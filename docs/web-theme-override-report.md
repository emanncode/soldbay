# Soldbay Web — Design System Theme Override Report

**Date:** 2026-09-12
**Scope:** `soldbay-web`
**Source of truth:** `docs/soldbay-design-system.md`
**Outcome:** Every theme value in the web app (Tailwind v4 `@theme` block, fonts, radii, shadcn/ui component tokens) replaced to match the Soldbay design system. Component structure and logic untouched — only the theme values they reference.

---

## 1. Overview

`soldbay-web` is a Next.js 16 + Tailwind CSS v4 + shadcn/ui project. In v4 the design
tokens do not live in a `tailwind.config.js` — they live in a CSS `@theme` block inside
`src/app/globals.css`. The previous theme was a generic dark "orange/purple SaaS" look
(orange `#ff4f18` primary, purple `#5b3df0` brand gradients, generic shadcn palette).

This report documents the wholesale replacement of that theme with the balanced
earthy/pastoral palette from the Soldbay design system: **cream, olive, tan, and muted
semantic colors**, Sora for UI, Fraunces for display headings.

---

## 2. Files Changed

### Theme / entry files

| File                  | Change                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `src/app/globals.css` | Complete rewrite of the `@theme` block + dark-mode override block + type/glass/atmosphere utilities                      |
| `src/app/layout.tsx`  | Font loading swapped to Sora + Fraunces via `next/font/google`; body moved onto semantic `bg-background text-foreground` |

### shadcn/ui components (theme-token references only)

| File                             | Token changes                                                                             |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| `src/components/ui/button.tsx`   | Radius `rounded-md` (10px); glass-primary glow revalued to olive                          |
| `src/components/ui/input.tsx`    | Radius `rounded-md`; `border-border` outline; focus `border-primary`                      |
| `src/components/ui/textarea.tsx` | Radius `rounded-md`; `border-border` outline; focus `border-primary`                      |
| `src/components/ui/select.tsx`   | Trigger: radius `rounded-md` + `border-border`; item: `rounded-md`; content: `rounded-lg` |
| `src/components/ui/checkbox.tsx` | Radius `rounded-sm` (6px); `border-border`; focus `border-primary`                        |
| `src/components/ui/badge.tsx`    | Radius `rounded-sm` (6px)                                                                 |
| `src/components/ui/card.tsx`     | Card/Header/Footer radius `rounded-lg` (16px)                                             |
| `src/components/ui/popover.tsx`  | Radius `rounded-lg` (16px)                                                                |
| `src/components/ui/command.tsx`  | Container `rounded-lg`; items `rounded-md`                                                |

### Landing / page components (colour-value references only)

| File                                      | Change                                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| `src/components/landing/ask-question.tsx` | Brand-pill glow `rgb(91 61 240 / …)` → olive `rgb(90 116 62 / …)`      |
| `src/components/landing/how-it-works.tsx` | Step-icon shadow purple → olive                                        |
| `src/components/join-form.tsx`            | Selected-chip shadow purple → olive                                    |
| `src/app/success/page.tsx`                | Success/info icon fills → `#2E7A6E` / `#4D6F89`; icon tile → `#5A743E` |

---

## 3. Core Colors — Light Mode

Mapped from design-system Section 14 (`Core Colors`) and Section 15 (`Secondary`).

| Token                             | Old                 | New                 | Design-system role                      |
| --------------------------------- | ------------------- | ------------------- | --------------------------------------- |
| `--color-background`              | `#ffffff`           | `#F4F1E8`           | Background (cream)                      |
| `--color-foreground`              | `#1d1d1f`           | `#2D3A1F`           | Text / Primary (olive)                  |
| `--color-primary`                 | `#ff4f18`           | `#5A743E`           | Primary ramp 500 (CTA olive)            |
| `--color-primary-foreground`      | `#ffffff`           | `#F1EEE4`           | On-primary text                         |
| `--color-secondary`               | `#f5f5f7`           | `#5C7048`           | Secondary green                         |
| `--color-secondary-foreground`    | `#1d1d1f`           | `#F4F1E8`           | On-secondary text                       |
| `--color-accent`                  | `#ff4f18`           | `#B8A678`           | Accent (tan)                            |
| `--color-accent-foreground`       | `#ffffff`           | `#2D3A1F`           | Dark text on tan                        |
| `--color-muted`                   | `#f5f5f7`           | `#E8E2D0`           | Surface (subtle bg)                     |
| `--color-muted-foreground`        | `#6e6e73`           | `#8A8070`           | De-emphasised text                      |
| `--color-card`                    | `#ffffff`           | `#E8E2D0`           | `/ --surface` — product cards, modals   |
| `--color-card-foreground`         | `#1d1d1f`           | `#2D3A1F`           | Card text                               |
| `--color-popover` / `-foreground` | `#ffffff`/`#1d1d1f` | `#E8E2D0`/`#2D3A1F` | Floating containers                     |
| `--color-border`                  | `#d2d2d7`           | `#D8D7CC`           | Border                                  |
| `--color-input`                   | `#d2d2d7`           | `#E8E2D0`           | Input fill → Surface (per DS Section 5) |
| `--color-ring`                    | `#ff4f18`           | `#B8A678`           | Focus ring (Accent)                     |

