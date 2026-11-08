# Soldbay Design Foundations — Stage 04, Step 04

**Status:** Approved by the owner on 2026-11-06. This is the approved foundation direction and token set; screen-level accessibility and rendering checks remain due.
**Prepared:** 2026-11-06
**Selected direction:** A — Grounded Market, owner-selected on 2026-11-06.
**Canvas:** `design/soldbay-design-documentation.pen`, frame “Step 04 Grounded Market Foundations”.
**Product authority:** [`docs/architecture.md`](architecture.md). Product behavior and roles are unchanged.

## Purpose and evidence boundary

Translate the selected visual direction into document the approved color, type, spacing, layout, shape, and motion foundations. These are foundations, not components or final screens. No design preference or accessibility result is presented as user research. The owner approved the stated palette, including `#E8EDD9`, typography scale, spacing/grid values, status pairs, shape, and motion values as the foundation set.

The product follows the device appearance setting; the approved foundation therefore includes light and dark semantic mappings, with no in-app theme toggle. Platform behavior and system chrome are specified in Step 05.

## Approved token architecture

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

The active Pencil file previously contained unused legacy variables. They were checked for references and replaced with a fresh foundation set; no legacy visual values were carried forward.

## Review checklist and remaining work

- [x] Owner selected Grounded Market as the direction to develop.
- [x] Approved light/dark semantic color maps and type/spacing scales are documented.
- [x] Approved status pairs have spot-checked contrast ratios.
- [x] Owner approved the complete foundation set on 2026-11-06.
- [ ] Verify type licensing, glyph coverage, dynamic text, and real content lengths.
- [ ] Check all semantic color pairings and focus/disabled/selected states on rendered screens.
- [ ] Refine exact responsive breakpoints and pane changes against real screen structures in Steps 08–09.
- [x] Define iOS/Android system chrome, cutouts, safe areas, keyboards, gestures, touch targets, and offline/interruption behavior in the approved Step 05 foundations.
- [x] Record the shared component state contract and platform boundaries in the approved Step 06 architecture; select the product icon family during detailed component design.

**No application code, reusable UI components, or final product screens were created in Step 04.** The Pencil foundation sheet records approved tokens; actual screen rendering, contrast coverage, target-device behavior, and technology-specific token mapping remain unverified.
