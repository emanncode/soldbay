---
name: soldbay-component-inventory
description: Information about Component Inventory & Build Order for Soldbay
---

Full reusable component inventory, built directly from the Feature/Workflow Inventory and Screen Flow (IA) — not a guess, every entry maps to something those docs already establish as needed. Purpose: build these systematically before deep screen design starts, so screens compose from a settled kit instead of each screen reinventing pieces ad hoc.

**Two separate statuses live in this doc — don't conflate them:**

1. **Design status** (`[X]` checklist below) — the component was designed as a prompt for Agy, rendered, reviewed, and locked. **Every component is design-locked.**
2. **Code status** (section at the bottom) — the component exists as real React Native code in `soldbay-app`, verified against the locked tokens. This is the current phase.

**Design-phase workflow (complete):** each component was delivered as a written design PROMPT for Agy (Antigravity) to render in the .pen design boards — not as code. The prompt referenced soldbay-design-system.html for every token. One component's prompt per session.

Build order (applies to both design and code): Navigation/Structure first (almost everything else sits inside these), then Cards/Buttons (used everywhere), then the rest.

## Navigation / Structure

- [X] Tab bar (4 items: Browse/Search/Orders/Profile) — built and locked (unread badge dot = #FFB980; active state = fill icon + accent-colored icon/label, confirmed against `all-screens.html`'s `.nav-item.active { color: var(--accent) }`; inactive state = `secondaryText`/`borderDark`, NOT `borderLight` — `borderLight` is a border-only color, see Design System Reference)
- [X] Screen header (title + bell) — built and locked. **Correction 28-09-26:** the title is Title 2, 22px/Bold (`h1.title-2`), not Title 3 as this doc previously said. Also, only the Browse screen actually has this title+bell pattern — Search replaces the header with an inline search bar, Profile shows only a settings gear with no title. Don't assume every main tab shares one header pattern; check the real screen.
- [X] Search bar — built and locked (`radius-sm` 8px). Icon/placeholder muted color is `secondaryText` in light mode, `borderDark` in dark — same correction as the tab bar.
- [X] Seller tab bar (4 items: Hub/Orders/Post/Profile) — built and locked, mirrors buyer tab bar's 4-tab structure. Wallet reached via a "View Wallet" entry point on the Hub balance card, not a nav tab.

## Cards

- [X] Product card (grid item: image, title, price, badges) — built and locked after one correction round (added strikethrough original price alongside discount, made verified/unverified badge mandatory on all 5 states including Sold and no-photo). Verified badge stayed icon-only; Unverified became an icon+text pill — deliberate differentiation. **Verified badge icon, locked 28-09-26:** plain `ph-seal-check` (Phosphor Fill), accent color, no circular background — a deliberate reversal of an earlier auto-generated shield-in-a-circle variant, now baked into all three prototype HTML files. Rating (star + score + review count) also confirmed present on the grid card itself, next to the seller-info row — resolves the old "is rating shown on the grid card" open question as yes.
- [X] Order/transaction card — built and locked. All four semantic states correctly mapped (Pending pickup → Info, Awaiting handoff → Warning, Completed → Success, Disputed → Error, using each mode's own value — see Design System Reference's light/dark semantic table), countdown correctly suppressed to "Auto-release paused" on Disputed.

## Buttons

- [X] Primary button (accent fill) — built and locked (#F47A32 fill, #031F21 label)
- [X] Secondary/outline button — built and locked, one correction round: a bonus "Action Bar" composite pattern Agy added had inconsistent copy ("Chat" vs "Message" elsewhere) — corrected to "Message" to match the locked Screen Flow copy ("Message the seller")
- [X] Icon button — built and locked (muted secondary/icon tone, not accent)
- Bonus: an "Action Bar" composite pattern (bookmark/wishlist icon button + Message secondary + Buy Now primary) was added beyond the original ask — kept and locked as a documented reusable pattern, since it maps directly onto the real Product Detail screen's bottom action bar from the Screen Flow

## Badges / Pills

- [X] Verified-seller badge — built and locked (icon-only, `ph-seal-check`, see Product card entry above)
- [X] Discount badge (with stroke) — built and locked (#FFB980 fill, #F47A32 stroke, per product card)
- [X] Status pill (success/warning/error/info) — built and locked (per order/transaction card + list rows). Solid fill + white text; each mode uses its own semantic value (light and dark differ — see Design System Reference).

## Inputs

- [X] Text input — built and locked (default/filled/error states confirmed correct; distinct focused state not separately demonstrated, minor gap, not blocking)
- [X] Textarea (listing description) — built and locked, same states as text input
- [X] Select/dropdown (category, condition) — built and locked (closed + open states, correct elevation)
- [X] Toggle/switch — built and locked as a component (#F47A32 on-state track, correct). **Note:** its two originally listed uses no longer exist — dark mode is system-default with no toggle, and "Verified Only" is chip-only with no separate toggle (Screen Build Order). Confirm a real consumer (e.g. 2FA in Account Security) before building it in code.
- Bonus: "All 4 Input Types Together in Form Pattern" — a composite Create-Listing-style form assembling all four inputs together, kept as a documented reusable pattern

## Lists

- [X] Generic list item (settings, order history rows) — built and locked (status pills correctly using distinct semantic colors per row)
- [X] Chat message bubble (sent/received) — built and locked (sent = peach fill + dark text, avoiding the orange-fill/white-text contrast trap; received = white/light fill). Bonus: chat header pattern (seller name + verification badge inline) kept as a documented reusable pattern — this is the Seller Info Row component from Identity, demonstrated in real context

## Feedback

- [X] Empty state — built and locked (icon + message + Clear Filters action button)
- [X] Loading skeleton — built and locked (desaturated teal-tinted blocks, not generic gray)
- [X] Toast/banner — built and locked (full-strength fill + white text for ephemeral toasts; a separate lighter inline-context-box treatment, 12% tint + colored text, applies to persistent embedded messages like the PIN screen's "Buyer is at Hall B" box — see Color section of the Design System Reference)
- [X] Modal/dialog — built and locked ("Confirm Item Release?" example, correct elevation + button treatment in both modes)

## Identity

- [X] Avatar — built and locked. 44×44px, radius-full, Headline 17px/Semibold initials fallback. Photo + initials-fallback states shown, both modes. Dark-mode initials-fallback uses a solid `#67B8B3` fill (not the 24%-opacity treatment used elsewhere for borders/secondary text/icons) — accepted as a locked usage specific to avatar-fallback surfaces.
- [X] Seller info row (avatar + name + verification badge) — built and locked, demonstrated via the chat header pattern ("Chidi E. ✓ Verified Seller")

## Misc

- [X] Divider — covered by the locked border/divider tokens, no separate component needed
- [X] Filter chip — built and locked (unselected outline vs. selected #FFD0A6 fill + #031F21 text + checkmark, \~11.8:1 AAA, correctly avoids #F47A32-on-white)
- [X] Countdown/timer display (48hr auto-release) — built and locked (compact inline + large focal versions, both demonstrated)
- [X] PIN entry/reveal component (core differentiator flow) — built and locked after full dedicated review: buyer entry (filled/active/empty digit states) + all 3 seller-reveal states (inactive/active/revealed), correct dark-teal-on-orange label contrast confirmed on the active button
- [X] Upload box (tap-to-upload pattern) — built and locked. Used by Switch-to-Seller and Dispute Flow (evidence photos). **Switch-to-Seller is either/or, not both:** the user chooses Student ID (two slots, front + back, \~1.586:1 card ratio) OR Student Portal screenshot (one slot, adaptive preview that fits portrait or landscape, not forced to a ratio). Dashed border, upload icon, short instruction label; filled state = thumbnail + "Change".
- [X] Campus Picker (full-screen searchable list) — built and locked. Three states: default, filtered (live-narrowing), empty ("No campus found"). Its own full-screen pattern, not an inline dropdown.
- [X] Wallet balance breakdown — built and locked. Total Balance (primary), Withdrawable (with Withdraw button), Held (with lock icon, muted). Hub's compact version shows Total only + "View Wallet" link.
- [X] Dispute status timeline (stepper) — built and locked. Submitted -> Under Review -> Resolved, filled dots for completed/current, muted dot for pending.
- [X] Rate & Review star input — built and locked. Phosphor Star icon, outline/fill states, filled = locked accent color. Read-only version reused for Seller Profile Display's aggregate score.
- [X] Seller star rating placement — locked decision: shows everywhere a buyer is building trust in a seller — Product Card (Feed/Search grid), Product Detail's Seller Info Row, and Seller Profile Display all show the read-only aggregate rating.
- [X] Self-purchase-blocked button state — built and locked. Disabled secondary-button treatment, label "This is your listing," replaces the action bar on Product Detail when viewer is the seller.
- [X] Payment method selector card — built and locked. Selectable card per provider (Paystack/Flutterwave), selected state = accent-colored border + filled checkmark.
- [X] Chat read-receipt tooltip — built and locked. Long-press -> floating dark tooltip ("Read at \[time\]"), not a persistent inline label.

Icon library: Phosphor Icons (outline for inactive states, fill for active) — locked in the Design System Reference.

---

# CODE BUILD STATUS (React Native / NativeWind, `soldbay-app`)

**Rules for every component in code:** tokens only (class names from the Design System Reference token map, or `colors` from `src/theme/tokens.js` for icon colors) — no hex literals; light + dark (`dark:` variants) from the first commit; Sora type utilities only; Phosphor Regular inactive / Fill active. A component only counts as done here after its actual file content has been checked directly against the real prototype HTML (`all-screens.html` / `all-screens-dark.html` / `component-library.html`) — a build report describing what was done is not sufficient verification on its own; open the file and the corresponding HTML and diff them.

**Foundation**

- [X] `tailwind.config.js` + `src/theme/tokens.js` — corrected 28-09-26 to the locked Orange & Teal system, applied locally. `_layout.tsx` font loading switched to Sora (`useFonts` with `Sora_400Regular`/`Sora_600SemiBold`/`Sora_700Bold`).
- [X] `global.css` + import in `_layout.tsx` (NativeWind utilities rendering) — done.
- [ ] `docs/soldbay-design-system.md` and `src/theme/colors.ts` — still flagged as likely holding the stale olive palette; not yet confirmed either way, check before anyone reads either as a reference.

**Components — verified 28-09-26 directly against the real prototype HTML, not against a build summary**

- [X] **Tab bar** (`TabBar.tsx`) — one bug: inactive icon/text color uses `borderLight` (`#008080`) for light mode; must be `secondaryText` (`#063F42`) — `.nav-item { color: var(--secondary-text) }` in the real CSS. Dark mode (`borderDark`) is already correct. Structure (height 80, radius 24/24/40/40, column layout, active=accent) all confirmed correct.
- [X] **Screen header** (`ScreenHeader.tsx`) — confirmed correct as-is: `text-title-2` (not title-3), icon-btn border/shadow treatment in both modes, all match `.header`/`.icon-btn`/`h1.title-2` exactly. No fix needed; the earlier "not verified" status was wrong — this one's done.
- [X] **Search bar** (`SearchBar.tsx`) — one bug, same root cause as Tab bar: icon color uses `borderLight` for light mode; must be `secondaryText`. Background/border in both modes already correct.
- [X] **Product card** (`ProductCard.tsx`) — one bug: dark-mode border uses `borderDark/10`; must be `borderDark/24` (`.product-card`'s border resolves to `border-light` in dark mode, which is `rgba(103,184,179,0.24)`). Everything else confirmed correct: verified/unverified badges, rating, image height, discount badge, dark text color.
- [X] `src/theme/tokens.js` — `darkText: "#FFFFFF"` and the `darkSuccess/darkWarning/darkError/darkInfo` values are CONFIRMED CORRECT (verified against `all-screens-dark.html`'s `:root`) — these were flagged as suspicious drift in an earlier review pass and that flag was wrong; keep them.
- Not started: Order/transaction card, Buttons, Badges/Pills as standalone components, Inputs, Lists, Feedback, Identity, Misc. Code order follows the design build order above.

**Process note (28-09-26):** a review session made sweeping, unattended changes directly against both the code AND the three locked prototype HTML files (icon swaps, badge color patches, a rating block injected into the product-card markup) based on a general "make RN match HTML" instruction, without checking each specific claim against Linear or recording the changes here. Some of those changes were correct (verified badge icon, unverified badge dark treatment) and are now reflected above; others need the fixes listed above. Going forward: one component verified at a time, actual file diffed against actual HTML, result recorded here — not a batch "deep override" applied and summarized after the fact.

**Test harness:** `src/app/index.tsx` currently mounts components for visual checks. Restore/move before real routing is built on it.

**Security:** a plaintext Linear API key was found in use on the local machine (`~/fetch_linear.js`). Rotate it in Linear's API settings and check git history for `fetch_linear.js`/`linear_project.json`/`linear_docs.md`/`linear_recent.json` — see Design System Reference's Known Open Items for detail.
