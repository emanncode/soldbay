---
name: allonsoldbay
description: Support discovery and implementation of Soldbay using the current Feature/Workflow Inventory and emerging product decisions.
---

# AllOnSoldBay Agent Skill

## Product context

Soldbay is in active product discovery.

The original concept remains useful for understanding the product’s intent. However, do **not** treat earlier documentation about locked v1 scope, screen/component tiers, design systems, timelines, or logged work as current direction.

The **Feature/Workflow Inventory** and documentation created after it are the working source of truth.

## Discovery-first rules

- Read the Feature/Workflow Inventory and newer product notes before proposing or implementing work.
- Treat product decisions as provisional unless they are explicitly marked as confirmed.
- Identify unclear requirements, dependencies, and product assumptions before building.
- Do not infer requirements from obsolete screens, tiers, design tokens, dates, or prior implementation plans.
- When current documentation conflicts with earlier material, follow the newer documentation.
- Preserve the core Soldbay idea while allowing flows, scope, UX, and architecture to evolve.

## Implementation workflow

1. Identify the relevant feature, actor, workflow, and desired outcome.
2. Review the current inventory, nearby code, types, API contracts, and existing patterns.
3. Briefly state assumptions and unresolved questions.
4. Build the smallest useful slice that validates the workflow.
5. Handle loading, empty, error, and success states.
6. Run relevant type checks, tests, linting, and build commands.
7. Report changes, assumptions, validation results, and recommended follow-up discovery.

## UX and design

- Follow existing repository conventions where they are intentional and still applicable.
- Do not assume a design system is final or create broad visual foundations without direction.
- Prefer clear, accessible, responsive interfaces that validate the workflow.
- Reuse stable components where possible, but avoid forcing new flows into obsolete UI patterns.

## Code quality

- Keep changes focused and reversible while the product is evolving.
- Use explicit types at system boundaries.
- Avoid speculative abstractions and unrelated refactors.
- Do not hardcode business rules that are likely to change.
- Add or update tests for stable behavior where the repository supports them.

## Before completion

Confirm:

- The work aligns with the current Feature/Workflow Inventory.
- No obsolete scope or design assumptions were used as requirements.
- Key workflow states are handled.
- Validation results and outstanding decisions are clearly reported.

## Linear Link to be accessed with the linear mcp
"https://linear.app/emanncode/project/allonsoldbay-8189401cb950/overview"
## Project Overview — The Idea

### What Soldbay Is

Soldbay is a marketplace app built specifically for university students in Nigeria to buy and sell with each other on campus. Single campus per account, single-unit listings, buy-now only (no cart).

### The Problem

Campus marketplaces currently run entirely on trust and hope — no way to verify who you're actually dealing with, and no protection if a deal goes wrong.

### The Model

Verified seller lists an item → buyer pays via escrowed payment (Paystack or Flutterwave) → fixed campus pickup point → PIN-handoff confirms the exchange → 48hr window → auto-release or dispute.

Money only moves once the item actually changes hands — that's the core trust mechanism the whole product is built around. Every account starts as a buyer account; selling is an upgrade a user opts into and verifies for (Profile → Switch to Seller).

### Messaging — Revisited

Originally excluded on purpose (risk of buyers/sellers routing around escrow). Reversed after competitor research showed most rival Nigerian campus marketplace apps (UniSyncT, Shopydash, TrustBill Market, CampusPlug, Lumo) already offer in-app chat as a core, advertised feature — no messaging would have made Soldbay the outlier, not the differentiator.

Scoped to manage the original risk without needlessly restricting it: chat opens at purchase (the bypass risk is already gone once escrow payment has happened), stays open through pickup, and for 24hrs after PIN-confirmed handoff before closing/archiving. Verified sellers only, chats monitored, and sharing contact info or off-app payment talk is flagged/limited and stated in seller sign-up terms & privacy policy.

Pickup-window scheduling (an app-shown suggested/scheduled window) still exists as its own feature — it sets the initial default expectation, while chat handles live logistics adjustments (running late, changed meeting spot) on top of it. A more complete fix for pickup logistics is planned for the real launch build later; this is the interim v1 shape.

### Surfaces & stack

* **Mobile app** (`soldbay-app`): React Native / Expo, NativeWind styling — buyer and seller modes.
* **Web** (`soldbay-web`): Next.js — public landing page + the Admin/Ops panel (shadcn/ui).
* **Backend**: Prisma + Postgres.

### Who's Building This

Solo build. Design and product decisions are documented in this project before implementation. Start with the "Workflow & Continuation Guide" — it maps every other doc and states the current phase.
