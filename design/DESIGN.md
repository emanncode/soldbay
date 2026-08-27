# Soldbay Design System

> **Source of truth** for Soldbay Mobile (React Native / Expo) and the Pen.dev canvas
> (`design/starter.pen`). This document supersedes every earlier design doc in this
> repository, including the previous version of this file and `soldbay-web/DESIGN.md`.

Soldbay is a campus marketplace where students buy and sell from each other, with money
held in escrow until the buyer physically collects the item and confirms it. The design
system exists to make that trust legible. It is deliberately quiet.

---

## 1. Principles

1. **Minimal, not sparse.** Every screen earns its elements. Nothing decorative.
2. **One accent colour.** Teal, and only teal. An accent used everywhere stops being an
   accent — so it appears on primary actions, active states, and brand marks. Nowhere else.
3. **Whitespace is structure.** Grouping comes from space, not from boxes and borders.
4. **Consistency over cleverness.** A pattern that already exists is reused as-is.
5. **Trust is communicated in words, not decoration.** Escrow state, verification state,
   and money movement are always spelled out in text.

The brand mark is a **plain wordmark** — styled text, no icon. The previous purple-blue
gradient logo and the red accent are dropped entirely.

---

## 2. Foundations

### Colour

| Role | Token | Hex |
|---|---|---|
| Accent (the only brand hue) | `accent` | `#0D9488` |
| Accent pressed | `accent-hover` | `#0F766E` |
| Accent tint (verified chip, selected) | `accent-tint` | `#CCFBF1` |
| Success | `success` | `#16A34A` |
| Success tint | `success-tint` | `#DCFCE7` |
| Error | `error` | `#DC2626` |
| Error tint | `error-tint` | `#FEE2E2` |
| Warning | `warning` | `#D97706` |
| Warning tint | `warning-tint` | `#FEF3C7` |
| Base background | `surface-base` | `#FAFAFA` |
| Elevated surface (cards, sheets) | `surface-elevated` | `#FFFFFF` |
| Text primary | `text-primary` | `#171717` |
| Text secondary | `text-secondary` | `#525252` |
| Text tertiary | `text-tertiary` | `#737373` |
| Text inverse | `text-inverse` | `#FFFFFF` |
| Divider | `border` | `#E5E5E5` |
| Input border | `input` | `#D4D4D4` |
| Neutrals | `neutral-50…900` | `#FAFAFA` → `#171717` |

`accent-tint` is a **tint, not a second hue**. `primary` is an alias of `accent`, never a
different colour. There is no fifth status colour.

### Typography

**Manrope only**, at three weights: 400 Regular / 500 Medium / 600 Semibold. There is no
header/body font split.

| Level | Size / Line height | Weight |
|---|---|---|
| Display | 32 / 40 | 600 |
| H1 | 24 / 32 | 600 |
| H2 | 20 / 28 | 600 |
| Body | 16 / 24 | 400 |
| Body Medium (card titles, input labels) | 16 / 24 | 500 |
| Body Semibold (prices) | 16 / 24 | 600 |
| Small | 14 / 20 | 400 |
| Caption | 12 / 16 | 400 |

Body copy is never below 16. Caption 12 is the floor — nothing smaller. Prices are
deliberately heavier than the title beside them.

### Spacing, sizing, radius, borders

- Spacing scale: **4 / 8 / 12 / 16 / 24 / 32**.
- Icons 16 / 20 / 24. Avatars 32 (inline) / 40 (card) / 64 (profile).
- Buttons and inputs are **48** high. Minimum touch target **48×48, no exceptions**.
- Radius: `sm 6` (inputs, chips) / `md 10` (cards, buttons) / `lg 16` (modals, sheets) /
  `full 999` (avatars, pills). No `xl`/`2xl` — that is what invites per-screen one-offs.
- Inputs get a 1px `input` border. Dividers are 1px `border`.
- **Cards never get a border.** Elevation only. Never border + shadow on one surface.

### Elevation

| Level | Use | Shadow |
|---|---|---|
| 0 | Base screens | none |
| 1 | Cards | `0 1px 3px rgba(0,0,0,0.08)` |
| 2 | Modals, sheets, dropdowns | `0 4px 12px rgba(0,0,0,0.12)` |

Depth comes from surface contrast (`#FFFFFF` on `#FAFAFA`) plus a subtle shadow.

> **No glassmorphism or blur anywhere.** This was rejected deliberately: blur is expensive
> on older Android GPUs, the product ships to mixed low-end Android hardware, and it
> contradicts the minimal personality. Do not reintroduce it.

Implemented in [`soldbay-app/src/theme/elevation.ts`](../soldbay-app/src/theme/elevation.ts),
because NativeWind cannot express React Native's platform-split shadow props.

### Icons

A single **Lucide outline** set, 1.5–2px stroke, at 16/20/24. Never mix outline and filled
in one screen.

### Imagery

Listing covers are **1:1**, occupying roughly 65% of the card height. Avatars fall back to
**initials on accent tint** when there is no photo.

### Motion

Two durations only: **150ms** (micro — button press) and **250ms** (standard — transitions,
modal open). **Standard ease-in-out only. No bounce, no spring.** Reanimated's spring
presets are the easy default, which is exactly why this is an explicit token.

Respect the OS reduce-motion setting by degrading to instant or a cross-fade — **without
dropping the state feedback itself**.

