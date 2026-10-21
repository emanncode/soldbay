# Soldbay Backend Architecture

> **Status (2026-10-21): partially stale implementation reference.** Current
> product and design intent is defined by the AllOnSoldBay Linear project;
> source code is evidence of implementation. Known product/implementation gap:
> Linear specifies buyer-first signup and allows unverified sellers to list,
> while current signup and listing gates retain the older seller-approval model.
> Seller verification currently accepts a single image rather than the chosen
> Student ID front/back pair; no payment webhook or scheduled 48-hour release
> is present. Flow notes below describe current code or intended policy as
> explicitly labeled; they are not all shipped behavior.

> Comprehensive technical documentation of the backend system, APIs, infrastructure, and design decisions.

---

## 1. High-Level Overview

**Stack:** Next.js 16 (App Router) + TypeScript + Prisma ORM + PostgreSQL + NextAuth.js v5 (beta) + Vercel Blob integration. Deployment provider details must be checked in the active environment.

**Deployment target in project configuration/notes:** Vercel serverless functions, Edge middleware, and cron jobs. Verify the active production deployment settings separately.

**Primary Consumers:**

- **Web App** (this repo: `soldbay-web`) — server-rendered pages + API routes
- **Mobile App** (`soldbay-app`, React Native / Expo) — talks to same API via `Authorization: Bearer <JWT>`
- **Admin Dashboard** (same web app, gated routes) — admin-only endpoints

---

## 2. Infrastructure & Hosting

| Component        | Provider                      | Plan / Tier                    | Purpose                                                                                                                                    |
| ---------------- | ----------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Compute**      | Vercel                        | Plan unverified                 | Next.js serverless functions (API routes), Edge middleware, static assets                                                                  |
| **Database**     | PostgreSQL via Prisma adapter | Environment-configured         | Connection pool is configured in `src/lib/prisma.ts`; provider/tier/region are deployment configuration, not guaranteed by this repository |
| **Blob Storage** | Vercel Blob                   | Plan unverified                 | Listing images, seller verification screenshots (private)                                                                                  |
| **Auth Secrets** | Vercel Environment Variables  | —                              | `AUTH_SECRET`, `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `CRON_SECRET`                                                                      |
| **Email**        | Resend / FormSubmit           | Environment-configured         | Waitlist/question forwarding exists; password-reset OTP delivery needs a production-path check                                             |
| **Payments**     | Paystack                      | Checkout initialization exists | The payment webhook that advances paid orders is not implemented in this repo                                                              |

### 2.1 Database connection configuration

> Provider and plan are not verifiable from this repository. Avoid treating
> the historical provider-specific figures below as live deployment facts.

**Provider characteristics:** check the active PostgreSQL provider's dashboard and
deployment configuration. Do not infer a free tier, storage limit, region, or
PITR availability from this repository.

**Code-level connection settings:**
| Characteristic | Impact |
| ------------------------------- | ---------------------------------------------------------------------------- |
| **Auto-sleep after inactivity** | Provider/plan-specific; verify in deployment |
| **Connection limit** | Pool max is configured as 10 in `src/lib/prisma.ts`; database limits vary by provider/plan |
| **Connection reuse** | Pool reuse behavior depends on runtime and hosting provider |
| **Storage, replicas, recovery, region** | Provider-specific; verify against deployment settings |

**Mitigations in code (`src/lib/prisma.ts`):**

```ts
// Long idle timeout so warm connections survive across invocations
idleTimeoutMillis: 10 * 60_000,
// Generous connection timeout absorbs cold-start wake time
connectionTimeoutMillis: 45_000,
// TCP keep-alive prevents silent socket death
keepAlive: true, keepAliveInitialDelayMillis: 30_000,
```

**Additional cold-start guard (`src/lib/cold-start.ts`):**

- Detects known Prisma cold-start error signatures (P1017, "ConnectionClosed", timeouts)
- Retries **once** after 800 ms delay
- Used on auth-critical queries (login, signup, token verification)

> **Deployment note:** cold-start latency and connection limits depend on the actual database provider and plan. Do not rely on the estimates here without checking the active deployment configuration and provider metrics.

---

## 3. Database Schema (Prisma)

> Schema summary is an implementation snapshot. Use `prisma/schema.prisma` as
> the source for fields and relations; the product decisions in this section
> must be checked against the current Linear docs.

### 3.1 Core Models

```
User (auth, roles, soft-delete)
  ├─ Account (OAuth providers)
  ├─ Session (NextAuth cookies)
  └─ SellerProfile (1:1, optional)
       ├─ Listing[] (products)
       └─ Order[] (as seller)

