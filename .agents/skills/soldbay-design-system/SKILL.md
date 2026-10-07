---
name: soldbay-design-system
description: Information about Design System Reference for Soldbay
---
**Status: LOCKED — Color, Typography (typeface + full scale), Spacing, Corner Radius, and Elevation are all final.** Redone from scratch per the adopted Ace design-principles doc and the one-shared-iOS/Android decision. A full visual reference lives in `soldbay-design-system.html` (design folder) AND the three real prototype files `all-screens.html`, `all-screens-dark.html`, `component-library.html` — those three are the actual assembled source of truth for finished screen/component markup and CSS; this doc is the written explanation of the rules behind them. **Verified 28-09-26 directly against the three prototype files**, including a full header-by-header audit of all 22 screens in `all-screens.html` (see Screen headers section). **Semantic/status colors re-verified and re-locked 30-09-26 via a WCAG/APCA/CIEDE2000 accessibility audit script** (see Accessibility Audit section) — the values below supersede the ones from 28-09-26. If any other file disagrees with this doc, re-verify against the actual prototype HTML/script before trusting either.

## READ THIS FIRST — before writing any code

**The only valid system is Orange & Teal + Sora.** The earlier olive/tan/cream system is SUPERSEDED and must not appear in any new code or design. Superseded values (never use): backgrounds/surfaces `#F4F1E8` `#E8E2D0` `#FAF8F2`, olive `#5A743E` `#2C381E` `#5C7048` `#8BA670` `#2D3A1F`, tan `#B8A678` `#96824F` `#C7B58A`, border `#D8D7CC` `#3F4635`, dark bg `#1A1F14` `#242A1D`, old semantics `#2E7A6E` `#4D6F89` `#875931` `#9C453A`, the Manrope typeface, radii 6/10/24, and the type names Display/H1/H2/Small. **Also superseded as of 30-09-26**: the semantic colors listed in any doc/code dated before that day — see the updated hex values below.

**Source priority when files disagree:** (1) the three prototype HTML files (`all-screens.html`, `all-screens-dark.html`, `component-library.html`) → (2) this doc → (3) anything inside the repos. The repo copies were generated from the OLD olive system (see Daily Log, 12-09-26): `docs/soldbay-design-system.md`, `soldbay-app/tailwind.config.js` (replaced 28-09-26), `soldbay-app/src/theme/colors.ts`, `soldbay-web/src/app/globals.css`, and the shipped logo/icon assets. Never trust a repo file because it says it holds the design tokens, and never trust a written doc's paraphrase of a CSS rule either — diff the actual file when in doubt.

**Editing the three prototype HTML files:** they are locked design artifacts, not scratch files. A change to them (new markup, a CSS rule edit, a design decision like an icon swap) must be recorded here or in the relevant IA doc in the same session it happens — an agent running `sed`/scripted edits directly against these files with no corresponding Linear update is exactly the drift this doc exists to prevent. **The semantic-color change below (30-09-26) has NOT yet been applied to the three HTML files or to** `tokens.js` **in the repo — that application is an open action item, not done just because it's decided here.**

**Dark mode: system-default only, no manual toggle** (locked in Feature/Workflow Inventory). Every component ships light + dark from the first commit (`dark:` variants); retrofitting is not acceptable.

### Token → code map (React Native / NativeWind — `soldbay-app`)

Names match the Admin/Ops prototype Tailwind configs, so class strings port straight from the prototypes. Hex values live in one file, `src/theme/tokens.js`, which `tailwind.config.js` requires; components import the same object for anything that can't be a class (e.g. Phosphor icon `color`). No hex literals in components.

