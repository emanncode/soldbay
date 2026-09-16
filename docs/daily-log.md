# Soldbay — Daily Log

## 2026-09-16 — Mobile: Project Logo & App Icon Update (iOS, Android Foreground, Design System)

- **Screen & Component Library Reset (`soldbay-app`)**:
  - Cleared all non-active, legacy screens and component templates from `soldbay-app/src/components/` and `soldbay-app/src/app/`, resetting the app to a clean-slate state.
  - Reset `soldbay-app/src/app/index.tsx` into a clean interactive showcase screen.
  - Updated root layout `_layout.tsx` to mount the clean root navigation.
- **Color Design System Alignment**:
  - Verified and strictly aligned all color tokens across `design/design.pen`, `docs/soldbay-design-system.md` (Sections 4, 14–18), `soldbay-web/src/app/globals.css`, and `soldbay-app/src/theme/colors.ts`.
  - Added `darkMode: "class"` and dark surface/border variants to `soldbay-app/tailwind.config.js`.
  - Exposed dark elevation tokens (`surfaceModal: "#333B24"`, `borderElevated: "#4A523E"`) in `soldbay-app/src/theme/colors.ts`.
- **Custom Icon System Implementation (`soldbay-app/src/components/icons/`)**:
  - Built custom React Native SVG icons based on `design/design.pen` vectors:
    - `VerifiedShieldIcon` (custom checkmark-in-shield path geometry, ID: `ZXAqa`).
    - `SoldStamp` (administrative unavailable stamp badge with `-4°` tilt, IDs: `oAzqV`/`j2Uor`).
    - `CampusPickupIcon` (campus safe meetup pin with mortarboard cap, ID: `EECdL`).
    - `CampusDeliveryIcon` (3D parcel on-campus courier icon, ID: `Owa0b`).
    - `CategoryIcons` (brand taxonomy icons for Textbooks, Electronics, Fashion, Dorm).
    - `EmptyCrateIllustration` (bespoke line-art crate shelf with discovery sparkles, IDs: `pt_filt_crate`, `pt37ac8`).
    - `SoldbayMark` (circular medallion mark).
- **Deleted Legacy & Expo-Generated Icons**:
  - Completely removed all default/old Expo icons from `soldbay-app/assets/`: `assets/expo.icon/`, `assets/images/tabIcons/`, `assets/images/expo-badge.png`, `assets/images/expo-badge-white.png`, `assets/images/expo-logo.png`, `assets/images/react-logo*.png`, and `assets/images/tutorial-web.png`.
  - Ensured all app icons reference exclusively official Soldbay design system assets.
- **Project Logo & App Icon Specifications (Section 22 & `design/design.pen`)**:
  - Implemented the official project logo mark and app icon exports:
    - **iOS App Icon (`EXPORT — iOS Icon`, 1024×1024)**: Cream background (`#F4F1E8`), Fraunces SemiBold "S" glyph in Dark Olive (`#2D3A1F`, 580px font size at `x: 196, y: 160`), signature Tan Accent period dot (`#B8A678`, 72×72px at `x: 550, y: 655`).
    - **Android Adaptive Icon Foreground (`EXPORT — Android Foreground`, 512×512)**: Transparent background, Fraunces SemiBold "S" in Cream (`#F4F1E8`, 290px font size at `x: 98, y: 80`), Tan Accent dot (`#B8A678`, 36×36px at `x: 275, y: 328`).
    - **Android Adaptive Icon Background (`EXPORT — Android Background`, 512×512)**: Solid Dark Olive (`#2D3A1F`). Updated `app.json` `adaptiveIcon.backgroundColor` to `#2D3A1F` (was `#E6F4FE`).
    - **Android Themed Monochrome Icon (512×512)**: Pure white glyphs on transparent background for Android 13+ Material You themed icons.
    - **Web Favicon (64×64)**: Clean scaled version of the signature mark.
- **Font & Asset Integration**:
  - Downloaded and registered `Fraunces-SemiBold.ttf` in `soldbay-app/assets/fonts/`.
  - Loaded `Fraunces-SemiBold` in `soldbay-app/src/app/_layout.tsx` and configured `fontFamily.fraunces` in `tailwind.config.js`.
  - Generated all 5 production PNG assets (`icon.png`, `android-icon-foreground.png`, `android-icon-background.png`, `android-icon-monochrome.png`, `favicon.png`) with Pillow using the exact pixel coordinates from `design.pen`.
- **Reusable Component & Index Showcase**:
  - Created `SoldbayAppIcon` (`src/components/icons/soldbay-app-icon.tsx`) supporting `variant="ios"`, `variant="android"`, and `variant="monochrome"`.
  - Updated `soldbay-app/src/app/index.tsx` to render the interactive showcase for the project logo variants and custom icons.
