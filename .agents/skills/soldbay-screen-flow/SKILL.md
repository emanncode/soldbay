---
name: soldbay-screen-flow
description: Linear Document - Screen Flow (IA)
---

# Screen Flow (IA)

Screen-to-screen flow (information architecture) — not visual design, not build-order tiers. This maps what screens exist and what triggers a transition between them, based on the finalized MVP triage in "Feature/Workflow Inventory." Actual screen design and the Screen & Component Priority tier order are separate, later steps.

## Buyer flow

Signup/Auth (campus locked) → Feed/Browse → \[optional: Search & Filters\] → Product Detail → \[optional side-branch: Add to Wishlist, returns to Feed/Detail\] → Checkout (buy-now, escrow — Paystack or Flutterwave) → Order Confirmation → Order Status screen → Messaging thread opens (per-order) → buyer arrives, taps "ready for pickup" → seller's PIN-reveal activates → buyer enters/confirms PIN → Handoff Confirmed → Rate & Review seller → back to Feed

Branches:

* Payment fails → retry Checkout
* Buyer cancels pre-handoff → Order History (cancelled)
* Handoff fails (no-show/PIN mismatch) → Dispute flow

Side loops (not part of the linear path, always reachable):

* Profile → Order History / Wishlist / Settings / Help+FAQ (campus-change petition) / Account Security
* Notification bell → Notification list → tap → deep-links into the relevant screen (Order Status, Chat, etc.)
* Product Detail → Report a listing → confirmation, returns to Product Detail

## Seller flow

Signup/Auth → switch to Seller mode → verification submission (unverified badge shown immediately, access not blocked) → Seller Dashboard → Create/Edit Listing → published, appears in buyer Feed

Order lifecycle:
Order comes in → Orders/Sales queue → Order Detail (seller view) → confirms/sets pickup window → Messaging thread → buyer taps ready → seller's PIN-reveal activates → reveals PIN in person → buyer confirms → Handoff Confirmed → 48hr auto-release timer starts → funds land in Wallet

Branches:

* Handoff fails → Dispute flow

Side loops:

* Wallet → Balance / Transaction History / Withdrawal / Payout Method / Payout Status
* Seller Profile → business info, verification status, ratings, Settings

## Shared / cross-cutting

* Dispute flow (either role can enter) → Evidence Submission → Dispute Status → Admin resolution → Refund (if applicable) → back to Order History
* Block/report a user from chat → confirmation, exits back to where it was triggered
