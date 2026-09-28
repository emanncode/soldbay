---
name: soldbay-screen-prompts
description: Information about Admin/Ops — Screen Design Prompts for Soldbay
---

# Admin/Ops — Screen Design Prompts

Design prompts and status for the Admin/Ops screens (Agy renders static HTML/Tailwind prototypes; these are design artifacts, not production code). IA and scope: "Admin/Ops Screen Flow (IA)". Engineering handoff: `handoff_manifest.md` (currently v6).

**Status: 5 of 6 LOCKED. Seller Verification is REOPENED — one correction prompt below.** The round-by-round correction history for the other screens (status-pill tokens, action order, evidence-photo ratio, Reported-tab block placement, manifest stack line) is fully resolved and has been removed from this doc to keep it current.

**Standing rules for every Admin/Ops screen:**

* Stack target: React Native/Expo (`soldbay-app`) + Next.js (`soldbay-web`) — never Flutter.
* Status colors: only the four flat semantic tokens (`#14532D` / `#6B4E00` / `#8B1A10` / `#0D3B7A`), solid fill + white text. No `Bg`/`Dark` variant tokens.
* Action buttons: positive/primary first (left), destructive second (right).
* Shared pattern: queue list → detail pane → actions. Desktop = split pane; mobile = list that pushes to a full-screen detail.

## 1. Admin Shell — LOCKED

Desktop: shadcn/ui-style collapsible sidebar (5 nav items, active = peach `#FFD0A6` tint + Phosphor Fill, inactive = `#008080`/`#67B8B3`), Fraunces page title, admin identity footer. Mobile fallback: bottom tab bar reusing the Buyer/Seller Tab Bar's fluid-pill active state, Fraunces title + avatar. Dark mode: hairline borders, no shadows.

## 2. Seller Verification Review Queue — REOPENED (correction prompt)

**Why:** the built screen shows Student ID (Front), Student ID (Back) and Portal Screenshot together, and its helper copy says "Ensure the ID matches the portal screenshot." That contradicts the locked mobile model (see "Signup/Auth Rework"): a seller chooses EITHER Student ID (front + back) OR a Student Portal screenshot — never both. An earlier version of the Admin IA wrongly said "ID + Portal uploads", which is where this came from.

**Correction prompt for Agy — Seller Verification, change these things only:**

1. **Queue items:** add a small path label under the campus line — `Student ID` on one item, `Student Portal` on another — so both paths appear in the queue (Emeka U. = Student ID, Fatima A. = Student Portal).
2. **Detail pane, verification documents section — show the submitted path only:**
   * *Student ID path:* two cards side by side (Front, Back), both `aspect-[1.58/1]`, same lightbox-on-tap treatment as today.
   * *Student Portal path:* one card, no forced ratio — the existing adaptive treatment (`max-h-[400px]`, `object-contain`) so a phone (portrait) or laptop (landscape) screenshot both fit uncropped.
   * Add a small "Verification path" line in the section heading area stating which was submitted (e.g. "Submitted via Student ID").
3. **Demonstrate both states:** clicking the Emeka item shows the Student ID detail; clicking Fatima shows the Student Portal detail (a small JS toggle between two detail templates is enough — static prototype).
4. **Helper copy:** replace "Ensure the ID matches the portal screenshot and the name matches the account profile." with "Confirm the document is current (current academic level/session) and the name matches the account profile."

Everything else stays exactly as built: filter tabs, status pills, header, Approve (accent) / Reject & Request Fix (destructive outline) actions, Fraunces page title, dark mode.

**Validate before returning:** ID path shows exactly two cards and no portal card; Portal path shows exactly one adaptive card and no ID cards; no `#F47A32` outside the Approve button; no new color tokens. After it lands, `handoff_manifest.md` section 2 must be updated to describe the either/or model (currently says ID Front+Back and Portal are all shown), and this section goes back to LOCKED.

## 3. Moderation — LOCKED

Two-tab queue (New Listings / Reported). Reported items show a flag + reason line in the queue and a standalone full-width Report Context block (solid `#6B4E00`, white text: who reported and why) between the listing header and the image gallery. Actions: Approve Listing (accent) / Take Down (destructive outline).

## 4. Dispute Mediation Panel — LOCKED

Read-only vertical dispute timeline (locked mobile stepper), chat log with alternating peach/light bubbles, square evidence photo grid (`aspect-square`), resolution actions: Release funds (success outline) / Refund (destructive outline).

## 5. User Management — LOCKED

Persistent search bar (no filter tabs), profile header with status badge, metrics (active listings, sales, reports), moderation history list, actions: Issue Warning / Lift Suspension.

## 6. Campus-Change Petition Review — LOCKED

Current → Requested campus block, reason, solid-fill 12-month policy warning block, actions: Approve Change (accent, first) / Reject Petition (destructive outline).