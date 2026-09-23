---
name: soldbay-component-prompts
description: Linear Document - Remaining Component Prompts — Backlog
---

# Remaining Component Prompts — Backlog

Full explicit design specs for every remaining unbuilt component. Each spec references `soldbay-design-system.html` for all tokens (colors, type scale, spacing, radius, elevation) — do not invent new values. Deliver each by building it directly in the opened `design.pen` file. DO NOT generate image visuals. Mark each `[X]` in the Component Inventory & Build Order doc once built, same as prior components.

## Badges / Pills (consolidation — these already exist embedded in Product Card / Order Card, this pass extracts them as standalone documented components)

**Verified-seller badge**: icon-only circular badge, checkmark-shield icon, `#031F21` icon on white/translucent backing (light) or equivalent dark-mode treatment already used on the product card. Document as its own component with a single state (no variants needed — it's binary, either shown or not).

**Unverified-seller badge**: icon+text pill, "Unverified" label, Caption 1 scale, teal/neutral tones (never Error/Warning colors — this is a trust-status indicator, not a warning). Document as its own component alongside the verified badge for direct side-by-side comparison.

**Discount badge**: `#FFB980` fill, 1.5px `#F47A32` stroke, `#031F21` label (e.g. "−20%"). Single state.

**Status pill** (from the order/transaction card): four variants using the locked semantic colors — Success `#14532D`, Warning `#6B4E00`, Error `#8B1A10`, Info `#0D3B7A`. `radius-full`, white/light label text — verify each clears at least AA-large contrast (3:1) since these are small pill labels, flag any that don't.

Show all four badge/pill types together on one board for direct comparison.

## Inputs

**Text input**: single-line, `radius-sm` (8px), border `#008080` (light) / `#67B8B3` at 24% opacity (dark) — reusing the locked border tokens, not new ones. Label above the field (Footnote scale, 13px), placeholder text in secondary-text color at reduced opacity, typed text in primary-text color. States: default, focused (border shifts to `#F47A32` or thickens — pick whichever reads more natively, not both), error (border color `#8B1A10`, helper text below in the same error color), disabled (reduced opacity).

**Textarea**: same visual treatment as text input, taller, used for the listing description field. Same states.

**Select/dropdown**: same border/radius treatment as text input, with a chevron-down icon (Phosphor) on the right in the secondary/icon tone. Show closed and open (options list) states. Options list uses the card elevation treatment (light shadow / dark border).

**Toggle/switch**: used for "verified-only" filter and dark-mode setting. Off state: neutral gray/border-tone track. On state: `#F47A32` track (this is a legitimate small-area accent use, not text, so the contrast-avoidance rule doesn't block it here) with a white or `#031F21` thumb depending on which reads clearer. Show both states, both modes.

Show all four input types together for comparison.

## Lists

**Generic list item**: used for settings rows and order-history rows. Horizontal layout: optional leading icon, label (Body scale, 17px), optional trailing value/chevron. Divider between items using the locked divider tokens (`#008080` light / `#67B8B3` at 24% opacity dark). Show a stacked list of 3-4 items to demonstrate the divider rhythm, not a single isolated row.

**Chat message bubble**: sent (buyer or seller's own messages) vs. received (the other party). Sent bubble: accent-adjacent tone or primary-text-on-light-fill (avoid literal `#F47A32` fill with white text, since that fails contrast — use `#FFD0A6` fill with `#031F21` text instead, reusing the locked card-background token). Received bubble: neutral `#FFFFFF`/`#063F42` fill depending on mode. Timestamp: Caption 2 scale (11px), below or beside each bubble. Show a short exchange (2-3 bubbles alternating) in both light and dark mode.

## Feedback

**Empty state**: centered icon/illustration + short message (Body scale) + optional action button (reuse the Secondary button component). Needed for: empty feed, no search results, empty order history. Show one representative example, not all three separately — the pattern is the same, only copy changes.

**Loading skeleton**: pulsing/shimmering gray-teal blocks matching the shape of whatever's loading (e.g. product-card-shaped skeleton for the feed). Use a muted, desaturated version of the surface tone, not a generic gray unrelated to the palette.

**Toast/banner**: appears at top or bottom of screen, short message, auto-dismisses. Use semantic colors for context (success/error/info/warning) same as the status pill, but as a full-width banner rather than a small pill. Show one example per semantic type (4 total).

**Modal/dialog**: centered overlay, `radius-lg`, elevation treatment (stronger shadow than a resting card, per the "stronger for modals/floating elements" note already in the locked elevation spec). Show a generic confirmation-dialog example (title, body text, two buttons — Secondary "Cancel" + Primary "Confirm").

## Identity

**Avatar**: circular, with a fallback state (initials on a neutral-tinted background) for users with no profile photo. Show both photo and initials-fallback versions, one size only for now (a single standard size is enough at this stage).

**Seller info row**: avatar + seller name (Headline scale) + verification badge (reuse the verified/unverified badge components above) in one horizontal row. This is the component that will appear on Product Detail and Order screens wherever seller identity needs showing — build it as a composite that assembles the avatar + badge components already built, not from scratch.

## Misc

**Divider**: already effectively specified via the locked border tokens (`#008080` light / `#67B8B3` at 24% opacity dark) — this entry is just to confirm a standalone thin horizontal-rule component exists for use anywhere a divider is needed outside of lists/cards specifically.

**Filter chip**: used in Search & Filters. Pill shape (`radius-full`), two states — unselected (neutral border, secondary-text label) and selected (accent-adjacent fill, e.g. `#FFD0A6` background with `#031F21` label and a small checkmark, avoiding literal `#F47A32` fill with text on it for the same contrast reason as the chat bubble). Show both states, both modes.

**Countdown/timer display**: used for the 48hr auto-release window. Compact inline text (Footnote scale, e.g. "Auto-releases in 18h") for use inside the order/transaction card, PLUS a larger standalone version (Title 3 or Title 2 scale) for the dedicated Order Status screen where the countdown is the focal element. Show both sizes.

**PIN entry/reveal component**: unique to the core differentiator flow. Two distinct modes needed:

- **Buyer's PIN entry**: a set of individual digit boxes (4-6 digits, match whatever the actual PIN length ends up being), `radius-sm`, filled state shows the digit in Title 2 scale, empty state shows the box outline only.
- **Seller's PIN reveal**: a single button/control that's disabled/inactive-looking until the buyer signals "ready for pickup" (per the locked handoff workflow), then becomes active and tappable, revealing the PIN in large Title 1 scale text once tapped. Show all three states: inactive-waiting, active-tappable, revealed.

This is the most functionally important component in the whole set — it's the actual trust mechanism the whole product is built around — so give it its own full review pass rather than batching it in quickly with the others.