Listing (marketplace items)
  ├─ Category (commission rate)
  ├─ SellerProfile
  └─ Order[] (purchases)

Order (escrow transaction)
  ├─ buyer (User)
  ├─ seller (SellerProfile)
  ├─ listing (Listing)
  ├─ status: PENDING_PAYMENT → PAYMENT_SECURED → PICKUP_ARRANGED → AWAITING_CONFIRMATION → COMPLETED
  ├─ confirmationPin (4-digit, seller sees, buyer enters at handoff)
  └─ Dispute[] / WalletTransaction[]

WalletTransaction (in-app ledger)
  ├─ type: ESCROW_HOLD | ESCROW_RELEASE | REFUND | PAYOUT
  └─ balanceAfter (seller running balance)

Dispute (buyer raises, admin resolves)
  ├─ resolution: REFUND_BUYER | RELEASE_TO_SELLER
  └─ WalletTransaction created on resolution

Category (fixed catalog, admin-managed)
  └─ commissionRate (percentage)

University (Nigerian campuses)
  └─ code (e.g., "OAU", "UNILAG") + name
```

### 3.2 Schema behavior notes

| Decision                                                        | Rationale                                                                                                                                                       |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Soft-delete + 5-year retention** (`deletedAt`, `retainUntil`) | Provisional code policy; verify the period against an approved privacy/legal policy before treating it as a compliance requirement |
| **`previousEmail` column**                                      | Preserves original email on soft-delete so purge can fully anonymize                                                                                            |
| **SellerProfile separate from User**                            | Keeps seller identity separate; current role and verification gates are legacy behavior that conflicts with Linear's latest buyer-first, unverified-listing MVP |
| **Commission on Category**                                      | Flexible per-category rates (Textbooks 5%, Fashion 15%, etc.)                                                                                                   |
| **Listing `draftStep` + drafts API**                            | Multi-step create flow; current publish route requires approval, which is a known gap against Linear                                                            |
| **Order `confirmationPin`**                                     | 4-digit code shown to seller; buyer enters at campus handoff to prove pickup                                                                                    |
| **WalletTransaction sign implied by `type`**                    | `amount` always positive; `PAYOUT` increments seller balance                                                                                                    |
| **No `OrderItem` — 1:1 Order:Listing**                          | Simpler; campus marketplace = single-item meetups                                                                                                               |

---

## 4. Authentication & Authorization

### 4.1 Dual Auth Strategy

| Client                       | Mechanism                                   | Token Format                          | Lifetime                |
| ---------------------------- | ------------------------------------------- | ------------------------------------- | ----------------------- |
| **Web (browser)**            | NextAuth.js v5 Credentials + Cookie Session | HTTP-only `next-auth.session-token`   | 30 days (rolling)       |
| **Mobile (React Native)**    | `POST /api/auth/mobile-login` → plain JWT   | `Authorization: Bearer <HS256 JWT>`   | 30 days (fixed)         |
| **Server-to-server (Crons)** | `CRON_SECRET` Bearer token                  | `Authorization: Bearer <CRON_SECRET>` | Static, rotate manually |

**Shared secret:** `AUTH_SECRET` (HS256) — same for NextAuth JWT strategy and mobile tokens.

### 4.2 Token Verification

| Layer                                 | Implementation                                                                      |
| ------------------------------------- | ----------------------------------------------------------------------------------- |
| **Edge Middleware** (`middleware.ts`) | `jose` (Edge-compatible) validates JWT signature only; no DB call                   |
| **API Routes (Node)**                 | `verifyActiveMobileToken()` → verifies JWT **then** checks `User.deletedAt` is null |

> **Why two layers?** Middleware runs on Edge (no Prisma). It gates seller-only routes early. Node routes re-verify + DB-check for active status (prevents deleted-account token reuse).

### 4.3 Role Gates

| Role     | Capabilities                                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `BUYER`  | Current role: browse, checkout, disputes, wallet (read-only escrow ledger)                                                   |
| `SELLER` | Current code: draft listings; publish requires `APPROVED`. This gate conflicts with Linear's current unverified-listing MVP. |
| `ADMIN`  | Current APIs manage seller verification and disputes. Designed Admin/Ops screens are not implemented in this checkout.       |

**Current implementation (legacy relative to Linear):** signup accepts either
BUYER or SELLER; seller verification and admin decision routes exist; create
and publish listing endpoints call `requireApprovedSeller`. Linear specifies
buyer-first signup, a Profile-initiated seller upgrade, and immediate listing
with an unverified badge. The repository has not implemented that rule yet.

---

## 5. API Surface (selected routes)

> Base URL: `https://<vercel-deployment>.vercel.app/api/...` or `http://localhost:3000/api/...` in dev.

