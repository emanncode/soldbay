---
name: soldbay-design-system
description: Information about Design System Reference for Soldbay
---

# Design System Reference

**Status: LOCKED — Color, Typography (typeface + full scale), Spacing, Corner Radius, and Elevation are all final.** Redone from scratch per the adopted Ace design-principles doc and the one-shared-iOS/Android decision. A full visual reference lives in `soldbay-design-system.html` (design folder). This doc is the written source of truth; if any other file disagrees with it, this doc wins.

## READ THIS FIRST — before writing any code

**The only valid system is Orange & Teal + Sora.** The earlier olive/tan/cream system is SUPERSEDED and must not appear in any new code or design. Superseded values (never use): backgrounds/surfaces `#F4F1E8` `#E8E2D0` `#FAF8F2`, olive `#5A743E` `#2C381E` `#5C7048` `#8BA670` `#2D3A1F`, tan `#B8A678` `#96824F` `#C7B58A`, border `#D8D7CC` `#3F4635`, dark bg `#1A1F14` `#242A1D`, old semantics `#2E7A6E` `#4D6F89` `#875931` `#9C453A`, the Manrope typeface, radii 6/10/24, and the type names Display/H1/H2/Small.

**Source priority when files disagree:** (1) this doc → (2) `soldbay-design-system.html` → (3) anything inside the repos. The repo copies were generated from the OLD olive system (see Daily Log, 12-09-26): `docs/soldbay-design-system.md`, `soldbay-app/tailwind.config.js` (replaced 28-09-26), `soldbay-app/src/theme/colors.ts`, `soldbay-web/src/app/globals.css`, and the shipped logo/icon assets. Never trust a repo file because it says it holds the design tokens — diff it against the map below.

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
| Border/icon, light only | `#008080` | `border-borderLight` | dividers/icons on white; NOT on peach (use `#031F21` at 15%) |
| Border/text/icon, dark only | `#67B8B3` | `text-borderDark` | dark-mode secondary text/icons; hairlines at 24% (`border-borderDark/24`) |
| Dark base | `#031F21` | `bg-darkBg` | dark screens |
| Dark text | `#FFD0A6` | `text-darkText` | dark-mode text — taken from the elevation-dark sample in the HTML reference; confirm against the full spec if in doubt |
| Discount fill / unread dot | `#FFB980` | `bg-discountFill` | discount badge (+1.5px `#F47A32` stroke), unread dots |
| Success / Warning / Error / Info | `#14532D` `#6B4E00` `#8B1A10` `#0D3B7A` | `bg-success` etc. | flat, identical in light and dark. Toast = solid fill + white text; inline box = 12% tint (`bg-success/12`) + full-strength text |

Radius: `rounded-sm` 8 · `rounded-md` 12 · `rounded-lg` 16 · `rounded-full` 999. Spacing: Tailwind's default scale already contains the locked 4px steps (`1`=4, `2`=8, `3`=12, `4`=16, `6`=24, `8`=32, `12`=48, `16`=64) — do NOT remap numeric keys (an earlier config did, which made `w-2` render 16px). Elevation: `shadow-elevation-1` light only; dark = no shadow, step up one level + `border-borderDark/24`. Fonts (weight is carried by the family name; never combine with `font-bold`): `Sora_400Regular`, `Sora_600SemiBold`, `Sora_700Bold` — these names must match what `useFonts()` registers in `_layout.tsx`.

## Typography (LOCKED)

* **Sora** everywhere on mobile — zero Fraunces in the mobile UI. **Fraunces** is display-only on Web + Admin (landing page, admin section titles), paired with Sora for body there. Sora was re-evaluated against Figtree via the Ace "finding real references" process and confirmed.
* Scale structure follows the Apple HIG hierarchy (sizing system, not a typeface). 1pt (iOS) = 1sp (Android): one scale, applied identically on both platforms.