| Token | Hex | Class name | Use |
| -- | -- | -- | -- |
| Primary text (light) | `#031F21` | `text-primaryText` | body/link text, light |
| Secondary text (light) / dark step | `#063F42` | `text-secondaryText` / `bg-darkBgStep` | secondary text; dark elevated surface |
| Base surface (light) | `#FFFFFF` | `bg-bgBase` | screens |
| Card / selected fill | `#FFD0A6` | `bg-bgCard` | cards, filter-chip selected, active nav tint |
| Accent | `#F47A32` | `bg-accent` | buttons/badges/icons/large bold type only — never small text |
| Accent icon, light mode ONLY | `#BE5F27` | `accentIcon` in `tokens.js` | **NEW 30-09-26**: `#F47A32` itself fails 3:1 as an icon color on both `bgBase` (2.74:1) and `bgCard` (1.93:1). Use this darker variant for any icon rendered in accent color on a light surface (icon color prop only — never a Tailwind class, since it's not used for fills/buttons). On dark surfaces the plain `accent` (`#F47A32`) icon color is fine as-is (6.28:1 on `darkBg`, 4.27:1 on `darkBgStep`) — do not use `accentIcon` in dark mode. |
| Border, light only | `#008080` | `border-borderLight` | dividers/borders on white ONLY, at reduced opacity (10-20%) as a subtle divider; NOT on peach (use `#031F21` at 15%), and NOT a muted-icon/muted-text color |
| Solid border, light mode | `#008080` | `borderLightSolid` in `tokens.js` (same hex as `borderLight`) | **NEW 30-09-26**: for inputs/controls/anything needing an actually visible boundary (not a subtle divider) — the low-opacity `borderLight` divider treatment fails 3:1 as a real UI border. Use `borderLight` at full 100% opacity, no separate hex needed. Passes on `bgBase` (4.77:1) and `bgCard` (3.37:1). |
| Border/text/icon, dark only | `#67B8B3` | `text-borderDark` | dark-mode secondary text/icons; hairlines at 24% (`border-borderDark/24`) as a subtle divider only |
| Solid border, dark mode | `#5C8A8A` | `borderDarkSolid` in `tokens.js` | **NEW 30-09-26**: dark-mode equivalent of the above — `borderDark` at 24% fails 3:1 as a real UI border, and this is a genuinely different hex from `borderDark`, not just a full-opacity version of it. Passes on `darkBg` (4.47:1) and `darkBgStep` (3.04:1). |
| Dark base | `#031F21` | `bg-darkBg` | dark screens |
| Dark text | `#FFFFFF` | `text-darkText` | confirmed against `all-screens-dark.html`'s `:root { --primary-text: #ffffff }` |
| Muted/inactive icon or text, light mode | `#063F42` | `text-secondaryText` | inactive tab bar items, inactive search-bar icon, and any other "muted, not a border" light-mode element — confirmed from `.nav-item { color: var(--secondary-text) }` and `.search-bar i { color: var(--secondary-text) }`. `borderLight` is a border color, never a muted-content color. |
| Discount fill / unread dot | `#FFB980` | `bg-discountFill` | discount badge (+1.5px `#F47A32` stroke), unread dots |
| Success / Warning / Error / Info — LIGHT | `#1A6B3A` `#976F00` `#8B1A10` `#092853` | `success`/`warning`/`error`/`info` in `tokens.js` | **UPDATED 30-09-26** (was `#14532D` `#6B4E00` `#8B1A10` `#0D3B7A` — error unchanged, the other three shifted for color-vision-deficiency separation, see Accessibility Audit). Toast = solid fill + white text (all four still pass 4.5:1 with white). Inline box = 12% tint + full-strength text. |
| Success / Warning / Error / Info — DARK | `#A9EFC2` `#E6B905` `#F53D3D` `#57A0FA` | `darkSuccess`/`darkWarning`/`darkError`/`darkInfo` in `tokens.js` | **UPDATED 30-09-26** (was `#4ADE80` `#FACC15` `#F87171` `#60A5FA`). **Correction 03-10-26: the toast claim below is wrong for dark mode** — white text on these fails badly (computed \~1.3:1 against `darkSuccess`, nowhere near 4.5:1). Dark-mode status pills/toasts must use `darkBg` (`#031F21`) text, not white — confirmed already correct in `all-screens-dark.html`'s actual `.status-pill` rule (via an `!important` override) and in `OrderCard.tsx`. Light mode toast/white-text claim is unaffected (light semantic colors are dark enough for white text to pass). |

**Status pills MUST always pair the semantic color with an icon (check/clock/alert/info) and a text label — never color alone.** This is a hard accessibility requirement, not a style preference: even with the 30-09-26 color updates, grayscale/deuteranopia gaps between two status colors can fall as low as \~8 in CIEDE2000 (below the \~10 comfort threshold) in a couple of pairings. Icon + label is what actually makes every status distinguishable regardless of color vision.

Radius: `rounded-sm` 8 · `rounded-md` 12 · `rounded-lg` 16 · `rounded-full` 999. Spacing: Tailwind's default scale already contains the locked 4px steps (`1`=4, `2`=8, `3`=12, `4`=16, `6`=24, `8`=32, `12`=48, `16`=64) — do NOT remap numeric keys (an earlier config did, which made `w-2` render 16px). Elevation: `shadow-elevation-1` light only; dark = no shadow, step up one level + `border-borderDark/24` (product cards specifically: `.product-card`'s border resolves to `border-subtle` which in dark mode = `border-light` = `rgba(103,184,179,0.24)` — i.e. `borderDark/24`, not `/10`). Fonts (weight is carried by the family name; never combine with `font-bold`): `Sora_400Regular`, `Sora_600SemiBold`, `Sora_700Bold` — these names must match what `useFonts()` registers in `_layout.tsx`.

