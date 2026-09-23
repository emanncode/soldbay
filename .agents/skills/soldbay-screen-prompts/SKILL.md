---
name: soldbay-screen-prompts
description: Contains the explicit, ready-to-run design prompts for the next 10 screens in the Soldbay Screen Build Order. Use this to generate UI screens.
---

# Soldbay Screen Design Specs (Next 10)

This skill provides the ready-to-use design specs for the next 10 screens in the Soldbay Screen Build Order (Re-Sequenced). DO NOT generate image visuals.

## Standing Rule for All Screens

- Search real references first (Depop, Vinted, Jiji, Jumia) before starting the design. Pick 1-2, adapt.
- Build the design directly in the opened `design.pen` file. Show both light and dark mode unless noted.
- Use `soldbay-design-system.html` for every token — never invent new values.
- Self-check against the **"Validate"** list under each prompt before finalizing.

---

## ~~1. Feed/Browse~~ (Done)

**Prompt:** Design the Feed/Browse home screen. Structure top to bottom: Screen header ("Browse" title top-left, Title 3/20px/Semibold, bell icon right, no wordmark/campus name), Search bar (locked component, `radius-sm`), Category/filter chip row (horizontal scroll, locked Filter Chip, unselected/selected), Product Card grid (2-column, mix in Sold and no-photo states), Tab bar (Browse tab active). Show: populated feed, empty state ("No listings yet" + Clear Filters), loading skeleton state.
**Validate:** No wordmark/campus name in header. No cart tab, no "+" post action, no Wallet tab, no message icon in header. Category chips visible but no card-based category browsing.

## ~~2. Search & Filters~~ (Done)

**Prompt:** Design the Search & Filters screen. Header: Search bar (active/focused state, `radius-sm`) with back navigation. Below: Filter Chip row (category, price range, verified-only toggle using locked Toggle component, condition, availability). Sort control as a dropdown. Results: same Product Card grid as Feed. No-results state: "No results for '[query]'" + Clear Filters action.
**Validate:** Verified-only filter uses locked Toggle component (not a chip). No search history/autocomplete UI.

## 3. Product Detail

**Prompt:** Design the Product Detail screen. Top: Photo gallery (swipeable). Below: Product title (Title 2/22px/Semibold), price (strikethrough original + discount badge if applicable), Seller Info Row (avatar + name + verification badge). Description body text. Bottom: Action Bar composite (bookmark/wishlist + "Message the seller" secondary + "Buy Now" primary). Include Report a Listing entry point. Self-purchase blocking: show state where current user IS the seller (disabled Buy Now or "This is your listing" note).
**Validate:** Verified badge is icon-only; unverified is icon+text pill. No "Ask a question before buying" entry point. No similar/related listings section.

## 4. Checkout

**Prompt:** Design Checkout screen. Order summary card. Payment method selection: Paystack and Flutterwave as selectable cards. Public-facing copy must say "held" not "escrow". Primary button "Pay [amount]". Show: default state, payment failure/retry state (Error semantic color + Toast banner), and Order Confirmation screen (checkmark/success, order details, "View Order Status").
**Validate:** No coupon/promo code field. "held," never "escrow," anywhere user-facing.

## 5. Pickup-Window Selection

**Prompt:** Design Pickup-Window Selection screen. Seller-side: time-window picker. Buyer-side: same picker reading availability. Static map/location display for campus pickup point. "Reschedule" entry point. Late/no-show state: inline warning (Warning semantic color + inline-context-box treatment: 12% tint + colored text).
**Validate:** Newest screen; flag any pattern choice explicitly in notes rather than silently deciding.

## 6. Order Status + Handoff

**Prompt:** Design Order Status screen. Top: Countdown/Timer display (Title 2, "Auto-releases in Xh"). Status Pill (Pending pickup / Awaiting handoff / Completed / Disputed). Middle: PIN entry/reveal component (buyer sees entry state, seller sees reveal-button gated on buyer's "I'm here" signal). Bottom: handoff failure handling (no-show/PIN mismatch) leading toward Dispute flow. Order history entry, cancellation entry, re-attempt handoff.
**Validate:** PIN reveal button must show all 3 states correctly gated (inactive-waiting → active-tappable only after buyer signals ready → revealed).

## 7. Messaging/Chat

**Prompt:** Design Messaging/Chat screen (per-order thread). Header: chat-header pattern (Seller Info Row). Body: Chat Message Bubble (sent/received, alternating). Read receipt: show long-press → info interaction tooltip. Block/report-user entry point. Footer: message input + send button.
**Validate:** No typing indicator. No media/photo-sharing UI. Scoped to one order only (no global inbox).

## 8. Rate & Review

**Prompt:** Design Rate & Review screen. Star rating input (5-star tap, accent color `#F47A32` for filled stars). Optional written review (Textarea). Submit button. Secondary state: how a submitted rating displays on a Seller Profile (aggregate score + review count, Headline/Subheadline scale).
**Validate:** Must be skippable (confirm "Skip" or dismissal path exists).

## 9. Notifications

**Prompt:** Design Notification Center screen (accessed via header bell). List of notifications using Generic List Item (icon + label + timestamp + divider). Cover all MVP types (message, order update, pickup reminder, PIN reveal, listing sold, dispute update, verification status change). Unread state: `#FFB980` dot.
**Validate:** No push notification settings or email notification toggles on this screen.

## 10. Signup/Auth

**Prompt:** Design Signup/Auth flow. Signup: email/phone input, campus selection (Select/dropdown - copy must clarify permanence: "Choose carefully — this can only be changed via support request"), T&Cs acceptance. Login: email/phone + password inputs, "forgot password". Buyer/seller mode switch (settings-level toggle pattern). Seller verification submission: form + Unverified badge shown immediately.
**Validate:** Campus selection permanence is clear. No social/SSO login buttons. No onboarding walkthrough/tutorial screens.

_(Reference Linear Documents: `bd758cd51524`, `6dd4a0b360e7`, `e9d3cf4b4e09`)_
