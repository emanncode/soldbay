---
name: soldbay-competitive-context-differentiation
description: Information about Competitive Context & Differentiation for Soldbay
---

# Competitive Context & Differentiation

## Named Competitors (Nigerian campus marketplace space)

Researched directly rather than assumed — this space is more crowded than it first appeared:

* **UniSyncT** — escrow + verification + swipe-to-connect + AI search
* **Shopydash** — escrow-secured payments + in-app messaging + vendor storefronts
* **TrustBill Market** — verification + video-call verification + chat/voice/video call, solo-built by a FUTO student
* **CampusPlug** — verification + trust scores + in-app chat, 15+ campuses
* **Lumo** — verification + secure in-app communication, multi-campus
* **Campus Market / Campus Cart / [campusmarket.ng](<http://campusmarket.ng>)** — several similarly-named/branded competitors, some WhatsApp-handoff based, easy for users to confuse with each other

## What They Get Wrong / Leave Undone

* **Escrow and seller verification are now commodity features**, not differentiators — at least two competitors (UniSyncT, Shopydash) already advertise escrow as their headline safety pitch, nearly word-for-word how Soldbay would have framed it.
* **"Confirm delivery" in these apps is self-reported** — a buyer taps a button to release funds. None of the researched competitors describe a *physical, tamper-resistant confirmation mechanic* tied to the actual handoff moment.
* Several competing apps have overlapping/confusing branding ("Campus Market," "Campus Cart," "CampusPlug") — a crowded, undifferentiated-sounding field even before features are compared.

## The Actual Differentiator (locked)

**Escrow release is tied to a PIN exchanged in person at a fixed campus pickup point — not a self-reported "confirm delivery" tap.** The money doesn't move until both people are physically standing there with the code. This is a sharper, harder-to-fake trust mechanic than anything found in the competitor set, and it's simple enough to state to a non-technical reader in one sentence.

**Locked as a v1 rule, not a nice-to-have:** the PIN-handoff mechanic must ship in v1 exactly as designed (Section 6 of the design system, Tier 1 priority #6 in Screen & Component Priority) — it is the actual point of the product, not an incidental feature. If this ever gets cut or watered down under time pressure, Soldbay collapses into "yet another campus escrow app," indistinguishable from UniSyncT or Shopydash.

## Messaging, Reconsidered

Messaging (see MVP Scope & Decisions) is no longer a differentiator — it's now table stakes, matching what competitors already offer. Its value is user-experience parity, not differentiation. The PIN-handoff mechanic is the actual differentiator; messaging is a competitive necessity.

## The Mechanic Itself — Full Flow (built and locked)

Why it needs to work exactly this way: a buyer pays upfront and Soldbay holds the payment. The seller doesn't get paid just because they claim to have handed the item over — that's exploitable. Instead, at the moment of physical handoff, the seller reads a one-time PIN aloud, the buyer types it into their own app, and that action is what releases the held payment. Both people have to be physically present for the money to move.

The full sequence:

1. Buyer and seller meet at the fixed pickup point during the selected pickup window.
2. Buyer physically arrives, taps "I've Arrived — Notify Seller" in their app.
3. This unlocks the seller's ability to reveal their one-time PIN (hidden/locked before this point).
4. Seller taps to reveal the PIN, reads it aloud.
5. Buyer types that PIN into a 4-digit entry field in their own app.
6. Correct entry confirms handoff — payment releases to the seller automatically.

This is why the mechanic needs two sides (buyer and seller see different screens) and three sequential states on the seller's side (Inactive/Locked → Active/Tappable → Revealed) — the PIN literally cannot exist on screen until the buyer has checked in. Collapsing this into one static screen defeats the entire security model — this happened once during the coded build (PIN shown immediately alongside a "PIN Matched" success state, no gating) and was caught and corrected.

**Status:** fully built and confirmed across Order Status (Buyer - Not Arrived, Buyer - PIN Entry, Seller - Locked, Seller - Active, Seller - Revealed) in the coded prototype (`all-screens.html` / `all-screens-dark.html`).