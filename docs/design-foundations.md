# Soldbay Design Foundations — Stage 04, Step 04

**Status:** Historical record only. The former foundation values were withdrawn on 2026-11-08, and the three exploratory replacement options and synthetic buyer-feed studies were later cleared from the active Pencil canvas. None is a current candidate or approved styling. The owner approved only the high-level MVP direction on 2026-11-09; see [`visual-principles.md`](visual-principles.md) for the current candidate principles that must be reviewed before a new foundation is derived.
**Prepared:** 2026-11-06; candidate options added 2026-11-09.
**Former direction:** A — Grounded Market, selected on 2026-11-06 and withdrawn on 2026-11-08.
**Canvas:** The active Pencil canvas currently contains the real-screen reference-studies section. No foundation options or synthetic Soldbay screens are active there. The values below are preserved as historical notes only.
**Product authority:** [`docs/architecture.md`](architecture.md). Product behavior and roles are unchanged.

## Purpose and evidence boundary

This section records the former attempt to define color, type, spacing, layout, shape, and motion foundations after selecting A — Grounded Market. Those values were approved at the time and withdrawn on 2026-11-08. They are historical, not current tokens or design constraints. No design preference or accessibility result is presented as user research.

The app follows the device appearance setting and has no in-app theme toggle. That product requirement remains active; the previous light/dark foundation values were withdrawn with the former direction. The archived candidates below had provisional light and dark mappings, but no current palette exists. Platform behavior and system chrome are specified in Step 05.

## Withdrawn exploratory foundation values — historical only

**Current process update (2026-11-11):** These options and the comparative buyer-feed screens were cleared from the active Pencil canvas and are no longer active explorations. Preserve the notes only to show what was withdrawn; do not reuse or compare the values as current proposals. The current work is candidate visual principles in [`visual-principles.md`](visual-principles.md), followed by a fresh foundation process after owner review.

**Decision state:** Withdrawn. Do not treat these archived options as available choices, approved preferences, or current design hypotheses.

**Archived comparison specimen:** The deleted Pencil board used the same photo crop and sample content in all three options: campus `AAUA · Akungba-Akoko`, item `Graphing calculator`, price `₦18,500`, condition `Very good`, listing label `Negotiable`, and order label `In progress`. It showed palette, type hierarchy, spacing/shape, image treatment, and an icon sample; it was not a product screen or component set. The photo crop came from the Pinterest source capture and did not imply a Soldbay workflow or content model.

All options retain the approved device-appearance behavior: provide light and dark semantic mappings and follow the operating-system appearance setting. Status meaning must use visible text and may use a distinct icon; color alone is insufficient. Exact status palettes, production token names, and component styling remain open until an option is selected and reviewed against the actual screen specifications.

### Option A — Field Catalog

**Character:** Grounded, open, and practical; a warm paper base with a restrained deep-green action color. Pair an editorial serif only on selected headings with a highly readable sans-serif for marketplace information.

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | `#F7F4EB` | `#151D19` |
| Surface | `#FFFDF8` | `#202B25` |
| Raised surface | `#F0EEE4` | `#2A3830` |
| Primary text | `#232B27` | `#F2F4ED` |
| Secondary text | `#526057` | `#C1CCC4` |
| Border | `#D7DDD4` | `#526259` |
| Action | `#315F4B` | `#9BD0AE` |
| Text on action | `#FFFFFF` | `#13251A` |
| Accent surface | `#E7EFE8` | `#26392F` |

- **Type:** Lora 24/30 for occasional editorial emphasis; Manrope 20/26 section heading, 16/22 listing title, 15/22 body, 13/18 secondary, 12/16 label. Body and prices use Manrope; sentence case.
- **Spacing and shape:** 4, 8, 12, 16, 24, 32 px; 8 px standard corner, 12 px larger image/surface corner. Use dividers and whitespace for grouping.
- **Image treatment:** Same 4:3 sample crop; natural color, no tint, 12 px image corner, quiet surrounding surface.
- **Icon approach:** Lucide outline, 1.75 px visual stroke; reserve icons for actions or state cues and keep labels visible where meaning matters.

### Option B — Clear Signal

**Character:** Crisp, direct, and more energetic; cool near-white surfaces and cobalt action color. A sans-only hierarchy emphasizes fast scanning and precise price comparison.

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | `#F4F7FA` | `#101925` |
| Surface | `#FFFFFF` | `#182638` |
| Raised surface | `#EAF0F6` | `#23354A` |
| Primary text | `#172A3B` | `#F2F5F9` |
| Secondary text | `#4B6173` | `#BAC7D5` |
| Border | `#D7E1EB` | `#41556B` |
| Action | `#235DD1` | `#91B7FF` |
| Text on action | `#FFFFFF` | `#122443` |
| Accent surface | `#E6EEFB` | `#223752` |

