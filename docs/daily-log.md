# Daily Work Log

Running log of SoldBay work. Newest entry at the top. Each day is also mirrored
as a Linear issue (`EC-*`, "Work Log — <Month D, YYYY>: …") and a dated Linear
project document (`YYYY-MM-DD`).

## Sep 7, 2026 — Migration-history repair: reconciliation migration shipped + live deploy

Un-blocked the migration-drift item from the earlier audit. `db.prisma.io`
became reachable again, so the reconciliation was authored, verified end-to-end
with the real Prisma engine, and applied to the live DB.

### Root cause (debugged)
The migration **history** was irreproducible. `Order`, `Dispute`, the
`OrderStatus` / `DisputeStatus` / `DisputeResolution` enums, `User.matricNumber`,
and the `Listing` drift (`draftStep`, `updatedAt`,
nullable `categoryId`/`title`/`description`/`price`, `Listing_sellerId_status_updatedAt_idx`)
were created on the live DB **out-of-band via `prisma db push`** — no migration
ever created them. Later migrations only did `ALTER TABLE "Order"`, so a **fresh
`migrate deploy` aborted** with `relation "Order" does not exist` (reproduced on
a scratch schema by replay: failed at the 4th migration,
`20260831000000_add_order_pin_lockout`). The live DB was healthy only because it
was never built from migrations.

### Fix shipped
- New guarded reconciliation migration
  `prisma/migrations/20260801000000_reconcile_order_dispute/migration.sql`,
  placed chronologically *before* the first `ALTER TABLE "Order"`. Idempotent
  (exception handlers + `IF NOT EXISTS` + idempotent `DROP NOT NULL`) so it is a
  safe no-op against the live DB (objects already exist) while correctly
  bootstrapping a fresh DB. `Order` is created *without* the PIN columns — those
  come from the later pin lockout/expiry migrations.

