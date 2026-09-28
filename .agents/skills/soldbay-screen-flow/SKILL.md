---
name: soldbay-screen-flow
description: Information about Screen Flow (IA) for Soldbay
---

# Screen Flow (IA)

**Status: FINAL for mobile buyer/seller.** Admin/Ops has its own separate IA ("Admin/Ops Screen Flow (IA)") and is not covered here.

Screen-to-screen flow (information architecture) — not visual design, not build-order tiers. This maps what screens exist and what triggers a transition between them, based on the finalized MVP triage in "Feature/Workflow Inventory." Build order is in "Screen Build Order (Re-Sequenced)" (which superseded the old "Screen & Component Priority" doc).

## Buyer flow

Signup/Auth (buyer account; campus chosen via the full-screen Campus Picker, then locked) → Feed/Browse → \[optional: Search & Filters\] → Product Detail → \[optional side-branch: Add to Wishlist, returns to Feed/Detail\] → Checkout (buy-now, escrow — Paystack or Flutterwave) → Order Confirmation → Order Status screen → Messaging thread opens (per-order) → buyer arrives, taps "ready for pickup" → seller's PIN-reveal activates → buyer enters/confirms PIN → Handoff Confirmed → Rate & Review seller → back to Feed

Branches:

* Payment fails → retry Checkout
* Buyer cancels pre-handoff → Order History (cancelled)
* Handoff fails (no-show/PIN mismatch) → Dispute flow

Side loops (not part of the linear path, always reachable):

* Profile → Order History / Wishlist / Settings / Help+FAQ (campus-change petition) / Account Security
* Notification bell → Notification list → tap → deep-links into the relevant screen (Order Status, Chat, etc.)
* Product Detail → Report a listing → confirmation, returns to Product Detail

## Seller flow

Every account starts as a buyer account. To sell: Profile → Switch to Seller → the user chooses ONE verification path (Student ID front + back, OR a Student Portal screenshot) → Submit for Verification → unverified badge shown immediately, access not blocked → Seller Dashboard → Create/Edit Listing → published, appears in buyer Feed

Order lifecycle:
Order comes in → Orders/Sales queue → Order Detail (seller view) → confirms/sets pickup window → Messaging thread → buyer taps ready → seller's PIN-reveal activates → reveals PIN in person → buyer confirms → Handoff Confirmed → 48hr auto-release timer starts → funds land in Wallet

Branches:

* Handoff fails → Dispute flow

Side loops:

* Wallet → Balance / Transaction History / Withdrawal / Payout Method / Payout Status (reached via "View Wallet" on the Hub balance card)
* Seller Profile → business info, verification status, ratings, Settings, "Switch to Buyer"

## Shared / cross-cutting

* Dispute flow (either role can enter) → Evidence Submission → Dispute Status → Admin resolution → Refund (if applicable) → back to Order History
* Block/report a user from chat → confirmation, exits back to where it was triggered