---

## 3. Components

Buttons (Primary / Secondary / Ghost / Destructive) · Text Field · Text Area · PIN Input ·
PIN Display · Verified Chip · Avatar · Back Header · Section Header · Divider ·
Listing Card · Order Card · Order Badge · Escrow Stepper · Dispute Banner · Toast
(Success / Error) · Tab Bar · Search Bar · Filter Chip (+ Active) · Choice Card
(+ Selected) · Settings Row · Empty State · Progress Indicator · Photo Slot (Empty /
Filled) · Stat Card · Sticky Action Bar · Confirm Pair · Logo Wordmark · Status Bar.

### Rules that are easy to violate by accident

- **No hover states anywhere.** This is touch-first.
- Pressed state is a deeper shade. Loading replaces the label with a spinner and causes
  **no layout shift**.
- Text Field labels sit **above** the field (Medium weight) — never floating. Focus is a
  2px accent ring. Errors are a red border plus red `Small` text **below** the field.
- **Verified Chip and Escrow Stepper always carry a text label.** Never colour-only,
  never icon-only — colour is a redundant channel here, not the signal.
- **Toasts are never teal.** Teal is reserved for brand and primary actions. Success is a
  green left border, error is a red left border. Toasts sit above the tab bar, last about
  3 seconds, and never block interaction.
- The **confirm-receipt pair** — "Everything's good" / "Report a problem" — must have
  **equal visual weight**. Neither is Primary. This is a deliberate exception to normal
  hierarchy, so the UI does not bias a fairness-critical decision.
- **Order Badge statuses and tints**:
  - `Pickup arranged` → `accent-tint` (`#CCFBF1`) with `accentHover` (`#0F766E`) text
  - `Awaiting your confirmation` → `warning-tint` (`#FEF3C7`) with `text-secondary` (`#525252`) text
  - `Completed` → `success-tint` (`#DCFCE7`) with `success` (`#16A34A`) text
  - `Refunded` → `neutral-100` (`#F5F5F5`) with `text-secondary` (`#525252`) text (quiet neutral gray tint for terminal refunded state)
- **Escrow disputes are a red banner override during active review, resolved to Refunded badge**:
  During review, a red dispute banner displays. Once an admin resolves the dispute in the buyer's favor, the banner is replaced with the neutral gray **Refunded** Order Badge as the terminal state.
- Destructive confirmations use the **native** OS dialog, not a custom in-app sheet.

---

## 4. Templates

Five layouts: **Auth** · **Marketplace/Feed** (2-column grid) · **Detail** (full-bleed
image + sticky bottom action) · **Form** (single column + persistent bottom submit) ·
**Profile/Settings** (grouped rows separated by dividers).

All respect iOS safe-area insets and OS font scaling.

---

## 5. Content rules

Locked terminology — **no synonyms**:

| Use | Never |
|---|---|
| **Verified** | approved, confirmed, validated |
| **Pickup** | delivery, dropoff, collection point |
| **Order** | purchase, transaction, deal |
| **Report a problem** | dispute, complain, raise issue |

Buttons are verb-first. Errors state **what happened and what to do next** — a payment
failure says explicitly that no money was taken. Verification is never a silent black box:
pending is stated, and rejection always carries a reason plus a way to resubmit. Empty
states nudge, they do not guilt.

---

## 6. Platform behaviour (non-negotiable)

- Android hardware and gesture back must work on every screen.
- iOS safe areas respected top and bottom; edge-swipe back stays functional.
- System font scaling honoured.
- Native alert/dialog for destructive confirmations.
- Numeric keyboards forced on PIN and matriculation-number fields.

---

## 7. Canvas map (`design/starter.pen`)

Components sit in a band at `y = -500`. Screens are 390 wide, `fit_content(844)` tall
(fixed 844 where a sticky bottom bar is used), laid out on a 450px x-step and 1800px
row pitch.

| Row | y | Screens |
|---|---|---|
| 1 — Auth | 1200 | Splash · Login · Signup · Select Role · Select University · Forgot Password · Enter Code · New Password · Reset Success |
| 2 — Verification | 3000 | Verify Choice · Verify Capture · Verify Pending · Verify Approved · Verify Rejected |
| 3 — Buyer core | 4800 | Buyer Home · Search · Listing Detail · Checkout Pickup · Paystack Handoff · Order Placed · Payment Failed |
| 4 — Handoff | 6600 | Collect Start · Seller PIN · Enter PIN · Confirm Receipt |
| 5 — Orders | 8400 | Orders · Order Detail · Order Disputed |
| 6 — Seller | 10200 | Seller Dashboard · Create Listing 1–4 (photos → details → category → review) · Listing Published |
| 7 — Profile & empty | 12000 | Profile · Settings · Empty: No Listings · No Results · No Orders |

`.pen` files are encrypted — open them through the Pencil MCP tools only. Never `Read`
or `grep` them.

---

## 8. Deliberately out of scope

These are **not** oversights. Building any of them needs a new explicit decision:

dark mode / theme toggle · platform-adaptive visual styling beyond §6 · glassmorphism and
blur · shop drop-off, third-party pickup, delivery agents · automated payout splits ·
admin analytics · referral / ambassador system.

The **web admin is deliberately utilitarian**. Do not apply this branded system there with
the same weight.
