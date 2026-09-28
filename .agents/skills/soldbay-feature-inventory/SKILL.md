---
name: soldbay-feature-inventory
description: Information about Feature/Workflow Inventory for Soldbay
---

# Feature/Workflow Inventory

**Status: FINAL — scope source of truth.** The MVP / Later / Cut triage below is complete and settled; scope is not re-litigated elsewhere. Where a later, more specific doc refines an item, it is annotated inline with a pointer. All MVP screens are designed and locked (see Screen Build Order and Admin/Ops Screen Flow (IA)); the project is now in real-code integration (see Workflow & Continuation Guide).

Raw, exhaustive inventory of every feature/workflow across the whole product — buyer + seller, all product areas. This is the step that should have happened before any screen design started (per the Ace design-principles doc). Locked product decisions reflected: no cart (single-item buy-now only), no separate favorites/save (merged into wishlist), campus is fixed at signup and only changeable via email petition to Soldbay support.

Cross-referenced against Jiji, Jumia, and why campus vendors default to WhatsApp (validated by a direct competitor, Unigram, positioning itself against exactly that). Conclusion: most of what those platforms offer (job listings, pay-on-delivery, multi-vendor logistics penalties, broadcast marketing tools) would be overreach for a single-campus, single-unit, student-to-student app. The one item validated as a real gap rather than a nice-to-have: rating & review system (both Jiji and Jumia treat this as load-bearing for trust).

## Triage (complete)

Every item is tagged **MVP** / **Later** / **Cut**. "Cut" means *out of v1 scope, open to revisit once there's real usage data* — not a permanent kill — except a handful of items that are actual locked product decisions regardless of timing (no cart, no per-listing quantity/stock, no manual dark-mode toggle since system-default is already fully specced). Those are settled no's, not deferrals.

### 1. Onboarding & Auth