### Semantic colors (design-system Section 16)

Each semantic color gets a text/icon value plus a light surface tint:

| Role                        | Text / Icon                    | Contrast on `#F4F1E8` | Surface tint                        |
| --------------------------- | ------------------------------ | --------------------- | ----------------------------------- |
| Success (teal `~170°`)      | `--color-success: #2E7A6E`     | 4.51 : 1              | `--color-success-tint: #D9E8E1`     |
| Info (slate `~206°`)        | `--color-info: #4D6F89`        | 4.71 : 1              | `--color-info-tint: #DDE4E9`        |
| Warning (terracotta `~28°`) | `--color-warning: #875931`     | 5.31 : 1              | `--color-warning-tint: #EEE2D8`     |
| Destructive (brick `~7°`)   | `--color-destructive: #9C453A` | 5.59 : 1              | `--color-destructive-tint: #EEDFDD` |

Each also defines a `-foreground` token. Tint tokens are registered in `@theme`
(emitted when any utility referencing them is used, e.g. `bg-success-tint`).

### Custom tokens

- `--color-accent-400: #96824F` — Accent ramp 400, reserved for discounted pricing
  (struck-through original + bold discounted price). Deliberately not base Accent so
  discounts don't overuse the brand accent.
- `--color-text-primary / secondary / tertiary` — text hierarchy.
- `--color-surface: #E8E2D0`, `--color-surface-hover: #DDD6C4`,
  `--color-surface-elevated: #F4F1E8` — surface ramp.
- Brand gradient stops revalued (olive/tan): `--color-brand-start: #5A743E`,
  `--color-brand-end: #2C381E`, `--color-brand-light: #81A659`,
  `--color-brand-dark: #1A2112`. Kept for existing landing sections and
  `TagBadgeIcon` SVG gradients.

---

## 4. Core Colors — Dark Mode

Full separate set, per design-system Sections 14 and 18. Applied under a
`.dark, :root.dark` override block.

| Token              | Value     | Notes                             |
| ------------------ | --------- | --------------------------------- |
| `background`       | `#1A1F14` | Near-black, olive-tinted          |
| `foreground`       | `#F1EEE4` | 14.5 : 1 contrast                 |
| `secondary`        | `#8BA670` | lighter green for dark            |
| `accent`           | `#C7B58A` | lightened ~6% so it reads on dark |
| `card` / `surface` | `#242A1D` | elevation step                    |
| `border`           | `#3F4635` |                                   |
| `success`          | `#7BC4B6` | 8.33 : 1                          |
| `info`             | `#86A7C1` | 6.65 : 1                          |
| `warning`          | `#CF9B6E` | 6.85 : 1                          |
| `destructive`      | `#CC7266` | 4.93 : 1                          |

Dark tint backgrounds: success `#1F3A32`, info `#1F2D38`, warning `#3A2A1A`,
destructive `#3A1F1A`. Dark elevation steps revalued per Section 4
(`--color-surface-hover: #2C331F`, `--color-surface-elevated: #2C331F`).

---

## 5. Typography — Sora + Fraunces

Design-system Section 1: **Sora is the one true UI font; Fraunces is a marketing
accent reserved for the landing page only.**

### Loading (next/font/google — self-hosted at build, no Google CDN runtime request)

In `src/app/layout.tsx`:

```tsx
const sora = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
```

- `Sora` replaces the previous `Inter` on `--font-sans` (all UI/body, and the default
  family for shadcn components).
- `Fraunces` replaces the previous `Bricolage_Grotesque`. Its variable is exposed as
  `--font-serif` (display/headings only).
