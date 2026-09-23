---
name: soldbay-design-system
description: Linear Document - Design System Reference
---

# Design System Reference

**Status: mid-rebuild — core system now complete.** Per the adopted Ace design-principles doc, this system was redone from scratch to fit Ace's rules and the one-shared-iOS/Android decision. Color, Typography (typeface + full scale), Spacing, Corner Radius, and Elevation are all finalized and locked below. A full visual reference (colors, type scale, spacing, radius, elevation, components rendered together) lives as soldbay-design-system.html, dropped into the design folder for Agy to reference when building components in the .pen boards.

Full spec lives in `soldbay-design-system.md` (22 sections) — this doc is a summary/index, not a duplicate. Always check the actual markdown file as source of truth when building.

## Typography (LOCKED)

* **Fraunces** (serif, display headers only — Web + Admin dashboard, e.g. landing page and admin panel section titles — paired with Sora for body text there) + **Sora** (sans, used everywhere on mobile with zero Fraunces, and for all body text on Web/Admin) — re-evaluated against the Ace doc's "finding real references" process (considered switching Sora → Figtree, a documented pairing specifically with Fraunces) and confirmed: Sora stays, since it's independently validated in real font-pairing references ("Sora + Public Sans" — confident geometry, accessible standards) and has zero migration cost (already live on soldbay-web/landing page). **Mobile app uses Sora exclusively — no Fraunces anywhere in the mobile UI.**
* **Scale structure**: built on the Apple HIG type-scale hierarchy already pulled into the Ace doc — a *sizing/hierarchy system*, not a typeface (SF Pro itself isn't used, since it's not cross-platform); Sora is built into this same scale structure, applied identically on iOS and Android per the one-shared-system decision
* **Exact point sizes/weights for each scale step (LOCKED):**

  | Scale step | Size / weight | Used for |
  | -- | -- | -- |
  | rge Title | / Bold | served for rare full-bleed moments (e.g. onboarding), not regular screens |
  | tle 1 | / Bold | jor section headers (e.g. "Order confirmed") |
  | tle 2 | / Bold | rd/modal headers, product detail title |
  | tle 3 | / Semibold | e lightweight screen title ("Browse", "Search", etc.) locked in the wayfinding decision |
  | adline | / Semibold | st-item titles — product names in Feed/Search cards |
  | dy | / Regular | andard body text, descriptions |
  | llout | / Regular | condary descriptive text |
  | bheadline | / Regular | tadata — price, timestamps, pickup windows |
  | otnote | / Regular | sclaimers, helper text under inputs |
  | ption 1 | / Regular | dge text (verified, discount, status) |
  | ption 2 | / Semibold | allest labels — chat timestamps, fine print |

  **Cross-platform unit note:** 1pt (iOS) = 1sp (Android) — both scale with the user's system text-size setting, so this one scale applies unmodified on both platforms, no separate Android conversion table needed.

## Foundation (LOCKED)

* **Spacing**: 4px base scale — `4, 8, 12, 16, 24, 32, 48, 64`. Standard 4pt/4dp grid, chosen because it's what makes the one-shared-iOS/Android system actually work cleanly on both platforms, not a stylistic pick.
* **Corner radius**: `radius-sm` 8px (inputs, small buttons), `radius-md` 12px (badges, chips), `radius-lg` 16px (product cards, modals), `radius-full` 999px (pills, avatars)
* **Elevation**: approach kept from the old system (technically correct, not re-litigated), only the tint updated to the new palette:
  * Light mode: shadow tinted with `#031F21` at low opacity — e.g. `0 2px 8px rgba(3,31,33,0.08)` resting, stronger for modals/floating elements
  * Dark mode: no shadows (invisible on dark backgrounds) — background steps up one level (`#031F21` → `#063F42`) plus a hairline `#67B8B3` border at 24% opacity, reusing the already-locked dark-mode divider color

## Color (LOCKED)

Palette: **Orange & Teal**, chosen via the Ace doc's "finding real references" process (evaluated against Candy Pop and Pop Colors), then contrast-tested against a locked accessibility standard: any role carrying readable text targets **AAA** (7:1 normal / 4.5:1 large), not just AA. Accent/pop colors are permanently confined to buttons/badges/icons/large-bold-type only, accepted at whatever level they naturally clear (usually AA-large, \~3:1) — they are never pushed toward AAA, since doing so would require darkening them until they stop reading as vibrant accents.

**Roles:**

* **Primary text** (light-mode body/link text): `#031F21` — near-black teal, \~12.13:1 against `#FFD0A6`, \~15.76:1 against white/off-white
* **Secondary text** (light mode) / **background** (dark mode, dual role): `#063F42` (Shadow Teal) — 11.68:1 vs white as secondary text, 8.24–8.25:1 vs `#FFD0A6`
* **Background / cards** (light mode): `#FFD0A6` (Warm Highlight/Apricot), paired with white/off-white as the base surface
* **Accent** (buttons, badges, icons — never small text): `#F47A32` (Burnished Orange) — label color must be `#063F42` (dark teal), not white; orange only clears 3:1 against the dark teal, never against white
* **Borders/dividers/icons, light mode only**: `#008080` (CSS Teal) — 4.78:1 vs white (AA, not AAA); fails against `#FFD0A6` (too close in value) so never used on the card background
* **Secondary text/icons, dark mode only**: `#67B8B3` (Tide Tint) — 7.44:1 vs `#031F21`, 5.06:1 vs `#063F42` (AAA/strong-AA on dark surfaces); fails badly on any light surface, so this is a dark-mode-exclusive color, not a light/dark pair with `#008080`