| Scale step | Size / weight | Code utility | Used for |
| -- | -- | -- | -- |
| Large Title | 34 / Bold | `text-large-title` | rare full-bleed moments (e.g. onboarding) |
| Title 1 | 28 / Bold | `text-title-1` | major section headers ("Order confirmed") |
| Title 2 | 22 / Bold | `text-title-2` | card/modal headers, product detail title |
| Title 3 | 20 / Semibold | `text-title-3` | lightweight screen title ("Browse", "Search") |
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

Palette: **Orange & Teal**, chosen via the Ace "finding real references" process (evaluated against Candy Pop and Pop Colors), contrast-tested against a locked accessibility standard: any role carrying readable text targets **AAA** (7:1 normal / 4.5:1 large). Accent/pop colors are permanently confined to buttons/badges/icons/large-bold-type only, accepted at whatever level they naturally clear (\~3:1) — never pushed toward AAA.

**Roles:**

* **Primary text** (light): `#031F21` — \~12.13:1 against `#FFD0A6`, \~15.76:1 against white
* **Secondary text** (light) / **background** (dark, dual role): `#063F42` — 11.68:1 vs white, 8.24–8.25:1 vs `#FFD0A6`
* **Background / cards** (light): `#FFD0A6`, paired with white/off-white as the base surface
* **Accent** (buttons, badges, icons — never small text): `#F47A32` — label color must be dark teal, not white; orange only clears 3:1 against dark teal, never against white
* **Borders/dividers/icons, light mode only**: `#008080` — 4.78:1 vs white; fails against `#FFD0A6`, so never used on the card background
* **Secondary text/icons, dark mode only**: `#67B8B3` — 7.44:1 vs `#031F21`, 5.06:1 vs `#063F42`; fails on any light surface, so dark-mode-exclusive

**Semantic colors** (deliberately darker than typical status colors so they clear AAA against both white and `#FFD0A6`; kept separate from the brand hues so no brand color double-duties as a status color): Success `#14532D` · Warning `#6B4E00` · Error `#8B1A10` · Info `#0D3B7A`.

**Semantic banner/tint rule (LOCKED):**

* **Toast/banner (ephemeral):** full-strength semantic fill + white text.
* **Inline context box (persistent, embedded in a screen — e.g. "Buyer is at Hall B" in the PIN flow):** background = the semantic color at 12% opacity over the base surface; text = the full-strength semantic color.

**Discount/sale badges**: `#FFB980` fill with a **1.5px stroke** in `#F47A32` (the stroke was added because `#FFB980` alone was too close to the `#FFD0A6` card background). Label `#031F21`.

**Borders/dividers, full coverage**: `#008080` on white (light). On the peach card background use `#031F21` at 15% opacity. In dark mode, `#67B8B3` at 24%. Follows Apple's separator convention (an existing label color at reduced opacity).

**Wayfinding (LOCKED):** every main tab (Browse, Search, Orders, Profile) gets a lightweight screen-title text, top-left, with the bell on the right — relying on the highlighted tab label alone was rejected (Ace's "first glance, no scrolling" rule).

## Icons

Phosphor — Regular/Light for inactive, Bold/Fill for active. Tab bar active state = fill weight + dot indicator (not a colored label). Custom icons reserved for Soldbay-specific concepts (verified seller, sold stamp, campus pickup, category icons).

## Logo (locked concept)

Wordmark-led: "Soldbay" set in Fraunces with a single geometric dot accent; primary lockup, inverted version, wordmark-only, and a 40×40 "S" monogram app icon. **Open question — see below:** the exported logo/icon assets were produced in the old olive/cream palette.

## Component status

All design-phase components are built and locked — full list and build order in "Component Inventory & Build Order". Real-code (React Native) build status is tracked in that same doc, separately from design lock.

## Known open items

* **Palette of web landing + logo assets:** `soldbay-web` (landing page, theme) and the exported logo/icon SVG/PNGs were built in the olive/cream palette (Daily Log). Decision needed: re-theme them to Orange & Teal, or keep olive/cream as a separate marketing look. Not decided — do not assume either way.
* Culture/psychology check with real students
* Real-device + color-blindness testing
* Background→Surface contrast may need widening for dense feeds
* Exact Sold-stamp copy/icon
* Tab mount/offload behavior (navigator-config item, not visual design)