- **Web Logo & Favicon Assets (`soldbay-web`)**:
  - Generated multi-resolution `favicon.ico` (16×16, 32×32, 48×48) in `soldbay-web/public/` and `soldbay-web/src/app/` using the new Fraunces SemiBold "S." project logo mark.
  - Generated `apple-touch-icon.png` (180×180), `icon.png` (64×64), and `favicon.png` (64×64).
  - Created vector SVG assets: `soldbay-icon.svg` (light) and `soldbay-icon-inverted.svg` (dark/inverted).
  - Updated `soldbay-web/src/components/brand-logo.tsx` to export `BrandIcon` and support standalone mark rendering (`variant="mark" | "mark-inverted"`).
- **Verification**:
  - `tsc --noEmit` on both `soldbay-app` and `soldbay-web` passed with 0 errors.
  - `expo lint` on `soldbay-app` passed with 0 errors and 0 warnings.

---

## 2026-09-15 — Frontend: Feed / Browse screen implementation in soldbay-app (Linear EC-28)

Implemented the Feed / Browse screen and component system in `soldbay-app`, bringing the
approved `design/design.pen` specifications and Linear **[EC-28](https://linear.app/emanncode/issue/EC-28/tier-1-17-feed-browse-home)**
to the React Native / Expo application:

- **Simplified Header (`src/app/buyer/home.tsx`)**:
  - Contains only the `SearchBar` (`flex-1`) and a 44×44px Notification Bell button with an Accent
    gold unread dot indicator.
  - Completely removed the wordmark logo, AAUA campus name display, message icon, and cart button.
- **Pinned Category & Filter Chip Row**:
  - Horizontal chip list with leading icons: "Filters" count trigger chip, "All" chip (secondary tone),
    and category pills ("Textbooks", "Tech", "Fashion", "Dorm", etc.) with Accent gold active styling.
  - Enhanced `FilterChip` (`src/components/filter-chip.tsx`) to support leading icons, badge counts,
    and tone pairings (`variant: "secondary" | "accent"`).
- **Product Card (`src/components/listing-card.tsx`)**:
  - Updated card geometry to 16px radius (`rounded-lg`) and 1:1 square photo aspect ratio.
  - Verified badge row: `[checkmark shield icon] [seller business name]` in Sora 12px caption, single-line
    with ellipsis truncation (`numberOfLines={1}`, `ellipsizeMode="tail"`).
  - Discounted state: strikethrough original price and highlighted sale price.
  - Sold state: overlay `SOLD` stamp banner and `opacity: 0.75` on entire card container.
  - No photo state: surface placeholder tile with centered Tag icon.
- **Loading Skeleton (`src/components/skeleton-card.tsx`)**:
  - Created reusable skeleton blocks matching the exact geometry of `ListingCard` (1:1 image block,
    two title lines, price line, seller badge dot/bar) to eliminate layout shift during loading.
- **Infinite Scroll with Cursor Pagination**:
  - Backed by backend cursor pagination (`getListings({ cursor, limit: 16 })`).
  - Native `FlatList` with 2 columns (`numColumns={2}`, `columnWrapperStyle={{ gap: 16 }}`).
  - `onEndReached` trigger with `onEndReachedThreshold={0.5}`, loading indicator footer, and end-of-feed
    milestone notice (*"You've reached the end of AAUA listings"*).
  - Resilient mid-scroll retry banner (*"Couldn't load more items · Tap to retry"*).
  - Primary-tinted `RefreshControl` pull-to-refresh.
- **Buyer-Only Empty States**:
  - Filtered to zero: *"No listings found"* with promoted primary CTA button *"Clear filters"*.
  - Genuinely empty campus feed: *"No listings yet"* + *"Check back soon for new listings"* with no button.
- **4-Tab Buyer Navigation (`src/lib/tabs.tsx`)**:
  - Switched buyer tabs to `Browse` (active) · `Search` · `Orders` · `Profile`. Removed `+`/Sell and `Wallet`.
- **Backend Disconnection & Standalone Mock Layer (`src/lib/mock-data.ts`, `src/lib/api.ts`)**:
  - Fully disconnected the mobile app from the live backend server by default (`USE_MOCK_DATA = true`, `EXPO_PUBLIC_USE_MOCKS=true`).
  - Added realistic campus mock data (Textbooks, Tech, Fashion, Dorm) with verified student businesses ("Kemi Thrift Store", "Campus Gadgets Hub", "AAUA Book Nook", "Ade & Sons Dorm Store"), discounted items, sold items, and no-photo placeholders.
  - Mock API implements realistic client-side category filtering, search query filtering, cursor-based pagination, and simulated latency for reviewing skeleton loading and empty states offline.
- **Removed Deprecated & Non-Relevant Screens from `soldbay-app`**:
  - Deleted all legacy/unrelated screen files (`buyer/cart.tsx`, `buyer/wallet.tsx`, `buyer/checkout`, `buyer/search.tsx`, `buyer/listing-detail.tsx`, `seller/`, `handoff/`, `forgot-password/`, `orders/`, `profile/`, `login.tsx`, `signup.tsx`, `select-role.tsx`, `select-university.tsx`).
  - Preserved strictly the core screens we built and are using today: `buyer/home.tsx` (the Feed / Browse screen), `index.tsx` (direct redirect to `/buyer/home`), `_layout.tsx`, and `global.css`.
  - Updated `_layout.tsx` Stack to register only `index` and `buyer/home`.
- **Validation**:
  - `expo lint` passed with 0 errors and 0 warnings.
  - TypeScript typecheck (`tsc --noEmit`) passed with 0 errors.

---

## 2026-09-15 — Design: Mobile Feed / Browse screen assembly (Linear EC-28)

Completed the design and full screen assembly for the Soldbay Feed / Browse mobile
experience in `design/design.pen`, fulfilling the design checklist of Linear issue
**[EC-28: [Tier 1 · 1/7] Feed / Browse (Home)](https://linear.app/emanncode/issue/EC-28/tier-1-17-feed-browse-home)**
and strictly adhering to `docs/soldbay-design-system.md`.

- **Simplified Feed Header**: stripped of peripheral branding to maximize browsing
  density and speed. The header contains ONLY the search bar (`width: fill_container`,
  height 44, Phosphor `magnifying-glass`, `$surface` + `$border`) and the notification
  bell button (`44×44px` with `$accent` unread dot). Entirely removed: the "Soldbay"
  wordmark, the campus display, the message icon, and the cart button.
- **Campus Immutability Confirmed**: campus is selected once at student signup/matriculation
  and is strictly fixed and non-editable. It does not display anywhere in the Feed/Browse
  header or feed screens; it only ever appears on the Profile screen (also non-editable).
- **Shared Product Card Component & Seller Business Name**: updated the locked Product
  Card component across all states (`default`, `discounted`, `sold`, `no-photo`) and both modes:
  - Added seller's business name next to the 14px verified checkmark shield icon in the badge row
    below the price (`layout: horizontal`, `gap: 5px`, `alignItems: center`, `width: fill_container`).
  - Typography: Sora (`$font-ui`), Caption size (`12px`), Regular weight (`fontWeight: normal`),
    Primary text color (`$text-primary`). Styled subtly to avoid competing with the 15-16px bold price above.
  - Truncation Rule: strictly single line (`textGrowth: fixed-width`, `width: fill_container`). Truncates
    with ellipsis (`…`) if the business name exceeds available column width — never wraps to a 2nd line,
    preserving identical card height across the grid.
  - Sold State Desaturation: card frame `opacity: 0.75` ensures the business name text desaturates
    at 75% alongside the photo, title, and price.
  - Shared Context Verification: confirmed and demonstrated at the exact same 171px column width
    across both Feed/Browse and Search Results (`Screen/Search — Results` added to canvas).
- **Pinned Category & Filter Chip Row**: pinned directly under the simplified header
  row using Phosphor icons (`14×14`, 400 inactive, bold active), `radius-full` pills,
  and established color tones:
  - Active "All": Secondary olive fill (`$secondary` `#5C7048` light / `#8BA670` dark)
    with on-primary text `#F1EEE4` / `#1A1F14`.
  - Active category filter: Accent gold fill (`$accent` `#B8A678` light / `#C7B58A` dark)
    with contrasting text `#2D3A1F` / `#1A1F14`.
  - Inactive chips: Surface fill (`$surface`) + 1px Border outline (`$border`) +
    `$text-secondary` text and icons.
  - Filter trigger chip: Phosphor `faders` icon, "Filters" label, and active count badge.
- **4-Tab Buyer Navigation**: replaced legacy 5-tab bar with a strict 4-tab buyer-only
  nav: `Browse` (active) · `Search` · `Orders` · `Profile`. Completely removed the `+` / Sell
  FAB (posting is strictly gated to verified sellers, never injected into buyer browse)
  and removed `Wallet` (buyers have no wallet destination).
- **Buyer-Only Empty State CTAs (Section 9 & EC-28)**:
  - Completely removed the "Post a listing" button and eliminated all seller-recruiting copy
    (e.g., *"Be the first student on your campus to sell"*), as buyers have no capability to sell.
  - **Variant A (Filtered Empty State)**: when active filters or search yield 0 results, displays
    *"No listings found"* and promotes **"Clear filters"** to the primary button position
    (`$soldbay-primary`, 10px radius, Phosphor `arrow-clockwise` icon, high contrast `#F1EEE4`/`#10150C` text).
    Removed the secondary text link.
  - **Variant B (Genuinely Empty Campus Feed)**: when the campus feed itself has 0 listings with
    no filters applied, displays *"No listings yet"* and copy *"Check back soon for new listings"*
    with **no actionable button** (since there is nothing a buyer can action).
  - Maintained Section 9 custom vector line illustration in Primary and Accent colors only (crate shelf
    line art in a 96×96px Surface medallion).
- **Loading Skeleton Screens (Section 20)**: Surface-colored blocks matching the
  exact geometry of the product grid (image block, two title lines, price line,
  and seller badge dot/bar) to eliminate layout shift — no spinners.
- **Pull-to-Refresh Treatment (Section 20)**: standard platform pull pattern with
  Primary-tinted spinner arc (`#5A743E` light / `#8BA670` dark) inside an
  `elevation-2` Surface medallion, paired with status microcopy ("Updating fresh drops…").
- **Full Assembled Screens (Light & Dark Mode)**: built ten complete 390×844 mobile
  screen frames on the canvas (`x: 6200` to `x: 8310`) complete with Status Bar, Simplified Header
  (search + notification only), Pinned Chip Row, Feed Body, and 4-Tab Buyer Nav Bar:
  - Light (`y: 200`): Populated, Pull-to-Refresh, Loading Skeleton, Filtered Empty, Empty Feed (No Listings).
  - Dark (`y: 1080`): Populated, Pull-to-Refresh, Loading Skeleton, Filtered Empty, Empty Feed (No Listings).
- **Component System Gallery & Specs**: placed isolated component breakdown board
  at `x: 1320, y: 780` (with side-by-side empty state variants) and Section 23 Mobile Feed Specifications
  board at `x: 6200, y: 1960` (width 2110px). Documented in `feed-screen-design-spec.md`.

---

## 2026-09-14 — Buyer waitlist: "Other" category

- **`components/waitlist-form.tsx`**: the buyer Interested Categories chip row
  now ends with an **"Other"** chip. When selected, a free-text input appears
  (placeholder *"Tell us what category you're interested in"*). On submit, the
  free-text value is appended to the `categories` array; if left empty it's
  silently dropped (no empty strings saved). `otherCategory` is cleared when
  the chip is unselected or when the user clicks "Join the other side" from
  the success state.
- Committed `7eb6c1c`, pushed to `origin/master`.

---

## 2026-09-14 — Copy clean-up, asset cleanup & FAQ expansion

Follow-on pass after the landing polish: removed every em dash from rendered
copy, deleted the old placeholder assets (and the broken references pointed at
them), trimmed a mobile nav detail, then expanded the FAQ into the resolved
post-pickup experience. Committed as `b8bbac1`, `30366ab`, `b03b932`,
`a936f52` and pushed to `origin/master` (Vercel prod).

### All em dashes removed from rendered copy

- User rule: **zero `—` in any rendered output** (remaining occurrences may
  only live inside code comments).
- Fixed the three called-out spots — `layout.tsx` title (`Soldbay | Buy and
  sell on campus`), `social-proof.tsx` ("goes live. You&rsquo;ll be first
  in."), `faq-accordion.tsx` free answer ("completely free. Buyers never
  pay…") — then an actual grep of rendered output surfaced **six more**:
  both waitlist-proof subtitles (`lib/waitlist-proof.ts`), the question-form
  card description, the FAQ delivery answer, and two strings in
  `lib/api-error.ts`.
- Verified clean: grep for the `—` glyph across `components/` + `lib/` now
  hits comments only. `tsc --noEmit` clean.
- Committed `b8bbac1`.

### Placeholder asset cleanup

- Deleted the legacy placeholders and dead references: `folder structure.md`,
  `soldbay-app/assets/logo*.{png,svg}`, `soldbay-web/public/logo*.{png,svg}`,
  `favicon.ico`, `hero-abstract.svg` + its `HERO_ABSTRACT_README.txt`.
- Repositioned the accent dot on the kept wordmark SVGs (accent `cx` 462→241,
  `cy` 28→22) so it sits tight against the trailing "y", matching the inline
  `BrandLogo` lockup geometry.
- Fixed references the deletion exposed:
  - `login/page.tsx` no longer `<Image src="/logo.png">` — now
    `<BrandLogo variant="inverted" className="relative z-10 mb-8 h-22 w-auto" />`.
  - `soldbay-app/app.json` splash → `./assets/images/icon.png` on cream
    `#F4F1E8`, `imageWidth` 160.
  - Dropped the dead `@utility text-hero-image-clip` from `globals.css`.
- Verified: no remaining references to deleted assets; `tsc` + `next build`
  clean. Committed `30366ab`.

### Mobile site-nav polish

- Removed the backdrop overlay + `rounded-2xl` panel radius from the mobile
  dropdown in `components/site-nav.tsx` (flat full-bleed panel under the
  cream bar). Committed `b03b932`.

### FAQ expanded (payment → messaging → resolution flow)

- `components/landing/faq-accordion.tsx` grew from 4 to 6 Q&As:
  - **"Can I message the seller?"** — once you've paid, in-app chat for
    pickup details stays open through pickup and 24 hours after.
  - **"What if there's a problem with my order?"** (restored) — 24 hours
    after confirming pickup to sort it out with the seller; raise it with
    Soldbay before the 48-hour window closes and payment fully releases.
  - Both sit after "How do payments work?" and before "Is delivery
    available?", mirroring the buyer journey.
- Cross-checked against `docs/architecture.md` (dispute + refund/release
  resolution, `/api/orders/[id]/dispute`,
  `/api/admin/disputes/[id]/resolve`) — timeframes are consistent.
- Considered adding a 4th "Talk it out" card to Why Soldbay but left it at
  the three mechanism cards: messaging is post-sale support detail already
  covered by the FAQ flow, and the section's intro + chips row are a
  deliberate three-beat structure. Waitlist polls already list "In-app chat".
- Committed `a936f52`.

### Verified

- `npx tsc --noEmit` clean and `next build` succeeds across the batch; pushed
  `b8bbac1`, `30366ab`, `b03b932`, `a936f52` → `origin/master`.

---

## 2026-09-14 — Landing polish: Waitlist Section, FAQ/Questions Switch, Smooth Scroll, Hero Pill

Follow-up pass on the light-editorial landing, driven by build + usability feedback.
Three interactive sections replaced the previous static blocks, and all in-page
links now smooth-scroll. Committed as `9bf5198` (docs), `1a7b6c3` (app verified
badge), `b492398` (web landing rebuild) and pushed to `origin/master` (Vercel
prod). A follow-up `f65f6e3` fixes the FAQ answer text color class.

### Waitlist section — same dark band, Buyer/Seller switch

- **`components/waitlist-form.tsx` (new, reusable)**: the full signup card
  (name / email / university / level-or-category / frequency / category chips /
  poll checkboxes → `/api/waitlist` POST, inline "You're on the list!" success
  state + "Join the other side" back button) extracted so the same form works
  inline on the landing **and** in the standalone `/join/*` pages.
- **`components/join-form.tsx`**: rewritten as a thin page wrapper around
  `WaitlistForm`; standalone pages pass `onSuccess={() => router.push("/success")}`.
- **`components/landing/join-waitlist.tsx` (new)**: dark credibility band
  (`dark bg-background py-24 md:py-32`, `id="join"`), centered eyebrow
  "— Join Waitlist", heading, sub, and a **Buyer / Seller slide-switch pill** —
  `motion.span layoutId="join-role-pill"` green bg (spring 400/34), content
  crossfade-slides (~0.28s `soldbayEase`) via `AnimatePresence mode="wait"`.
  Tapping the already-active mode does nothing. Wired into `app/page.tsx`
  directly after `<Hero />`; brand nav gains a `join` link first in order.
- **All landing CTAs repointed from `/join/buyer|seller` → `/#join`** (nav
  desktop + mobile, hero pill, social-proof button, footer "Join as Buyer" /
  "Become a Seller"). No landing CTA routes externally anymore.

### FAQ + Ask-a-question — one dark band, one switch

- **`components/landing/faq-questions.tsx` (new)**: combined section, same dark
  band + centered header as the waitlist, `id="faq"`. One **FAQ / Questions**
  pill (`layoutId="faq-questions-pill"`), **FAQ default with the sliding bg**;
  tapping Questions slides the content to the question card and back. Same
  copy/pill/slide rules as the Buyer/Seller switch.
- **`components/landing/faq-accordion.tsx` (new)**: the 4-Q&A accordion extracted
  as a presentational piece (animated expand/collapse, rotating plus icon).
- **`components/question-form.tsx` (new, reusable)**: the ask-a-question card
  (name / email / question → `/api/questions` POST, inline "Question sent"
  success + "Ask another question") as its own component, mirroring the waitlist
  form pattern.
- `components/landing/faq.tsx` and `ask-question.tsx` **deleted** (replaced by
  the combined section; `page.tsx` now renders `<FaqQuestions />`).
- Tail-polish commit `f65f6e3`: FAQ answer text color class corrected in
  `faq-accordion.tsx`.

### Input-field consistency (waitlist vs question)

- The waitlist form was using raw `<input>` elements, which left the browser's
  default blue focus ring. All waitlist text inputs now use the `Input` UI
  component with the same `fieldClass` as the question form — identical border,
  cream `bg-background` fill on `bg-surface` cards, focus-visible ring.

### Smooth-scroll section links

- **`components/smooth-link.tsx` (new)**: a `Link` wrapper that intercepts
  `/#section` clicks, `preventDefault()`s the instant jump, and
  `scrollIntoView({ behavior: "smooth" })` (instant under `prefers-reduced-motion`).
  Falls back to normal navigation for everything else.
- Swapped into **every** in-page link: nav desktop links + "Join the waitlist"
  button, mobile menu links + button, hero "Join the waitlist" + "See how it
  works" pills, social-proof CTA, footer "Join as Buyer" / "Become a Seller".
- The `#how` / `#why` / `#join` / `#faq` sections gained
  `scroll-mt-20 md:scroll-mt-24` so section tops land below the fixed header.

### Hero dual-pill behavior

- Removed the `onMouseLeave` reset — the green `layoutId` pill **stays** on the
  hovered option (default stays `join` on load) until you hover the other.
- Click now flashes a light pressed overlay (`bg-white/25`, ~300ms) on the
  clicked pill, plus moves the bg there for touch/keyboard users.

### Assorted

- `container-page` max-width widened 72rem → **126rem** (editorial full-bleed look).
- `app/success/page.tsx` + `page-shell.tsx` finished converting off the dark glass/
  spotlight treatment to the light surface cards + `page-atmosphere-light`.
- `components/ui/input.tsx` base class switched `border` → `border-none` so
  callers control the border via tokens.
- `components/brand-logo.tsx` (new): inline wordmark lockup using the self-hosted
  Fraunces (the earlier `public/` SVGs' Google-Fonts `@import` fall back to Times
  inside SVG-as-image). Nav + footer use it.

### Verified

- `npx tsc --noEmit` clean, ESLint clean on all changed files, full
  `next build` succeeds (all public pages static).
- Pushed: `docs(design)` 9bf5198, `feat(app)` 1a7b6c3, `feat(web)` b492398 →
  `origin/master`; Vercel prod deploy triggered.

---

## 2026-09-13 — Landing Page → Light Editorial Design (design.pen → soldbay-web)

The landing design was rebuilt in `design/design.pen` as a new **light editorial**
direction (cream `#F4F1E8` base, olive ink `#2D3A1F`, olive CTAs `#5A743E`, tan
accents `#B8A678`/`#C7B58A`, Fraunces display + Sora body) — a deliberate break
from the old dark-glass look. This log entry covers the code implementation that
mirrors that pen board.

### Soldbay-web implementation

- **Shell (`globals.css` + `components/page-shell.tsx`)**: new
  `page-atmosphere-light` utility (cream base with faint olive/tan radial washes,
  no grain). `PageShell` now uses it; the dark `page-atmosphere`/noise/glass
  utilities remain for the admin login page.
- **Nav (`components/site-nav.tsx`)**: flat cream bar, `border-b border-border`,
  full lockup wordmark + tan dot, links `gap-8`, olive pill "Join the waitlist"
  CTA; mobile dropdown converted to cream.
- **Hero (`components/landing/hero.tsx`)**: light editorial two-column. Left:
  eyebrow (rule + "ESCROW-PROTECTED CAMPUS COMMERCE"), headline _"The campus
  marketplace where money moves last."_, subhead, primary pill (→ `/join/buyer`)
  - outline pill (→ `#how`), trust row (verified students / escrow / PIN handoff).
    Right: **Money Flow card** (`bg-surface`, border, radius-16) — "How money
    moves" header + escrow chip, three steps (List it → Pay into escrow → Confirm
    with PIN), footnote. Inline hero waitlist capture removed — landing CTAs route
    to the `/join/*` pages, which keep the working `/api/waitlist` POST.
- **How It Works (`components/landing/how-it-works.tsx`)**: three `bg-surface`
  radius-16 cards, olive icon tiles + tan Fraunces numbers (01/02/03).
- **Why Soldbay (`components/landing/why-soldbay.tsx`)**: dark credibility band
  (`#1A1F14`, tan rules/chips, `#242A1D` mechanism cards, `#3F4635` strokes).
- **Social Proof (`components/landing/social-proof.tsx`)**: light stat band —
  live count via `getWaitlistProof` in Fraunces 96 + "Join them…" copy + pill CTA.
- **FAQ (`components/landing/faq.tsx`)**: custom plus-icon accordion (4 Q&As from
  pen), full-bleed bordered rows (`border-y border-border`), light theme.
- **Forms/success**: `ask-question.tsx`, `join-form.tsx`, `success/page.tsx`
  restyled to light surface cards (dropped glass/spotlight); inputs on cream.
- **Footer (`components/landing/footer.tsx`)**: dark band, inverted wordmark +
  tagline, `soldbay.shop` tan chip, For Students / Company columns.
- Verified: `tsc --noEmit` clean, ESLint clean on all changed files, full
  `next build` succeeds (all public pages static).

---

## 2026-09-13 — Landing Design Board (design.pen): Light Editorial Direction

### Decision

The day's earlier code-based landing (dark glass, stored in `design/design.pen`
alongside the app design system) was rejected: **"design in pen file design.pen
not code… i want a new design not that bull shit there."** The landing is now a
visual design board in `design/design.pen`, and the code lands _after_ the design
is approved (see the code-mirror entry above/below).

Direction reset to a **light editorial** look — a clean break from dark-glass:

- Cream base `#F4F1E8`, olive ink `#2D3A1F`, olive CTAs `#5A743E`,
- Tan accents `#B8A678` (light) / `#C7B58A` (on dark), cards `$surface` `#E8E2D0`
  with `$border` `#D8D7CC` hairlines,
- Fraunces display (headlines, numbers) + Sora body/UI.

### The board

Built one tall page frame **`bSAyP` "Soldbay Landing — Light Editorial"
(1440×3266)** holding 7 sections:

1. **01 Nav** (88) — cream bar, `border-b #D8D7CC`, wordmark Fraunces 40 w500
   ls -0.02 + tan dot, links `gap 32`, olive pill CTA (`#5A743E`, radius 999,
   h 48, pad [0,28]).
2. **02 Hero** (688) — eyebrow (tan rule 40×2 `#B8A678` + caps label), headline
   Fraunces 64 w500 ls -0.03 lh 1.04 _"The campus marketplace where money moves
   last."_, Sora 18 sub, primary + outline CTAs (outline `#2D3A1F` 1.5px),
   trust row (verified students / escrow / PIN handoff), and a **Money Flow card**
   (`$surface`, border, r16): "How money moves" header + escrow chip (stroke
   `#96824F`, r999, h28), 3 steps (List it → Pay into escrow → Confirm with PIN,
   olive icon tiles), footnote strip (`#F4F1E8`, border, r12).
3. **03 How It Works** — eyebrow/title/sub centered, 3 `$surface` cards (r16,
   stroke `$border`), olive icon tiles r10 h44 + tan Fraunces numbers `#96824F`
   (01/02/03).
4. **04 Why Soldbay** — dark credibility band `#1A1F14` with gap 8: eyebrow rule
   `#C7B58A`, cream headline, 3 tan chips (stroke `#C7B58A`, h32), 3 mechanism
   cards `#242A1D` stroke `#3F4635` (r16, pad 24).
5. **05 Social Proof** — stat band: Fraunces 96 number + "on the waitlist",
   "Join them — Soldbay launches campus by campus…" + olive CTA (r999, h52).
6. **06 FAQ** — centered label/title + 4 Q&A rows, full-bleed `border-y #D8D7CC`,
   row icons +, answers 14px.
7. **07 Footer** — dark band `#1A1F14`: inverted wordmark + tagline, `soldbay.shop`
   tan chip (stroke `#C7B58A`, h30), © line, For Students / Company columns
   (head 13px w600 ls 0.1, links 14px `#F1EEE470`).

### Tooling notes / issues hit in the pen schema

- `alignItems` only accepts `start | center | end` — `"stretch"` rejects the node
  build (whole block rolls back); fixed by sizing cards content-driven.
- **Circular sizing**: a `fit_content` parent with a `fill_container` child
  collapses both to near-zero ("Collapsed size"); gave the HIW card `Body` frames
  an explicit `width: "fill_container"` to break the cycle.
- `fingerprint` was flagged invalid for _new_ icon nodes (despite existing in the
  doc) → swapped to `badge-check` on the new icons.
- Page geometry verified via `Get` `bounds` + `c.problems` (clip/collapse audit),
  not pixels: no clipping remains; section heights sum cleanly
  88 + 688 + 566 + 627 + 294 + 708 + 295 = 3266.

### Status

- Board design is complete and verified; **uncommitted** (pending the commit
  decision already asked for on the earlier badge/pen work).
- Code conversion to mirror this board: see the light-editorial code entry above.

---

## 2026-09-13 — Landing Page Redesign (soldbay-web)

Reworked the landing page against the locked design system and finalized
logo assets. All section structure/logic kept; this was a content + visual pass.

- **Header (`components/site-nav.tsx`)**: full-lockup wordmark (Soldbay in
  Fraunces Medium + tan accent dot) left, nav + olive "Join Waitlist" CTA right.
  The nav pill flipped to the cream brand surface so the primary (dark-olive)
  lockup is legible over the dark hero. Nav now anchors `/#how`, `/#why`,
  `/#faq`, `/#questions`.
- **Hero (`components/landing/hero.tsx`)**: new copy — "The campus marketplace
  where money moves last." with a Sora subhead on escrow-held-until-PIN-confirmed
  handoff. Waitlist capture (name / email / university / buyer-or-seller toggle)
  posts to the existing `/api/waitlist` route, success state inline. Right side is
  a built **list → escrow → PIN flow** element (3 steps + "funds stay in escrow"
  footnote) — no stock illustration.
- **How It Works (`components/landing/how-it-works.tsx`)**: rebuilt as
  **List it / Pay into escrow / Meet & confirm**, three radius-lg glass cards.
- **Why Soldbay (`components/landing/why-soldbay.tsx`, new)**: "Why not just
  another WhatsApp or Jiji deal?" — differentiation mechanisms (matric-verified
  students, escrow on every order, PIN-confirmed handoff) in three cards, drawn
  from the escrow/PIN/verify mechanics already specced in the design system.