### 5.1 Public / Unauthenticated

| Method | Endpoint                    | Description                                                                     |
| ------ | --------------------------- | ------------------------------------------------------------------------------- |
| `GET`  | `/api/categories`           | List all categories (cached 1 hr)                                               |
| `GET`  | `/api/universities`         | List all universities                                                           |
| `GET`  | `/api/listings`             | Browse active listings (cursor pagination, `?category=&search=&cursor=&limit=`) |
| `GET`  | `/api/listings/[id]`        | Public listing detail                                                           |
| `POST` | `/api/auth/signup`          | Register (BUYER or SELLER)                                                      |
| `POST` | `/api/auth/mobile-login`    | Email/password → JWT (mobile)                                                   |
| `POST` | `/api/auth/forgot-password` | Initiate OTP reset (development response may expose OTP; verify production behavior) |
| `POST` | `/api/auth/verify-otp`      | Verify 6-digit OTP                                                              |
| `POST` | `/api/auth/reset-password`  | Set new password with valid OTP                                                 |
| `POST` | `/api/questions`            | Public "Ask a question" → stored + emailed                                      |

### 5.2 Authenticated (Any Role)

| Method | Endpoint                           | Auth            | Description                                     |
| ------ | ---------------------------------- | --------------- | ----------------------------------------------- |
| `GET`  | `/api/users/me`                    | Cookie / Bearer | Current user profile                            |
| `GET`  | `/api/orders`                      | Cookie / Bearer | My orders (buyer + seller merged)               |
| `GET`  | `/api/orders/[id]`                 | Cookie / Bearer | Order detail (PIN only to seller)               |
| `POST` | `/api/orders/[id]/verify-pin`      | Cookie / Bearer | Buyer enters 4-digit PIN at handoff             |
| `POST` | `/api/orders/[id]/confirm-receipt` | Cookie / Bearer | Buyer confirms item OK → COMPLETED + payout     |
| `POST` | `/api/orders/[id]/dispute`         | Cookie / Bearer | Buyer raises dispute                            |
| `GET`  | `/api/wallet`                      | Cookie / Bearer | Ledger + balance (seller: real; buyer: derived) |

### 5.3 Seller-Only (Current code requires `APPROVED` status for listing writes)

> **Known gap:** current Linear MVP allows unverified sellers to list. This
> section describes current code only, not the intended product rule.

