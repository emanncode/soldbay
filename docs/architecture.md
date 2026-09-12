# Soldbay Backend Architecture

> Comprehensive technical documentation of the backend system, APIs, infrastructure, and design decisions.

---

## 1. High-Level Overview

**Stack:** Next.js 16 (App Router) + TypeScript + Prisma ORM + PostgreSQL (Prisma Postgres / db.prisma.io) + NextAuth.js v5 (beta) + Vercel Blob Storage

**Deployment Target:** Vercel (serverless functions + Edge middleware + Cron jobs)

**Primary Consumers:**

- **Web App** (this repo: `soldbay-web`) — server-rendered pages + API routes
- **Mobile App** (`soldbay-app`, React Native / Expo) — talks to same API via `Authorization: Bearer <JWT>`
- **Admin Dashboard** (same web app, gated routes) — admin-only endpoints

---

## 2. Infrastructure & Hosting

| Component           | Provider                       | Plan / Tier   | Purpose                                                                   |
| ------------------- | ------------------------------ | ------------- | ------------------------------------------------------------------------- |
| **Compute**         | Vercel                         | Free / Hobby  | Next.js serverless functions (API routes), Edge middleware, static assets |
| **Database**        | Prisma Postgres (db.prisma.io) | **Free tier** | Managed PostgreSQL with connection pooling, serverless-optimized          |
| **Blob Storage**    | Vercel Blob                    | Free tier     | Listing images, seller verification screenshots (private)                 |
| **Auth Secrets**    | Vercel Environment Variables   | —             | `AUTH_SECRET`, `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `CRON_SECRET`     |
| **Email (planned)** | Resend / SendGrid              | —             | OTP delivery, verification notifications (not yet integrated)             |
| **Payments**        | Paystack                       | Live / Test   | Card/bank transfer checkout; webhook updates order status                 |

### 2.1 Database: Prisma Postgres (Free Tier)

**Connection string format (from `.env`):**

```
postgres://<user>:<password>@db.prisma.io:5432/postgres?sslmode=verify-full
```

**Free-tier characteristics & implications:**
| Characteristic | Impact |
|----------------|--------|
| **Auto-sleep after inactivity** | Compute sleeps ~15–25 s cold start on first request after idle |
| **Connection limit** | 10 concurrent (configured in `prisma.ts`) |
| **No persistent connections** | Each serverless invocation gets a fresh connection via pooler |
| **Storage limit** | ~500 MB (sufficient for MVP) |
| **No read replicas / PITR** | Single primary; backups manual via `pg_dump` if needed |
| **Region** | Fixed (usually `us-east-1` or `eu-west-1`); latency from Nigeria ~180–250 ms |

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

> **Downside of free tier:** Unpredictable 15–25 s latency on first request after idle. Users on slow networks may perceive "app is broken". Production should migrate to a provisioned Postgres (Neon, Supabase, Railway, or Prisma Paid) with `minConnections > 0`.

---

## 3. Database Schema (Prisma)

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

### 3.2 Key Design Decisions

| Decision                                                        | Rationale                                                                    |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Soft-delete + 5-year retention** (`deletedAt`, `retainUntil`) | Legal/compliance; allows email reuse immediately; purge cron runs daily      |
| **`previousEmail` column**                                      | Preserves original email on soft-delete so purge can fully anonymize         |
| **SellerProfile separate from User**                            | Buyer→Seller transition is a _petition_ (admin approval), not a role flip    |
| **Commission on Category**                                      | Flexible per-category rates (Textbooks 5%, Fashion 15%, etc.)                |
| **Listing `draftStep` + drafts API**                            | Multi-step create flow; only `requireApprovedSeller` at publish              |
| **Order `confirmationPin`**                                     | 4-digit code shown to seller; buyer enters at campus handoff to prove pickup |
| **WalletTransaction sign implied by `type`**                    | `amount` always positive; `PAYOUT` increments seller balance                 |
| **No `OrderItem` — 1:1 Order:Listing**                          | Simpler; campus marketplace = single-item meetups                            |

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

| Role     | Capabilities                                                                            |
| -------- | --------------------------------------------------------------------------------------- |
| `BUYER`  | Browse, checkout, disputes, wallet (read-only escrow ledger)                            |
| `SELLER` | Draft listings, publish (if `APPROVED`), manage orders, wallet (real balance + payouts) |
| `ADMIN`  | Verification queue, approve/reject sellers, resolve disputes                            |

**Seller approval flow (critical):**

1. Buyer petitions via `POST /api/sellers/petition` → creates `SellerProfile` with `verificationStatus: "PENDING"`, **role stays BUYER**
2. Seller uploads student portal screenshot + matric via `POST /api/sellers/verify`
3. Admin reviews in `/api/admin/verifications` → `POST /api/admin/verifications/[id]/decision`
4. **Only on APPROVE:** transaction flips `User.role = "SELLER"` + `verificationStatus = "APPROVED"`
5. Rejection keeps role BUYER; seller can re-petition (max 3 attempts before support escalation)

---

## 5. API Surface (All Routes)

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
| `POST` | `/api/auth/forgot-password` | Initiate OTP reset (dev returns OTP in response)                                |
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

### 5.3 Seller-Only (Requires `SELLER` role + `APPROVED` for publishing)

| Method   | Endpoint                            | Gate                            | Description                                      |
| -------- | ----------------------------------- | ------------------------------- | ------------------------------------------------ |
| `GET`    | `/api/sellers/me`                   | `requireSeller`                 | Dashboard: drafts + live listings                |
| `POST`   | `/api/sellers/verify`               | `requireSeller`                 | Upload student portal screenshot + matric        |
| `GET`    | `/api/sellers/me/id-image`          | `requireSeller`                 | Serves private verification image (signed URL)   |
| `POST`   | `/api/sellers/petition`             | `requireSeller` (BUYER allowed) | BUYER → petition to become seller                |
| `GET`    | `/api/sellers/petition`             | `requireSeller`                 | Check petition status                            |
| `POST`   | `/api/listings`                     | `requireApprovedSeller`         | Create live listing directly                     |
| `POST`   | `/api/listings/drafts`              | `requireSeller`                 | Start draft (step 1)                             |
| `PATCH`  | `/api/listings/drafts/[id]`         | `requireSeller`                 | Auto-save draft steps 1–3                        |
| `GET`    | `/api/listings/drafts/[id]`         | `requireSeller`                 | Resume draft                                     |
| `POST`   | `/api/listings/drafts/[id]/publish` | `requireApprovedSeller`         | Publish draft → ACTIVE listing                   |
| `DELETE` | `/api/listings/[id]`                | `requireApprovedSeller`         | Delist own listing                               |
| `POST`   | `/api/upload/listing-image`         | `requireSeller`                 | Upload to Vercel Blob (5 MB, JPEG/PNG/WebP/HEIC) |

### 5.4 Admin-Only

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

### 6.1 Checkout & Escrow (Campus Meetup Model)

```
Buyer clicks "Buy" → POST /api/orders/checkout
  ├─ Idempotency: reuse existing order within 30 min window
  ├─ Stock reservation: atomic `listing.stock--` (conditional UPDATE stock > 0)
  ├─ TEST_MODE=true → order = PAYMENT_SECURED (skip Paystack)
  ├─ LIVE: Paystack initialize → authorization_url returned
  └─ Paystack webhook (not in repo yet) → PAYMENT_SECURED
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
Admin: GET /api/admin/disputes/[id] (not implemented, but data exists)
Admin: POST /api/admin/disputes/[id]/resolve { action, resolutionNotes }
  ├─ REFUND_BUYER → Order = REFUNDED, WalletTransaction REFUND (buyer ledger)
  └─ RELEASE_TO_SELLER → Order = COMPLETED, payout + PAYOUT wallet tx
