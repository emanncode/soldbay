# Soldbay — Daily Log

---

## 2026-09-12 — Web Theme Override, Design System Sync & Pen Design Update

### Summary

After the logo export, two large pieces of work landed today:

1. **soldbay-web theme override** — replaced the shadcn/ui default violet/indigo
   theme with the full Soldbay palette (olive/tan/cream + dark mode + semantic
   colors) using Tailwind CSS v4's `@theme` system, wired Fraunces + Sora into
   `layout.tsx`, tokenized every UI component, and re-tinted the landing + success
   pages away from purple. Verified with TypeScript, ESLint, and a PostCSS compile.
2. **Design system sync** — reconciled three artifacts against an updated design
   system the user pasted in: the doc (`docs/soldbay-design-system.md`), the pen
   design board (`design/design.pen`), and the tokens already shipped to
   `soldbay-web`. The headline change: the **Unverified Seller card state was
   retired** (Section 6 simplified to Sold/Unavailable), Section 10's "New seller"
   indicator was simplified, Section 14 gained a locked "Naming clarification," and
   Section 19's decision statuses were updated.

A full detailed report of the theme override also lives in
`docs/web-theme-override-report.md`.

---

### Starting Context

- The repo is a monorepo: `soldbay-app` (Expo/React Native mobile),
  `soldbay-web` (Next.js 15 App Router + Tailwind CSS v4), `design/` (`.pen`
  design boards + `DESIGN.md`), `docs/` (architecture, design system, daily log,
  reports).
- `soldbay-web` shipped with shadcn/ui components and landing pages using the
  default **violet/indigo** accent theme — visually wrong for the earthy,
  olive/tan/cream Soldbay brand.
- The canonical brand spec is `docs/soldbay-design-system.md`: Fraunces for
  display/marketing, Sora for UI; olive Primary, tan Accent, cream Background,
  plus a full dark-mode + semantic set.
- Tailwind v4 config pattern in `soldbay-web/src/app/globals.css`: design tokens
  are defined in CSS `@theme` blocks and generate named utilities (`bg-background`,
  `text-foreground`, `bg-primary`, `border-border`) **on demand**; unused vars are
  tree-shaken; dark mode is a plain `.dark, :root.dark` CSS block that always
  emits.

---

### 1 · Repo Map

Created `folder structure.md` at the repo root: a tree of the monorepo
(`soldbay-app`, `soldbay-web`, `design/`, `docs/`) so "what lives where" is
answerable from one file — including soldbay-web's `app/` routes, `components/ui`
(shadcn) and `components/landing`, soldbay-app's assets/screens, and the `.pen`
boards + their DESIGN.md.

---

### 2 · soldbay-web Theme Override

#### How decisions were made

- The design-system doc is the single source of truth for color/type; the task was
  to make soldbay-web **render those tokens**, not invent new ones.
- Kept the file's existing Tailwind v4 `@theme` pattern instead of restructuring:
  named utilities are generated only when referenced (keeps the CSS bundle lean),
  and the `.dark` block is plain CSS so dark mode is always emitted.
- The locked naming from the design system (see Section 14 clarification in part 3
  below) was honored directly: `foreground` = the olive ink / cream text pair,
  `primary` = the CTA-fill olive, pressed uses ramp 700.

#### Core tokens — light mode

| Token | Value | Brand role |
|---|---|---|
| `--color-background` | `#F4F1E8` | cream bg |
| `--color-foreground` | `#2D3A1F` | Text/Primary (olive ink) |
| `--color-primary` | `#5A743E` | CTA fill (ramp 500) |
| `--color-primary-700` | `#2C381E` | pressed/active |
| `--color-accent` | `#B8A678` | tan brand echo |
| `--color-accent-400` | `#96824F` | discounted-price accents |
| `--color-secondary` | `#5C7048` | secondary buttons/tags |
| `--color-card` / `surface` | `#E8E2D0` | cards, modals |
| `--color-border` | `#D8D7CC` | hairlines |

Semantics (text/icon + tint): Success `#2E7A6E`/`#D9E8E1`, Info `#4D6F89`/`#DDE4E9`,
Warning `#875931`/`#EEE2D8`, Destructive `#9C453A`/`#EEDFDD`.

Radii: `sm` 6, base 10, `md` 10, `lg` 16, `xl` 24, `full` 999.

#### Core tokens — dark mode (`.dark` block)

