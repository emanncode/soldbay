---
name: soldbay-screen-build-order-re-sequenced
description: Information about Screen Build Order (Re-Sequenced) for Soldbay
---

# Screen Build Order (Re-Sequenced)

**Status: every mobile MVP screen is designed and locked (all** `[X]`**).** This doc is now the reference order for the real-code screen build (app components first, then these screens in this order — see Workflow & Continuation Guide). Code status per screen: Feed/Browse, Search/Filters & Product Detail built.

Replaces the superseded "Screen & Component Priority (Tiers 1-3)" doc. Every screen below is derived from two already-locked sources — not a fresh guess: **which** items belong on it comes from the MVP-tagged entries in Feature/Workflow Inventory, **when** it comes in sequence comes from Screen Flow (IA)'s own buyer/seller/shared ordering. Later/Cut items are deliberately left off each screen's scope — if it's not MVP-tagged, it's not part of this build.

Design-phase process (complete): search real references first, one explicit design prompt per screen referencing `soldbay-design-system.html`, hand to Agy, review against Design System + Screen Flow + accessibility, correct, lock — then mark `[X]` here.

## Tier 1 — Buyer core loop (highest traffic, most trust-critical)

- [X] **Feed/Browse** — home feed grid (own campus only), category chips, empty state, loading skeleton, pull-to-refresh, infinite scroll/pagination.
- [X] **Search & Filters** — search bar, filters (category/price/verified-only/condition/availability), sort, no-results state. "Verified Only" is chip-only, globally — no separate toggle anywhere.
- [X] **Product Detail** — full listing view, photo gallery/zoom, seller info & verification display, self-purchase blocking, report a listing, add to wishlist
- [X] **Checkout** — single-item buy-now flow, Paystack/Flutterwave payment cards, no delivery fee (pickup-only), payment failure/retry, order confirmation
- [X] **Pickup-Window Selection** — seller sets windows, buyer selects window, reschedule/change window, pickup location/map display, late/no-show handling, pickup reminders/notifications
- [X] **Order Status + Handoff** — order status tracking, PIN generation/reveal/entry/confirmation, handoff confirmation, auto-release countdown UI, handoff failure handling, order history, cancellation, re-attempt handoff. Copy uses "held"/"Auto-Release Window," no "Escrow" anywhere user-facing.
- [X] **Messaging/Chat** — per-order thread, push notifications for new messages, read receipts (long-press → tooltip, no persistent read indicator), contact-info/off-app-payment flagging, chat archiving, block/report a user from chat
- [X] **Rate & Review** — its own screen (upgraded to MVP via Jiji/Jumia competitor validation); Screen Flow places it right after Handoff Confirmed, before returning to Feed
- [X] **Notifications** — notification center/inbox, all MVP notification types (message, order update, pickup reminder, PIN reveal, listing sold, dispute update, verification status change)

## Tier 2 — Onboarding, seller side, shared account screens

- [X] **Signup/Auth** — Login, Sign Up (First Name/Surname side-by-side, Matric Number, Email, Phone optional, Campus, T&Cs gating disabled/active Create Account), Campus Picker (default/filtered/empty states, full-page searchable), and Switch to Seller. **Switch to Seller is choose-one, not both:** the user picks EITHER Student ID (front + back, \~1.586:1 card ratio) OR a Student Portal screenshot (adaptive portrait/landscape preview); 5 states built (default, ID empty, ID filled, Portal empty, Portal filled). Full detail in "Signup/Auth Rework — Buyer-First Model + Campus Picker". Buyer-first model fully in place — no buyer/seller choice at signup.
- [X] **Create/Edit Listing** (seller) — create, edit, delete/unlist/relist, discount/sale pricing
- [X] **Seller Dashboard** — active/sold/unlisted listings management, orders/sales queue, earnings summary. Seller nav locked: Hub/Orders/Post/Profile. Wallet reached via "View Wallet" on the balance card, not a nav tab.
- [X] **Profile/Settings** — built twice, buyer and seller layouts are distinct, not shared. Buyer: info, order history, wishlist, Switch to Seller CTA. Seller: business name, verification, ratings. Both: dark/light mode (system-default, no manual toggle), account security (password change, 2FA), help/support/FAQ + campus-change petition entry point, app version/about
- [X] **Wallet/Ledger** (seller) — Total/Withdrawable/Held balance breakdown, transaction history, withdrawal/payout to bank, payout method management

## Tier 3 — Lower frequency, can wait

- [X] **Dispute Flow** (shared, either role can enter) — reason selection, evidence/photo upload, status timeline (Submitted → Under Review → Resolved)

## Admin/Ops (web, separate track)

Not part of the mobile tiers above. Designed and locked separately in "Admin/Ops Screen Flow (IA)" and "Admin/Ops — Screen Design Prompts" (6 screens, desktop + mobile fallback). In code this is built AFTER the whole mobile app and the web component library.