```

### 6.3 Seller Verification (Student Identity)

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

- First request after idle → 15–25 s delay
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

**Integration test suite:** `test_all_endpoints.ts` (24 scenarios, run with `npx tsx test_all_endpoints.ts`)

Covers:

- Auth (signup, login, password reset)
- Seller petition → verification → approval
- Draft → publish flow
- Browse + search listings
- Checkout → PIN verify → confirm receipt
- Dispute raise + admin resolve
- Wallet ledger (seller + buyer)

**Run locally:**

```bash
cd soldbay-web
npx tsx test_all_endpoints.ts
```

Requires `TEST_MODE=true` and valid `DATABASE_URL`, `AUTH_SECRET`, `BLOB_READ_WRITE_TOKEN`.

---

## 10. Environment Variables (Required)

| Variable                | Source                    | Required     | Notes                                                                  |
| ----------------------- | ------------------------- | ------------ | ---------------------------------------------------------------------- |
| `DATABASE_URL`          | Prisma Postgres dashboard | ✅           | `postgres://...@db.prisma.io:5432/...`                                 |
| `AUTH_SECRET`           | `openssl rand -base64 32` | ✅           | HS256 secret for NextAuth + mobile JWT                                 |
| `AUTH_URL`              | Vercel deployment URL     | ✅           | `https://soldbay.shop` (prod) or `http://192.168.x.x:3000` (local LAN) |
| `BLOB_STORE_ID`         | Vercel Blob dashboard     | ✅           | `store_...`                                                            |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob dashboard     | ✅           | `vercel_blob_rw_...`                                                   |
| `CRON_SECRET`           | Generate random string    | ✅           | Protects cron endpoints                                                |
| `PAYSTACK_SECRET_KEY`   | Paystack dashboard        | 🔴 Prod only | `sk_test_...` or `sk_live_...`                                         |
| `NEXTAUTH_URL`          | Same as `AUTH_URL`        | ✅           | NextAuth canonical URL                                                 |
| `TEST_MODE`             | `"true"` / `"false"`      | Dev only     | Bypasses Paystack; **never true in prod**                              |

