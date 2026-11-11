# Soldbay Screen Specifications — Stage 04, Step 08

**Status:** Functional screen specifications drafted from the approved PSS, current IA, and owner-approved screen inventory baseline. They define task content and behavior, not visual layout. Owner review of the details and unresolved staff routes is still required before screen composition.
**Authority:** [`architecture.md`](architecture.md), current AllOnSoldBay workflow/IA records, and [`screen-architecture.md`](screen-architecture.md).
**Visual direction:** No current theme, palette, component appearance, or layout is approved. Follow [`design-reference-studies.md`](design-reference-studies.md) for visual research and later design.
**Artifact boundary:** Keep this specification in Markdown. Pencil is for visual reference studies and design artifacts, not text documentation.

## Shared screen contract

- Buyer and seller product experiences are mobile apps. The web product is the Soldbay staff console. Couriers are external participants with scoped delivery contact, not an app role in this specification.
- There is one flat Soldbay Admin role. Support and Ops are assigned work contexts, not separate authorization roles.
- Screen availability and actions follow the PSS. A screen never authorizes an operation solely because a component is visible.
- Show the current record, state, next actor/action, and relevant deadline together when that information is needed for the task. Keep pending, unknown, server-confirmed, and terminal states distinct.
- Chat is opened from a negotiable listing or a paid order; there is no global inbox. Notifications deep-link to their associated listing, order, chat, or request. A handoff code is never included in a notification.
- Status color is never the only state signal. Preserve user input safely across errors and interruptions. Do not claim provider, Admin, courier, or user action has completed until its authoritative event is recorded.
- Each screen's visual reference study is a separate, sourced artifact. It does not change the content, routes, role permissions, or workflow below.

## Buyer account and access

### AU-01 — Create account

- **Entry / user:** Signed-out person choosing to register.
- **Content:** Email, password, separate Terms acceptance, separate Privacy acceptance, one 18+ confirmation checkbox, and validation feedback.
- **Actions / route:** Create account proceeds to AU-02; sign-in route to AU-04. Do not collect matric number, date of birth, student proof, or age-verification material here.
- **States / trace:** Empty, invalid email/password, required acknowledgement missing, submitting, recoverable failure; preserve valid entries. AC-01, AC-36.

### AU-02 — University and campus

- **Entry / user:** New account, after initial credentials/acknowledgements.
- **Content:** Supported university selector followed by the required full-screen campus choice and selected-campus confirmation.
- **Actions / route:** Choose university, then a campus belonging to it; continue to AU-03/account creation. No skip path. Campus scope is stored for discovery.
- **States / trace:** Campus unavailable until university selected; registry loading/error; no available campus; selected campus cannot be changed casually after signup. AC-01, AC-56.

### AU-03 — Verify email

- **Entry / user:** New account immediately before app access.
- **Content:** Destination email, OTP entry, expiry/resend guidance, and verification status.
- **Actions / route:** Submit code; resend when eligible; correct email through the defined recovery path. Successful server verification enters the buyer app.
- **States / trace:** Invalid/expired code, resend pending/failure, submitting, verified. No authenticated app entry before verification. AC-01.

### AU-04 — Log in / 2FA

- **Entry / user:** Existing active account.
- **Content:** Email/password; after valid credentials, request TOTP or one unused recovery code when 2FA is enabled.
- **Actions / route:** Authenticate to the user's permitted app mode; route forgotten password to AU-05; lost-factor help to PF-04.
- **States / trace:** Invalid credentials, 2FA challenge, invalid/reused code, loading, rate-limit/lock state and recovery path. Do not bypass required seller 2FA. AC-34–36, AC-58.

### AU-05 — Forgot password

- **Entry / user:** Returning user who cannot authenticate.
- **Content:** Email destination, OTP, new-password fields, validation and completion status.
- **Actions / route:** Request email OTP, verify, set password, return to AU-04. Password reset does not reactivate a deactivated account or reset 2FA.
- **States / trace:** Invalid/expired OTP, resend, weak/mismatched password, pending, success/failure. AC-34, AC-58.

### AU-06 — Reactivate account