| Token | Value |
|---|---|
| background | `#1A1F14` (near-black, olive-tinted) |
| foreground | `#F1EEE4` |
| primary | `#8BA670` (lightened CTA) |
| accent | `#C7B58A` (lightened ~6%) |
| card | `#242A1D` |
| border | `#3F4635` |
| semantics | Success `#7BC4B6`, Info `#86A7C1`, Warning `#CF9B6E`, Destructive `#CC7266` |

Brand ramp (`--color-brand-*`, olive): start `#5A743E` → end `#2C381E`, light
`#81A659`, dark `#1A2112` — used for button glows and gradients.

**Spacing decision:** the pre-existing `--space-*` tokens were removed because
Tailwind v4's default 4px spacing scale already covers the design system's
4px-based spacing; keeping them would just re-map to equal values.

#### Typography

- `soldbay-web/src/app/layout.tsx` now loads **Sora** (400/500/600) as `--font-sans`
  and **Fraunces** variable (400–700) as `--font-serif`, aliased to `--font-display`;
  Satisfy stays as the small script accent used in the landing hero.
- `<body>` set to `bg-background text-foreground` so both modes flow from the
  tokens.

#### UI components tokenized

All shadcn components in `components/ui/` were converted from the default
violet/neutral scheme to token classes + the design-system radii:
`button`, `input`, `textarea`, `select`, `checkbox`, `badge`, `card`, `popover`,
`command`. Highlights: primary button's `glass-primary` glow re-tinted from purple
to olive; focus rings/checks switched to `border-primary` / `focus-visible:border-primary`.

#### Landing + success pages re-tinted

- Purple accents (`rgb(91 61 240/…)`) → olive (`rgb(90 116 62/…)`) across
  `components/landing/ask-question.tsx`, `how-it-works.tsx`, and
  `components/join-form.tsx`.
- `app/success/page.tsx` icon fills pulled to the semantic + brand set
  (`#2E7A6E`, `#4D6F89`, `#5A743E`).

#### Verification

- `npx tsc --noEmit` — clean
- `npx eslint src/` — clean
- PostCSS + `@tailwindcss/postcss` compile of `globals.css` — clean
- Full `next build` was **not** run: it needs Prisma + a reachable DB for the
  home-page waitlist count that's statically generated at build.

---

### 3 · Design System Sync (doc + pen)

The user pasted an updated design system. It was diffed against the on-disk
doc and the three artifacts were aligned.

#### Diff: pasted version vs on-disk `soldbay-design-system.md`

| Section | Change |
|---|---|
| 6 · Product Card States | Dropped "& Unverified Seller" from title; **retired the Unverified Seller card state** (former 6b/6c removed). Placement decision updated: stamp copy **and icon** still open (was "SOLD"; flagging text vs icon combo). Whole-card desaturation ~75%. |
| 10 · Trust & Verification | "New seller" indicator simplified from a full pill spec to **"Neutral tag, Secondary color background"**; the Section 6b cross-reference was dropped. |
| 14 · Core Colors | Added a **"Naming clarification (locked)"** block (see below). |
| 19 · Still Open | Sold/Unavailable: structure + treatment decided, only stamp copy/icon open. Verified-seller: treatment decided (Section 10), **just not yet built as a component**. |

**The locked naming (Section 14):** `foreground` (alias `text`) = dark olive
`#2D3A1F` light / cream `#F1EEE4` dark — everything renders in this pair.
`primary` (alias `button`) = CTA-fill `#5A743E` (ramp 500) light / `#8BA670` dark —
NOT the text default, not a synonym for "important". Pressed → ramp 700 `#2C381E`.

#### Pen board updates (`design/design.pen`)

Inspected via the pencil MCP. Most sections already matched the new doc (06, 10,
16, 19 had been updated earlier), so only the actual gaps were touched:

- **Section 14 (14 Core Colors):** inserted a "Naming clarification (locked)" note
  between the color tables and the Marketplace note, styled to match the existing
  caption (12px Sora, `#5A5A4F`). Frame height bumped to fit.
- **Section 06 (Product Card States):** whole-card desaturation wording aligned
  from ~70–80% to **~75%** to match the doc.
- **Product Card Gallery:** deleted the two **"Product Card — Unverified Seller"**
  demo cards (light + dark) since the new doc retires that state. (Flagged to the
  user — easy to restore if they want the exploration kept.)

Verification was structural (node geometry: no overlaps, notes fit, gallery
intact) because the model couldn't render the captured screenshots.

#### Markdown updates (`docs/soldbay-design-system.md`)