* Signup — MVP. Refined: First Name/Surname, Matric Number (collected, not verified), Email, optional Phone, Campus via full-screen picker, T&Cs. Every signup is a buyer account (see "Signup/Auth Rework — Buyer-First Model + Campus Picker")
* Login / session mgmt / password reset — MVP
* Switch buyer/seller mode — MVP
* Seller verification submission — MVP. Refined: initiated from Profile → Switch to Seller; the user chooses EITHER Student ID (front + back) OR a Student Portal screenshot — one path, not both (see Signup/Auth Rework)
* Campus selection (locked at signup) — MVP
* Account deletion — MVP
* Re-signup after deletion — MVP
* T&Cs / privacy policy acceptance — MVP
* Social/SSO login — Later
* Onboarding walkthrough/tutorial — Cut (4-tab app doesn't need hand-holding; revisit if real users get confused)

### 2. Feed / Browse

* Home feed grid (own campus only) — MVP
* Category browsing (chips) — MVP
* Sections (recently added, trending, hall/dept-specific) — Later (needs usage data to justify segmentation)
* Empty states — MVP
* Loading states (skeleton) — MVP
* Pull-to-refresh — MVP
* Infinite scroll / pagination — MVP
* Personalized recommendations — Cut (no data at fresh-campus launch to make this meaningful)
* Screen identity/wayfinding — RESOLVED: a lightweight screen-title on every main tab, with the bell on the right (see Design System Reference)
* Note: anything above tagged "already built" in [EC-28](https://linear.app/emanncode/issue/EC-28/tier-1-17-feed-browse-home) ([https://linear.app/emanncode/issue/EC-28/tier-1-17-feed-browse-home](<https://linear.app/emanncode/issue/EC-28/tier-1-17-feed-browse-home>)) was revisited during this triage, not automatically settled just because code/design existed.

### 3. Search & Filters

* Search bar / keyword search — MVP
* Filters (category, price, verified-only, condition, availability) — MVP. Verified Only is chip-only, globally — no separate toggle anywhere.
* Sort (price, recency, popularity) — MVP
* Search history / recent searches — Later
* Search suggestions / autocomplete — Later (sparse catalog at launch makes this low-value)
* No-results state — MVP
* Saved searches / search alerts — Cut (needs steady listing volume to matter)

### 4. Product Listing (Seller Side)

* Create listing — MVP
* Edit listing — MVP
* Delete / unlist / relist — MVP
* Draft listings — Later
* Discount/sale pricing — MVP (visual spec locked)
* Quantity/stock per listing — Cut, locked (single-unit model, not a timing deferral)
* Listing expiry / auto-relist / bump — Later
* Boost/promote a listing — Later (monetization feature)
* Bulk listing tools — Cut (not this user base — individual student sellers)
* Listing performance stats — Later

### 5. Product Detail

* Full listing view — MVP
* Photo gallery / zoom — MVP
* Seller info & verification display — MVP
* Self-purchase blocking — MVP
* Report a listing — MVP
* Share a listing — Later
* Add to wishlist — MVP
* Ask a question before buying — Cut, locked (confirmed: defeats the purpose of messaging-only-after-payment)
* Similar/related listings — Cut (needs catalog depth)
* Price history — Cut (low value for one-off single-unit listings)

### 6. Checkout

* Single-item buy-now flow — MVP
* Payment method selection — MVP (Paystack and Flutterwave)
* Escrow/held-payment processing — MVP
* Payment failure/retry — MVP
* Order confirmation — MVP
* Coupon/promo codes — Cut (no pricing/marketing infra or clear owner yet)

### 7. Pickup Coordination

* Seller sets pickup windows — MVP
* Buyer selects pickup window — MVP
* Reschedule/change window — MVP (real gap — pickup timing is too central to leave to chat alone)
* Pickup location/map display — MVP (fixed pickup point is locked as a concept)
* Pickup point management (fixed vs. multiple) — Later (start with one fixed point per campus)
* Late/no-show handling — MVP
* Pickup reminders/notifications — MVP

### 8. Order Status & Handoff

* Order status tracking — MVP
* PIN generation/reveal/entry/confirmation — MVP. Refined workflow: the seller's PIN-reveal control is not always-visible — it only appears/activates after the buyer taps a "ready for pickup / I'm here" action on their end. State flow: idle → buyer signals ready → seller's PIN reveal becomes available → PIN entered/confirmed.
* Handoff confirmation flow — MVP
* Auto-release timer/countdown display — MVP (48hr logic locked)
* Handoff failure handling (no-show, PIN mismatch, dispute) — MVP (real gap — the core differentiator needs a documented failure path)
* Order history — MVP
* Order cancellation (pre-handoff) — MVP
* Re-attempt handoff after failure — MVP

### 9. Messaging / Chat

* Per-order chat thread — MVP
* Message thread list/inbox — Cut, locked (no global inbox — scoped per-order only)
* Push notifications for new messages — MVP
* Read receipts — MVP, via long-press → info (not persistent checkmarks)
* Typing indicators — Cut for MVP
* Contact-info/off-app-payment flagging — MVP
* Chat archiving / read-only history — MVP (closes 24hrs post-handoff, locked)
* Pre-purchase inquiry chat — Cut, locked (conflicts with verified-sellers-only, opens-at-purchase gating)
* Block/report a user from chat — MVP
* Media sharing in chat (photos) — Later

### 10. Trust & Verification

* Seller verification badge display — MVP
* Seller verification submission & review — MVP (submission per the refined model in section 1; review = Admin/Ops queue)
* Buyer trust signals (account age, order history) — Later
* Rating & review system — MVP (validated as load-bearing by competitor research)
* Dispute history visibility — Later (depends on Disputes flow existing first)
* Fraud/scam reporting — MVP
* Blocklist / banned users — MVP

### 11. Seller Tools / Dashboard

* Active/sold/unlisted listings management — MVP
* Orders/sales queue — MVP
* Earnings summary — MVP
* Analytics (views, conversion, top listings) — Later
* Bulk actions on listings — Cut
* Customer messages overview — Cut, locked (no inbox means no overview surface)

### 12. Wallet / Payments (Seller)

* Balance display — MVP
* Transaction history — MVP
* Withdrawal / payout to bank — MVP (real gap — a wallet that only accumulates is incomplete)
* Payout method management — MVP
* Payout status tracking — MVP
* Fee/commission breakdown — Later (depends on an actual fee model existing first — business decision, not a UI task yet)

### 13. Profile / Settings

* Buyer profile (info, order history, wishlist items) — MVP
* Seller profile (business name, verification, ratings) — MVP
* Notification preferences — Later
* Privacy settings — Later
* Dark/light mode — MVP, both modes (system-default, no manual toggle — locked). Design System Reference extended and locked.
* Language preference — Cut, locked (English-only v1, toggle meaningless until Pidgin ships)
* Account security (password change, 2FA) — MVP
* Help/support/FAQ (+ campus-change petition entry point) — MVP
* App version/about — MVP

### 14. Disputes

* Dispute initiation — MVP
* Evidence submission (photos, chat logs) — MVP
* Dispute status tracking — MVP
* Admin/mediator resolution flow — MVP
* Refund processing — MVP
* Appeal process — Cut (revisit once real dispute volume shows it's needed)

### 15. Notifications

* Notification center/inbox — MVP
* Notification types (message, order update, pickup reminder, PIN reveal, listing sold, dispute update, verification status change) — MVP
* Wishlist price-drop notification — Later (depends on discount/re-pricing workflow maturing)
* Push notification settings — Later
* Email notifications — Later
* In-app banner/toast notifications — MVP

### 16. Admin / Ops (designed and locked — see Admin/Ops Screen Flow (IA))

* Seller verification review queue — MVP
* Listings moderation — MVP
* Dispute mediation panel — MVP
* User management (ban, suspend, reinstate) — MVP
* Platform analytics/reporting — Later
* Content moderation (flagged listings/messages) — MVP (merged with listings moderation into one Moderation screen with two tabs)
* Campus-change petition review — MVP

### 17. Cross-Cutting / Platform-Wide

* Onboarding tooltips/empty-state guidance — Cut
* Accessibility (screen reader, contrast, text scaling) — MVP (baseline responsibility, cheap to bake in now vs. retrofit)
* Offline/connectivity loss states — MVP, but not a standalone feature/screen: handled as ongoing backend/integration practice built alongside each feature that needs it
* App-wide search (help articles) — Cut (FAQ covers this at launch scale)
* Referral/invite-a-friend — Later
* Multi-campus expansion support — Later. Shape (for when this is picked up): admin needs a schools registry (all registered schools), and every buyer/seller account is scoped/registered under one school — more detail to be defined when this is actually prioritized.
* Localization (Pidgin, other languages) — Later (already locked as v2+)

## Where this leads

Triage was re-sequenced into the screen order in "Screen Build Order (Re-Sequenced)" (done — the old "Screen & Component Priority (Tiers 1-3)" doc is superseded). Design phase is complete for mobile and Admin/Ops; current work is real-code integration — see "Workflow & Continuation Guide" and the code-status section of "Component Inventory & Build Order".