- **Entry / user:** User signs in to a deactivated account.
- **Content:** Same-account reactivation choice and clear summary of restored access; seller listing review requirement when relevant.
- **Actions / route:** Decline ends sign-in and keeps account deactivated; accept restores retained history and account access. Seller listings stay paused until individually reviewed and republished.
- **States / trace:** Decision pending, declined, restoring, reactivated, recoverable failure. Do not create a replacement account or publish listings automatically. AC-11, AC-22, AC-34, AC-44.

## Buyer marketplace

### BY-01 — Browse

- **Entry / user:** Authenticated buyer on the selected campus.
- **Content:** Campus context, search entry, categories, Recently Added results, product photos, title, price, condition, negotiability and seller indicator as available.
- **Actions / route:** Open BY-02 search/filters, BY-03 eligible detail, Saved, Orders, Profile, or relevant notification. Only current-campus public listings appear.
- **States / trace:** Loading, refresh, pagination, empty, stale/offline and unavailable results. A sold listing may appear for its one-hour sold-tag period but is non-clickable; other unavailable listings do not return to public browse. AC-23, AC-46, AC-52.

### BY-02 — Search and filters

- **Entry / user:** Buyer from Browse or a category result.
- **Content:** Query, category, price range, verified seller, condition, availability and active-filter summary.
- **Actions / route:** Apply/clear filters, sort by price or recency, open eligible result in BY-03, return to prior browse context.
- **States / trace:** No results, validation for price bounds, active chips, loading, stale/offline; results remain campus-scoped. No popularity sort in MVP. AC-46–47.

### BY-03 — Product detail

- **Entry / user:** Buyer opens a public listing from Browse, Search, or Saved.
- **Content:** Published photos, title, description, condition, normal/effective price, availability, seller verification status, negotiable tag when applicable, and contextual report action.
- **Actions / route:** Buy/order at the applicable price through CO-01. Open BY-05 pre-purchase chat only for a negotiable listing. Open a safety report from this context. Prevent self-purchase.
- **States / trace:** Active, negotiation/order locked, unavailable, self-purchase blocked, stale listing. Never imply current price/availability when data is stale. AC-13, AC-23, AC-49, AC-59.

### BY-04 — Saved listings

- **Entry / user:** Buyer opens Saved from the app navigation or Profile.
- **Content:** Saved listing cards with current campus and availability state.
- **Actions / route:** Remove from saved or open an eligible listing in BY-03; other main destinations remain reachable.
- **States / trace:** Empty, loading, stale, unavailable, item removed. Saving does not bypass campus scope, listing locks, or order eligibility. AC-48.

### BY-05 — Negotiation thread

- **Entry / user:** Buyer starts chat on a negotiable listing; seller opens that listing's conversation.
- **Content:** Listing context and state, messages, composer, accepted-price terms/expiry when present, and safety/report access.
- **Actions / route:** Send scoped text, submit/accept a price proposal as permitted by PSS, proceed to CO-01 at a buyer-specific accepted amount, or return to BY-03.
- **States / trace:** Active, accepted price locked to this buyer for 90 minutes, expiry, no-message closure after 24 hours, blocked, closed read-only, connection error. Fixed-price listings have no pre-purchase chat. No global inbox, typing indicator, or photo attachment. AC-03–04, AC-13, AC-51.

### BY-06 — Order chat

- **Entry / user:** Buyer or seller opens communication from an active order or its archived record.
- **Content:** Associated order/listing context, timeline-relevant notices, messages, and composer/read-only explanation.
- **Actions / route:** Send scoped coordination messages while permitted; follow the order into OR-02/OR-04 or return to the originating record.
- **States / trace:** Active, interrupted draft, blocked, archived read-only; archived content remains visible but cannot be sent to. No global inbox or photo attachment. AC-25, AC-51–52.

## Checkout, orders, and handoff

### CO-01 — Checkout

- **Entry / user:** Buyer selects order from BY-03 or an active accepted price in BY-05.
- **Content:** One item, effective agreed price, campus, meetup/courier choice, fixed campus meetup point or buyer-preferred campus destination, disclosed courier fee, total, and payment method summary.
- **Actions / route:** Confirm and initiate payment; on provider-confirmed success go to OR-01. Return to listing/chat before payment if correction is needed.
- **States / trace:** Listing revalidation/lock, invalid destination, submitting, provider pending, confirmed failure, unknown result reconciliation. Never create a duplicate order/payment or mark paid from a redirect alone. AC-05, AC-14, AC-26, AC-37–40, AC-59.

