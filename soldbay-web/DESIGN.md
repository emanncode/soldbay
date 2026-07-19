# Soldbay Design System

Reference document for all UI decisions across the Soldbay admin web app. Every component should trace back to a token here — no one-off hex values or magic numbers in component code.

---

## 1. Brand concept

**The tag.** Soldbay's logo is a price tag. That idea extends through the whole system: listings are "tagged," badges are tag-shaped, and a small tag icon shows up anywhere something is being marked, priced, or categorized. The signature layout motif is the **dome** — a rounded-bottom hero/section shape, used sparingly as a transition device, not on every section.

Two colors, two jobs:
- **Brand gradient** (purple → blue, from the logo) = identity, atmosphere, backgrounds
- **Primary red** = action only — CTAs, prices, the "sold" moment

---

## 2. Color tokens

```css
/* Base */
--color-background: #ffffff;
--color-foreground: #1d1d1f;

/* Primary (CTA / action) */
--color-primary: #e1261c;
--color-primary-hover: #c91f16;
--color-primary-active: #a91912;
--color-primary-foreground: #ffffff;

/* Secondary */
--color-secondary: #f5f5f7;
--color-secondary-hover: #ebebee;
--color-secondary-foreground: #1d1d1f;

/* Accent (alias of primary — reserved for action moments) */
--color-accent: #e1261c;
--color-accent-foreground: #ffffff;

/* Muted */
--color-muted: #f5f5f7;
--color-muted-foreground: #6e6e73;

/* Surfaces */
--color-card: #ffffff;
--color-card-foreground: #1d1d1f;
--color-popover: #ffffff;
--color-popover-foreground: #1d1d1f;
--color-surface: #f5f5f7;
--color-surface-hover: #ececef;
--color-surface-elevated: #ffffff;

/* Form */
--color-border: #d2d2d7;
--color-input: #d2d2d7;
--color-ring: #e1261c;

/* Status */
--color-success: #16a34a;
--color-success-foreground: #ffffff;
--color-warning: #f59e0b;
--color-warning-foreground: #ffffff;
--color-info: #2563eb;
--color-info-foreground: #ffffff;
--color-destructive: #dc2626;
--color-destructive-foreground: #ffffff;

/* Text */
--color-text-primary: #1d1d1f;
--color-text-secondary: #6e6e73;
--color-text-tertiary: #8e8e93;

/* Brand gradient (identity, dark sections/hero only) */
--color-brand-start: #5b3df0;
--color-brand-end: #4527c8;
--color-brand-light: #8b6cff;
--color-brand-dark: #2e1f8d;
```

**Rule of use:** the brand gradient never appears on light/white sections — it's reserved for dark, atmospheric moments (hero, feature spotlight sections). On white/light sections, the only color besides neutrals is the primary red, used sparingly (one CTA, one price, one highlight — not decoratively).

---

## 3. Typography

- **Display font** (headlines, hero copy): Bricolage Grotesque — bold weights only (600–800)
- **Body font** (everything else): Inter

| Token | Size / Line-height | Weight | Use |
|---|---|---|---|
| `display-xl` | 96px / 1.02 | Bold | Hero headline only |
| `display-l` | 60px / 1.05 | Bold | Section-defining headlines |
| `display-m` | 40px / 1.1 | Semibold | Sub-section headers |
| `heading-l` | 32px / 1.2 | Semibold | Card group titles |
| `heading-m` | 24px / 1.3 | Semibold | Card titles |
| `heading-s` | 20px / 1.4 | Medium | Small section labels |
| `body-l` | 18px / 1.6 | Regular | Intro/lede paragraphs |
| `body-m` | 16px / 1.6 | Regular | Default body text |
| `body-s` | 14px / 1.5 | Regular | Secondary text, captions in UI |
| `caption` | 12px / 1.4 | Medium | Badges, timestamps, metadata |

On mobile, `display-xl` and `display-l` should scale down roughly 40% (e.g. 96px → 56px) — never keep hero type at full desktop size below the `lg` breakpoint.

---

## 4. Spacing scale

4px base unit: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`

Section vertical rhythm: `py-20` to `py-28` for standard marketing sections; hero can exceed this since it's dome-shaped and self-contained.

---

## 5. Radius scale

| Token | Value | Use |
|---|---|---|
| `sm` | 8px | Inputs, small controls |
| `md` | 12px | Inputs (default), small cards |
| `lg` | 16px | Standard cards |
| `xl` | 24px | Feature cards, "tag" listing cards |
| `full` | 9999px | All buttons, badges, pills |

Buttons and badges are always pill-shaped (`full`). Cards default to `xl` — soft enough to echo the tag motif without looking like a generic rounded-card template.

---

## 6. Shadows

| Token | Use |
|---|---|
| `shadow-sm` | Cards resting on white/light surfaces |
| `shadow-md` | Elevated/hover state cards on light surfaces |
| `shadow-lg` / `shadow-xl` | Floating tag cards on dark hero backgrounds — needs to read clearly against the dark/gradient backdrop |

---

## 7. Motion

- **Easing** (the "Soldbay ease," used everywhere): `cubic-bezier(0.25, 0.1, 0.25, 1)`
- **Durations:**
  - Fast (hover, press, small state changes): `150ms`
  - Base (toggles, tab switches, slide interactions): `300ms`
  - Slow (section reveals, hero entrance): `600–700ms`, staggered `100–150ms` per child
- **Spring** (for interactive sliders/pills like the shop/sell toggle): `stiffness: 200, damping: 25`
- Scroll-triggered reveals animate **once** (`viewport={{ once: true }}`), never replay on re-scroll.

---

## 8. Iconography

`lucide-react` for all standard UI icons (consistent stroke weight, widely available). The **tag icon** (derived from the logo mark) is the one custom icon in the system — reserved for brand-specific moments: price markers, category badges, list bullets tied to listings.

---

## 9. Layout

- Marketing/content max-width: `1152px` (`max-w-6xl`)
- Dashboard/app max-width: `1280px` (`max-w-7xl`)
- Breakpoints: Tailwind defaults — `sm 640 / md 768 / lg 1024 / xl 1280`

---

## 10. Component conventions

- **Button**: pill-shaped, `primary` = red fill + white text, `secondary` = neutral surface fill, `outline` = for use on dark backgrounds (white border, transparent fill)
- **Badge**: pill-shaped, subtle fill on light backgrounds, outline on dark backgrounds
- **Card**: `rounded-xl`; flat + bordered on light sections, elevated + shadowed on dark sections
- **Dome sections**: reserved for the hero and at most one other high-impact section — overusing the curve dilutes it as a signature