### Verification
- **Real Prisma engine, throwaway schema**: all 14 migrations applied cleanly on
  a fresh schema (was: abort at #4); `prisma migrate diff --from-config-datasource
  --to-schema` → **empty** — fresh deploy now reproduces `schema.prisma` exactly.
- Live DB: `prisma migrate deploy` applied (no-op via guards); `migrate status`
  clean; diff vs schema empty. All scratch schemas dropped; `public` un-polluted.

### Blocked / deferred
- 1b (composite matric) + auto-release/refund-cron: product decisions still
  deferred (from audit entry below).

## Sep 7, 2026 — Stress-test audit (10-item pass) + hardening fixes

Follow-on to today's petition entry (EC-11) — ran a full source-level stress-
test audit of identity/trust, payments/escrow/commission, economics, disputes,
verification UX, legal, session security, data-integrity crons, evidenceless
claims, and process gaps, then shipped the in-scope fixes. Several audit
premises were **refuted** by the actual code, and the audit surfaced **new
critical bugs** beyond scope.

### Audit findings (against actual code)

**Confirmed real issues**
- **8a draft-cron image leak (top bug)**: `purge-drafts/route.ts` selected only
  `{ id }`, deleted rows, never read `images`/called `deleteBlobImages` → every
  auto-purged draft leaked its Vercel Blob photos permanently.
- **8b account-purge cron**: `purgeExpiredAccounts` only deleted sessions/
  accounts + anonymized PII — purged users' listings/images retained indefinitely.
- **8c cron vs pending sellers**: draft cron purged all `DRAFT` rows >30d
  regardless of `verificationStatus`, destroying a pending seller's first draft.
- **8d batching**: `take: 500` / `batchSize: 200`, no overflow loop.
- **7b middleware auth**: stateless gate; most routes re-verify DB-backed —
  **except `POST /api/listings`** which trust `body.sellerId` (no auth binding →
  cross-account listing creation; deleted-user tokens valid 30d).
- **1a** no liveness (document-existence-only); **1b** `matricNumber @unique`
  global; **5a/5b** 3-attempt cap, no admin UI/manual-support channel;
  **7a** 30-day stateless JWT, no revocation; **7c** admin = bare role check.

**Refuted (audit claim wrong)**
- **2a commission** — *is* implemented (`confirm-receipt`/`order-service.ts`:
  deduct, bump `walletBalance`, write `PAYOUT`). Rates: 5/8/15/10/12%.
- **2d 48hr auto-release** — *does not exist*; escrow stays locked until buyer
  confirms or a dispute resolves.

**Verified correct**: 9a mode-toggle/tab-sets/`useModeTabs`/mode-resume.

**New critical findings**
- **Schema/migration drift — fresh `migrate deploy` would FAIL**: `Order` and
  `Dispute` have **no CREATE TABLE migration anywhere** yet later migrations
  `ALTER "Order"`; `matricNumber` has no migration; `Listing.categoryId`
  NOT-NULL in init but nullable in schema. Created out-of-band (`db push`).
- **`seller/dashboard.tsx`**: `l.status === "active"` (lowercase) vs API
  `"ACTIVE"` → stat always 0; `$` prefix instead of `₦`.

### Fixes shipped (`7fb46f0`)

- `purge-drafts/route.ts`: select `images` → `deleteBlobImages`; exclude PENDING
  sellers; page-loop (500).
- `account-retention.ts`: purge deletes purged user's listings (+ orbitals FKs
  first) + blob images; page-loop (200).
- `listings/route.ts` `POST`: `requireApprovedSeller` binds `sellerId` to the
  authenticated user; `body.sellerId` no longer trusted.
- `dashboard.tsx`: `"ACTIVE"` compare + `₦` prefix.
- `eslint.config.js`: `no-direct-alert/ban-alert-import` — errors on `Alert`
  imports outside `src/lib/dialogs.ts`.

### Verification
- `soldbay-web` + `soldbay-app`: `tsc --noEmit` clean; lint clean on changed
  files (ESLint rule verified to fire on a synthetic Alert import).
- Commit `7fb46f0` (5 files, +190/−84); `assets/` (Kanchenjunga fonts) left
  untracked by request.

### Blocked / deferred
- Migration-drift reconciliation: **shipped** — see the entry above
  (reconciliation migration applied to live this session; fresh deploy verified).
- 1b (composite matric) + auto-release/refund-cron: product decisions deferred.

## Sep 7, 2026 — Petition-to-become-a-seller flow (replaces in-place upgrade) + security suite

Replacement for Sep 6's #4: "Switch to Campus Seller" no longer re-signs the
user up, and the backend no longer flips a buyer to SELLER on request. It is now
a **Yes/No petition** — approval powers remain entirely with the admin.

### Backend
- **New `POST/GET /api/sellers/petition`** (`soldbay-web/src/app/api/sellers/petition/route.ts`):
  - Request body is **never parsed** — zero mass-assignment/injection surface
    (username, role, status, rejectionReason, wallet from the client are all ignored).
  - Username auto-derived server-side from the stored `User.name` (lowercased
    `[a-z0-9]` slug, cap 30, numeric suffix loop to 50 attempts).
  - One transaction re-checks existence/deletion/role/university; requires
    `universityId` (403); existing SELLER → 409; PENDING → 200 idempotent;
    REJECTED → re-petition to PENDING (clears `rejectionReason`, `verifiedAt`,
    +1 `verificationAttempts`); concurrent `P2002` → idempotent re-fetch.
  - `GET` returns the user's petition status (`NONE|PENDING|APPROVED|REJECTED`)
    + `rejectionReason`/`verificationAttempts`.
- **`POST /api/admin/verifications/[id]/decision`** rewritten transactional:
  APPROVE hardcodes `role: "SELLER"` nested in the user update (never from the
  request), sets `verifiedAt`, clears reason; REJECT keeps BUYER, stamps
  reason (≤1000) + `verifiedAt: null`. Admin-only gate unchanged.
- **New `POST /api/auth/refresh-token`**: bearer + `verifyActiveMobileToken`,
  reloads the DB user, re-signs with the **DB role only** (client role never
  trusted). Heals the stale BUYER-role JWT right after an admin approval.
- **Deleted** `soldbay-web/src/app/api/sellers/upgrade/route.ts`.

### Mobile
- New `soldbay-app/src/app/seller/petition.tsx` screen (loading/ask/pending/
  rejected/approved states; pending mirrors the seller "awaiting review" copy;
  approved state heals the token via `refreshToken()` then enters seller mode).
- `src/lib/api.ts`: swapped `upgradeToSeller` → `petitionToBecomeSeller()` +
  `getPetitionStatus()` + `refreshToken()` (+ `PetitionStatus`/`PetitionResponse`/
  `PetitionStatusResponse` types).
- `app/profile/index.tsx`: buyers fetch petition status and see
  "Awaiting approval"/"Rejected"; players who can't verify are pointed at
  `/seller/petition`; verify row now SELLER-only.
- `app/index.tsx` (splash): SELLER branch heals a 401 from `getSellerMe` via
  `refreshToken()` + retry. Deleted `app/seller/upgrade.tsx`.

### Security verification
`scripts/verify-petition-security.ts` (new, runs via `npx tsx`) — 31 assertions
against the live DB, self-cleaning:
role/status/wallet injection + SQLi screen-name, username slug-safety,
idempotency/duplicate-row guard, petitioning grants **no** seller powers,
deleted/no-university/existing-seller/invalid-token edges, non-admin decision
403, admin APPROVE flips role exactly to SELLER, stale-token heal via
refresh-token, REJECT stays BUYER + re-petition, refresh-token role from DB
only. **ALL PASSED.**

### Verification
- `soldbay-app`: `tsc --noEmit` clean; `expo lint` 0 errors (1 pre-existing
  warning `orders/detail.tsx`). Typed routes regenerated (`expo start`).
- `soldbay-web`: `tsc --noEmit` clean; changed routes lint-clean;
  `verify-petition-security.ts` PASSED.
- Note: `test_all_endpoints.ts` still fails at [7/24] `POST /api/sellers/verify`
  because the Vercel Blob store is configured **public** while the route
  deliberately `put(..., { access: "private" })` for PII portals — a dashboard
  setting, not a code defect.

### Files touched
- `soldbay-web/src/app/api/sellers/petition/route.ts` (new),
  `soldbay-web/src/app/api/auth/refresh-token/route.ts` (new),
  `soldbay-web/scripts/verify-petition-security.ts` (new),
  `soldbay-web/src/app/api/admin/verifications/[id]/decision/route.ts`,
  deleted `soldbay-web/src/app/api/sellers/upgrade/route.ts`.
- `soldbay-app/src/app/seller/petition.tsx` (new), `soldbay-app/src/lib/api.ts`,
  `soldbay-app/src/app/profile/index.tsx`, `soldbay-app/src/app/index.tsx`,
  deleted `soldbay-app/src/app/seller/upgrade.tsx`.
- Docs: `docs/daily-log.md` (this entry).

## Sep 6, 2026 — Open-items closure: in-place seller upgrade, draft-expiry cron, upload limits, DB pass

Second session (Sep 6 appendix to EC-10 Work Log + project doc [2026-09-06](https://linear.app/emanncode/document/2026-09-06-dd1373beddb3)).

### #4 — Switch-to-campus-seller upgrades in place (no re-signup)
Profile's "Switch to Campus Seller" used to push `/select-role` → the full signup flow. Now:
- **Backend** `soldbay-web/src/app/api/sellers/upgrade/route.ts` (POST): authenticates the existing account via bearer/session, validates a unique lowercased username, and in one transaction creates the `SellerProfile` + flips `role` to SELLER. Because the mobile JWT carries a `role` claim (minted at login), a fresh token is **re-signed with the SELLER role** and returned — without it, every seller-gated API (`requireSeller`/`requireApprovedSeller`, uploads, verify) would 401 until re-login.
- **Mobile** new `soldbay-app/src/app/seller/upgrade.tsx` (username + optional store name/bio → `upgradeToSeller()` in `src/lib/api.ts`), profile row rewired to it; on success saves the new token, persists `lastActiveMode="seller"`, lands on `/seller/verify`.

### #12 — Draft-expiry cron
Drafts are `Listing` rows stuck at `status="DRAFT"`. New `soldbay-web/src/app/api/cron/purge-drafts/route.ts` deletes drafts whose `updatedAt` is ≥30 days stale (batch 500, in a transaction, defensively clearing any orphaned order rows first); CRON_SECRET-guarded exactly like the existing `purge-accounts` job. Wired at `0 5 * * *` in `vercel.json`.

### #9 — Image upload size limit: already enforced server-side; client pre-gates added
Both upload paths already reject >5 MB and non-image MIME: `/api/upload/listing-image` and `/api/sellers/verify` (JPEG/PNG/WebP/HEIC, 5 MB cap). Closed as **verified**, plus added a **client-side 5 MB pre-gate** on the web `fetch→blob` paths of `uploadListingImages`/`uploadIdImage` so oversized files fail fast (native path already compresses to ≤1600px JPEG via `expo-image-manipulator`).

### #6 / #7 / #8 — Confirmed already correct (no change needed)
- **#6 mode-toggle placement**: lives in Profile Settings for both roles — "Switch to Buyer Mode" (sellers), "Switch to Campus Seller" (buyers, now the upgrade screen).
- **#7 tab set/order**: matches the locked spec — buyer 5 tabs, seller 6 tabs, single source of truth in `soldbay-app/src/lib/tabs.tsx`, consistent with `docs/tab-layouts-roadmap.md`.
- **#8 mode-resume**: splash (`soldbay-app/src/app/index.tsx`) APPROVED sellers resume `lastActiveMode`; pending/rejected land on the seller dashboard; buyers on `/buyer/home`.

### #10 — DB query-optimization pass (audit done)
Hot queries audited against schema indexes — all covered: feed `GET /api/listings` (status/category/cursor) by `Listing[status,createdAt]` + `Listing[categoryId,status,createdAt]`; orders list `OR[buyerId,sellerId]` by `Order[buyerId,status,createdAt]` + `Order[sellerId,status,createdAt]`; wallet by `WalletTransaction[userId,createdAt]`; seller products by `Listing[sellerId,status,updatedAt]`. Only note: substring search (`contains` → `ILIKE '%…%'`) would benefit from a `pg_trgm` GIN index at scale — deferred, not worth an extension/migration at current volume.

### #11 — Launch-Readiness
Documented as **deferred** (no code): custom domain, Paystack production creds, admin dashboard on the deployed env, legal (ToS/privacy), app-store prep, and infra/rate limits are product/commercial decisions — tracked in EC-9.

### #5 (roadmap #15) — add-to-cart
Still **not built** (out of scope this pass): the Cart tab is a "Coming soon" placeholder; checkout/drafts unaffected.

### Verification
- `soldbay-app`: `tsc --noEmit` clean; `expo lint` 0 errors (1 pre-existing warning `orders/detail.tsx`).
- `soldbay-web`: `tsc --noEmit` clean; new routes lint-clean.

### Files touched
- `soldbay-web/src/app/api/sellers/upgrade/route.ts` (new), `soldbay-web/src/app/api/cron/purge-drafts/route.ts` (new), `soldbay-web/vercel.json`
- `soldbay-app/src/app/seller/upgrade.tsx` (new), `soldbay-app/src/lib/api.ts`, `soldbay-app/src/app/profile/index.tsx`
- Docs: `docs/daily-log.md` (this entry); Linear EC-9 "Open items" updated + comment; project doc [2026-09-06](https://linear.app/emanncode/document/2026-09-06-dd1373beddb3) appended.

## Sep 6, 2026 — Confirmed-bug pass: splash redirect, retention verify, dashboard pending banner

Linear: [Work Log — Sep 6, 2026](https://linear.app/emanncode/issue/EC-10/work-log-sep-6-2026-confirmed-bug-pass-splash-redirect-retention) (status: Backlog) · Project document: [2026-09-06](https://linear.app/emanncode/document/2026-09-06-dd1373beddb3)

### Confirmed bugs fixed
- **Splash no longer strands pending sellers in buyer mode**: `soldbay-app/src/app/index.tsx` still redirected SELLER users to `/buyer/home` unless APPROVED — contradicting the Sep 5 policy (approval gates publishing, not seller-mode access). Now APPROVED sellers resume `lastActiveMode` (`/seller/dashboard` vs `/buyer/home`); pending/rejected sellers land on `/seller/dashboard`. Added a pending/rejected banner there ("Complete Verification" → `/seller/verify`) so the status is discoverable and that draft listings save automatically until approval.
- **`scripts/verify-account-retention.ts` updated for the email-reuse model**: the old post-DELETE assertion (email "fully intact") was false — DELETE now stamps `deleted+{userId}@deleted.soldbay.app` and keeps the original in `User.previousEmail`. Rewritten: STEP 2 asserts placeholder email + `previousEmail` preservation + password/name intact over a ~5yr window; STEP 3 blocks re-login with the original address (401); STEP 4 proves the freed address re-signs-up (201). Re-run → **PASSED (all 4 steps)**; script cleans up its own throwaway users.
- **"Throwaway test accounts in prod" (#10) — checked, already clean**: new `soldbay-web/scripts/list-users.ts` lists the live DB — **0 users**, and 0 seller profiles / listings / orders / sessions / accounts / disputes / wallet transactions. The Sep 1 verification accounts were already removed; nothing to delete.

### Open items (consolidated; full list now in EC-9 "Open items")
- #14 switch-to-campus-seller re-runs full signup; #15 add-to-cart not built; mode-toggle placement undecided; exact tab set/order vs locked spec unconfirmed; multi-mode app-resume not fully built; image upload size limit not implemented; DB query-optimization pass never done; Launch-Readiness block (domain, Paystack, admin dashboard, legal, app-store prep, infra); draft expiry/auto-cleanup ("8c") — stale draft listings have no expiry/purge, lowest urgency.

### Verification
- `soldbay-app`: `tsc --noEmit` clean; `expo lint` clean (1 pre-existing warning in `orders/detail.tsx`).
- `soldbay-web`: `tsc --noEmit` clean; `scripts/verify-account-retention.ts` PASSED; live DB user-data footprint = 0.

### Files touched
- `soldbay-app/src/app/index.tsx`, `soldbay-app/src/app/seller/dashboard.tsx`
- `soldbay-web/scripts/verify-account-retention.ts`, `soldbay-web/scripts/list-users.ts` (new)
- Docs: `docs/daily-log.md` (this entry); Linear EC-9 "Open items" section updated + comment; EC-10 created; project document [2026-09-06](https://linear.app/emanncode/document/2026-09-06-dd1373beddb3).

## Sep 5, 2026 — Relaxed seller approval gating, shared tab shell, email reuse on delete

Linear: [Work Log — Sep 5, 2026](https://linear.app/emanncode/issue/EC-9/work-log-sep-5-2026-relaxed-seller-approval-gating-shared-tab-shell) (status: Backlog)

### Shipped
- **Q1 — Self-purchase 403**: `soldbay-web/src/app/api/orders/checkout/route.ts` now returns 403 (was 400) when a seller buys their own listing.
- **Q2 — Approval gates publishing, not seller mode**: added approval-free `requireSeller` (`soldbay-web/src/lib/seller-gate.ts`, built on shared `resolveSellerUser`/`findSellerProfile`); draft routes use it; `publish` + live-listing edits keep `requireApprovedSeller`. Mobile: pending sellers get full seller mode (dashboard/wallet/products/orders/profile); `create-listing` step 4 saves as draft when not approved; `verify` pending state offers "Go to Seller Dashboard" + "Continue as a Buyer".
- **Q3 — Shared tab layout (Option 1)**: new `soldbay-app/src/lib/tabs.tsx` (`useModeTabs`) + `soldbay-app/src/components/tab-screen-shell.tsx`; refactored 9 tab screens (buyer home/search/cart/wallet, seller dashboard/products/wallet, profile, orders); removed dead `useSellerVerificationGate`. Option 2 (full expo-router nested tab layouts) documented in [`docs/tab-layouts-roadmap.md`](./tab-layouts-roadmap.md).
- **Q4 — Free deleted emails**: `User.previousEmail` added; `DELETE /api/users/me` stores the original address and stamps `deleted+{userId}@deleted.soldbay.app`; purge nulls `previousEmail`. Migration `20260905000000_add_user_previous_email` **applied** (see Verification).

### idea.md items 5 & 11 worked on
- **Item 5 — `level` field removed from the app**: earlier log claimed `level` was already absent — that was wrong; an audit found `User.level` still stored and surfaced (schema, `/signup`, `/sellers`, `/users/me`, mobile `api.ts` types). Removed it everywhere: schema column dropped (migration `20260905010000_drop_user_level`), API routes no longer read/write it, mobile `SignupPayload`/`UserMeResponse` types cleaned, `test_all_endpoints.ts` stale `level` PATCH assertion removed. Level now exists nowhere in the product — school (university) is the only attribute collected, exactly matching idea.md #5. Note: `WaitlistSignup.level` + the landing waitlist form (`join-form.tsx`) were intentionally **left untouched** — that's a separate lead-gen table, not a product account; can be pruned later if wanted.
- **Item 11 — buyer wallet is now an explicit "coming soon" placeholder**: added `BuyerWalletComingSoon` to `wallet-view.tsx` — a dashed informational banner ("Buyer wallet — coming soon", "you pay in person at pickup, nothing to fund yet") for `BUYER` role only, with no deposit/top-up/interaction. Buyer still sees the informational "Escrow on hold" balance for tracking. Seller wallet unchanged (PAYOUT on escrow release).

### In-app QA checklist (next time in the app)
1. Self-purchase → 403.
2. Re-signup with a deleted account's email succeeds (no 409).
3. Pending seller: seller mode works; step 4 = "Save as Draft"; direct publish 403.
4. After approval: drafts visible + publishable from seller dashboard.
5. Tab bar consistent across all 9 screens; active tab highlights (orders = none in buyer mode, by design).
6. Buyer wallet reads as "coming soon" (no fund/withdraw path).
7. No `level` in signup or profile screens; `/users/me` returns no `level` field.

### Verification
- Both apps: `tsc --noEmit` clean.
- `expo lint` clean (1 pre-existing warning in `orders/detail.tsx`); web lint clean except pre-existing errors in `prisma/seed.ts`, `scripts/clear-db.ts`, `test_all_endpoints.ts`.
- Prisma client regenerated (7.9.1).
- Migrations **applied** (via `prisma dev` local server + `migrate deploy`): `20260905000000_add_user_previous_email`, `20260905010000_drop_user_level` — `migrate status` up to date; DB assert: `User.level` gone, `User.previousEmail` present.

### Files touched
Backend: `orders/checkout/route.ts`, `lib/seller-gate.ts`, `listings/drafts` + `drafts/[id]` routes, `prisma/schema.prisma` + migrations `20260905000000_add_user_previous_email` + `20260905010000_drop_user_level`, `users/me/route.ts`, `lib/account-retention.ts`, `api/auth/signup/route.ts`, `api/sellers/route.ts`, `test_all_endpoints.ts`. Mobile: `lib/tabs.tsx` (new), `lib/auth.ts`, `lib/api.ts`, `components/tab-screen-shell.tsx` (new), `components/wallet-view.tsx`, `components/index.ts`, `buyer/{home,search,cart,wallet}`, `seller/{dashboard,products,wallet,create-listing,verify}`, `profile/index`, `orders/index`. Docs: `docs/tab-layouts-roadmap.md` (new).