**Semantic colors** (deliberately darker than typical bright status colors, so they clear AAA against both white and `#FFD0A6`, not just white — kept separate from the five brand-palette hues per Ace's semantic-naming rule, so no brand color double-duties as a status color):

* Success: `#14532D`
* Warning: `#6B4E00`
* Error: `#8B1A10`
* Info: `#0D3B7A`

**Semantic banner/tint rule (LOCKED, refined):** two distinct treatments for two distinct components, not one overloaded rule:

* **Toast/banner (ephemeral, top-of-screen notification):** full-strength semantic color fill + white text — white clears AAA against all four semantic colors (same contrast math as the color-vs-white values above, just inverted). Bold and attention-grabbing is correct here since a toast is meant to be noticed briefly, then dismissed.
* **Inline context box (persistent, embedded within a screen's content — e.g. the "Buyer is at Hall B" message inside the PIN reveal flow):** background = the semantic color at 12% opacity over the base surface (white light / `#031F21` dark); text = the full-strength semantic color. Softer treatment, since this sits on-screen throughout a task rather than appearing-and-dismissing, and shouldn't compete for attention the way a toast should.

**Superseded:** the old core palette (Background #F4F1E8, Primary/Text #2D3A1F, Accent #B8A678, Surface #E8E2D0, Border #D8D7CC + dark-mode set, Secondary #5C7048, old semantic set, Accent-400 #96824F for discounts) is fully replaced by the above.

**Discount/sale badges**: `#FFB980` fill (lighter tint of Burnished Orange) with a **1.5px stroke in** `#F47A32` (base accent) — the stroke was added after review: `#FFB980` alone was too close in value to the `#FFD0A6` card background to read at a glance, so the stroke gives it a defined edge without making the fill louder. Label `#031F21`.

**Borders/dividers, full coverage**: `#008080` on white/off-white (light mode). On the peach card background, `#008080` fails (too close in value) — use `#031F21` at 15% opacity instead. In dark mode, use `#67B8B3` at 24% opacity. This follows Apple's own separator convention (an existing label color at reduced opacity, not a dedicated new hue) rather than introducing untested standalone border colors — dividers are decorative/structural, not held to text-level contrast requirements.

**Wayfinding (revised):** the Feed/Browse header gets a lightweight screen-title text added — top-left, small, unobtrusive (just the tab name: "Browse"), sitting above/beside the search bar, with the bell on the right. Reversal of an earlier call: relying on the highlighted active tab label alone was rejected — forcing a glance down to the bottom nav to confirm the current screen violates Ace's "first glance, no scrolling" rule, since the tab bar isn't the first thing the eye lands on. Every other tab (Search, Orders, Profile) gets the same lightweight title treatment for consistency.

## Product Card States (built)

* Default, Sold (overlay stamp + whole-card desaturation, price stays visible, neutral Border-family color — not Error), no-photo placeholder
* Still needed: Unverified-seller state (separate axis from Sold — a listing can be both available AND unverified)

## Icons

Phosphor (not Feather, which was the kit's original default) — Regular/Light for inactive, Bold/Fill for active states. Custom icons reserved for Soldbay-specific concepts (verified seller, sold stamp, campus pickup, category icons).

## Also specified

Component states (buttons/inputs), product photography rules, grid/breakpoints, empty states, trust & verification visual language, price/currency formatting, notification/badge system, motion principles, tone of voice (English-only v1, Pidgin optional in v2+), app icon/splash guidance.

## Logo (locked)

Wordmark-led direction: "Soldbay" set in Fraunces with a single geometric dot accent — not the handoff-overlap or campus-pin alternates that were also explored. Full system includes: primary lockup (dot accent, Primary color on Background), inverted version for dark surfaces, wordmark-only (no accent, for tight contexts), and a 40×40px "S" monogram app icon (iOS pre-masked to their rounded-square mask, Android built as separate foreground/background layers for the adaptive icon format).

## Reusable component build (in progress)

Full inventory and build order tracked in the "Component Inventory & Build Order" doc. Components are delivered as written design PROMPTS for Agy (the Antigravity agent) to render in the .pen design boards, referencing soldbay-design-system.html for all tokens — not as code. Build order: Navigation/Structure first, then Cards/Buttons, then the rest.

* Tab bar (4 items: Browse/Search/Orders/Profile) — **built and locked**. Agy's first pass matched spec closely (Phosphor-style icons, outline/inactive vs. fill/active, weight+dot for active state instead of colored text, correct dark-mode treatment with hairline border instead of shadow). One open item resolved: the unread-count badge dot (added by Agy, a reasonable extension of the original prompt) uses `#FFB980` (discount-tint), not Error red or the active-indicator orange — avoids colliding with either the "error" semantic meaning or the active-state indicator when both dots appear together on the same tab.
* Screen header (title + bell — the wayfinding pattern) — next up

## Known open items

* Culture/psychology check with real students
* Real-device + color-blindness testing
* Background→Surface contrast may need widening for dense feeds
* Exact Sold-stamp copy/icon
* Tab mount/offload behavior (which tabs stay mounted vs. get offloaded when inactive) — not yet decided, navigator-config item not a visual-design item
