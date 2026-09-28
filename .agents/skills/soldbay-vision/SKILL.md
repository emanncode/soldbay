---
name: soldbay-vision
description: Information about MVP Scope & Decisions for Soldbay
---

# MVP Scope & Decisions

**Status: early scoping record (12-09-26), still valid unless noted.** The Feature/Workflow Inventory is the final triage and wins on any conflict. This doc is kept because it holds decision rationale that isn't restated elsewhere (layout sharing, re-signup retention, messaging scope). Items resolved since it was written are marked RESOLVED below.

This is the actual MVP definition — not the earlier prototype build, but what was deliberately decided to build.

## Cart

**Cut.** No add-to-cart for v1 — buy-now only. A marketplace with instant escrow checkout doesn't need a cart; it was only scaffolded routes with no real functionality behind it.

## Pickup Coordination

**App shows a suggested/scheduled pickup window.** Messaging (see below) extends through pickup, but the window still sets the initial default expectation before chat handles live adjustments. RESOLVED in the Feature/Workflow Inventory: the seller sets pickup windows and the buyer selects one; reschedule/change is MVP.

## Self-Purchase

**Blocked.** A seller cannot buy their own live listing while browsing in buyer mode. The Buy Now action is replaced by a disabled "This is your listing" state on their own listings.

## Seller Verification Gating

**Immediate access, marked "unverified."** New sellers can list right away rather than waiting for admin approval — they're just visually marked as unverified until approved. This means:

* The product card has a distinct "unverified" treatment (separate from the "Sold" state, must not visually compete with it) — built and locked
* Feed/search make unverified listings distinguishable

Verification itself is a choose-one submission (Student ID front + back, OR Student Portal screenshot) started from Profile → Switch to Seller — see "Signup/Auth Rework".

## Layout Sharing

**Buyer-mode and seller-mode keep distinct layouts.** Not shared, even where workflows are similar (e.g. profile, settings). More design work, but avoids awkward compromises between two different user contexts.

## Re-signup After Deletion

**Allowed.** Someone can re-signup with the same email after account deletion. Per the existing 5yr retention model, the old data tied to that email is kept in the DB — re-signup isn't a clean slate, it's reconnecting to retained history.

## Messaging

**Reversed — now in scope.** Competitor research showed most rival campus marketplace apps already offer in-app chat as a standard feature; excluding it made Soldbay the outlier, not the differentiator. See Project Overview for full reasoning.

Scope, locked:

* Chat opens at purchase (not just pre-purchase) — the original bypass risk is gone once escrow payment has already happened
* Stays open through pickup, and for 24hrs after PIN-confirmed handoff, then closes/archives (bounded to the transaction lifecycle, separate from the 48hr auto-release/dispute window)
* Handles live logistics (running late, changed meeting spot) that a static pickup-window can't — the window sets the default, chat handles adjustments on top
* Verified sellers only (unverified sellers don't get messaging)
* Chats are monitored
* Sharing contact info or off-app payment talk is flagged/limited, and this is stated explicitly in seller sign-up terms & privacy policy

Note: a more complete fix for pickup logistics is planned for the real launch build later — this is the interim v1 shape. RESOLVED: the messaging screen was added and is built and locked (Screen Build Order, Tier 1).

## Open Product Questions

* RESOLVED — "Switch to campus seller wrongly re-routes through full signup": superseded by the buyer-first model (every signup is a buyer account; Switch to Seller lives in Profile).
* STILL OPEN — exact stamp copy/icon for the Sold state (structure is decided, exact copy isn't).