## Typography (LOCKED)

* **Sora** everywhere on mobile — zero Fraunces in the mobile UI. **Fraunces** is display-only on Web + Admin (landing page, admin section titles), paired with Sora for body there. Sora was re-evaluated against Figtree via the Ace "finding real references" process and confirmed.
* Scale structure follows the Apple HIG hierarchy (sizing system, not a typeface). 1pt (iOS) = 1sp (Android): one scale, applied identically on both platforms.

| Scale step | Size / weight | Code utility | Used for |
| -- | -- | -- | -- |
| Large Title | 34 / Bold | `text-large-title` | rare full-bleed moments (e.g. onboarding) |
| Title 1 | 28 / Bold | `text-title-1` | major section headers ("Order confirmed") |
| Title 2 | 22 / Bold | `text-title-2` | ALL screen headers with a visible text title — both back-navigation sub-screens (Checkout, Order Status, etc.) AND main-tab roots (Browse, Seller Hub) use `h1.title-2`, confirmed across all 22 screens. There is no screen using Title 3 for its header. |
| Title 3 | 20 / Semibold | `text-title-3` | NOT used for any screen header in the current 22-screen set — reserved for a lighter-weight secondary heading if one comes up, not the header pattern |
| Headline | 17 / Semibold | `text-headline` | list-item titles — product names in Feed/Search cards |
| Body | 17 / Regular | `text-body` | standard body text, descriptions |
| Callout | 16 / Regular | `text-callout` | secondary descriptive text |
| Subheadline | 15 / Regular | `text-subheadline` | metadata — price, timestamps, pickup windows |
| Footnote | 13 / Regular | `text-footnote` | disclaimers, helper text under inputs |
| Caption 1 | 12 / Regular | `text-caption-1` | badge text (verified, discount, status) |
| Caption 2 | 11 / Semibold | `text-caption-2` | smallest labels — chat timestamps, fine print |

Line heights are not part of the lock; code uses the Apple HIG values.

## Foundation (LOCKED)

* **Spacing**: 4px base scale — `4, 8, 12, 16, 24, 32, 48, 64`.
* **Corner radius**: `radius-sm` 8px (inputs, small buttons), `radius-md` 12px (badges, chips), `radius-lg` 16px (product cards, modals), `radius-full` 999px (pills, avatars).
* **Elevation**: Light mode: shadow tinted `#031F21` at low opacity — `0 2px 8px rgba(3,31,33,0.08)` resting, stronger for modals/floating elements. Dark mode: no shadows — background steps up one level (`#031F21` → `#063F42`) plus a hairline `#67B8B3` border at 24% opacity.

## Color (LOCKED)

Palette: **Orange & Teal**, chosen via the Ace "finding real references" process (evaluated against Candy Pop and Pop Colors). Accessibility standard, re-confirmed 30-09-26 via script (see Accessibility Audit): text roles target AAA (7:1 normal / 4.5:1 large) where feasible, status pills target AA (4.5:1) with white/darkBg text, and any non-text UI element (icons, borders) targets 3:1. Accent/pop colors stay confined to buttons/badges/icons/large-bold-type only.

**Roles:**

* **Primary text** (light): `#031F21` — \~12.13:1 against `#FFD0A6`, \~15.76:1 against white. **Dark**: `#FFFFFF`.
* **Secondary text** (light) / **background** (dark, dual role): `#063F42` — 11.68:1 vs white, 8.25:1 vs `#FFD0A6`. Also the correct color for any muted/inactive icon or label in light mode — not `borderLight`.
* **Background / cards** (light): `#FFD0A6`, paired with white/off-white as the base surface
* **Accent** (buttons, badges, large bold type): `#F47A32` — button label is `darkBg` text ONLY (LOCKED 30-09-26 — white-on-accent was 2.74:1, a real fail; `darkBg` text passes at 6.28:1). **For icons specifically**, use `accentIcon` (`#BE5F27`) on light surfaces — plain accent fails 3:1 as an icon color on both `bgBase` and `bgCard`; on dark surfaces plain `accent` is fine.
* **Borders/dividers, light mode**: `#008080` at reduced opacity (10-20%) for subtle dividers; at full 100% opacity as `borderLightSolid` for anything needing a real visible boundary (inputs, controls) — the low-opacity version fails 3:1 as an actual UI border.
* **Secondary text/icons, dark mode only**: `#67B8B3` — 7.43:1 vs `#031F21`, 5.05:1 vs `#063F42`; at 24% opacity for subtle dividers; a separate hex, `#5C8A8A` (`borderDarkSolid`), for full-strength UI borders needing 3:1.