| Method   | Endpoint                            | Gate                            | Description                                                                  |
| -------- | ----------------------------------- | ------------------------------- | ---------------------------------------------------------------------------- |
| `GET`    | `/api/sellers/me`                   | `requireSeller`                 | Dashboard: drafts + live listings                                            |
| `POST`   | `/api/sellers/verify`               | `requireSeller`                 | Upload student portal screenshot + matric                                    |
| `GET`    | `/api/sellers/me/id-image`          | `requireSeller`                 | Serves private verification image (signed URL)                               |
| `POST`   | `/api/sellers/petition`             | `requireSeller` (BUYER allowed) | BUYER → petition to become seller                                            |
| `GET`    | `/api/sellers/petition`             | `requireSeller`                 | Check petition status                                                        |
| `POST`   | `/api/listings`                     | `requireApprovedSeller`         | Create live listing directly (current approval gate conflicts with Linear)   |
| `POST`   | `/api/listings/drafts`              | `requireSeller`                 | Start draft (step 1)                                                         |
| `PATCH`  | `/api/listings/drafts/[id]`         | `requireSeller`                 | Auto-save draft steps 1–3                                                    |
| `GET`    | `/api/listings/drafts/[id]`         | `requireSeller`                 | Resume draft                                                                 |
| `POST`   | `/api/listings/drafts/[id]/publish` | `requireApprovedSeller`         | Publish draft → ACTIVE listing (current approval gate conflicts with Linear) |
| `DELETE` | `/api/listings/[id]`                | `requireApprovedSeller`         | Delist own listing                                                           |
| `POST`   | `/api/upload/listing-image`         | `requireSeller`                 | Upload to Vercel Blob (5 MB, JPEG/PNG/WebP/HEIC)                             |

### 5.4 Admin APIs (UI status differs)

> Admin UI pages in this checkout are login and waitlist only; these endpoints
> do not mean the designed Admin/Ops screens are implemented.

| Method | Endpoint                                  | Description                     |
| ------ | ----------------------------------------- | ------------------------------- | ---------------------------- |
| `GET`  | `/api/admin/verifications?status=PENDING` | Review queue (filter by status) |
| `POST` | `/api/admin/verifications/[id]/decision`  | `action: APPROVE                | REJECT` (+ reason if reject) |
| `POST` | `/api/admin/disputes/[id]/resolve`        | `action: REFUND_BUYER           | RELEASE_TO_SELLER`           |

### 5.5 Cron Jobs (Vercel Scheduled)

| Schedule                      | Endpoint                       | Purpose                                           |
| ----------------------------- | ------------------------------ | ------------------------------------------------- |
| `0 4 * * *` (daily 04:00 UTC) | `GET /api/cron/purge-accounts` | Purge soft-deleted accounts past 5-year retention |
| `0 5 * * *` (daily 05:00 UTC) | `GET /api/cron/purge-drafts`   | Delete stale draft listings (> 7 days)            |

> Both require `Authorization: Bearer <CRON_SECRET>` header (Vercel injects automatically).

---

## 6. Key Business Flows

### 6.1 Checkout and campus handoff (implementation gaps)

The flow below describes current checkout behavior and the intended campus
handoff. Test mode creates a secured order without processing payment. Live mode
initializes Paystack checkout, but no webhook in this repository advances an
order after provider payment. Buyer receipt confirmation triggers payout; the
intended 48-hour auto-release has no scheduled implementation here. Confirm the
actual funds-holding and settlement arrangement with the payment provider
before describing the flow as operational escrow.

```
Buyer clicks "Buy" → POST /api/orders/checkout
  ├─ Idempotency: reuse existing order within 30 min window
  ├─ Stock reservation: atomic `listing.stock--` (conditional UPDATE stock > 0)
  ├─ TEST_MODE=true → order = PAYMENT_SECURED (no payment processed)
  ├─ LIVE: Paystack initialize → authorization_url returned
  └─ Paystack webhook (not implemented in this repo) → PAYMENT_SECURED
       │
       ▼
Seller arranges pickup → PICKUP_ARRANGED
       │
       ▼
Buyer meets seller, enters 4-digit PIN → POST /api/orders/[id]/verify-pin
       │
       ▼
AWAITING_CONFIRMATION
       │
       ▼
Buyer confirms "Everything's good" → POST /api/orders/[id]/confirm-receipt
       │
       ├─ Order = COMPLETED
       ├─ Seller wallet += amount * (1 - commissionRate)
       └─ WalletTransaction PAYOUT recorded
```

