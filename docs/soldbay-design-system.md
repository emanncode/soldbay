# Soldbay — Color & Typography System

Shopping app for Nigerian university students. Built on the Fraunces & Sora brand
kit, extended with semantic colors, a secondary color, tint/shade ramps, and dark
mode — all matched to the kit's original earthy, desaturated fingerprint.

---

## 1. Typography

**Fonts:** Fraunces (serif, display) + Sora (sans-serif, UI/body)
**Source:** Both are on Google Fonts — download the actual font files (woff2) from
fonts.google.com and self-host them in your app/admin bundles. No need to fetch
from Google's CDN at runtime.

### Where each font goes

| Surface                  | Font(s)                            | Why                                                                                                                                                                                                         |
| ------------------------ | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mobile app (Soldbay)** | Sora only                          | Product cards, prices, filters, stock counts — needs speed and legibility over personality. High-contrast display serifs (like Fraunces) lose their strokes at small UI sizes on mid-range Android screens. |
| **Admin dashboard**      | Sora only                          | Pure density/scanning — a display serif adds visual noise with no benefit here.                                                                                                                             |
| **Web landing page**     | Fraunces (headlines) + Sora (body) | The one surface with room to be slow and expressive — hero statement, brand storytelling. Marketing pages can afford it; product/admin screens can't.                                                       |

**Rule of thumb:** Sora is the one true UI font across app _and_ admin. Fraunces is
a marketing accent reserved for the landing page only — never in interface text.

### Type scale (from the kit, headings in Fraunces, everything else in Sora)

| Style     | Size / line-height / tracking |
| --------- | ----------------------------- |
| Display   | 72px / 1 / -0.035em           |
| Heading 1 | 52px / 1.08 / -0.03em         |
| Heading 2 | 38px / 1.15 / -0.02em         |
| Heading 3 | 28px / 1.2 / -0.01em          |
| Body      | 20px / 1.6 / normal           |
| Small     | 16px / 1.55 / normal          |
| Caption   | 13px / 1.5 / 0.04em           |

_(Only 400 Regular weight ships in the free kit preview — worth grabbing Fraunces'
full variable weight range from Google Fonts for the landing page headline to get
more of its personality; Sora at Regular is fine for UI as-is, but a Medium/Semibold
weight is worth adding for buttons and emphasis text.)_

---

## 2. Spacing Scale

4px base — finer control than 8px alone for dense marketplace grids (product
cards need tighter internal padding than, say, a settings screen).

| Token      | Value | Typical use                                 |
| ---------- | ----- | ------------------------------------------- |
| `space-1`  | 4px   | Icon-to-label gap, tight inline spacing     |
| `space-2`  | 8px   | Chip/tag padding, small gaps                |
| `space-3`  | 12px  | Card internal padding (compact)             |
| `space-4`  | 16px  | Standard card padding, list item spacing    |
| `space-5`  | 20px  | Section spacing within a screen             |
| `space-6`  | 24px  | Card-to-card gap in a feed/grid             |
| `space-8`  | 32px  | Section-to-section spacing                  |
| `space-10` | 40px  | Screen top/bottom padding                   |
| `space-12` | 48px  | Major layout breaks (landing page sections) |

---

## 3. Corner Radius

Leaning rounded, not sharp — matches Fraunces' soft serif shapes and reads
friendly/approachable for a student marketplace rather than premium/severe.

| Token         | Value | Use                                   |
| ------------- | ----- | ------------------------------------- |
| `radius-sm`   | 6px   | Chips, tags, small badges             |
| `radius-md`   | 10px  | Buttons, input fields                 |
| `radius-lg`   | 16px  | Product cards, modals                 |
| `radius-xl`   | 24px  | Bottom sheets, large hero cards       |
| `radius-full` | 999px | Avatar, pill buttons, toggle switches |

---

## 4. Elevation / Shadow System