- **Why Soldbay wired into `app/page.tsx`** between HowItWorks and SocialProof.
- **Footer (`components/landing/footer.tsx`)**: finalized wordmark-only logo
  (inverted variant for the dark surface) + new `soldbay.shop` pill.
- **`components/brand-logo.tsx` (new)**: inline wordmark/lockup SVG that inherits
  the self-hosted Fraunces from `next/font`. Rendered inline (not `<img>`) because
  web fonts don't load inside SVG-as-image, so the finalized `public/` SVGs' remote
  `@import` would fall back to Times. Geometry matches the finalized assets
  exactly (weight 500, letter-spacing -0.02em, dot at 462/28 in the 520×100 lockup).
- **`lib/universities.ts` (new)**: shared campus list; `join-form.tsx` now imports
  it instead of a local copy.
- Verified: `tsc --noEmit` clean, ESLint clean for changed files (pre-existing
  `no-explicit-any` errors remain in `prisma/seed.ts`, `scripts/*`, tests), and a
  full `next build` succeeds with `/` prerendered static.

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

### Verified Seller Badge Update

- Made the verified-seller badge **icon-only** everywhere: a custom-drawn
  checkmark-in-shield (filled shield, check punched out via the `evenodd` fill rule)
  in Accent — no text label, no stock Phosphor/Lucide shield-check.
