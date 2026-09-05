# Daily Work Log

Running log of SoldBay work. Newest entry at the top. Each day is also mirrored
as a Linear issue (`EC-*`, "Work Log — <Month D, YYYY>: …").

## Sep 5, 2026 — Relaxed seller approval gating, shared tab shell, email reuse on delete

Linear: [Work Log — Sep 5, 2026](https://linear.app/emanncode/issue/EC-9/work-log-sep-5-2026-relaxed-seller-approval-gating-shared-tab-shell) (status: Backlog)

### Shipped
- **Q1 — Self-purchase 403**: `soldbay-web/src/app/api/orders/checkout/route.ts` now returns 403 (was 400) when a seller buys their own listing.
- **Q2 — Approval gates publishing, not seller mode**: added approval-free `requireSeller` (`soldbay-web/src/lib/seller-gate.ts`, built on shared `resolveSellerUser`/`findSellerProfile`); draft routes use it; `publish` + live-listing edits keep `requireApprovedSeller`. Mobile: pending sellers get full seller mode (dashboard/wallet/products/orders/profile); `create-listing` step 4 saves as draft when not approved; `verify` pending state offers "Go to Seller Dashboard" + "Continue as a Buyer".
- **Q3 — Shared tab layout (Option 1)**: new `soldbay-app/src/lib/tabs.tsx` (`useModeTabs`) + `soldbay-app/src/components/tab-screen-shell.tsx`; refactored 9 tab screens (buyer home/search/cart/wallet, seller dashboard/products/wallet, profile, orders); removed dead `useSellerVerificationGate`. Option 2 (full expo-router nested tab layouts) documented in [`docs/tab-layouts-roadmap.md`](./tab-layouts-roadmap.md).
- **Q4 — Free deleted emails**: `User.previousEmail` added; `DELETE /api/users/me` stores the original address and stamps `deleted+{userId}@deleted.soldbay.app`; purge nulls `previousEmail`. Migration `20260905000000_add_user_previous_email` written but **not yet applied** (`prisma migrate deploy` pending).

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