### OR-01 — Order confirmation

- **Entry / user:** Buyer and seller open the result after checkout begins.
- **Content:** Order reference and authoritative payment/order status.
- **Actions / route:** Confirmed paid opens OR-02. Pending stays in reconciliation. Confirmed failure releases the reservation and offers only a safe retry/return route.
- **States / trace:** Pending, confirmed paid, confirmed failed, unknown/reconciling. Do not display a success state without provider confirmation. AC-05, AC-14.

### OR-02 — Order detail/status

- **Entry / user:** Buyer or seller opens an owned order from Orders, notification, checkout, or contextual chat.
- **Content:** Item, parties, payment/funds state, fulfilment, timeline, next actor/action, exact applicable deadline, order-scoped chat, and support route.
- **Actions / route:** Seller marks Ready; continue to meetup booking OR-03 or courier coordination OR-04; buyer enters code via OR-05; open eligible dispute DS-01/DS-02, review RV-01, or help request as allowed.
- **States / trace:** Payment pending, preparing, six-hour Ready deadline, four-hour grace, ten-hour auto-cancel/refund, ready, meetup/courier, failed attempt, cancelled, received, dispute/return/refund. Listing is locked while a process is active. AC-06–09, AC-16–20, AC-24, AC-28–30, AC-38–41.

### OR-03 — Meetup booking

- **Entry / user:** Paid meetup order after seller marks Ready and posts availability.
- **Content:** Fixed campus pickup point, seller-posted available windows, current booking and deadline.
- **Actions / route:** Seller posts/updates allowed availability; buyer books a window within 24 hours. Return to OR-02 for progress and order coordination.
- **States / trace:** Waiting for seller availability, no slots, booked, reminder, missed first meetup, one replacement window, resolution window, closed. Do not offer another campus point or unlimited rescheduling. AC-16–17, AC-20, AC-24, AC-38.

### OR-04 — Courier coordination

- **Entry / user:** Paid courier order after seller marks Ready; Admin handles assignment, seller collection coordination, and buyer delivery coordination.
- **Content:** Agreed destination and quoted fee, assignment state, courier contact scoped to the order, seller pickup coordination, buyer-confirmed delivery window/directions, and attempt/event history.
- **Actions / route:** Admin assigns courier and records events; seller coordinates collection; buyer gives directions/confirms the delivery window; courier logs collection/in-transit/arrival/failed attempt. Return to OR-02/OR-05.
- **States / trace:** Unassigned, assigned, collection pending, in transit, arrival, ten-minute wait, logged failed attempt, one replacement, return to seller. Material route changes require Admin review and buyer confirmation of any fee difference. Collection/delivery report is not receipt. Staff destination is unresolved in the current six-screen IA; see Open route gaps. AC-24, AC-39–41, AC-55.

### OR-05 — Handoff code

- **Entry / user:** Buyer has inspected item at meetup or courier drop-off.
- **Content:** Six-digit order code prompt, order/item identity, safe inspection reminder, and submission/pending status.
- **Actions / route:** Buyer enters code once; server validates and moves order to Received, then OR-02 displays the 36-hour dispute deadline.
- **States / trace:** Ready, invalid/retry, submitting, offline saved/Pending sync, sync conflict, server-validated Received. Offline entry never locally marks receipt, starts dispute timer, releases funds, or allows replay. Code is available only within authenticated order flow; notification only says it is ready. AC-07, AC-15, AC-28, AC-41, AC-45, AC-52.

## Disputes, reviews, and reports

### DS-01 — Open dispute

- **Entry / user:** Buyer from an order in the 36-hour server-confirmed receipt window.
- **Content:** Eligible material reasons, short explanation, relevant product/issue photo and/or video upload, privacy note, and submission consequence.
- **Actions / route:** Submit once for the order, then DS-02. Return to order only before submission if allowed.
- **States / trace:** Eligible, ineligible/expired, upload progress/error, incomplete evidence, submitting, submitted. Exclude change of mind, subjective dislike, and disclosed flaws. AC-08, AC-18–19, AC-29, AC-45.