**Semantic colors — UPDATED 30-09-26** (see Accessibility Audit for the full methodology and results): **light**: Success `#1A6B3A` · Warning `#976F00` · Error `#8B1A10` (unchanged) · Info `#092853`. **Dark**: Success `#A9EFC2` · Warning `#E6B905` · Error `#F53D3D` · Info `#57A0FA`. These moved from the 28-09-26 values specifically to spread lightness further apart for color-vision-deficiency and grayscale legibility — same hues, different lightness steps. **Status pills must always carry an icon + label, not color alone** (see token table above).

**Semantic banner/tint rule (LOCKED):**

* **Toast/banner (ephemeral):** full-strength semantic fill (mode-appropriate value) + white text.
* **Inline context box (persistent, embedded in a screen — e.g. "Buyer is at Hall B" in the PIN flow):** background = the semantic color (mode-appropriate value) at 12% opacity over the base surface; text = the full-strength semantic color.

**Discount/sale badges**: `#FFB980` fill with a **1.5px stroke** in `#F47A32`. **Accepted as-is 30-09-26**: the stroke-on-fill contrast (1.63:1) and the badge shape against white (1.68:1) both fail the 3:1 non-text-UI threshold — deliberately left unfixed since the badge is decorative and the percentage text inside it (which passes at 10.23:1) carries all the actual meaning. Label `#031F21`.

**Borders/dividers, full coverage**: `#008080` on white (light, low opacity) / `#031F21` at 15% on the peach card background / `#67B8B3` at 24% in dark mode, for subtle dividers. For anything needing a real visible boundary at 3:1, use the solid variants (`borderLightSolid` `#008080` full-opacity light, `borderDarkSolid` `#5C8A8A` dark) — see token table.

## Accessibility Audit (locked 30-09-26)

A Python script (`soldbay_color_audit.py`, then a revised `soldbay_color_audit_v2.py` after the decisions below) checked every token pairing in the palette: WCAG 2 contrast ratios (with APCA `Lc` as a secondary reference), plus CIEDE2000 color-distance under simulated protanopia/deuteranopia/tritanopia/grayscale for the four status colors. **v2 result: 28 of 30 checks pass** (the 2 fails are the discount badge, accepted as-is above). Both scripts are stored as project files for re-running if any token changes again.

**Decisions made from the v1 audit:**

1. Accent button text: `darkBg` only, never white.
2. Discount badge stroke/shape contrast: left as-is (decorative, text carries meaning).
3. New solid-border tokens for real UI borders (see above) — the original low-opacity divider tokens were never meant to double as input/control borders, and don't pass 3:1 when misused that way.
4. New `accentIcon` token for light-mode icon usage of the accent color.
5. Status colors re-tuned for color-vision-deficiency separation (v2 run), spreading lightness apart within each hue rather than changing hue — see updated hex values above.

**Color-vision-deficiency result (v2, CIEDE2000 minimum gap across the 4 status colors, higher = more distinguishable, \~10 is the comfort threshold):**

| Mode | Protanopia | Deuteranopia | Tritanopia | Grayscale |
| -- | -- | -- | -- | -- |
| Light | 11.2 | 10.1 | 19.1 | 7.9 |
| Dark | 21.2 | 15.7 | 17.9 | 8.0 |

Grayscale stays just under the 10 threshold in both modes (lightness is already near its practical limit for four AA-passing colors) — this is exactly why the icon+label rule above is mandatory, not optional polish.

## Screen headers — full audit (28-09-26)

There are **five distinct header patterns**, all built from the same `.icon-btn` and `h1.title-2` primitives, that a screen picks from depending on what it needs:

