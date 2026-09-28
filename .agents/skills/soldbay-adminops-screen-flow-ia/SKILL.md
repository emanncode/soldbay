---
name: soldbay-adminops-screen-flow-ia
description: Information about Admin/Ops Screen Flow (IA) for Soldbay
---

# Admin/Ops Screen Flow (IA)

Screen-to-screen flow (IA) for Admin/Ops — the web surface (`soldbay-web` admin) with a mobile fallback, companion to the mobile Screen Flow (IA) doc. Admin/Ops was deliberately excluded from that doc and from the Screen Build Order pass; this is its own IA.

**Status: 5 of 6 screens designed and LOCKED; Seller Verification is REOPENED** (see screen 2). Full design-prompt history and the open correction live in "Admin/Ops — Screen Design Prompts".

Scope source: Feature/Workflow Inventory, section 16 (Admin/Ops), MVP-tagged items only. Platform analytics/reporting is Later, not in this pass.

## Role model (LOCKED)

Single flat **admin** role for MVP — no moderator/super-admin split. Any admin can verify sellers, moderate listings/content, mediate disputes, ban/suspend/reinstate users, and review campus-change petitions. Tiered permissions can be revisited post-MVP if real usage shows a need.

## Platform scope (LOCKED)

Admin/Ops is not desktop-only. A genuine mobile fallback is in scope for MVP — the real case being an admin needing to verify a seller, action a report, or resolve something urgent when a PC isn't available. Every screen has two states: **Desktop** (sidebar shell, shadcn/ui base) and **Mobile fallback** (bottom-tab shell reusing the locked Buyer/Seller Tab Bar's structural pattern). Mobile fallback is full-capability, reflowed — not a restricted subset.

## Screen list (LOCKED — 6 screens)

1. **Admin Shell** — sidebar nav + top bar (desktop), bottom tab bar + top bar (mobile fallback). LOCKED.
2. **Seller Verification Review Queue** — pending seller verification submissions, approve/reject actions, filter by status (pending/approved/rejected). **REOPENED:** each submission is EITHER a Student ID (front + back at \~1.586:1) OR a Student Portal screenshot (adaptive portrait/landscape) — whichever path the seller chose in Profile → Switch to Seller (choose-one model, see "Signup/Auth Rework"). The detail pane must show the submitted path only, not both. An earlier version of this doc said "ID + Portal uploads", which was wrong.
3. **Moderation** — merges "Listings moderation" and "Content moderation (flagged listings/messages)" into one screen with two tabs: **New Listings** (proactive queue) and **Reported** (reactive, driven by user reports; the detail pane shows a Report Context block with reporter + reason). LOCKED.
4. **Dispute Mediation Panel** — open disputes list, detail (evidence photos, chat log excerpts, read-only vertical dispute timeline), resolve/refund actions. LOCKED.
5. **User Management** — search/browse users, user detail (profile, verification status, order history, moderation history), ban/suspend/reinstate actions. LOCKED.
6. **Campus-Change Petition Review** — queue of petitions submitted via the Help+FAQ entry point, current → requested campus, reason, 12-month policy warning, approve/deny. LOCKED.

## Cross-cutting

* Every queue screen (Verification, Moderation, Disputes, Petitions) shares one pattern: queue list → item detail pane → action buttons (positive action first/left, destructive second/right).
* Status colors: only the four flat semantic tokens, solid fill + white text pills; no separate light/dark variants.
* Design base: shadcn/ui (web-only). Typography: Fraunces for the admin page title, Sora for body. Same color/spacing/radius/elevation tokens as mobile.
* Prototype files and `handoff_manifest.md` are static HTML/Tailwind for React Native/Expo + Next.js implementation.

## Build order (design — complete except Verification correction)

Admin Shell → Seller Verification → Moderation → Disputes → User Management → Campus-Change Petitions. In real code, Admin/Ops is built after the entire mobile app and the web component library.