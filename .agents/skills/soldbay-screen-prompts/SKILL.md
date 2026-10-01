---
name: soldbay-screen-prompts
description: Information about Admin/Ops — Screen Design Prompts for Soldbay
---

# Admin/Ops — Screen Design Prompts

Design prompts and status for the Admin/Ops screens (Agy renders static HTML/Tailwind prototypes; these are design artifacts, not production code). IA and scope: "Admin/Ops Screen Flow (IA)". Engineering handoff: `handoff_manifest.md` (currently v6).

**Status: All 6 screens LOCKED.** The round-by-round correction history for the other screens (status-pill tokens, action order, evidence-photo ratio, Reported-tab block placement, manifest stack line) is fully resolved and has been removed from this doc to keep it current.

**Standing rules for every Admin/Ops screen:**

* Stack target: React Native/Expo (`soldbay-app`) + Next.js (`soldbay-web`) — never Flutter.
* Status colors: only the four flat semantic tokens (`#14532D` / `#6B4E00` / `#8B1A10` / `#0D3B7A`), solid fill + white text. No `Bg`/`Dark` variant tokens.
* Action buttons: positive/primary first (left), destructive second (right).
* Shared pattern: queue list → detail pane → actions. Desktop = split pane; mobile = list that pushes to a full-screen detail.

## 1. Admin Shell — LOCKED

Desktop: shadcn/ui-style collapsible sidebar (5 nav items, active = peach `#FFD0A6` tint + Phosphor Fill, inactive = `#008080`/`#67B8B3`), Fraunces page title, admin identity footer. Mobile fallback: bottom tab bar reusing the Buyer/Seller Tab Bar's fluid-pill active state, Fraunces title + avatar. Dark mode: hairline borders, no shadows.

## 2. Seller Verification Review Queue — LOCKED

Two verification paths supported via an either/or model (matching the locked mobile Signup/Auth flow): EITHER Student ID (front + back) OR Student Portal screenshot. The detail pane dynamically displays only the documents for the chosen path, with a "Verification path" label denoting the submission type. Helper copy instructs the admin to confirm the document is current and the name matches the account profile.

## 3. Moderation — LOCKED

Two-tab queue (New Listings / Reported). Reported items show a flag + reason line in the queue and a standalone full-width Report Context block (solid `#6B4E00`, white text: who reported and why) between the listing header and the image gallery. Actions: Approve Listing (accent) / Take Down (destructive outline).

## 4. Dispute Mediation Panel — LOCKED

Read-only vertical dispute timeline (locked mobile stepper), chat log with alternating peach/light bubbles, square evidence photo grid (`aspect-square`), resolution actions: Release funds (success outline) / Refund (destructive outline).

## 5. User Management — LOCKED

Persistent search bar (no filter tabs), profile header with status badge, metrics (active listings, sales, reports), moderation history list, actions: Issue Warning / Lift Suspension.

## 6. Campus-Change Petition Review — LOCKED

Current → Requested campus block, reason, solid-fill 12-month policy warning block, actions: Approve Change (accent, first) / Reject Petition (destructive outline).