### DS-02 — Dispute status and return

- **Entry / user:** Buyer/seller opens an active case; Admin opens assigned mediation.
- **Content:** Submitted reason/evidence, seller response/deadline, Admin decision target, order history, held funds, responsibility/cost decision, return instructions, and refund state.
- **Actions / route:** Seller responds within 18 hours; Admin records decision and responsibility; if return is required, buyer arranges within 18 hours and returns by Admin-set time using original fulfilment method and separate one-time return code. Then provider reconciliation or final resolution.
- **States / trace:** Waiting for seller, seller response, Admin review, decision, return pending, return validated, refund pending, refund confirmed, closed. Targets are not promises; do not mark refund complete before provider confirmation. AC-09, AC-18–20, AC-29–30, AC-43.

### RV-01 — Seller review / contextual safety report

- **Entry / user:** Buyer opens review from a final Completed/Refunded order, or opens Report from a listing, user, or relevant chat.
- **Content:** For review: seller identity, 1–5 rating, optional text, eligibility and one-time submission note. For report: contextual subject, eligible reason, explanation and confirmation.
- **Actions / route:** Submit one eligible seller review or create an Admin report; return to originating order/listing/chat. Keep these as separate task modes even if they share form components.
- **States / trace:** Review ineligible until final outcome, submitted/read-only, report draft/submitted, upload/error if applicable. No seller rating of buyers; a report does not decide or cancel an active order. AC-31, AC-50–51, AC-54.

## Seller workspaces

### SH-01 — Seller verification application

- **Entry / user:** Existing buyer applies to become seller.
- **Content:** Matric number validated to selected university's rule; exactly one student proof (eduportal student homepage preferred, or current academic-year school ID); store information; payout bank information; privacy and submission status.
- **Actions / route:** Save draft, upload/replace private evidence, submit to Admin; route to SH-02. Do not expose verification proof publicly.
- **States / trace:** Incomplete, validation, upload pending/error, draft, submitted, under review, clarification, rejected/resubmission, approved, 2FA required. No listing can go live before Admin approval and seller 2FA. AC-02, AC-12, AC-27, AC-35–36, AC-42.

### SH-02 — Verification status

- **Entry / user:** Seller checks application progress or receives a decision notice.
- **Content:** Current status, Admin reason/message where applicable, permitted next action, draft/publishing eligibility and 2FA requirement.
- **Actions / route:** Edit/resubmit after clarification or rejection; continue to security setup or SH-03 after approval.
- **States / trace:** Pending, needs clarification, rejected, resubmitted, approved, 2FA required, error. No turnaround promise; pending sellers may edit drafts but not publish. AC-02, AC-27, AC-35–36, AC-42.

### SH-03 — Seller Hub

- **Entry / user:** Approved seller opens Seller mode; pending seller may see only allowed draft/status tools.
- **Content:** Listing groups (draft/active/sold/unlisted), sales/order queue, earnings/proceeds summary, and publish/verification/2FA gates.
- **Actions / route:** Start/edit SH-04 where permitted, open an order in OR-02, wallet in SH-05, verification status SH-02, profile/security.
- **States / trace:** Empty/loading, restricted, pending verification, 2FA required, active order/listing locks, current proceeds state. Never imply funds are withdrawable before policy allows or promise arrival time. AC-23, AC-27, AC-32, AC-37, AC-53.

### SH-04 — Listing editor

- **Entry / user:** Seller creates a listing or edits an unlocked draft/eligible published listing.
- **Content:** Photos, title, price, optional lower sale price, description, condition, explicit negotiable/not-negotiable choice, draft/publish eligibility.
- **Actions / route:** Save private draft, correct errors, publish only when complete and seller is approved with 2FA; return to SH-03.
- **States / trace:** Empty, validation, upload/error, saved draft, ready to publish, active, sold, archived, unavailable, locked by negotiation/order/process. No edit/delete while any active process has started. AC-04, AC-13, AC-23, AC-37, AC-53, AC-59.

### SH-05 — Seller wallet and withdrawal

