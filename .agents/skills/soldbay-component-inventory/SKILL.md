---
name: soldbay-component-inventory
description: Linear Document - Component Inventory & Build Order
---

# Component Inventory & Build Order

Full reusable component inventory, built directly from the Feature/Workflow Inventory and Screen Flow (IA) — not a guess, every entry maps to something those docs already establish as needed. Purpose: build these systematically before deep screen design starts, so screens compose from a settled kit instead of each screen reinventing pieces ad hoc.

**Workflow:** each component is built directly in the opened `design.pen` file by the agent using the ready components. DO NOT generate image visuals. Reference `soldbay-design-system.html` (dropped into the design folder) for every token: colors, type scale, spacing, radius, elevation. Build one component per session.

Build order: Navigation/Structure first (almost everything else sits inside these), then Cards/Buttons (used everywhere), then the rest.

## Navigation / Structure

- [x] Tab bar (4 items: Browse/Search/Orders/Profile) — built and locked (unread badge dot = #FFB980, not error-red or active-indicator orange)
- [x] Screen header (title + bell) — built and locked (Title 3, 20px/Semibold confirmed; #FFB980 unread dot on bell matches the tab-bar badge convention)
- [ ] Search bar — result reviewed, sent back for one correction: rendered as `radius-full` (pill), corrected to locked `radius-sm` (8px) to stay consistent with the rest of the Inputs family. Awaiting corrected result.

## Cards

- [x] Product card (grid item: image, title, price, badges) — built and locked after one correction round (added strikethrough original price alongside discount, made verified/unverified badge mandatory on all 5 states including Sold and no-photo). Verified badge stayed icon-only; Unverified became an icon+text pill — deliberate differentiation (verified = quiet confirmation of the expected state, unverified = the exception that needs explicit callout), not an inconsistency to fix.
- [x] Order/transaction card — built and locked. All four semantic states correctly mapped (Pending pickup → Info #0D3B7A, Awaiting handoff → Warning #6B4E00, Completed → Success #14532D, Disputed → Error #8B1A10), countdown correctly suppressed to "Auto-release paused" on Disputed.

## Buttons

- [x] Primary button (accent fill) — built and locked (#F47A32 fill, #031F21 label)
- [x] Secondary/outline button — built and locked, one correction round: a bonus "Action Bar" composite pattern Agy added had inconsistent copy ("Chat" vs "Message" elsewhere) — corrected to "Message" to match the locked Screen Flow copy ("Message the seller")
- [x] Icon button — built and locked (muted secondary/icon tone, not accent)
- Bonus: an "Action Bar" composite pattern (bookmark/wishlist icon button + Message secondary + Buy Now primary) was added beyond the original ask — kept and locked as a documented reusable pattern, since it maps directly onto the real Product Detail screen's bottom action bar from the Screen Flow

## Badges / Pills

- [x] Verified-seller badge — built and locked (icon-only, per product card)
- [x] Discount badge (with stroke) — built and locked (#FFB980 fill, #F47A32 stroke, per product card)
- [x] Status pill (success/warning/error/info) — built and locked (per order/transaction card + list rows)

## Inputs

- [x] Text input — built and locked (default/filled/error states confirmed correct; distinct focused state not separately demonstrated, minor gap, not blocking)
- [x] Textarea (listing description) — built and locked, same states as text input
- [x] Select/dropdown (category, condition) — built and locked (closed + open states, correct elevation)
- [x] Toggle/switch (verified-only filter, dark mode) — built and locked (#F47A32 on-state track, correct)
- Bonus: "All 4 Input Types Together in Form Pattern" — a composite Create-Listing-style form assembling all four inputs together, kept as a documented reusable pattern

## Lists

- [x] Generic list item (settings, order history rows) — built and locked (status pills correctly using distinct semantic colors per row)
- [x] Chat message bubble (sent/received) — built and locked (sent = peach fill + dark text, avoiding the orange-fill/white-text contrast trap; received = white/light fill). Bonus: chat header pattern (seller name + verification badge inline) kept as a documented reusable pattern — this is the Seller Info Row component from Identity, demonstrated in real context

## Feedback

- [x] Empty state — built and locked (icon + message + Clear Filters action button)
- [x] Loading skeleton — built and locked (desaturated teal-tinted blocks, not generic gray)
- [x] Toast/banner — built and locked (full-strength fill + white text for ephemeral toasts; a separate lighter inline-context-box treatment, 12% tint + colored text, applies to persistent embedded messages like the PIN screen's "Buyer is at Hall B" box — see Color section)
- [x] Modal/dialog — built and locked ("Confirm Item Release?" example, correct elevation + button treatment in both modes)

## Identity

- [x] Avatar — built and locked. 44×44px, radius-full, Headline 17px/Semibold initials fallback. Photo + initials-fallback states shown, both modes. New decision: dark-mode initials-fallback uses a solid `#67B8B3` fill (not the 24%-opacity treatment that token uses elsewhere for borders/secondary text/icons) — accepted as a new locked usage specific to avatar-fallback surfaces, since it clears contrast easily and reads clean.
- [x] Seller info row (avatar + name + verification badge) — built and locked, demonstrated via the chat header pattern ("Chidi E. ✓ Verified Seller")

## Misc

- [x] Divider — covered by the locked border/divider tokens, no separate component needed
- [x] Filter chip — built and locked (unselected outline vs. selected #FFD0A6 fill + #031F21 text + checkmark, \~11.8:1 AAA, correctly avoids #F47A32-on-white)
- [x] Countdown/timer display (48hr auto-release) — built and locked (compact inline + large focal versions, both demonstrated)
- [x] PIN entry/reveal component (core differentiator flow) — built and locked after full dedicated review: buyer entry (filled/active/empty digit states) + all 3 seller-reveal states (inactive/active/revealed), correct dark-teal-on-orange label contrast confirmed on the active button

Icon library: Phosphor Icons (outline for inactive states, fill for active) — already locked in the Design System Reference doc.