**Fraud prevention:**

- Seller cannot buy own listing (403)
- PIN only returned to seller in `GET /api/orders/[id]`
- Buyer must physically meet seller to get PIN

### 6.2 Dispute Resolution

```
Buyer: POST /api/orders/[id]/dispute { reason } → Order = DISPUTED
Admin: GET /api/admin/disputes/[id] (implemented; returns dispute, order, listing, buyer, and seller details)
Admin: POST /api/admin/disputes/[id]/resolve { action, resolutionNotes }
  ├─ REFUND_BUYER → Order = REFUNDED, WalletTransaction REFUND (buyer ledger)
  └─ RELEASE_TO_SELLER → Order = COMPLETED, payout + PAYOUT wallet tx
```

### 6.3 Seller Verification (current implementation differs from Linear)

The current API accepts one `image` plus an optional matric number. Linear's
current verification design allows either two Student ID images (front/back)
or one student portal screenshot. The current API does not yet represent that
choose-one submission model.

```
BUYER: POST /api/sellers/petition → SellerProfile (PENDING, username generated)
SELLER: POST /api/sellers/verify (multipart: image + matricNumber)
  ├─ Image → Vercel Blob (PRIVATE access)
  ├─ matricNumber uniqueness enforced
  ├─ verificationAttempts++
  └─ Max 3 rejections → requiresSupport: true
ADMIN: Reviews image + matric → APPROVE (flips role) or REJECT (reason stored)
```

---

## 7. Error Handling & Client Contracts

### 7.1 Standard Error Shape (`src/lib/api-error.ts`)

```ts
type AppError = {
  variant:
    | "validation"
    | "unauthorized"
    | "forbidden"
    | "notFound"
    | "conflict"
    | "server"
    | "network"
    | "unknown";
  status?: number;
  title: string; // Short heading for UI
  message: string; // User-facing body
  retryable: boolean; // Should client auto-retry?
  codeLabel?: string; // "400", "500", "NET", etc.
};
```

**All API routes return** `{ error: string }` with appropriate HTTP status.  
**Server errors (5xx)** use `SERVER_GENERIC` message mentioning database wake-up.

### 7.2 Cold-Start UX

- First request after idle may be delayed by provider cold starts; actual timings require deployment measurement.
- `retryOnColdStart` retries once transparently
- Client `api-error.ts` treats 5xx as `retryable: true` with message: _"This can happen when the database is waking up — please wait a moment and try again."_

---

## 8. File Storage (Vercel Blob)

| Use Case                        | Access    | Path Pattern                                         | Max Size |
| ------------------------------- | --------- | ---------------------------------------------------- | -------- |
| Listing images                  | `public`  | `listing-images/<userId>-<timestamp>.<ext>`          | 5 MB     |
| Seller verification screenshots | `private` | `seller-portals/<sellerProfileId>-<timestamp>.<ext>` | 5 MB     |

**Private blobs** served via authenticated endpoint (`GET /api/sellers/me/id-image`) — never exposed directly.

**Cleanup:** `deleteBlobImages()` called on listing delete / account purge (best-effort, logged only).

---

## 9. Testing

**Database-backed integration script:** `test_all_endpoints.ts` (24 numbered request steps; only run with disposable database and blob-storage credentials)

The script exercises signup/login/reset, seller petition and verification,
draft publishing, browse, checkout, PIN confirmation, and dispute resolution.
It creates an admin and test users, mutates data, and should not be treated as
isolated or exhaustive coverage.

**Run locally:**