1. **Back-arrow + Title 2** — the default for any screen reached by navigating forward (not a tab root): Campus Picker (all 3 states), Switch to Seller (all 5 states), Checkout, Pickup-Window Selection, Order Status (all 5 states), Rate & Review, Wallet, Dispute Flow.
2. **Title 2 + bell, no back-arrow** — main-tab roots with their own notification entry point: **Browse and Seller Hub** (Seller Dashboard) both use this.
3. **X-close + Title 2** — for a screen that dismisses a modal-like flow rather than navigating back in a stack: **Create Listing** uses `ph-x` instead of `ph-arrow-left`.
4. **Trailing single icon-button, no title, right-aligned**: **Profile (Buyer) and Profile (Seller)** — settings gear only, no title text at all.
5. **No** `.header` **at all, or a fully custom one**: **Search & Filters** replaces the entire header with an inline search bar. **Messaging** replaces it with back-arrow + avatar + seller name. **Notifications** is title-only with no icon-button on either side.

None of the 14 back-navigation screens in pattern 1 have a second action button on the right — checked directly. If a future screen needs a right-side header action beyond the tab-root bell, that's a new, sixth pattern to record here.

## Icons

Phosphor — Regular/Light for inactive, Bold/Fill for active. Custom icons reserved for Soldbay-specific concepts (verified seller, sold stamp, campus pickup, category icons). **Verified badge**: plain `ph-seal-check` (Phosphor Fill), color `accent` in dark mode / `accentIcon` in light mode (see 30-09-26 accent-icon note above), no circular background.

## Logo (locked concept)

Wordmark-led: "Soldbay" set in Fraunces with a single geometric dot accent; primary lockup, inverted version, wordmark-only, and a 40×40 "S" monogram app icon. **Open question — see below:** the exported logo/icon assets were produced in the old olive/cream palette.

## Component status

All design-phase components are built and locked — full list and build order in "Component Inventory & Build Order". Real-code (React Native) build status is tracked in that same doc, separately from design lock.

## Known open items

* **Apply the 30-09-26 semantic-color update to the actual files** — PARTIALLY DONE, verified 03-10-26: `tokens.js` is fully correct (both new tokens included). The three HTML files' `:root` variables are also correctly updated. **Still broken: 7 leftover hardcoded** `rgba()` **inline tints across all three files still reference the OLD pre-30-09-26 hex values** (e.g. `all-screens.html` lines 380 and 2442; `all-screens-dark.html` lines 1649 and 2483; `component-library.html` lines 392, 1384, 2133) — these render actual inline warning/success/error context boxes and are now inconsistent with their own `:root` vars. Needs a targeted find-and-replace per file.
* `all-screens-dark.html`**'s** `.product-card` **border is stale** — still hardcodes `rgba(103,184,179,0.1)` (`/10`); should be `/24` to match both this doc's locked value and the already-correct `ProductCard.tsx` code. Fix the HTML, not the code.
* `component-library.html`**'s Order/Transaction Card reference has two bugs**, found 03-10-26: "Pending pickup" uses `.status-warning` instead of `.status-info` (an unused, correctly-defined `.status-info` class exists right there), and "Awaiting handoff" uses a hardcoded off-palette `#d97706` instead of any locked token. `OrderCard.tsx` in code already has the correct mapping (pending_pickup→info, awaiting_handoff→warning) — fix the HTML to match the code.
* Minor hygiene: `all-screens-dark.html`'s `.status-pill` CSS rule has a dead, redundant `color: white` line after the `color: #031f21 !important` line that actually wins — harmless (renders correctly) but should be deleted for clarity.
* Every status pill needs an icon added if it doesn't have one already — the color-vision mitigation depends on this, see Accessibility Audit.
* Palette of web landing + logo assets: `soldbay-web` (landing page, theme) and the exported logo/icon SVG/PNGs were built in the olive/cream palette (Daily Log). Decision needed: re-theme them to Orange & Teal, or keep olive/cream as a separate marketing look. Not decided.
* Culture/psychology check with real students
* Real-device + color-blindness testing (the script is a simulation model, not a clinical test — verify by eye too, especially the dark-mode status colors, which moved the most: error is now a stronger red, success a pale mint, info deeper navy)
* Background→Surface contrast may need widening for dense feeds
* Exact Sold-stamp copy/icon
* Tab mount/offload behavior (navigator-config item, not visual design)
* **Security note (28-09-26):** a plaintext Linear API key was found and used from `~/fetch_linear.js` on the local machine during a code-review session. It must be rotated in Linear's API settings, and any of `fetch_linear.js`/`linear_project.json`/`linear_docs.md`/`linear_recent.json` that ended up committed to git need to be removed from the repo history, not just deleted from the working tree.