- **Pen** (`design/design.pen`): swapped all 7 product-card `shield-check` badges
  (component `g1Grgp` + 6 gallery variants) and the Section 10 profile/chat demo
  pill (`VB`) for the custom path; deleted the "Verified" / "Verified seller" labels;
  pill backing changed from solid Accent to `#E8E2D0` cream so the Accent icon stays
  visible; DSVerified caption updated to "small, icon-only badge".
- **App** (`soldbay-app`): `VerifiedChip` rewritten icon-only (dropped the text label
  and Lucide `CheckCircle`); added `accent-gold` / `accent-gold-tint` tokens to
  `tailwind.config.js` and `src/theme/colors.ts`. The single chip drives listing
  cards, seller profile, and chat/verify consistently.
- **Docs**: `design/DESIGN.md` (verified-chip rule is now icon-only, colour table
  gains `accent-gold` rows, trust principle gains the verified-badge exception);
  `docs/soldbay-design-system.md` Section 19 bullet updated to "locked and applied".
- Pen quirk noted: `Replace` fails on nodes inside a component definition; used
  `Delete` + `Insert` there instead. Path geometry is elided in `Get` output unless
  `includePathGeometry: true` is passed.

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

| Token                      | Value     | Brand role               |
| -------------------------- | --------- | ------------------------ |
| `--color-background`       | `#F4F1E8` | cream bg                 |
| `--color-foreground`       | `#2D3A1F` | Text/Primary (olive ink) |
| `--color-primary`          | `#5A743E` | CTA fill (ramp 500)      |
| `--color-primary-700`      | `#2C381E` | pressed/active           |
| `--color-accent`           | `#B8A678` | tan brand echo           |
| `--color-accent-400`       | `#96824F` | discounted-price accents |
| `--color-secondary`        | `#5C7048` | secondary buttons/tags   |
| `--color-card` / `surface` | `#E8E2D0` | cards, modals            |
| `--color-border`           | `#D8D7CC` | hairlines                |