---

## 11. Known Limitations & Technical Debt

| Area                            | Issue                                                       | Severity | Mitigation / Plan                                                              |
| ------------------------------- | ----------------------------------------------------------- | -------- | ------------------------------------------------------------------------------ |
| **Database cold starts**        | 15–25 s on first request after idle (free tier)             | High     | Migrate to provisioned Postgres (Neon/Supabase) with min connections           |
| **No Paystack webhook handler** | Orders stuck in `PENDING_PAYMENT` in live mode              | Critical | Implement `/api/webhooks/paystack` + verify signature                          |
| **No email service**            | OTP/password reset only works in dev (OTP returned in JSON) | High     | Integrate Resend/SendGrid; store OTP hash in DB with expiry                    |
| **No push notifications**       | Mobile app can't get real-time order updates                | Medium   | Expo push + Supabase Realtime or Pusher                                        |
| **Admin UI incomplete**         | Verification queue exists; dispute queue missing            | Medium   | Build `/admin/disputes` page                                                   |
| **No rate limiting**            | Auth endpoints vulnerable to brute force                    | Medium   | Vercel Edge Config + `@vercel/edge-ratelimit` or Upstash Redis                 |
| **No logging/observability**    | `console.error` only                                        | Low      | Add Sentry / Logtail / Axiom                                                   |
| **Single-region DB**            | ~200 ms latency from Nigeria                                | Medium   | Provision DB in closer region (e.g., `eu-west-1` or `af-south-1` if available) |
| **No automated backups**        | Free tier has no PITR                                       | Low      | Schedule `pg_dump` to object storage weekly                                    |

---

## 12. Local Development Setup

```bash
# 1. Clone & install
cd soldbay-web
npm install

# 2. Environment (copy .env.example → .env and fill)
cp .env.example .env   # (create if missing)

# 3. Database push (dev)
npx prisma db push

# 4. Seed categories + universities
npm run seed

# 5. Run dev server
npm run dev
# → http://localhost:3000

# 6. Run API tests
npx tsx test_all_endpoints.ts
```

**Mobile app** (`soldbay-app`) points to `AUTH_URL` (LAN IP for physical device testing).

---

## 13. Deployment Checklist (Production)

- [ ] `TEST_MODE=false`
- [ ] Real `PAYSTACK_SECRET_KEY` + webhook URL configured in Paystack dashboard
- [ ] `CRON_SECRET` set in Vercel Environment Variables
- [ ] Email provider (Resend) connected + `FORGOT_PASSWORD_EMAIL_TEMPLATE`
- [ ] Provisioned Postgres (Neon/Supabase) + update `DATABASE_URL`
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

| Term                   | Meaning                                                               |
| ---------------------- | --------------------------------------------------------------------- |
| **Escrow**             | Money held by platform (via Paystack) until buyer confirms receipt    |
| **Payout**             | Seller wallet increment after order `COMPLETED` (amount − commission) |
| **Petition**           | Buyer requests seller role; creates `SellerProfile` in `PENDING`      |
| **Verification**       | Seller uploads student portal screenshot + matric for admin review    |
| **Draft**              | Multi-step listing creation (steps 1–3 saved, step 4 = publish)       |
| **Idempotency window** | 30 min — retry checkout returns same order                            |
| **Stale order**        | `PENDING_PAYMENT` > 24 h → auto-cancel + stock release                |
| **Cold start**         | Prisma Postgres compute wake from sleep (15–25 s)                     |

---

_Generated from codebase analysis — update when schema, routes, or infra change._
