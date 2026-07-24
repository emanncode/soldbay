# Soldbay Design System

Source of truth for UI across **soldbay-web**. Prefer tokens and shadcn primitives over one-off values.

**Stack alignment**

| Layer | Choice |
|---|---|
| Components | [shadcn/ui](https://ui.shadcn.com) — style `radix-luma` (`components.json`) |
| Primitives | Radix UI (via shadcn) |
| Icons | `lucide-react` + custom **Tag** mark |
| Styling | Tailwind CSS v4 + CSS variables in `src/app/globals.css` |
| Motion | Framer Motion + shared helpers in `src/lib/motion.ts` |
| Fonts | **Bricolage Grotesque** (display), **Inter** (body) |

Do not invent parallel button/input/card components. Extend shadcn variants (`button.tsx`, `card.tsx`, etc.) instead.

Design export scripts (Pencil/pen) live under repo `design/*.mjs` and should stay in sync with this doc.

---

## 1. Brand concept

**The tag.** The logo is a price tag. That idea shows up as:

- Tag-shaped badges / list accents
- Custom `TagIcon` for brand moments (listings, categories, step markers)
- Soft large radii on cards (tag-like softness, not harsh boxes)

**Two color jobs (never mix roles):**

| Role | Color | Use |
|---|---|---|
| **Identity / atmosphere** | Brand purple gradient (`#5b3df0` → `#4527c8`) | Dark page shells, hero glow, brand accents on dark UI |
| **Action** | Primary red (`#e1261c`) | CTAs, prices, “sold”, destructive-action emphasis |

**Rules**

- Purple gradient is for **dark atmospheric surfaces**, not decorative fill on light forms.
- Red is **sparse**: one primary CTA per view when possible.
- Current marketing UI is **dark-first** (atmosphere + glass). Light tokens remain for future dashboard / light cards.

---

## 2. Color tokens (shadcn + Soldbay)

Mapped to shadcn CSS variables and Tailwind `@theme` in `globals.css`.

### Core (shadcn-compatible)

```
background / foreground     #ffffff / #1d1d1f   (light surfaces; body default is dark shell)
card / card-foreground      #ffffff / #1d1d1f
popover / popover-foreground
primary / primary-foreground  #e1261c / #ffffff
secondary / secondary-foreground  #f5f5f7 / #1d1d1f
muted / muted-foreground      #f5f5f7 / #6e6e73
accent / accent-foreground    #e1261c / #ffffff   (action alias of primary)
destructive / destructive-foreground  #dc2626 / #ffffff
border / input / ring         #d2d2d7 / #d2d2d7 / #e1261c
```

### Status

| Token | Hex | Use |
|---|---|---|
| `success` | `#16a34a` | Success states, checkmarks |
| `warning` | `#f59e0b` | Caution, validation soft-warn |
| `info` | `#2563eb` | Informational |
| `destructive` | `#dc2626` | Errors, destructive actions |

### Brand (custom)

| Token | Hex |
|---|---|
| `brand-start` | `#5b3df0` |
| `brand-end` | `#4527c8` |
| `brand-light` | `#8b6cff` |
| `brand-dark` | `#2e1f8d` |

### Dark marketing shell

| Token / value | Use |
|---|---|
| `#07060f` / `#0b0b10` | Page atmosphere base |
| `text-white`, `white/55–85` | Primary / secondary copy on dark |
| Glass borders `white/12–22` | Glass edges |

### Error UI variants (status-colored alerts)

| Variant | HTTP | Surface (example) |
|---|---|---|
| `validation` | 400 | Amber `bg-amber-50` |
| `unauthorized` | 401 | Orange `bg-orange-50` |
| `forbidden` | 403 | Rose `bg-rose-50` |
| `notFound` | 404 | Sky `bg-sky-50` |
| `conflict` | 409 | Violet `bg-violet-50` |
| `server` | 5xx | Red `bg-red-50` (retry / cold start) |
| `network` | — | Slate `bg-slate-100` |
| `unknown` | other | Zinc `bg-zinc-100` |

Implementation: `src/lib/api-error.ts` + `src/components/ui/error-message.tsx`.

---

## 3. Typography

| Role | Family | Weights |
|---|---|---|
| Display / headlines | Bricolage Grotesque | 600–800 |
| Body / UI | Inter | 400–600 |

### Scale (utilities)

| Token | Size | Line-height | Weight | Use |
|---|---|---|---|---|
| `display-xl` | 96px (56 mobile) | 1.02 | Bold | Hero only |
| `display-l` | 60px (40 mobile) | 1.05 | Bold | Major section titles |
| `display-m` | 40px | 1.1 | Semibold | Section headers |
| `heading-l` | 32px | 1.2 | Semibold | Form / card group titles |
| `heading-m` | 24px | 1.3 | Semibold | Card titles |
| `heading-s` | 20px | 1.4 | Medium | Small labels, FAQ questions |
| `body-l` | 18px | 1.6 | Regular | Lede / intro |
| `body-m` | 16px | 1.6 | Regular | Default body |
| `body-s` | 14px | 1.5 | Regular | Secondary / helper |
| `caption` | 12px | 1.4 | Medium | Meta, badges, “Built by” |

**Hero display** may use fluid type: `clamp(2.75rem, 9vw, 7.5rem)` for marketing impact while staying on the display face.

**Hero text effects**

- `text-hero-gradient` — animated gradient clipped to glyphs (primary readable headline treatment)
- Respect `prefers-reduced-motion` (disable shimmer)

---

## 4. Spacing — 8-point grid

**Base unit: 8px.** Layout spacing must be multiples of 8.

Allowed scale:

```
8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128
```

**Half-step (4px)** only for micro UI (icon inset, hairline alignment) — not section padding.

### CSS tokens (`globals.css`)

```
--space-1: 8px
--space-2: 16px
--space-3: 24px
--space-4: 32px
--space-5: 40px
--space-6: 48px
--space-7: 56px
--space-8: 64px
--space-10: 80px
--space-12: 96px
--space-14: 112px
--space-16: 128px
```

### Layout utilities

| Utility | Rule |
|---|---|
| `container-page` | `max-w-6xl` (72rem), horizontal padding **16 → 24 → 32** |
| `pt-nav` | Clear fixed nav: **112px** / **128px** (sm+) |

### Section rhythm (marketing)

| Section | Vertical padding |
|---|---|
| Compact | `py-16` (64) |
| Default | `py-24` (96) |
| Tall | `py-32` (128) |

### Form rhythm

| Element | Spacing |
|---|---|
| Field stack | `gap-6` (24) |
| Label → control | `gap-2` (8) |
| Chip row | `gap-2` (8) |
| Card padding | `p-8` / `md:p-12` (32 / 48) |
| Input height | `h-10` or `h-12` (40 / 48) |

**Avoid:** `gap-3` (12), `p-7` (28), `h-9` (36), `px-3.5` (14) for layout.

---

## 5. Radius

| Token | Value | Use |
|---|---|---|
| `sm` / `md` | 8px | Inputs, small controls |
| `lg` | 16px | Medium surfaces |
| `xl` | 24px | Cards, glass panels |
| `2xl` | 32px | Large panels |
| `full` | 9999px | **Buttons, badges, nav pill, chips** |

From design scripts: buttons and badges are **always pill-shaped**. Cards use large soft corners (`rounded-3xl` ≈ 24px).

---

## 6. Elevation & glass

### Light surfaces

| Shadow | Use |
|---|---|
| `shadow-sm` | Resting cards |
| `shadow-md` | Hover / elevated |
| `shadow-lg` | Floating over complex bg |

### Dark / glass utilities (`globals.css`)

| Class | Role |
|---|---|
| `page-atmosphere` | Fixed dark + purple radials (whole marketing shell) |
| `page-noise` | Subtle film grain overlay |
| `glass-panel` | Standard frosted panel |
| `glass-panel-strong` | Stronger frosted panel |
| `glass-panel-focus` | Brighter glass for form/success focal cards |
| `glass-nav` | Nav pill: **blur + border only**, no solid fill |
| `glass-input` | Dark glass field (optional) |
| `form-spotlight` / `form-spotlight-glow` | Soft lightened area behind form cards |

**Glass rules**

- Prefer glass on dark atmosphere; don’t place heavy glass on pure white.
- Nav must not sit on an opaque black bar — it **overlays** the hero (`fixed` + transparent).
- Forms sit on `form-spotlight` so the card is the center of attention.

---

## 7. Motion

| Token | Value |
|---|---|
| Soldbay ease | `cubic-bezier(0.25, 0.1, 0.25, 1)` (`soldbayEase`) |
| Fast | ~150ms (hover) |
| Base | ~300–400ms |
| Entrance | ~400–450ms |
| Form stagger | ~55ms between fields |

**Performance rules (required)**

1. Scroll reveals: **`viewport.once = true`** only — do **not** reverse-animate on scroll up (jank).
2. Prefer **opacity + translateY** only for scroll/form motion (no scale on scroll).
3. Honor **`prefers-reduced-motion`** (`useReducedMotion()` + CSS).
4. Hero content can use mount `animate="visible"`; below-fold uses `whileInView`.

Shared API: `src/lib/motion.ts`

| Export | Use |
|---|---|
| `scrollViewport` | Shared once-true viewport |
| `sectionVariants` / `fadeUpVariants` / `scaleInVariants` | Section / block reveal |
| `staggerCardVariants` | Card grids |
| `formCardEntry` / `formFieldEntry` | Form page entry cascade |

---

## 8. Iconography

- **Default:** `lucide-react` (shadcn default).
- **Brand:** `TagIcon` for price/list/category/brand steps only.
- Keep stroke weight consistent; don’t mix icon libraries.

---

## 9. Layout structure

### Shell

```
<body dark base>
  <SiteNav fixed glass pill />
  <PageShell>          <!-- page-atmosphere + noise -->
    {page content}
  </PageShell>
</body>
```

- `PageShell` (`src/components/page-shell.tsx`) for home, join, success.
- Marketing max-width: `max-w-6xl` / `container-page`.
- Wide hero: up to `max-w-[100rem]` with 8-pt gutters.
- Fixed nav offset: always use `pt-nav` (or equivalent 112/128) on non-hero pages.

### Breakpoints

Tailwind defaults: `sm 640` · `md 768` · `lg 1024` · `xl 1280`.Business Analyst (BA)

### Dome motif (from original system)

Rounded “dome” section transitions are **optional** and rare (hero signature only). Current shipping UI uses full-bleed atmosphere instead of a white dome into the next section — don’t reintroduce dome on every section.

---

## 10. shadcn component conventions

Installed under `src/components/ui/`. Extend via **variants** and `className`, not forks.

### Button (`button.tsx`)

| Variant | Use |
|---|---|
| `default` | Solid primary red CTA |
| `secondary` | Neutral surface |
| `outline` | Bordered; light surfaces |
| `ghost` | Quiet actions |
| `destructive` | Destructive |
| `link` | Text link style |
| `glass` | Frosted secondary on dark |
| `glass-primary` | Frosted primary red on dark |

| Size | Height (8-pt) |
|---|---|
| `xs` | 24 |
| `sm` | 32 |
| `default` | 40 |
| `lg` | 48 |
| `xl` | 56 |
| `icon*` | 24–40 square |

Always **pill** (`rounded-4xl` / full). Always **`cursor-pointer`** (disabled → `not-allowed`).

### Card

- Prefer shadcn `Card` + `CardHeader` / `CardTitle` / `CardDescription` / `CardContent`.
- On dark pages: add `glass-panel*` / `glass-panel-focus`, transparent bg, light text.

### Input / Label / Select / Checkbox

- Use shadcn primitives.
- Dark form fields: `border-white/15 bg-white/5 text-white` (8-pt `h-10`/`h-12`, `px-4`).
- Select menus: dark popover (`#12101f`) with white text.

### Accordion (FAQ)

- shadcn Accordion; trigger **`cursor-pointer`**.
- Dark glass container; open state subtle `bg-white/5`.

### Separator / Badge

- Use shadcn; badges pill-shaped.

### ErrorMessage

- Custom but status-mapped; use for form API errors (not raw red text).

---

## 11. Interaction

Global (`globals.css` base layer):

- Pointer on: links, buttons, `[role=button]`, checkboxes, selects, labeled controls.
- `not-allowed` when disabled.

Chips / social pills: same pointer + hover border/bg lift.

---

## 12. Page patterns

### Landing (home)

1. Hero (full viewport art under fixed nav)  
2. How it works (glass cards)  
3. Social proof (live waitlist count)  
4. FAQ (glass accordion)  
5. Footer (links + builder signature)

### Join buyer / seller

- `PageShell` + spotlight + `Card` form  
- Staggered field entry (`formCardEntry` / `formFieldEntry`)  
- Submit: `glass-primary`  
- Errors: `ErrorMessage` + retryable label **Try again →**

### Success

- Same shell + spotlight  
- Success mark + glass card  
- CTA: `glass` → home  

### Waitlist social proof copy

Real count only (`prisma.waitlistSignup.count` / `GET /api/waitlist`).

| Count | Display |
|---|---|
| 0 | “Be first” + empty-state CTAs |
| 1 | Exact “1 student…” |
| 2–99 | Exact number |
| 100+ | Floor to 50s: `100+`, `150+`, `200+`, … |

Never invent inflated marketing numbers.

---

## 13. Content & signature

Footer **Built by** block:

| Network | Handle / link |
|---|---|
| X | [@emanncode](https://x.com/emanncode) |
| GitHub | [emanncode](https://github.com/emanncode) |
| WhatsApp | [09048801668](https://wa.me/2349048801668) |

---

## 14. Hero artwork

| Item | Path |
|---|---|
| Code constant | `HERO_ABSTRACT_SRC` in `src/components/landing/hero.tsx` |
| Default | `/public/hero-abstract.svg` |
| Production art | e.g. `/public/hero-abstract.webp` |

Search themes: dark purple fluid light trails, liquid chrome ribbons, glass refraction, cinematic violet smoke — **not green**. See `public/HERO_ABSTRACT_README.txt`.

---

## 15. Design export scripts (repo `/design`)

| File | Purpose |
|---|---|
| `generate-design-system.mjs` | shadcn-aligned variables + Button/Badge/Card frames → `shadcn.lib.pen` |
| `generate-complete.mjs` / `generate-landing.mjs` | Landing frames (nav, pill buttons, tag icon, fields, chips, accordion) |

When updating this doc, keep pen generators’ colors and component names aligned:

- Primary red, brand purple, neutrals, success/info  
- Pill buttons, 32px chips, tag icon mark  
- Nav: logo + Buyers / Sellers / FAQ + Join Waitlist  

---

## 16. Do / don’t

**Do**

- Use shadcn components + tokenized classes  
- Stay on the 8-point grid  
- Dark atmosphere + glass for public marketing pages  
- Red for action; purple for atmosphere  
- Scroll animate once; respect reduced motion  

**Don’t**

- Hardcode random hex outside tokens  
- Use non-8 layout spacing (12, 20, 28, 36…)  
- Fake social proof numbers  
- Opaque black strip behind the nav  
- Replay scroll-out animations on every scroll  

---

## 17. File map (implementation)

| Path | Role |
|---|---|
| `src/app/globals.css` | Tokens, glass, atmosphere, cursor base |
| `src/components/ui/*` | shadcn primitives + variants |
| `src/components/page-shell.tsx` | Shared atmosphere shell |
| `src/components/site-nav.tsx` | Fixed glass nav |
| `src/components/landing/*` | Marketing sections |
| `src/components/join-form.tsx` | Waitlist form (buyer/seller) |
| `src/lib/motion.ts` | Motion system |
| `src/lib/api-error.ts` | Typed API errors |
| `src/lib/waitlist-proof.ts` | Social proof copy from count |
| `components.json` | shadcn project config |

---

*Last aligned with shipping soldbay-web: dark glass marketing UI, 8-pt grid, Auth/waitlist, live social proof, builder signature.*