- `--font-display` is aliased to `--font-serif` in the theme so any existing
  `font-display` utilities fall through to Fraunces.

### Theme wiring

```css
--font-sans: var(--font-sans), "Sora", sans-serif;
--font-serif: var(--font-serif), "Fraunces", serif;
--font-display: var(--font-serif);
```

The `var()` self-reference is the established shadcn v4 pattern: `next/font` sets the
inline variable on `<html>`/`<body>`, which shadows the `@theme` `:root` rule, so the
utilities resolve to the loaded runtime font with a fallback.

### Type scale (design-system Section 1)

The `text-display-*`, `text-heading-*`, `text-body-*`, and `text-caption` utilities
were re-scoped to the design-system scale:

| Style                        | Size / line-height / tracking             | Font     |
| ---------------------------- | ----------------------------------------- | -------- |
| Display (`text-display-xl`)  | 72px / 1 / −0.035em                       | Fraunces |
| Heading 1 (`text-display-l`) | 52px / 1.08 / −0.03em                     | Fraunces |
| Heading 2 (`text-display-m`) | 38px / 1.15 / −0.02em                     | Fraunces |
| Heading 3 (`text-heading-l`) | 28px / 1.2 / −0.01em                      | Fraunces |
| `text-heading-m` / `-s`      | 20px / 1.6 / normal, 16px / 1.55 / normal | Sora     |
| Body (`text-body-l/m/s`)     | 20/16/14px, line-height 1.6/1.55/1.5      | Sora     |
| Caption (`text-caption`)     | 13px / 1.5 / 0.04em                       | Sora     |

Landing headings (`font-display text-display-m`, etc.) now render in the display serif.

---

## 6. Radius

Design-system Section 3. shadcn's base token is `--radius`, which previously pointed
at an 8px scale. Overridden explicitly to match the doc exactly:

| Token                    | Value   | Use                               |
| ------------------------ | ------- | --------------------------------- |
| `--radius` (shadcn base) | `10px`  | = radius-md, button/input default |
| `--radius-sm`            | `6px`   | chips, tags, small badges         |
| `--radius-md`            | `10px`  | buttons, input fields             |
| `--radius-lg`            | `16px`  | product cards, modals             |
| `--radius-xl`            | `24px`  | bottom sheets, large hero cards   |
| `--radius-full`          | `999px` | avatars, pill buttons, toggles    |

In Tailwind v4 the `rounded-{sm,md,lg,xl}` utilities resolve against these
`--radius-*` vars, so components were updated to emit the **token classes**
(`rounded-sm`, `rounded-md`, `rounded-lg`) rather than shadcn's arbitrary/default
values — e.g. the button went from `rounded-4xl` (32px) to `rounded-md` (10px), the
card from `rounded-4xl` to `rounded-lg` (16px).

---

## 7. Spacing

The design system uses a **4px base scale** (`space-1` = 4px … `space-12` = 48px;
Section 2). Tailwind v4's default spacing scale (`--spacing: 0.25rem`) already
matches this scale exactly.

The previous theme declared a `--space-*` block with 8px multiples (a different,
non-standard scale). Because v4 derives spacing utilities from `--spacing`, those
custom `--space-*` overrides introduced an inconsistent scale. They were **removed**
and the default 4px scale left in effect — matching the design system's
space-1–space-12 table and satisfying "confirm default 4px scale is in use; no
override needed."

Existing usages like `[--card-spacing:--spacing(6)]` (`--spacing(6)` = 24px) and
`--spacing(4)` (= 16px) now correspond exactly to design `space-6` and `space-4`.

---

## 8. Elevation / Shadows

Design-system Section 4. Light-mode shadows are olive-tinted (Primary at low
opacity) rather than pure black, keeping shadows warm:

| Token                  | Value                            |
| ---------------------- | -------------------------------- |
| `--shadow-elevation-1` | `0 1px 2px rgba(45,58,31,0.06)`  |
| `--shadow-elevation-2` | `0 2px 8px rgba(45,58,31,0.10)`  |
| `--shadow-elevation-3` | `0 8px 24px rgba(45,58,31,0.16)` |

These mirror the additive elevation background/border steps already defined in dark
mode (`#242A1D` → `#2C331F`, etc.).

---

## 9. Form Elements & Component States

Per design-system Section 5:

