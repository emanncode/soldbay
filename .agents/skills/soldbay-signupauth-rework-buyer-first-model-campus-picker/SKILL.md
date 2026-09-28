---
name: soldbay-signupauth-rework-buyer-first-model-campus-picker
description: Information about Signup/Auth Rework — Buyer-First Model + Campus Picker for Soldbay
---

# Signup/Auth Rework — Buyer-First Model + Campus Picker

> **STATUS: BUILT AND LOCKED.** Every piece below is confirmed in the coded prototype (`all-screens.html` / `all-screens-dark.html`) — Login, Sign Up, Campus Picker (3 states), and Switch to Seller (5 states). This doc is the single consolidated record of the buyer-first pivot decision; two earlier duplicate/draft docs covering the same ground were merged into this one.

This was a real product-model change, not a copy tweak — every account is a buyer account first; "seller" is an upgrade initiated from Profile, not a choice made at signup.

## Locked decision

Every signup produces a buyer account. There is no buyer/seller choice at Sign Up. A user who wants to sell goes to Profile → Switch to Seller afterward.

## Sign Up screen — fields, in order

1. **First Name** / **Surname** — two separate inputs, side by side in one row
2. **Matric Number** — single text input, collected but **not verified** at this stage
3. **Email**
4. **Phone Number** — optional
5. **Campus** — opens the Campus Picker (below), not an inline dropdown
6. **T&Cs checkbox** — "Create Account" button starts disabled/greyed, becomes active once checked

No ID upload, no matric verification, no student-portal check anywhere on Sign Up — all of that lives in Switch to Seller.

## Campus Picker (full-screen, not inline dropdown)

The campus list is long (700+ Nigerian tertiary institutions) so this is its own full-screen pattern, not the standard inline Select:

* Tapping Campus opens a full-screen picker: back arrow + "Select Campus" title, Search Bar pinned top, scrollable list below (Generic List Item pattern)
* Typing narrows the list live
* Selecting closes the picker, Campus field shows the selected name
* Field stays tappable to reopen and change the selection while still on Sign Up (this doesn't conflict with the "locked after account creation, support-request only" rule — that applies post-signup, not during the form itself)
* Three states, all built: default (full list), filtered (narrowed), empty ("No campus found")

**Data note (backend, not design):** no single official API from NUC; community-maintained open datasets exist (e.g. Nigeria Tertiary Institutions API, \~752 institutions) or a one-time scrape of Wikipedia's List of Universities in Nigeria.

## Switch to Seller (Profile-initiated) — final verification model

**This is where the model evolved during the build — the final, correct version is: choose one, not both.** An earlier draft of this decision said both Student ID and Student Portal screenshot were required; that was superseded during the coded-prototype review. The actual locked model:

* User chooses **either** Student ID **or** Student Portal screenshot (a selectable-card choice, not two mandatory uploads)
* Whichever is chosen must be **current** (current academic level/session) — explicit instruction copy communicates this
* **Student ID path:** two upload slots, front and back, each sized to an actual ID-card aspect ratio (\~1.586:1) — not a generic square/portrait photo box
* **Student Portal path:** one upload slot with an adaptive preview area (`width:100%; height:auto`) that correctly fits either a phone screenshot (portrait) or a laptop screenshot (landscape) — not forced into one fixed shape
* Both paths have a filled/uploaded state (thumbnail + "Change" affordance), not just the empty tap-to-upload prompt
* "Submit for Verification" button is disabled until the chosen path actually has content
* Five states, all built: default/unchosen, ID chosen + empty, ID chosen + filled, Portal chosen + empty, Portal chosen + filled

## Seller Profile (new screen, built alongside this)

Profile is built twice — buyer and seller layouts are distinct. Seller Profile: avatar, business/display name + icon-only Verified badge, aggregate rating (score + review count), Listings/Account Security/Help & Support/App Version entries, and a "Switch to Buyer" toggle for mode-switching between the two profiles.