- **Type:** Inter throughout; 24/30 page title, 20/26 section heading, 16/22 listing title, 15/22 body, 13/18 secondary, 12/16 label. Use weight and alignment rather than a second display face for emphasis.
- **Spacing and shape:** 4, 8, 12, 16, 20, 24, 32 px; 4 px control edge and 8 px image/surface corner. Prefer crisp separators and compact metadata.
- **Image treatment:** Same 4:3 crop with natural saturation, minimal framing, and a 4 px corner; keep price and condition visually distinct beneath it.
- **Icon approach:** Phosphor Regular at 20 px; use a filled active state only where it clarifies selection, with text labels retained for essential states.

### Option C — Editorial Finds

**Character:** Warm, expressive, and more editorial while retaining an orderly marketplace hierarchy. Terracotta provides selective emphasis; serif display type is confined to short headings.

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | `#FBF1EB` | `#211613` |
| Surface | `#FFFCF9` | `#2D201C` |
| Raised surface | `#F5E7DF` | `#3B2B25` |
| Primary text | `#33231F` | `#F9EEE8` |
| Secondary text | `#72584F` | `#D4BEB5` |
| Border | `#E2CFC5` | `#60483F` |
| Action | `#A84231` | `#F09A7D` |
| Text on action | `#FFFFFF` | `#2B130F` |
| Accent surface | `#F5E0D6` | `#472E27` |

- **Type:** Instrument Serif 28/34 for short editorial headings; DM Sans 20/26 section heading, 17/23 listing title, 16/24 body, 13/18 secondary, 12/16 label. Keep prices in DM Sans with strong weight.
- **Spacing and shape:** 4, 8, 12, 16, 24, 32, 40 px; 6 px standard and 12 px larger image/surface corner. Allow more breathing room around section headings without breaking repeated listing comparison.
- **Image treatment:** Same 4:3 crop with warm natural photography, no color overlay, 8 px corner; editorial emphasis stays in typography and image scale, not added decoration.
- **Icon approach:** Material Symbols Rounded at 20 px and regular weight; use sparingly, paired with text for status and marketplace actions.

### Contrast spot checks for candidate palettes

Ratios use the stated sRGB hex pairs and are initial spot checks, not a complete accessibility audit or conformance claim. All listed text/action pairs exceed 4.5:1 in these candidate combinations.

| Option | Primary text / canvas, light | Secondary text / canvas, light | On-action / action, light | Primary text / canvas, dark | Secondary text / canvas, dark | On-action / action, dark |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| A — Field Catalog | 13.20:1 | 6.02:1 | 7.32:1 | 15.50:1 | 10.40:1 | 9.20:1 |
| B — Clear Signal | 13.65:1 | 6.00:1 | 5.90:1 | 16.17:1 | 10.29:1 | 7.67:1 |
| C — Editorial Finds | 13.48:1 | 5.86:1 | 6.02:1 | 15.50:1 | 9.95:1 | 8.00:1 |

These checks do not cover small icon strokes, borders, selected/disabled/focus states, tinted surfaces, photography overlays, or actual screen combinations. Verify those after selection. Do not mark any option accessible or approved based only on this table.

**Historical note:** The following values and prior contrast calculations document a withdrawn experiment only. They are not current tokens, defaults, or accessibility verification for Soldbay.

## Former token architecture — inactive

Pencil variables should use the `soldbay-` prefix. Primitive values map to semantic roles; product components should use semantic roles rather than hard-coded color values. Component-specific tokens are deferred until a real need appears in Step 06.

### Light theme

| Semantic role          | Approved value | Intended use                       |
| ---------------------- | -------------- | ---------------------------------- |
| `light-canvas`         | `#F6F7F1`      | Main app background                |
| `light-surface`        | `#FFFFFF`      | Content surfaces                   |
| `light-accent-surface` | `#E8EDD9`      | Restrained campus/context emphasis |
| `light-ink`            | `#1F2B21`      | Primary text                       |
| `light-muted`          | `#4E5D4D`      | Secondary text                     |
| `light-border`         | `#C5CEBF`      | Subtle separators and outlines     |
| `light-action`         | `#40543A`      | Primary action surface             |
| `light-on-action`      | `#FFFFFF`      | Text on primary action             |

### Dark theme

| Semantic role    | Approved value | Intended use                              |
| ---------------- | -------------- | ----------------------------------------- |
| `dark-canvas`    | `#151B16`      | Main app background                       |
| `dark-surface`   | `#202820`      | Content surfaces                          |
| `dark-raised`    | `#28332B`      | Raised surface where separation is needed |
| `dark-ink`       | `#EFF3EA`      | Primary text                              |
| `dark-muted`     | `#C4CEC0`      | Secondary text                            |
| `dark-border`    | `#556152`      | Subtle separators and outlines            |
| `dark-action`    | `#B8D6A5`      | Primary action surface                    |
| `dark-on-action` | `#172117`      | Text on primary action                    |

Dark mode uses the approved semantic adaptation of the selected direction, not a simple color inversion. Verify real screens, system settings, imagery, and platform rendering in later steps.

### Status pairs

Use color with explicit status text and, where helpful, a distinct icon or shape. Never make status understandable through color alone.