Applied the same diff as targeted edits — Section 6 title/intro, the stamp
placement cell, whole-card wording, removal of 6b/6c + a "Still open: exact stamp
copy / icon" line, Section 10's New seller row, Section 14's naming clarification,
and Section 19's updated statuses. Verified with grep: no stale
"Unverified/6b/6c/both states implemented" references remain.

---

### Open Items / Notes

- The two Unverified Seller pen demos were **removed**, not hidden — restore if
  wanted.
- Full `next build` still blocked on Prisma + DB for the waitlist count.
- Pen screenshots captured but not viewable by the model; layout verified via node
  geometry instead — worth a quick human glance at the board.

---

## 2026-09-12 — Logo System Design & Production Export

### Summary

Designed and exported the complete Soldbay logo system: a wordmark-led primary direction
(Fraunces serif + geometric dot accent), two lighter alternate explorations (handoff mark,
campus pin), and full production assets (SVGs + PNGs) deployed to `soldbay-app/assets/` and
`soldbay-web/public/`.

---

### Starting Context

The design system doc (`docs/soldbay-design-system.md`) already defined typography
(Fraunces for display/marketing, Sora for UI), the color palette (Primary #2D3A1F,
Background cream #F4F1E8, Accent #B8A678), and Section 22's app icon spec (40×40px,
simple mark, iOS pre-masked / Android adaptive fg+bg layers). But no logo or wordmark
existed yet — only placeholder files in the asset folders.

The brief called for a **wordmark-led** approach (not an abstract icon-first mark), with
Fraunces doing the heavy lifting. The wordmark itself should carry the brand character,
not a separate symbol.

---

### Design Decisions — Primary Direction (Wordmark-Led)

#### Why Fraunces for the wordmark

Fraunces is already the brand's display typeface (Section 1 of the design system). Using
it for the wordmark means the logo and the landing-page headlines share the same DNA —
no disconnect between "what the brand looks like in marketing" and "what the logo looks
like." A generic sans logotype (like many tech brands default to) would fight the
earthy, editorial personality the palette establishes.

#### Letterspacing: -0.02em

Tested tighter (-0.04em) and looser (0, +0.02em) on the canvas. -0.02em is the sweet
spot: the wordmark feels intentional and compact without the letters colliding. Fraunces
has fairly open counters by default, so a slight negative tracking compensates without
making it feel cramped.

#### Weight: 500 (Medium)

The design system notes that only 400 Regular ships in the free Fraunces preview, but
the full variable range should be used for marketing. Weight 500 gives the wordmark
enough presence to read as a logo (not body text) while staying below the bold/heavy
range that would feel aggressive for a campus marketplace. 600 was tested but felt
slightly too heavy for the friendly/approachable tone.

#### The dot accent — why a dot, not an underline or bracket

The brief specified "one accessory, not multiple" — a single dot, underline, or bracket.
Evaluated all three on the canvas:

- **Dot (chosen):** Sits naturally after the wordmark like a period/full-stop. Reads as
  a deliberate full-stop that says "this is the name." Small, doesn't compete with the
  letterforms. The Accent color (#B8A678) ties it to the brand palette without using the
  Primary color twice (which would flatten the hierarchy).
- **Underline:** Tested a short Accent-colored rule beneath the wordmark. Felt like a
  design-system annotation rather than part of the logo. Also problematic at small sizes
  where the line blurs into the descenders.
- **Bracket:** Tested an Accent-colored closing bracket after the wordmark. Read as
  decorative/punctuation — too literal, and confused with actual syntax at small sizes.

The dot won because it's the most invisible-as-brand-device. People don't question a
dot after a wordmark; they do question lines and brackets.

#### Color: Primary #2D3A1F on cream #F4F1E8

Directly from the design system's Section 14 core colors. The cream background is the
app's actual Background token, so the lockup sits in its natural habitat. The inverted
version (cream on Primary or dark #1A1F14) is for dark surfaces — app splash screen,
dark-mode headers, pitch decks with dark backgrounds.

---

### Design Decisions — App Icon Monogram

#### Why "S" alone (not "SB")

The brief allowed "S" or "SB." Tested both on the canvas. "SB" at 40×40px gets muddy —
the two letters compete and neither is legible. A single "S" in Fraunces is distinctive
enough (the serifs and ball terminals are recognizable even at 20px effective size) and
leaves room for the Accent dot as a secondary identifier.

#### The accent dot in the icon

The dot from the full lockup carries through to the icon, maintaining brand continuity.
It sits in the bottom-right corner at a size proportional to the icon — large enough to
read as intentional, small enough not to crowd the "S."

#### iOS: no radius baked in

Section 22 of the design system specifies "pre-masked for iOS's rounded-square shape
(no radius baked in)." The export is a clean square PNG at 1024×1024. iOS applies its
own squircle mask at runtime.

#### Android: split foreground/background layers

Android adaptive icons require separate fg and bg layers, each 512×512:
- **Foreground:** Cream "S" + Accent dot on transparent background
- **Background:** Solid #2D3A1F fill

The OS composites them and applies its own masking/shape.

---

### Alternate Directions (Lighter Explorations)

#### Alternate 1: Handoff Moment

Two overlapping rounded rectangles — one in Primary (#2D3A1F), one in Accent (#B8A678)
— with a Primary-green overlap zone. Evokes the PIN-confirmed exchange that's the actual
product differentiator (students meet at a campus point, confirm a code, hand off the
item).

**Why it's an alternate, not primary:** It works as a mark but adds visual complexity
the wordmark-led approach avoids. The two shapes need explanation ("what do these
mean?") whereas a wordmark is immediately readable. The concept is strong for
storytelling (e.g., "the moment of exchange") but too abstract for a logo that needs to
work at 16×16 favicon size.

#### Alternate 2: Campus Pin

A map-pin teardrop shape with four small dots inside (2×2 grid) — references campus
pickup points and the PIN/code confirmation mechanic. The pin is a universal "location"
signifier; the four dots hint at a keypad without being literal.

**Why it's an alternate:** The pin shape is immediately recognizable as "location" but
doesn't say "Soldbay" — it says "map." The four dots are a subtle nod, but at small
sizes they blur into a texture. The wordmark-led approach is more ownable because
"Soldbay" in Fraunces is uniquely Soldbay; a pin shape could be any campus app.

---

### Production Export Details

#### SVGs (3 files)

All SVGs use `@import url()` to reference Fraunces from Google Fonts. This works in
browsers, web contexts, and any SVG renderer with network access. For native app use
where font loading is unreliable, the SVGs can be converted to path-based outlines.

| File | Viewbox | Fill | Accent |
|---|---|---|---|
| `soldbay-logo-primary.svg` | 520×100 | #2D3A1F wordmark | #B8A678 dot |
| `soldbay-logo-inverted.svg` | 520×100 | #F4F1E8 wordmark | #B8A678 dot |
| `soldbay-wordmark-only.svg` | 440×100 | #2D3A1F wordmark | none |

#### PNGs (3 files)

| File | Dimensions | Color | Description |
|---|---|---|---|
| `icon.png` | 1024×1024 | sRGB, 8-bit RGBA | S monogram + dot on cream, no radius |
| `android-icon-foreground.png` | 512×512 | sRGB, 8-bit RGBA | Cream S + dot, transparent bg |
| `android-icon-background.png` | 512×512 | sRGB, 8-bit Palette | Solid #2D3A1F |

#### File Placement

```
soldbay-app/assets/
├── soldbay-logo-primary.svg
├── soldbay-logo-inverted.svg
├── soldbay-wordmark-only.svg
└── images/
    ├── icon.png                          (was placeholder)
    ├── android-icon-foreground.png       (was placeholder)
    └── android-icon-background.png       (was placeholder)

soldbay-web/public/
├── soldbay-logo-primary.svg
├── soldbay-logo-inverted.svg
└── soldbay-wordmark-only.svg
```

The old placeholder files (`logo.png`, `logo.svg`, `logo2.svg`, etc.) remain in place
for now — they can be removed once all import references are updated to the new filenames.

---

### Open Items / Next Steps

1. **Update import references** in app code and web code to use the new filenames
   (`soldbay-logo-primary.svg` instead of `logo.svg`).
2. **Remove old placeholder files** once references are confirmed working.
3. **Test the SVGs in production** — verify Fraunces loads correctly in the app's
   WebView and the web landing page.
4. **Favicon** — the wordmark-only SVG or a cropped version of the icon could serve as
   the favicon; currently `favicon.ico` in `soldbay-web/public/` is the old one.
5. **Splash screen** — use the iOS icon (centered on cream background) for the splash,
   per Section 22 of the design system.
6. **Social/meta images** — the inverted lockup on a dark background would work for
   Open Graph / Twitter card images; not yet generated.

---
