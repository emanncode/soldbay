# Soldbay

## What Soldbay Is

Soldbay is a marketplace app built specifically for university students in Nigeria to buy and sell with each other on campus. Single campus per account, single-unit listings, buy-now only (no cart).

## The Problem

Campus marketplaces currently run entirely on trust and hope — no way to verify who you're actually dealing with, and no protection if a deal goes wrong.

## The Model

Verified seller lists an item → buyer pays via escrowed payment (Paystack or Flutterwave) → fixed campus pickup point → PIN-handoff confirms the exchange → 48hr window → auto-release or dispute.

Money only moves once the item actually changes hands — that's the core trust mechanism the whole product is built around. Every account starts as a buyer account; selling is an upgrade a user opts into and verifies for (Profile → Switch to Seller).

## Messaging — Revisited

Originally excluded on purpose (risk of buyers/sellers routing around escrow). Reversed after competitor research showed most rival Nigerian campus marketplace apps (UniSyncT, Shopydash, TrustBill Market, CampusPlug, Lumo) already offer in-app chat as a core, advertised feature — no messaging would have made Soldbay the outlier, not the differentiator.

Scoped to manage the original risk without needlessly restricting it: chat opens at purchase (the bypass risk is already gone once escrow payment has happened), stays open through pickup, and for 24hrs after PIN-confirmed handoff before closing/archiving. Verified sellers only, chats monitored, and sharing contact info or off-app payment talk is flagged/limited and stated in seller sign-up terms & privacy policy.

Pickup-window scheduling (an app-shown suggested/scheduled window) still exists as its own feature — it sets the initial default expectation, while chat handles live logistics adjustments (running late, changed meeting spot) on top of it. A more complete fix for pickup logistics is planned for the real launch build later; this is the interim v1 shape.

## Surfaces & stack

* **Mobile app** (`soldbay-app`): React Native / Expo, NativeWind styling — buyer and seller modes.
* **Web** (`soldbay-web`): Next.js — public landing page + the Admin/Ops panel (shadcn/ui).
* **Backend**: Prisma + Postgres.

## Who's Building This

Solo build. Design and product decisions are documented in this project before implementation. Start with the "Workflow & Continuation Guide" — it maps every other doc and states the current phase.