| Role        | Light foreground / background | Dark foreground / background |
| ----------- | ----------------------------- | ---------------------------- |
| Success     | `#235B3D` / `#E1F1E5`         | `#A9D5B5` / `#26342A`        |
| Warning     | `#684700` / `#FFF1CC`         | `#FFC96B` / `#463615`        |
| Danger      | `#8B3029` / `#FBE8E4`         | `#FFB4A9` / `#482A28`        |
| Information | `#315A77` / `#E3EFF7`         | `#A7CCE5` / `#253A48`        |

The semantic hues are communication roles, not additional brand accents. Product status mapping must be defined against the PSS and exercised in Step 06–09.

## Typography

Approved family: **Inter**, as used in the selected concept. Before handoff, confirm font licensing, glyph coverage for Nigerian names and currency/text, and native rendering on target platforms.

| Role      | Approved size / line height | Weight   |
| --------- | --------------------------: | -------- |
| Display   |                     28 / 34 | Bold     |
| Heading   |                     22 / 28 | Bold     |
| Title     |                     17 / 24 | Semibold |
| Body      |                     16 / 24 | Regular  |
| Secondary |                     14 / 20 | Regular  |
| Label     |                     12 / 16 | Semibold |

Use sentence case, keep body copy at 16 px where practical, and preserve text scaling. Validate actual localized strings and long campus/item names before finalizing the scale. Avoid metadata below 12 px in real UI unless a tested platform constraint justifies it.

## Spacing, grids, sizing, and shape

- **Spacing scale:** 4, 8, 12, 16, 24, and 32 px. Use semantic relationships, not arbitrary offsets.
- **Mobile foundation grid:** four-column reference grid, 16 px outer margins, 12 px gutters.
- **Desktop Admin/Ops foundation grid:** 12 columns, 32 px outer margins, 24 px gutters.
- **Breakpoints:** not set here. Step 05 defines the responsive test canvases and platform rules; refine exact adaptation rules against real screen structures in Steps 08–09.
- **Approved radii:** 4 px for controls, 8 px for cards, 12 px for larger containers. Keep the interface square enough to read as practical; do not round every element.
- **Borders/elevation:** prefer spacing and subtle borders for grouping. Use a restrained shadow only for overlays that need separation. Exact elevation is deferred until patterns are designed.
- **Sizing:** preserve readable text and comfortable targets. Set platform-specific minimum targets in Step 05 using current Apple and Android guidance.

## Motion and iconography

- Approved motion durations: 120 ms fast feedback, 180 ms standard transitions, 240 ms emphasis. Animation must not delay tasks or communicate status alone.
- Respect reduced-motion settings and make essential state changes clear without animation.
- No icon family is selected or drawn in this step. Select a coherent product icon family during detailed component design; keep OS-owned symbols platform-specific.

## Contrast spot checks

Ratios below were calculated from the stated sRGB hex pairs. They are spot checks for candidate pairings, not a complete WCAG audit or a claim of accessibility conformance.

| Pair                                                     |      Contrast |
| -------------------------------------------------------- | ------------: |
| Light primary text `#1F2B21` on accent surface `#E8EDD9` |       12.31:1 |
| White `#FFFFFF` on primary action `#40543A`              |        8.24:1 |
| Dark primary text `#EFF3EA` on dark surface `#202820`    |       13.48:1 |
| Status foreground/background pairs                       | 6.28:1–8.01:1 |

Recheck every actual text/background pairing, focus, disabled and selected states, text resizing, and non-color status cues in the component and screen reviews.

## Implementation mapping proposal

Keep the token names semantic and independent of the undecided application framework. If the selected implementation stack supports semantic aliases, map primitive values to semantic roles once and consume the role names from components. Production implementation still waits for the technology decision and later component/screen validation.

At the time, the Pencil file's unused legacy variables were checked for references and replaced with a fresh foundation set. This historical change does not make those withdrawn values current.

## Historical review checklist from withdrawn foundation work

The completed boxes below refer to the former 2026-11-06 foundation review only; they do not approve the current visual principles or any active theme.

- [x] Owner selected Grounded Market as the direction to develop.
- [x] Approved light/dark semantic color maps and type/spacing scales are documented.
- [x] Approved status pairs have spot-checked contrast ratios.
- [x] Owner approved the complete foundation set on 2026-11-06.
- [ ] Verify type licensing, glyph coverage, dynamic text, and real content lengths.
- [ ] Check all semantic color pairings and focus/disabled/selected states on rendered screens.
- [ ] Refine exact responsive breakpoints and pane changes against real screen structures in Steps 08–09.
- [x] Define iOS/Android system chrome, cutouts, safe areas, keyboards, gestures, touch targets, and offline/interruption behavior in the approved Step 05 foundations.
- [x] Record the shared component state contract and platform boundaries in the approved Step 06 architecture; select the product icon family during detailed component design.

**No application code, reusable UI components, or final product screens were created in the former Step 04.** The Pencil foundation sheet and all values above are historical and withdrawn, not current tokens. The high-level MVP direction is approved; the current next gate is review of [`visual-principles.md`](visual-principles.md), followed by fresh visual-foundation work. The archived values and their contrast calculations are not current accessibility verification for Soldbay.