Shadows behave differently by mode — a drop shadow barely reads on a dark
background, so dark mode leans on a lighter Surface step + a thin border instead
of shadow alone. This is the direct fix for cards not lifting off the page in a
feed (flagged earlier).

**Light mode** (shadow color is a low-opacity tint of Primary, not pure black —
keeps shadows warm rather than generic):

| Token         | Value                            | Use                                    |
| ------------- | -------------------------------- | -------------------------------------- |
| `elevation-0` | none                             | Background itself                      |
| `elevation-1` | `0 1px 2px rgba(45,58,31,0.06)`  | Resting product card                   |
| `elevation-2` | `0 2px 8px rgba(45,58,31,0.10)`  | Raised card (hover/pressed), dropdowns |
| `elevation-3` | `0 8px 24px rgba(45,58,31,0.16)` | Modals, bottom sheets                  |

**Dark mode** (elevation via Surface lightness step + border, not shadow):

| Token         | Background                   | Border                                   | Use                                                 |
| ------------- | ---------------------------- | ---------------------------------------- | --------------------------------------------------- |
| `elevation-0` | `#1A1F14`                    | none                                     | Background itself                                   |
| `elevation-1` | `#242A1D` (existing Surface) | `#3F4635` (existing Border)              | Resting product card                                |
| `elevation-2` | `#2C331F` _(new)_            | `#4A523E` _(new)_                        | Raised/pressed state                                |
| `elevation-3` | `#333B24` _(new)_            | glow: `0 0 0 1px rgba(199,181,138,0.08)` | Modals — faint Accent-tinted glow instead of shadow |

`elevation-1` + `radius-lg` (16px) together are the baseline product-card
treatment that should solve the flat-feed issue in both modes.

---

## 5. Component States

Button, input, and interactive states — built entirely from existing tokens, no
new colors introduced.

### Button (primary)

| State                 | Treatment                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| Default               | Primary bg, on-primary text `#F1EEE4`                                                                       |
| Pressed / Active      | Primary ramp `700` (`#2C381E`) instead of base `500`                                                        |
| Disabled              | Primary ramp `200` (`#CDDBBD`) bg + Border color text — deliberately low-contrast to read as "not tappable" |
| Loading               | Same as default, swap label for spinner in on-primary color                                                 |
| Focus (keyboard/a11y) | 2px ring in Accent (`#B8A678`), 2px offset — visible in both modes                                          |

### Button (secondary / outline)

| State    | Treatment                                                 |
| -------- | --------------------------------------------------------- |
| Default  | Transparent bg, 1px Border in Primary color, Primary text |
| Pressed  | Surface bg fill (subtle), same border/text                |
| Disabled | Border color outline, Border color text                   |

### Input / form field

