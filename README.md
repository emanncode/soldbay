# Soldbay

> **Documentation hierarchy:** Current product scope and design decisions live
> in the AllOnSoldBay Linear project. The repository code is the evidence for
> implementation status. `docs/daily-log.md` is historical; older design docs
> are explicitly marked below where superseded. If product decisions and code
> differ, record the gap instead of implying implementation is complete.

## Product and design references

- **Product scope and workflow:** AllOnSoldBay Linear project. The Feature/Workflow Inventory is the scope reference; the more specific signup/auth and screen-flow documents define their respective workflows. The October 13 Market Validation Plan is the current market-evidence reference. Older overview copy that states the trust problem as established is a hypothesis, not validated evidence.
- **Design tokens:** Linear's Design System Reference (updated October 7, 2026) is the global token reference. Some Admin/Ops documents updated September 28 still specify white text for semantic fills in both modes; follow the later global token guidance and update those prompts when they are next revised.
- **Visual snapshot:** [Soldbay-Designs in Figma](https://www.figma.com/design/sgQa1LT80qwtk317aSbXHS/Soldbay-Designs) contains imported HTML-to-Design snapshots: light screens (`0:1`), dark screens (`5:2488`), and components (`7:4846`), dated September 25–26, 2026. Treat these as visual references, not proof of current implementation or later design decisions. Linear's October updates are newer; where a snapshot conflicts with a later Linear decision, record the discrepancy and use the later decision.

Linear is not fully internally synchronized: its global Design System Reference is newer than the Admin/Ops prompt's semantic-text rule, and its October market-validation draft qualifies older overview claims. Keep these differences visible until the affected Linear documents and Figma snapshots are refreshed.

## What Soldbay Is

Soldbay is a marketplace app built specifically for university students in Nigeria to buy and sell with each other on campus. Single campus per account, single-unit listings, buy-now only (no cart).

## The Problem

Soldbay's initial product hypothesis is that campus transactions need better identity and handoff safeguards. The market-validation plan in Linear treats the strength of that problem as unvalidated and calls for student interviews before making a larger market bet.

## The Model

Seller lists an item (verification status is shown) → buyer pays → campus pickup → PIN-confirmed handoff → 48-hour confirmation/dispute window. This is the intended product flow; live payment settlement and automatic release are not yet evidenced as complete in the repository.

The intended trust mechanism is to release funds only after the item changes hands. Every account starts as a buyer account; selling is an upgrade a user opts into from Profile. Linear's current MVP allows sellers to list while unverified, with a visible unverified badge. The existing server still gates listing writes on approval; see the implementation gap below.

## Messaging — Revisited

Originally excluded on purpose (risk of buyers/sellers routing around escrow). Reversed after competitor research showed most rival Nigerian campus marketplace apps (UniSyncT, Shopydash, TrustBill Market, CampusPlug, Lumo) already offer in-app chat as a core, advertised feature — no messaging would have made Soldbay the outlier, not the differentiator.

Scoped to manage the original risk without needlessly restricting it: chat opens at purchase (the bypass risk is already gone once escrow payment has happened), stays open through pickup, and for 24hrs after PIN-confirmed handoff before closing/archiving. Verified sellers only, chats monitored, and sharing contact info or off-app payment talk is flagged/limited and stated in seller sign-up terms & privacy policy.

Pickup-window scheduling (an app-shown suggested/scheduled window) still exists as its own feature — it sets the initial default expectation, while chat handles live logistics adjustments (running late, changed meeting spot) on top of it. A more complete fix for pickup logistics is planned for the real launch build later; this is the interim v1 shape.

## Surfaces & stack

- **Mobile app** (`soldbay-app`): React Native / Expo, NativeWind styling — buyer and seller modes.
- **Web** (`soldbay-web`): Next.js — public landing page, shared APIs, and a currently limited admin area (login and waitlist page; designed Admin/Ops screens remain to be built).
- **Backend**: Prisma + Postgres.

The current web CSS theme also still uses the historical olive palette. The
Linear orange/teal design system is authoritative, but its web implementation
remains to be synchronized.

Current implementation caveat: browse/search, chat, orders, and verification
screens in the mobile client still use mock or placeholder data/actions. The
server-side seller role/publish gate also does not yet match Linear's latest
unverified-seller listing decision. See [docs/architecture.md](docs/architecture.md)
for the verified gaps and [soldbay-app/README.md](soldbay-app/README.md) and
[soldbay-web/README.md](soldbay-web/README.md) for local development.

## Who's Building This

Solo build. For current product scope and design decisions, start with the Linear "Workflow & Continuation Guide" and related project docs. Its dated implementation status may be stale; verify implementation against this repository.
