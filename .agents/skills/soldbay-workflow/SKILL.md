---
name: soldbay-workflow
description: Information about Workflow & Continuation Guide for Soldbay
---

# Workflow & Continuation Guide

Durable process doc — read this first, before anything else on Soldbay. It is a map to the other docs plus the rules that have already cost time when missed. Everything referenced lives in this Linear project (AllOnSoldBay, team EmannCode).

## What Soldbay is (one line)

A single-campus, single-unit, student-to-student marketplace app for Nigerian universities — buy-now only (no cart), escrow-held payments, PIN-based in-person handoff as the core trust mechanism. Every account starts as a buyer; selling is a verified upgrade.

## Current phase (as of 28-09-26)

**Design phase: complete and locked** for all 15 mobile MVP screens (light + dark), the component library, and 5 of 6 Admin/Ops screens. **One reopened item:** Admin/Ops Seller Verification (it shows both Student ID and Portal at once; the locked model is choose-one) — correction prompt is in "Admin/Ops — Screen Design Prompts".

**Now: real-code integration.** Locked decisions:

* Both repos' UI was cleared to a blank slate; backend (Prisma + Postgres) untouched.
* Build order: (1) React Native component library in `soldbay-app` → (2) app screens → (3) `soldbay-web` component library (shadcn/ui) → (4) Admin/Ops screens. Mobile fully done before web.
* Styling: NativeWind for the RN app, shadcn/ui for web.
* Pace: one component per chat/reply, no batching unless explicitly agreed.
* Dark mode: system-default only, no manual toggle (so NativeWind `darkMode: "media"`).

## Which doc answers what (read in this order)

 1. **Project Overview** — what/why, surfaces, stack.
 2. **Feature/Workflow Inventory** — final MVP/Later/Cut scope. Not re-litigated elsewhere.
 3. **Screen Flow (IA)** + **Signup/Auth Rework** — mobile flows; the buyer-first model and the choose-one seller verification.
 4. **Screen Build Order (Re-Sequenced)** — screen order (design all `[X]`; code not started).
 5. **Design System Reference** — locked tokens **and the token → code map** ("READ THIS FIRST — before writing any code" section). Authoritative.
 6. **Component Inventory & Build Order** — design-locked component list AND the separate code-status section (what actually exists in code and whether it has been verified).
 7. **Admin/Ops Screen Flow (IA)** + **Admin/Ops — Screen Design Prompts** — the web admin surface.
 8. **MVP Scope & Decisions** — early scoping rationale (layout sharing, re-signup retention, messaging); the Inventory wins on conflicts.
 9. **Competitive Context & Differentiation** — research background.
10. **Daily Log (Web/Landing Build)** — HISTORICAL log of the olive-palette landing/web/logo work. Its palette is superseded; never take tokens from it.

## Rules that exist because they were missed

1. **Repo files are not a source of truth for design tokens.** `docs/soldbay-design-system.md`, `soldbay-app/tailwind.config.js` (replaced 28-09-26), `soldbay-app/src/theme/colors.ts`, `soldbay-web/src/app/globals.css`, and the shipped logo/icon assets were all generated from the OLD olive/tan/Manrope system. A build report saying "config is populated with the design tokens" is not evidence — open the file and diff it against the Design System Reference token map.
2. **Olive/tan/cream/Manrope must never appear in new code.** The superseded values are listed in the Design System Reference.
3. **Every code component is checked against four things before it counts as done:** tokens only (no hex literals), light + dark variants present, Sora type utilities only, Phosphor Regular inactive / Fill active. Track it in the Component Inventory's code-status section, not in chat.
4. **Verify claims against files, not summaries.** In the design phase, corrections were repeatedly reported as applied when the file showed otherwise. Ask for the actual file and check the specific lines.
5. **Cross-check any new doc or prompt against the most recent locked doc on the same topic** (e.g. the Admin verification error came from reusing older wording instead of the Signup/Auth Rework doc).

## Doc hygiene

* Outdated or duplicate docs get renamed with a `DELETE —` prefix in the title; Emann deletes them. Claude does not delete Linear docs.
* Docs that are kept but partly stale get an explicit status line at the top saying what is current and what is superseded.
* Genuinely new decisions are written into the relevant doc (Design System Reference for tokens, the IA docs for flows) immediately, not left in chat.

## Open items

* Web landing (`soldbay-web`) and the exported logo/icon assets are in the olive/cream palette. Decision needed: re-theme to Orange & Teal, or keep as a separate marketing look. Do not assume.
* Admin/Ops Seller Verification correction (above).
* App code: apply the corrected `tailwind.config.js` + `src/theme/tokens.js`, switch font loading from Manrope to Sora, check `docs/soldbay-design-system.md` and `src/theme/colors.ts` for the stale palette, then patch and re-verify Tab bar and Screen header. Next component after that: Search bar.

## Continuation message for a new chat

"Continuing Soldbay work — real-code integration into soldbay-app (React Native/Expo + NativeWind). Check memory for context, then check the AllOnSoldBay Linear project (EmannCode team) and read the Workflow & Continuation Guide first, then the Design System Reference's 'READ THIS FIRST — before writing any code' section."

## Design-phase workflow (for any remaining design touch-ups)

1. Claude writes a design prompt for one component/screen, referencing `soldbay-design-system.html` for every token.
2. Real references get searched first — pick 1–2 real ones, adapt, never invent purely from judgment.
3. Emann runs the prompt through Agy.
4. Claude reviews the returned files against the prompt, the locked tokens, and accessibility rules; corrections go back as targeted follow-ups with exact before/after code.
5. Once correct it is marked locked in the relevant doc.