```bash
cd soldbay-web
npx tsx test_all_endpoints.ts
```

The script creates users, listings, and orders, changes a test user's password,
and uploads a verification image using the configured blob store. It writes to
`DATABASE_URL`; use only explicitly disposable database and blob credentials.
It requires `TEST_MODE=true`, `DATABASE_URL`, `AUTH_SECRET`, and
`BLOB_READ_WRITE_TOKEN`. It is an integration script, not an isolated unit test
suite, and its numbered flows should not be treated as exhaustive coverage.

---

## 10. Environment Variables (Required)

| Variable                | Source                         | Required     | Notes                                                                  |
| ----------------------- | ------------------------------ | ------------ | ---------------------------------------------------------------------- |
| `DATABASE_URL`          | Configured PostgreSQL provider | ✅           | Use the intended development or deployment database URL                |
| `AUTH_SECRET`           | `openssl rand -base64 32`      | ✅           | HS256 secret for NextAuth + mobile JWT                                 |
| `AUTH_URL`              | Vercel deployment URL          | ✅           | `https://soldbay.shop` (prod) or `http://192.168.x.x:3000` (local LAN) |
| `BLOB_STORE_ID`         | Vercel Blob dashboard          | ✅           | `store_...`                                                            |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob dashboard          | ✅           | `vercel_blob_rw_...`                                                   |
| `CRON_SECRET`           | Generate random string         | ✅           | Protects cron endpoints                                                |
| `PAYSTACK_SECRET_KEY`   | Paystack dashboard             | Required for live checkout; use test credentials in development | `sk_test_...` or `sk_live_...` |
| `NEXTAUTH_URL`          | Same as `AUTH_URL`             | ✅           | NextAuth canonical URL                                                 |
| `TEST_MODE`             | `"true"` / `"false"`           | Dev only     | Bypasses Paystack; **never true in prod**                              |

---

## 11. Known Limitations & Technical Debt

| Area                            | Issue                                                                                                                                            | Severity             | Mitigation / Plan                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- | --------------------------------------------------------------------- |
| **Database cold starts**        | Latency depends on configured provider/plan; current checkout configures a 45 s connection timeout and retry for some auth queries               | Verify in deployment | Measure actual deployed cold-start behavior before changing providers |
| **Payment lifecycle gaps**      | No webhook advances live orders and no scheduled 48-hour release is implemented                                                                  | Critical             | Implement and verify payment callback and release handling            |
| **Email delivery**              | Waitlist and question forwarding exist; verify/reset flows and delivery configuration must be audited before launch                              | High                 | Verify provider integration and OTP handling                          |
| **No push notifications**       | Mobile app cannot receive real-time order updates from a push service                                                                            | Medium               | Add and verify a push delivery path                                   |
| **Admin UI incomplete**         | In this checkout, admin pages are login and waitlist; verification and dispute APIs exist, but the designed Admin/Ops pages are not implemented. | Medium               | Build screens from the current Linear Admin/Ops IA and prompts        |
| **Rate limiting**               | No rate-limiting middleware is visible in the reviewed API routes                                                                                | Medium               | Add an appropriate rate limit and verify coverage                     |
| **Logging/observability**       | Reviewed routes use `console.error`; no observability SDK is configured in this package                                                          | Low                  | Add service-level monitoring if required for launch                   |
| **Database region/backups**     | Provider, region, backup and PITR configuration are not established by this repository                                                           | Verify in deployment | Confirm provider settings, retention, and recovery process            |

---

## 12. Local Development Setup

> The commands below include database writes and a blob upload. Use disposable
> development services. The integration script is not safe for shared or
> production credentials.

```bash
# 1. Clone & install
cd soldbay-web
npm install

# 2. Configure required environment values in a local .env file

# 3. Apply checked-in migrations to the intended development database
npx prisma migrate deploy

# 4. Seed categories + universities
npm run seed

# 5. Run dev server
npm run dev
# → http://localhost:3000

# 6. Run the database/blob-mutating integration script only with disposable services
npx tsx test_all_endpoints.ts
```

