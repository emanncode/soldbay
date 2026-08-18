# 07. UI Design System

Source of truth for visual tokens, components, layouts, and animations across `soldbay-web` and `soldbay-app`.

---

## Brand Theme & Concepts

### The Tag Mark
The visual identity of Soldbay revolves around the **Price Tag**. This concept is integrated into the UI as:
* Custom `TagIcon` vectors used for category indicators, bullet points, list items, and brand illustrations.
* Soft rounded corner radii on cards, panels, and input fields to mimic tag edges rather than harsh boxy grids.

### Dual-Role Color Palette
Soldbay enforces a strict distinction between atmospheric identities and call-to-actions:
1. **Identity & Atmosphere (Purple Gradient)**:
   * Hex: `#5b3df0` to `#4527c8` (`brand-start` to `brand-end`).
   * Usage: Reserved for dark mode background glows, page headers, nav bar states, and brand illustrations.
   * *Rule*: Never use purple gradients as fills on interactive forms or call-to-action buttons.
2. **Action & Pricing (Primary Red)**:
   * Hex: `#e1261c`.
   * Usage: Reserved for prices, "SOLD" badges, destructive buttons, and primary CTAs.
   * *Rule*: Use red sparsely—aim for only one primary red CTA per view to keep visual emphasis high.

---

## Color Tokens

### Standard Themes (shadcn-compatible)
* **Background / Foreground**: `#ffffff` / `#1d1d1f`
* **Card / Card-Foreground**: `#ffffff` / `#1d1d1f`
* **Primary / Primary-Foreground**: `#e1261c` (Primary Red) / `#ffffff`
* **Secondary / Secondary-Foreground**: `#f5f5f7` / `#1d1d1f`
* **Muted / Muted-Foreground**: `#f5f5f7` / `#6e6e73`
* **Accent / Accent-Foreground**: `#e1261c` / `#ffffff`
* **Destructive / Destructive-Foreground**: `#dc2626` / `#ffffff`
* **Border / Input / Ring**: `#d2d2d7` / `#d2d2d7` / `#e1261c`

### Status Accents
* **Success**: `#16a34a` (green) for verified sellers and payment clearances.
* **Warning**: `#f59e0b` (amber) for soft form warnings and input warnings.
* **Info**: `#2563eb` (blue) for system updates and helper tips.
* **Destructive/Error**: `#dc2626` (red) for invalid submissions and connection dropouts.

---

## Typography

### Families
* **Display / Headline Face**: *Bricolage Grotesque* (font-weights: `600` to `800`)
* **Body / Interface Face**: *Inter* (font-weights: `400` to `600`)

### Font Sizing Scale
* **Display XL**: `96px` (Mobile: `56px`), Line-Height: `1.02`, Weight: `Bold` (Hero banners only)
* **Display L**: `60px` (Mobile: `40px`), Line-Height: `1.05`, Weight: `Bold` (Major sections)
* **Display M**: `40px`, Line-Height: `1.1`, Weight: `Semibold` (Section headers)
* **Heading L**: `32px`, Line-Height: `1.2`, Weight: `Semibold` (Cards and major form titles)
* **Heading M**: `24px`, Line-Height: `1.3`, Weight: `Semibold` (List item headers)
* **Heading S**: `20px`, Line-Height: `1.4`, Weight: `Medium` (Labels and FAQs)
* **Body L**: `18px`, Line-Height: `1.6`, Weight: `Regular` (Hero intros)
* **Body M**: `16px`, Line-Height: `1.6`, Weight: `Regular` (Standard paragraphs)
* **Body S**: `14px`, Line-Height: `1.5`, Weight: `Regular` (Captions and input hints)
* **Caption**: `12px`, Line-Height: `1.4`, Weight: `Medium` (Badges and labels)

---

## Spacing (8-Point Grid)

All padding, margins, gaps, and offsets must follow multiples of **8px**:
```
8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128
```
* **Half-Step (4px)**: Allowed only for micro-alignments (e.g. icon spacing next to text). Do not use for layout padding.
* **Layout Constants**:
  * Page Container Max Width: `max-w-6xl` (72rem).
  * Page Container Horizontal Padding: `px-4` (mobile) to `md:px-8` (desktop).
  * Section Vertical Padding: `py-16` (64px) to `py-24` (96px).
  * Form Field Gap Stack: `gap-6` (24px).
  * Form Label to Control: `gap-2` (8px).

---

## Border Radius

* **sm/md (8px)**: Inputs, small buttons, and tags.
* **lg (16px)**: Standard card layouts, popup overlays, and dashboard cards.
* **xl/3xl (24px to 32px)**: Large marketing page panels, hero signups, and modal frames.

---

## Component Designs

### Buttons
* **Primary (Red)**: Solid background `#e1261c` with white text. High emphasis.
* **Secondary**: Light grey background with dark text. Medium emphasis.
* **Glassmorphism Panels**: Semitransparent backgrounds (`white/8%`) with border lines (`white/15%`) and backdrop filters (`blur(12px)`) for dark themes.
* **Primary Glass Button**: Purple glow background in headers and hero sections.

### Cards
* Rounded borders (`rounded-3xl` / `16px-24px` radius).
* Thin, transparent borders (`border-white/12`).
* Soft drop shadows for depth.

---

## Motion & Micro-Animations

* **Reduced Motion Support**: Ensure Framer Motion checks `prefers-reduced-motion` and falls back to instant opacity changes.
* **Fade Up**: `y: 20` to `y: 0` combined with `opacity: 0` to `opacity: 1` over `0.5s` for section entries.
* **Card Stagger**: Sequential entry delays (`0.1s` multiplier per index) for card lists.
* **Text Shimmer**: Shimmer gradients over text headers must be toggled off when motion reduction is active.