- **Entry / user:** Seller opens earnings/proceeds from Seller Hub.
- **Content:** Ledger/history, held versus available balance, withdrawal request and payout status.
- **Actions / route:** Request withdrawal only when available; view result or a safe correction/retry after failure.
- **States / trace:** Held, eligible, requested, processing, paid, failed. No withdrawal before dispute window closes; no guaranteed payout date. AC-06, AC-30, AC-32, AC-43.

## Profile, help, security, and notification

### PF-01 — Profile and settings

- **Entry / user:** Buyer or seller opens Profile.
- **Content:** Account identity and mode, allowed personal/store settings, security, saved-listing entry, help, notification center, and deactivate-account action.
- **Actions / route:** Switch buyer/seller mode, edit store name/bio/avatar and allowed username, open PF-02/PF-03/PF-04, deactivate after the required resolution gate.
- **States / trace:** Username change cooldown (90 days), store edits, active-order restriction, deactivation confirmation, loading/error. Bank and personal account-detail changes use PF-03 Support request, not direct settings. AC-11, AC-22, AC-33–36, AC-44, AC-53, AC-57–58.

### PF-02 — Campus-change request

- **Entry / user:** Buyer or seller from Profile when requesting a campus change.
- **Content:** Current and requested campus, reason, unresolved-order blocker, affected listing pause and decision status.
- **Actions / route:** Submit request; provide clarification if asked; return to Profile when approved/denied.
- **States / trace:** Blocked by unresolved order, submitted, needs info, pending review, approved, denied. Seller must resolve/cancel current orders and await approval before new listings/orders on new campus; buyer must resolve/cancel current order before ordering from new campus. Active listings pause during review and do not automatically republish. AC-10, AC-21.

### PF-03 — Help/FAQ and request status

- **Entry / user:** Buyer or seller from Profile or an eligible order context.
- **Content:** FAQ/help topics, request type, message/details, linked order/account context, secure bank-change request fields when applicable, status and Admin replies.
- **Actions / route:** Submit account-detail, campus, or other defined support request; read/reply to request; return to associated account/order.
- **States / trace:** Draft, submitted, waiting, response, resolved, validation/upload error. Bank changes are securely requested here and performed by Admin; no bank editing in settings. AC-33, AC-57.

### PF-04 — Account security

- **Entry / user:** Buyer or seller opens security settings; seller may be routed here before publish/proceeds.
- **Content:** 2FA status, authenticator enrollment/confirmation, recovery codes, loss-of-factor guidance, active security requirements.
- **Actions / route:** Enroll/confirm TOTP, regenerate only through the defined secure process, download/store one-time recovery codes; lost-factor recovery creates an Admin request. Return to Profile or seller eligibility.
- **States / trace:** Optional buyer setup, mandatory seller gate, enrollment pending/error, enabled, recovery code consumed, recovery under review. Seller reset requires second authorized reviewer and keeps listing/proceeds blocked until re-enrollment. AC-12, AC-27, AC-35.

### NT-01 — Notification center

- **Entry / user:** Authenticated user opens notifications from app navigation or a push notification.
- **Content:** Event class, timestamp/read state, short status summary, and deep-link destination.
- **Actions / route:** Open related order/listing/chat/case/request; mark/read via normal opening behavior where supported.
- **States / trace:** Unread/read, empty, loading, unavailable destination, stale. Handoff-code notice contains no code; notifications are in-app/push per approved event classes, not email. AC-45, AC-52.

### PR-01 — About/version

- **Entry / user:** Buyer or seller from Profile.
- **Content:** App release/version and support links.
- **Actions / route:** Open support information or return to Profile.
- **States / trace:** Version available, loading/error. AC-60.

## Soldbay Admin staff console

All staff surfaces use the same Admin role and an auditable queue → detail → allowed action → recorded outcome pattern. Desktop and the required full-capability mobile fallback must support the same task completion; exact responsive arrangement is a later design decision.

### ST-01 — Admin shell

- **Entry / user:** Authenticated Soldbay Admin.
- **Content:** Navigation to assigned verification, moderation, dispute, user, campus-change, support/order operations; account/session context and queue indicators.
- **Actions / route:** Open an authorized work queue and return to prior task. No separate Support/Ops role selector or privilege tier.
- **States / trace:** Loading, empty queues, assigned/unassigned work, session/access error. Exact staff destinations for three operation groups remain open below. AC-55.

