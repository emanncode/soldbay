# Soldbay Admin/Ops Module - Engineering Handoff Manifest

**Revision status:** v6 — All corrections from earlier rounds (Verification portal ratio/ID back, Moderation reported tab structure/placement, Disputes evidence ratio, and all token/button fixes) have been implemented and locked.

## Overview
This document serves as the official handoff manifest for the Soldbay Admin/Ops module. All screens have been prototyped in static HTML/Tailwind and locked for React Native/Expo (soldbay-app) + Next.js (soldbay-web) implementation. 

The design relies heavily on a responsive **Master-Detail split pane** pattern. On desktop/tablet, this displays as a side-by-side queue and detail view. On mobile, it falls back to a standard queue list that pushes/navigates to a full-screen detail view.

---

## 1. Global Shell & Navigation
**Prototype:** `adminops-shell-prototype.html`

### Engineering Notes:
- **Desktop Sidebar:** Collapsible `shadcn/ui` style sidebar. Active states use `#FFD0A6` (bg-card) with Phosphor Fill (`ph-fill`) icons.
- **Mobile Tab Bar:** Fixed bottom tab bar. Uses a fluid pill shape (`w-16 h-[34px]`) for the active tab background to prevent Flexbox squishing. Icon size is `28px`.
- **Dark Mode:** Do not use drop shadows in dark mode. Use hairline borders (`border-borderDark/20`) for elevation.

---

## 2. Seller Verification Queue
**Prototype:** `adminops-verification-prototype.html`

### Engineering Notes:
- **Layout:** Master-Detail. Detail pane uses `w-full px-[5%]` for fluid stretching on large monitors.
- **Images:** Verification uses an either/or model. A user submits EITHER Student ID (Front + Back) OR a Student Portal Screenshot. The detail pane only shows the submitted path. When Student ID is submitted, the Front and Back images must maintain a `1.58:1` aspect ratio (standard ID card format). When Student Portal is submitted, the screenshot uses adaptive portrait/landscape sizing instead — a phone screenshot and a laptop screenshot are genuinely different shapes, so it should not be forced into a specific ratio. Implement an image viewer/lightbox on tap for all images.
- **Actions:** 
  - Approve: Solid Accent Button (`#F47A32`).
  - Reject: Destructive Outline Button (flat `statusError` color, same in light and dark mode — no separate dark-mode variant).

---

## 3. Moderation (Listings & Content)
**Prototype:** `adminops-moderation-prototype.html`

### Engineering Notes:
- **Queue Tabs:** A pill-style toggle at the top of the queue switches between `New Listings` and `Reported` data sources.
- **Detail View:** Renders full listing context directly in the pane. Do not navigate the admin out to the public app to view a listing.
- **Actions:** Take Down action must use the Destructive Outline style to prevent accidental clicks during rapid queue clearance.

---

## 4. Dispute Mediation Panel
**Prototype:** `adminops-disputes-prototype.html`

### Engineering Notes:
- **Timeline:** Reuses the mobile Dispute Status stepper component in a vertical, read-only configuration.
- **Chat Logs:** Implements the locked chat bubble styling. Buyer/Seller messages should visually alternate (e.g., Peach fill for one party, White/Light fill for the other) for clarity.
- **Actions:** Both resolution actions involve moving money. Use Destructive Outline (Red) for Refunds, and Success Outline (Green) for Releasing funds. 

---

## 5. User Management Directory
**Prototype:** `adminops-users-prototype.html`

### Engineering Notes:
- **Search:** The queue pane drops the standard filter tabs in favor of a persistent Search Bar for directory lookups.
- **Metrics:** Display active listings, sales, and reports prominently below the user header.
- **History:** Implement a scrollable `ListView` for moderation history.

---

## 6. Campus-Change Petition Review
**Prototype:** `adminops-petitions-prototype.html`

### Engineering Notes:
- **Visual Mapping:** Implement a clear `[Current Campus] ➔ [Requested Campus]` UI block.
- **Policy Enforcement:** If a user has changed campuses within the last 12 months, render a warning block using a solid `statusWarning` fill with white text (no separate light/dark background variant) to alert the admin before they approve the change.

---

## Design System Tokens
All prototypes map to the locked tokens from `soldbay-design-system.html`. Status colors use only the four original flat semantic tokens — `statusSuccess: '#14532D'`, `statusError: '#8B1A10'`, `statusWarning: '#6B4E00'` (plus `info`, not used on these screens) — always as a solid fill with white text, identical in light and dark mode. Do NOT port `statusErrorDark`, `statusSuccessDark`, or `statusWarningDark` into the application theme — these were an early, incorrect addition and have been removed from every screen; they should not exist anywhere in the final implementation.
