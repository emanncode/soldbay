# Soldbay Admin/Ops Module - Engineering Handoff Manifest

> **Status: historical handoff; reconcile with Linear before implementation.**
> This v6 manifest predates later Linear design and accessibility updates. Use
> the current Admin/Ops Screen Flow and Screen Design Prompts for screen intent,
> and the current Design System Reference for tokens and contrast rules. In
> particular, do not use this file's instruction to use white text for dark-mode
> semantic colors; Linear's 03-10-26 correction requires `darkBg` text on dark
> semantic fills. Seller Verification remains reopened in Linear.

> **Cross-reference conflict:** the September 28 Admin/Ops Screen Design Prompts
> still says semantic fills use white text in both themes. The October 7 global
> Design System Reference is newer and governs token pairings; treat the prompt
> wording as stale until that Linear document is reconciled. The linked
> Soldbay-Designs Figma pages are imported HTML snapshots dated September 25–26,
> so confirm them against later Linear decisions before implementation.

**Revision status:** v6 historical snapshot — Linear currently reopens Seller Verification for correction, and later accessibility/token decisions supersede portions of this handoff.

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
- **Historical note:** Campus-change petition behavior and visual treatment must be checked against the current Linear Admin/Ops IA and Design System Reference before implementation. The data model/routes in this checkout do not currently implement the described campus-change workflow.

---

## Design System Tokens

Use current tokens and contrast rules from the AllOnSoldBay Linear Design
System Reference. This older manifest's flat semantic token names and claim
that white text applies in both themes are superseded. In dark mode, semantic
fills use `darkBg` text; status indicators include an icon and label. Do not
copy token values from this historical section.