- **Input default:** Surface fill (`bg-input/50` where `--color-input: #E8E2D0`),
  Border outline (`border-border`), `radius-md` (10px).
- **Input focused:** border changes from Border to Primary (olive) with a 2–3px
  accent ring (`focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/30`).
- **Error:** `aria-invalid:border-destructive` → `#9C453A` for validation states.
- **Primary button states:** active ramp 700 `#2C381E` (per Section 5), disabled
  ramp 200 `#CDDBBD`, focus ring in Accent.
- **Secondary/outline button:** transparent bg, Primary border + Primary text.

The old `border-none`/`border-transparent` classes on input/textarea/checkbox/select
were replaced with `border-border` so form elements get the visible Border outline
described in the design system.

---

## 10. Application / Context Utilities

The old utilities were tied to the orange/purple dark brand (pure black background,
purple gradients, purple glows). They were revalued to the olive/tan palette:

- `page-atmosphere` — dark olive background with olive/tan radial gradients.
- `glass-panel`, `glass-panel-strong`, `glass-panel-focus`, `glass-nav`,
  `glass-input` — glass chrome retained (white-alpha based), spot/focus glows
  shifted from purple `rgb(139 108 255 …)` to olive `rgb(184 166 120 …)` /
  `rgb(90 116 62 …)`.
- `form-spotlight-glow` — shifted from purple to an earthy olive/tan radial.
- `text-hero-gradient` — shimmer swapped from violet tones to the olive/tan ramp
  (`#E6EDDE`, `#CABD9B`, `#B8A678`, `#81A659`, `#EDE9DE`).
- `text-hero-image-clip` — drop-shadow tinted olive.

---

## 11. Method & Notes

### How tokens wire together (Tailwind v4)

- Color tokens are declared as `--color-*` in `@theme` → generate `bg-*`, `text-*`,
  `border-*`, `ring-*` utility classes.
- Tailwind v4 tree-shakes `@theme` variables that match no generated utility;
  each token is emitted at `:root` the moment a referencing utility is used, so all
  the custom tokens (`accent-400`, `success-tint`, …) are available on demand.
- The `.dark, :root.dark` override block is plain CSS, so dark-mode variables are
  always present and take precedence under a `.dark` class (drop-in ready for the
  `next-themes` class strategy).

### Mapping decision: "Primary"

The design system calls the olive `#2D3A1F` "Primary/Text". shadcn's `--color-primary`
is the CTA/brand colour. Resolution: `--color-foreground` = `#2D3A1F` (the text
colour), while `--color-primary` = olive ramp 500 `#5A743E` (the CTA fill, hover/
active 700 `#2C381E` per Section 5). Accent (tan) carries focus rings and brand
highlights; its filled usage pairs with dark text.

### What was deliberately left alone

- Component structure/logic in every shadcn component.
- The landing page's dark "glass" architecture (it remains dark via
  `page-atmosphere`); only its colour values were revalued.
- `--color-input` was set to Surface rather than Border so textarea/select/checkbox
  fills (which reference `bg-input/50`) read as Surface, with `border-border`
  supplying the outline.

---

## 12. Verification

| Check                                                     | Result                                                             |
| --------------------------------------------------------- | ------------------------------------------------------------------ |
| `npx tsc --noEmit`                                        | Passed (0 errors)                                                  |
| `npx eslint src/`                                         | Passed (0 errors)                                                  |
| PostCSS + `@tailwindcss/postcss` compile of `globals.css` | Passed; tokens, dark block, and font utilities confirmed in output |

Not run: full `next build` (requires Prisma + database for static generation of the
waitlist count on the home page).

---

## 13. Follow-ups / Not Yet Handled

- No dedicated dark-mode toggle is wired up yet; the `.dark` block is ready for
  a theme provider but nothing toggles the class today.
- Tint/custom tokens (`accent-400`, `success-tint`, etc.) are available as utility
  classes; any component using them via `var(--color-…)` directly will resolve once a
  referencing utility exists in the build.
- `error-message.tsx` uses hard-coded Tailwind palette utilities (`amber-*`, `rose-*`,
  …); it was left untouched to stay within the stated scope (shadcn components only)
  and may be worth reconciling with the semantic tokens in a future pass.
- Product-card-level treatments from the design system (Sold/Unavailable stamp,
  New-seller pill, discounted price in `accent-400`) are token-enabled but not yet
  implemented in `soldbay-web` UI.