Semantics (text/icon + tint): Success `#2E7A6E`/`#D9E8E1`, Info `#4D6F89`/`#DDE4E9`,
Warning `#875931`/`#EEE2D8`, Destructive `#9C453A`/`#EEDFDD`.

Radii: `sm` 6, base 10, `md` 10, `lg` 16, `xl` 24, `full` 999.

#### Core tokens — dark mode (`.dark` block)

| Token      | Value                                                                       |
| ---------- | --------------------------------------------------------------------------- |
| background | `#1A1F14` (near-black, olive-tinted)                                        |
| foreground | `#F1EEE4`                                                                   |
| primary    | `#8BA670` (lightened CTA)                                                   |
| accent     | `#C7B58A` (lightened ~6%)                                                   |
| card       | `#242A1D`                                                                   |
| border     | `#3F4635`                                                                   |
| semantics  | Success `#7BC4B6`, Info `#86A7C1`, Warning `#CF9B6E`, Destructive `#CC7266` |

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

| Section                   | Change                                                                                                                                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 6 · Product Card States   | Dropped "& Unverified Seller" from title; **retired the Unverified Seller card state** (former 6b/6c removed). Placement decision updated: stamp copy **and icon** still open (was "SOLD"; flagging text vs icon combo). Whole-card desaturation ~75%. |
| 10 · Trust & Verification | "New seller" indicator simplified from a full pill spec to **"Neutral tag, Secondary color background"**; the Section 6b cross-reference was dropped.                                                                                                  |
| 14 · Core Colors          | Added a **"Naming clarification (locked)"** block (see below).                                                                                                                                                                                         |
| 19 · Still Open           | Sold/Unavailable: structure + treatment decided, only stamp copy/icon open. Verified-seller: treatment decided (Section 10), **just not yet built as a component**.                                                                                    |

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

| File                        | Viewbox | Fill             | Accent      |
| --------------------------- | ------- | ---------------- | ----------- |
| `soldbay-logo-primary.svg`  | 520×100 | #2D3A1F wordmark | #B8A678 dot |
| `soldbay-logo-inverted.svg` | 520×100 | #F4F1E8 wordmark | #B8A678 dot |
| `soldbay-wordmark-only.svg` | 440×100 | #2D3A1F wordmark | none        |

#### PNGs (3 files)

| File                          | Dimensions | Color               | Description                          |
| ----------------------------- | ---------- | ------------------- | ------------------------------------ |
| `icon.png`                    | 1024×1024  | sRGB, 8-bit RGBA    | S monogram + dot on cream, no radius |
| `android-icon-foreground.png` | 512×512    | sRGB, 8-bit RGBA    | Cream S + dot, transparent bg        |
| `android-icon-background.png` | 512×512    | sRGB, 8-bit Palette | Solid #2D3A1F                        |

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