| State    | Treatment                                                                                                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Default  | Surface bg, Border color outline, `radius-md` (10px)                                                                                                                                        |
| Focused  | Border switches to Primary, 1px → 2px                                                                                                                                                       |
| Filled   | Same as default, no special treatment                                                                                                                                                       |
| Error    | Border + helper text switch to **Error** semantic color (`#9C453A`) — reused directly for form validation (note: the product card's "Sold" state does _not_ use this color — see Section 6) |
| Disabled | Surface bg at ~60% opacity, Border color text                                                                                                                                               |

---

## 6. Product Card States — Sold / Unavailable

Same structural skeleton on every card: 1:1 photo → title → price → badge row,
so all cards interchange seamlessly in a grid. Only the visual treatment
changes. (The pricing/verification variants live one section to the right — see
Sections 11 & 10 — rather than duplicating full cards here.)

### 6a. Sold / Unavailable

The sold state overlays independently — it does not replace the price.

| Aspect               | Decision                                                                                                                                                                                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Price behavior       | Price stays visible underneath, at reduced opacity — not replaced/removed. Lets buyers still see what an item sold for (price anchoring), and avoids conditional layout logic (card structure doesn't change between available/sold, only its visual treatment does)                                               |
| Placement            | A straight bar across the top of the product photo — not a small corner badge. Needs to read as obviously unavailable at a glance while scrolling a feed. Stamp copy **and icon** still being picked (was "SOLD"; flagging text vs icon combo).                                                                   |
| Whole-card treatment | Entire card (photo + price + title) desaturated / reduced opacity (~75%). It recedes against available listings in the same grid.                                                                                                                                                                          |
| Color                | Derived from the neutral Border/Surface family (Border `#D8D7CC` background + Primary text on the stamp) — **not** the Error semantic color. Error means "something's wrong"; sold means "administrative, no longer available." Using Error here would incorrectly imply a problem rather than a normal state         |
| Badge                | Verified badge remains visible (unchanged) — sold status is a property of the listing, not a reflection on the seller's trustworthiness                                                                                                             |

**Still open:** exact stamp copy / icon.

---

## 7. Product Photography Guidelines

Photos are the product on a marketplace — inconsistent treatment (mixed aspect
ratios, no placeholder) makes even a well-designed app feel unfinished.

| Decision                             | Recommendation                                                                                                          |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Aspect ratio (grid/feed)             | 1:1 square — packs evenly in a scrolling grid, matches the de facto marketplace standard (Depop, Vinted, Jiji)          |
| Aspect ratio (listing detail page)   | 4:5 portrait allowed — room for full-length shots (clothing, furniture)                                                 |
| Corner treatment                     | `radius-lg` (16px), consistent with product cards                                                                       |
| Border/shadow on photo               | None directly on the image — let the card's `elevation-1` do the lifting, avoids double-framing                         |
| Background behind non-square uploads | Neutral Surface-colored letterbox/backdrop, since sellers won't shoot on consistent backgrounds                         |
| No-image / placeholder state         | Flat Surface-colored tile + custom icon (e.g. bag/tag in Border color) — never a generic broken-image graphic           |
| Multi-photo indicator                | Small pill/dot indicator (`radius-full`) in the image's bottom corner for 2+ photos                                     |
| Compression                          | Enforce max upload size + client-side compression before upload — real cost/UX issue given Nigerian mobile data pricing |

---

## 8. Grid & Breakpoints

Mobile app doesn't need much breakpoint complexity; web landing + admin do.

| Breakpoint | Width       | Use                                                          |
| ---------- | ----------- | ------------------------------------------------------------ |
| `mobile`   | < 480px     | Mobile app (floor, not really breakpoint territory)          |
| `tablet`   | 480–1024px  | Web landing on tablet, admin on smaller laptop windows       |
| `desktop`  | 1024–1440px | Standard web landing + admin                                 |
| `wide`     | > 1440px    | Large monitors — cap content width, don't stretch full-bleed |

| Grid                    | Columns                                           | Gutter           |
| ----------------------- | ------------------------------------------------- | ---------------- |
| Mobile app product grid | 2 columns                                         | `space-4` (16px) |
| Web landing             | 12-column                                         | `space-6` (24px) |
| Admin dashboard         | 12-column (often sidebar + flexible content area) | `space-6` (24px) |

**Open decision:** 2-column product grid is the safe default; 3-column is possible
on larger phones for a denser "browse fast" feel, but price/title text gets tight
under 3 columns at small widths — test with real product photos before locking in.

---

## 9. Empty States & Illustration Style

| Screen                    | Treatment                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| Empty cart                | Custom illustration + short Sora copy + CTA ("Browse listings")                               |
| No search results         | Same illustration family, lighter tone — "No results for 'x'" + suggestion to broaden filters |
| No messages yet           | Illustration + action prompt (e.g. "Message a seller to get started")                         |
| No listings from a seller | Text + icon only — lower-stakes screen, doesn't need a full illustration                      |

**Style guidance:** simple line illustrations in Primary/Accent colors — not full-
color flat illustration or 3D/gradient styles. Keeps this visually consistent with
the icon system rather than introducing a fourth visual language; treat it as an
extension of the custom-icon decision, not a separate system.

---

## 10. Trust & Verification Visual Language

Important specifically for a student marketplace — buyers need to feel safe
transacting with strangers on campus.

| Element                | Treatment                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Verified seller badge  | Small badge, Accent color + custom checkmark-in-shield icon (`shield-check` from Phosphor), consistent placement next to seller name (listing cards, profile, chat). Pill shape, 11px Sora, `Accent` fill + `on-primary` text |
| Seller rating          | Star icon (Phosphor, Fill weight) + numeric rating on cards; full breakdown only on seller profile — avoids visual noise             |
| "New seller" indicator | **Neutral tag, Secondary color background** — being new isn't a red flag and shouldn't look like one |
| Campus/location tag    | Small pill, Border-color outline, neutral                                                                                            |

---

## 11. Price & Currency Formatting

| Case             | Format                                                                                                                                                                                                                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Standard price   | `₦` prefix, no space, comma thousands separator — `₦15,000`                                                                                                                                                                                                                                  |
| Discounted price | Original price struck through in Border/muted color; new price bold in **Accent ramp `400` (`#96824F`)** — not base Accent (`500`), to avoid overusing the brand accent given how common discounts will be in a marketplace; not Error, since a discount is a positive signal, not a warning |
| "Negotiable" tag | Small pill, Secondary color — visually distinct from the price itself                                                                                                                                                                                                                        |
| Free item        | Replace price with "Free" label in Success color — one of the few places Success genuinely applies to a price                                                                                                                                                                                |

---

## 12. Notification & Badge System

| Element                 | Treatment                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| Cart count              | Small circular badge (`radius-full`), Error color background — standard convention, draws the eye        |
| Unread messages         | Same treatment on the messages tab icon                                                                  |
| New listing indicator   | Subtle dot (no number) on relevant category/tab — less urgent than a count                               |
| Push notification style | Platform-level, out of scope here — keep icon + accent color matched to in-app treatment for consistency |

---

## 13. Icon System

**Primary set:** Phosphor Icons — replaces the brand kit's default (Feather),
which is fine as a base but doesn't offer the weight range Phosphor does.
MIT-licensed, free.

**Active/inactive state pattern:**

| State                                                       | Weight           |
| ----------------------------------------------------------- | ---------------- |
| Inactive (nav, tabs, toggleable icons)                      | Regular or Light |
| Active (selected tab, active toggle — favorite, cart, etc.) | Bold or Fill     |

**Custom icons — reserved for:**

- Marketplace-specific concepts with no good generic match: verified campus
  seller, sold/unavailable stamp, campus pickup point, delivery-on-campus
- Category icons for product taxonomy (electronics, fashion, textbooks, dorm
  essentials) — a good place for brand personality since these are glanced at
  repeatedly on the home/category screen, not read for precise meaning like a
  settings icon

**Rule of thumb:** Phosphor for all UI chrome and interactive icons (needs to be
instantly recognizable, not distinctive). Custom only where the concept is
Soldbay-specific or where personality genuinely helps (category art).

---

## 14. Core Colors — Light & Dark

| Role                    | Light mode | Dark mode | Notes                                                           |
| ----------------------- | ---------- | --------- | --------------------------------------------------------------- |
| Background              | `#F4F1E8`  | `#1A1F14` | Dark bg is near-black but olive-tinted, not pure black          |
| Text / Primary          | `#2D3A1F`  | `#F1EEE4` | 14.5:1 contrast in dark mode                                    |
| Accent                  | `#B8A678`  | `#C7B58A` | Lightened ~6% in dark mode so it isn't swallowed by the dark bg |
| Surface (cards, modals) | `#E8E2D0`  | `#242A1D` | Where product cards sit on top of Background                    |
| Border                  | `#D8D7CC`  | `#3F4635` | Subtle in both modes                                            |

**Naming clarification (locked):** `foreground` (alias `text`) = the dark olive `#2D3A1F` in light mode and cream `#F1EEE4` in dark mode — it is the color pair **that text renders in** everywhere by default. `primary` (alias `button`) = the CTA-fill green `#5A743E` (ramp 500) in light mode and `#8BA670` in dark mode — **not** the text default, not a synonym for "important". Pressed state → ramp 700 (`#2C381E`).

**Marketplace note:** the Background→Surface lightness gap is fairly subtle in both
modes (~7% light, ~4% dark) — fine for editorial content, a little flat for a dense
scrolling product feed. Consider widening this gap or adding card shadow/border
weight if cards feel like they aren't lifting off the page once real content is in.

---

## 15. Secondary Color

Derived from Primary's own hue (89°) at a lighter weight, rather than introducing a
third brand color — keeps the two-color discipline intact.

| Role      | Hex       | Contrast on `#F4F1E8` |
| --------- | --------- | --------------------- |
| Secondary | `#5C7048` | 4.81 : 1 (AA)         |

Use for secondary buttons, subheadings, tag/pill backgrounds paired with dark text.

---

## 16. Semantic Colors

Each has a text/icon version (AA-passing on the cream background) and a light
surface tint (for badges, alerts, chips), matched to Surface's own lightness range.

| Role             | Text / Icon | Contrast on `#F4F1E8` | Surface tint |
| ---------------- | ----------- | --------------------- | ------------ |
| Success (green)  | `#2E7A6E`   | 4.51 : 1              | `#D9E8E1`    |
| Info (blue)      | `#4D6F89`   | 4.71 : 1              | `#DDE4E9`    |
| Warning (orange) | `#875931`   | 5.31 : 1              | `#EEE2D8`    |
| Error (red)      | `#9C453A`   | 5.59 : 1              | `#EEDFDD`    |

**Hue reasoning:**

- Success shifted to teal (~170°) — clearly distinct from Primary's yellow-green (89°) so "brand" and "success" don't collide, even at small badge/icon size.
- Info is a dusty slate blue (206°) — not a saturated tech-blue, keeps the natural/editorial mood.
- Warning is a burnt terracotta (28°) — sits tonally between Accent and Error.
- Error is a muted brick/rust (7°) — same saturation range as the rest of the kit, not fire-engine red.

**Marketplace-specific states to design separately** (not yet built — flagging for
next pass):

- **Sold / Unavailable** — its own state, distinct from generic Error; a desaturated grey-red or a tone of Border/neutral usually reads better as "no longer available" than an alarming red.
- **Verified seller / campus-verified** — a trust signal, likely an extension of Accent rather than one of the four semantics above.

---

## 17. Extended Palette (tints & shades)

Ramps for the two hues that need scaling for hover/active/disabled states.

**Primary ramp (olive, hue 89°)**

| 50        | 100       | 200       | 300       | 400       | 500 (base) | 700       | 900       |
| --------- | --------- | --------- | --------- | --------- | ---------- | --------- | --------- |
| `#F2F6EE` | `#E6EDDE` | `#CDDBBD` | `#A7C18B` | `#81A659` | `#5A743E`  | `#2C381E` | `#1A2112` |

**Accent ramp (tan, hue 43°)**

| 50        | 100       | 200       | 300       | 400       | 500 (base) | 700       | 900       |
| --------- | --------- | --------- | --------- | --------- | ---------- | --------- | --------- |
| `#F6F4EE` | `#EDE9DE` | `#DCD3BC` | `#CABD9B` | `#96824F` | `#B8A678`  | `#645735` | `#3C3420` |

_(500 is the kit's original Accent value — kept as the anchor point.)_

---

## 18. Dark-Mode Semantic Colors

Lightened versions of the semantic set for legibility on the dark background — a
direct port of the light-mode text colors would fail contrast.

| Role    | Hex       | Contrast on `#1A1F14` |
| ------- | --------- | --------------------- |
| Success | `#7BC4B6` | 8.33 : 1              |
| Info    | `#86A7C1` | 6.65 : 1              |
| Warning | `#CF9B6E` | 6.85 : 1              |
| Error   | `#CC7266` | 4.93 : 1              |

---

## 19. Still Open / Not Derivable from Hex Values

- **Color psychology / cultural meaning** — worth a manual sanity check with actual
  students; olive + tan + this semantic set skews earthy/grounded, no obvious
  cultural red flags for a Nigerian audience, but that's a judgment call.
- **Real lighting conditions** — test on an actual mid-range Android screen in
  daylight/glare, and run the palette through a color-blindness simulator (Stark,
  Coblis) before locking anything in.
- **Sold/Unavailable state** — ✅ Resolved. Structure (Section 6a) and treatment
  decided. Only the exact stamp copy / icon still needs picking.
- **Verified-seller** — ✅ Resolved. Visual treatment already decided (Section 10:
  Accent badge + `shield-check` icon), just not yet built as a component.
- **Success vs. Primary contrast** — mitigated: Success shifted to teal
  (`#2E7A6E` light / `#7BC4B6` dark, hue ~170°) so it no longer reads as a second
  shade of Primary's olive. Update Section 16's Success values to match.
- **Background→Surface contrast for dense product feeds** — flagged above, may need
  widening once real product cards are in front of you.

---

## 20. Motion & Animation Principles

Lightweight on purpose — motion should make the app feel responsive, not decorative.

| Element              | Guidance                                                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Duration             | 150–200ms for micro-interactions (button press, toggle); 250–300ms for screen transitions. Slower than 300ms starts to feel laggy |
| Easing               | Ease-out for things entering/appearing; ease-in-out for things moving between states                                              |
| Screen transitions   | Standard platform push/pop (iOS slide, Android native) — no custom transitions for v1, not worth the engineering cost             |
| Loading states       | Skeleton screens (Surface-colored blocks in the shape of content) for product grids/lists — not spinners                          |
| Pull-to-refresh      | Standard platform pattern, tinted in Primary color                                                                                |
| Card press feedback  | Subtle scale-down (~98%) or elevation drop on press                                                                               |
| Success confirmation | Small, quick checkmark micro-animation (e.g. "added to cart") — not a full-screen celebration                                     |

---

## 21. Tone of Voice & Microcopy

**v1 decision: English only, across all UI.** Pidgin is intentionally deferred —
planned as an optional toggle in a future version (v2+), letting users choose a
touch of Pidgin flavor vs. strictly English, rather than being baked in or mixed
in by default. Keeps v1 simple and unambiguous while leaving room to add it later
without a rework.

| Context             | Recommendation                                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Base language       | Standard English for all core UI (buttons, labels, errors)                                                                           |
| Personality moments | Light, warm, a little informal — "Your cart's empty" not "No items in cart," "Message the seller" not "Initiate contact with vendor" |
| Error messages      | Specific and actionable, never blame the user — "That link's expired, try again" not "Invalid request"                               |
| Empty states        | Already covered in Section 8 — friendly, action-oriented copy                                                                        |
| Future (v2+)        | Optional Pidgin toggle — user-selected, not default; scope (marketing copy only vs. full UI) still to be decided when it's built     |

---

## 22. App Icon / Splash Screen

| Element           | Guidance                                                                                                                                                                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App icon          | Must work at 40×40px — simple mark/symbol in Primary on Background (or inverted), not fine detail or a full wordmark                                                                                                                           |
| Splash screen     | Logo mark centered on Background (light) / dark Background (dark mode aware), no spinner needed if launch is fast. One acceptable place for a touch of Fraunces (e.g. wordmark beneath the mark) since it's a one-time, non-interactive moment |
| Platform variants | iOS: icon pre-masked to their rounded-square shape (no radius baked in, iOS applies its own mask). Android: adaptive icon with separate foreground/background layers                                                                           |