**Mobile app** (`soldbay-app`) needs an API base URL reachable from the selected
device; a physical device generally cannot reach the host via `localhost`.

---

## 13. Deployment Checklist (Production)

- [ ] `TEST_MODE=false`
- [ ] Implement and verify the payment webhook before configuring it in Paystack
- [ ] `CRON_SECRET` set in Vercel Environment Variables
- [ ] Email provider (Resend) connected + `FORGOT_PASSWORD_EMAIL_TEMPLATE`
- [ ] Confirm production PostgreSQL provider, region, backup policy, and recovery procedure
- [ ] `AUTH_URL` = production domain (`https://soldbay.shop`)
- [ ] Custom domain + SSL on Vercel
- [ ] Sentry DSN for error tracking
- [ ] Rate limiting enabled (Edge Config or Upstash)
- [ ] Load test checkout flow under concurrent users

---

## 14. Directory Map (Backend-Relevant)

```
soldbay-web/
├── prisma/
│   ├── schema.prisma           # Complete data model
│   ├── seed.ts                 # Categories + universities
│   └── migrations/             # Full history
├── src/
│   ├── lib/
│   │   ├── prisma.ts           # PrismaClient with cold-start adapter
│   │   ├── api-error.ts        # Unified error shape + helpers
│   │   ├── blob-image.ts       # Vercel Blob delete helper
│   │   ├── seller-gate.ts      # requireSeller / requireApprovedSeller
│   │   ├── mobile-auth.ts      # JWT verify (Edge-safe, jose)
│   │   ├── mobile-auth-active.ts # JWT + DB active check (Node)
│   │   ├── sign-mobile-token.ts # jwt.sign (Node only)
│   │   ├── cold-start.ts       # Retry wrapper for Prisma
│   │   ├── order-service.ts    # Idempotent checkout, stock, disputes
│   │   ├── account-retention.ts # 5-year purge logic
│   │   ├── pin-timing.ts       # PIN shown/expires/lockout constants
│   │   └── ...
│   ├── auth.config.ts          # Edge-compatible NextAuth config
│   ├── auth.ts                 # Full NextAuth (Credentials + PrismaAdapter)
│   ├── middleware.ts           # CORS + seller-gate (Edge)
│   └── app/api/
│       ├── auth/               # signup, mobile-login, forgot, verify-otp, reset
│       ├── sellers/            # me, verify, petition, me/id-image
│       ├── listings/           # GET (browse), POST (create), drafts/*
│       ├── orders/             # checkout, list, detail, verify-pin, confirm, dispute
│       ├── wallet/             # GET ledger
│       ├── admin/              # verifications, disputes
│       ├── upload/             # listing-image (Vercel Blob)
│       ├── cron/               # purge-accounts, purge-drafts
│       └── ...
├── test_all_endpoints.ts       # Full integration test suite
├── vercel.json                 # Cron schedules
└── package.json
```

---

## 15. Glossary

| Term                   | Meaning                                                                     |
| ---------------------- | --------------------------------------------------------------------------- |
| **Intended escrow flow** | Payment is intended to remain held until buyer confirms receipt; verify actual settlement and release behavior against the implemented payment lifecycle |
| **Payout**             | Seller wallet increment after order `COMPLETED` (amount − commission)       |
| **Petition**           | Buyer requests seller role; creates `SellerProfile` in `PENDING`            |
| **Verification**       | Seller uploads student portal screenshot + matric for admin review          |
| **Draft**              | Multi-step listing creation (steps 1–3 saved, step 4 = publish)             |
| **Idempotency window** | 30 min — retry checkout returns same order                                  |
| **Stale order**        | `PENDING_PAYMENT` > 24 h → auto-cancel + stock release                      |
| **Cold start**         | Delay when a configured service resumes after inactivity; provider-specific |

---

_Generated from codebase analysis — update when schema, routes, or infra change._