### ST-02 — Seller verification review

- **Entry / user:** Admin opens seller verification queue/detail.
- **Content:** Application status, selected student proof (one of the permitted types), matric/university format, store and payout information, prior communications, and audit history as needed.
- **Actions / route:** Approve, reject with reason, or request clarification; record actor/time/reason/outcome; return to queue or seller record.
- **States / trace:** Pending, review, clarification, resubmitted, decided, access error. Restrict private proof and bank data to the task and audit access. AC-02, AC-42, AC-55.

### ST-03 — Moderation

- **Entry / user:** Admin opens new-listing or report queue.
- **Content:** Listing/report context, item/user/message, submitted reason/evidence, relevant history and prior actions.
- **Actions / route:** Approve/reject listing or remove content; ban/suspend/reinstate with recorded reason and user notice; route linked active order to normal order/dispute handling.
- **States / trace:** New, in review, resolved, insufficient context, restricted account. Moderation does not itself cancel an order or decide/release funds. AC-31, AC-50, AC-54–55.

### ST-04 — Dispute mediation

- **Entry / user:** Admin opens active dispute, failed-handoff case, or linked order case.
- **Content:** Buyer evidence, seller response/deadline, order and payment timeline, handoff/return events, courier facts, held funds and policy choices.
- **Actions / route:** Request/record evidence where allowed, decide responsibility/outcome, set return method/time, initiate required refund/release workflow, record audit outcome.
- **States / trace:** Seller response pending, Admin review/target, fault unclear, return pending, refund pending/confirmed, resolved. Do not promise target times or mark provider refund complete early. AC-08–09, AC-18–20, AC-29–30, AC-43, AC-45, AC-55.

### ST-05 — User management

- **Entry / user:** Admin searches for a user or opens a profile from a case.
- **Content:** Minimum account, campus, verification, orders, reports/moderation history and status needed for the task; sensitive fields only when justified and audited.
- **Actions / route:** Suspend/ban/reinstate with reason and notice; open linked records; initiate a defined recovery or account request.
- **States / trace:** Active, restricted, deactivated, loading, no match, access-limited. Never resolve an order or alter funds implicitly through a user restriction. AC-34–36, AC-54–55.

### ST-06 — Campus-change review

- **Entry / user:** Admin opens campus-change petition queue/detail.
- **Content:** Current/requested campus, reason, active/unresolved orders, listing pause effects and decision history.
- **Actions / route:** Request clarification, approve only when required orders resolve, or deny with reason; restore eligible listings only after seller review/republish.
- **States / trace:** Blocked by order, pending, needs info, approved, denied, listing restoration pending. AC-10, AC-21, AC-55–56.

## Open route gaps before staff screen design

The current six-screen Admin IA does not explicitly assign destinations for:

1. General Support requests, including secure account-detail changes.
2. Provider refund and payout reconciliation outside dispute mediation.
3. Active courier assignment, delivery coordination, and ordinary order-event operations.

These are real PSS tasks (including AC-32–33, AC-39–40, AC-43, AC-55, AC-57), not new roles. Before Admin wireframes, map each into an existing surface or review a focused Admin IA adjustment. Do not silently create screens or separate roles. This gap does not block buyer/seller screen specifications or visual reference studies.

## Review status and next gate

- The broad list of buyer, seller, transaction, profile, notification, and six staff surfaces is recorded in `screen-architecture.md` and traced to the PSS.
- This document now specifies their user, entry, required information, actions/routes, meaningful states, and relevant constraints at a functional level. It does not determine final layout, copy polish, component appearance, navigation labels, or visual hierarchy.
- Proposed four-tab labels remain unapproved. The PSS requires destinations/flows, not these exact labels.
- Review the staff route gaps before staff screen work. Then use `design-reference-studies.md` one task at a time; reference studies do not become Soldbay screens.
- The owner has approved the high-level MVP visual direction from five reference studies. Next derive and review replacement foundations; then define component appearance and compose product screens. Functional screen specifications remain a separate review gate.
