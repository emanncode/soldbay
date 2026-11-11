# Soldbay Interaction Patterns & UX Architecture — Stage 04, Step 07

**Status:** Approved by the owner on 2026-11-06; it documents interaction behavior against the approved Product & System Definition (PSS).
**Prepared:** 2026-11-06
**Depends on:** `docs/architecture.md` and the approved interaction/component behavior. The former Step 04 visual tokens were withdrawn; interaction rules remain independent of the replacement theme.
**Authority:** The PSS remains authoritative for eligibility, deadlines, permissions, transitions, and outcomes. This document defines how the interface communicates them; it does not add product policy.
**Artifact boundary:** This written interaction map belongs in Markdown. The owner is clearing textual boards from the Pencil canvas; screen composition remains deferred to the paired platform files.

## Interaction principles

1. **Show the current state and the next available action together.** Explain who acts next and any relevant deadline. Never show an action that the PSS blocks.
2. **Distinguish local response from confirmed outcome.** A button press can show immediate progress, but payment, receipt, refund, verification, and other server-owned outcomes appear complete only after authoritative confirmation.
3. **Make uncertainty visible and recoverable.** Keep a pending state when the server/provider result is unknown. Reconcile before offering a retry that could duplicate payment, an order, a code use, refund, or release.
4. **Preserve user work.** Retain form and chat text across validation errors, navigation interruptions, app backgrounding, and transient connectivity loss where safe.
5. **Use specific, actionable errors.** Keep field errors beside fields; explain transaction and permission failures in the task context; state what remains saved and what the user can do next.
6. **Confirm consequential actions in proportion to their impact.** Clarify the result of cancellations, account deactivation, irreversible submission, and staff decisions. Do not interrupt reversible actions with redundant confirmation.
7. **Keep state understandable without color or motion.** Pair status color with text and accessible semantics. Respect reduced motion; never use animation, haptics, or sound as the only confirmation.

### Motion ownership

Step 04 will own shared motion principles and any replacement tokens after visual direction is revisited. Step 06 specifies only component-local animation when it clarifies a component state change. Step 07 specifies transitions and motion that communicate a change across a user task. Follow Step 05 platform behavior; no motion may delay an action or serve as the only state signal. The former timing values are historical and inactive.

## State and feedback contract

| Interaction state        | Interface response                                                                                      | Recovery rule                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Ready                    | Show the action, eligibility, price or deadline information needed to decide.                           | Keep unavailable actions disabled with a short reason where useful.                                              |
| Editing                  | Show persistent field labels, focus, format guidance, and immediate input-level validation when useful. | Keep valid entered data when another field fails.                                                                |
| Submitting               | Indicate progress and prevent duplicate submission of the same operation.                               | Allow safe cancellation only before the operation becomes consequential.                                         |
| Pending / result unknown | Name the operation and say Soldbay is checking its status. Keep associated money/order actions blocked. | Refresh/reconcile from the authoritative source; offer retry only after outcome is known and retry is safe.      |
| Confirmed                | State the confirmed result, what changed, the next actor/action, and any relevant deadline.             | Provide a path to the resulting order, listing, case, or receipt.                                                |
| Recoverable failure      | Explain what failed and whether the user's work or payment/order state is retained.                     | Offer a safe retry, correction, or Support path; do not discard entered data.                                    |
| Blocked / ineligible     | State the unmet condition and how it can be resolved, when allowed.                                     | Preserve unrelated work and avoid implying an override exists.                                                   |
| Offline / stale          | Identify stale data and actions that need a connection. Do not imply price or availability is current.  | Queue only explicitly supported work; show a pending-sync state until server confirmation.                       |
| Read-only / closed       | Keep prior content visible and state why composing or changing it is unavailable.                       | Link to the allowed next step or a related record; do not expose a disabled-looking control without explanation. |

## Core task patterns

### 1. Buyer signup and campus context

Order: accept Terms and Privacy separately, confirm the 18+ checkbox, choose university, choose a required campus, create the buyer account, verify email, then enter the app. Campus is mandatory because it scopes discovery. Email verification is a hard entry gate. Show progress and keep the email address available through OTP correction/resend. An invalid or expired code returns a clear field-level error; it does not create an authenticated app session.

### 2. Seller verification and listing readiness

Collect matric number in the selected university's format and one student proof, then store information and payout account information. Keep sensitive proof private and show upload/replace states without exposing it in a public profile. Pending, clarification, rejection, and resubmission states explain whether edits are allowed. Draft listings remain private until approval and required 2FA are complete. Separate “saved draft,” “submitted for review,” “approved,” and “eligible to publish.”

### 3. Browse, product detail, and negotiation

Keep campus context visible in browse/search and state clearly when results are stale or empty. Public listing availability determines which product detail and order actions are available. Sold items may show the agreed one-hour Sold tag but remain non-clickable; other unavailable listings do not return to public browse. Product detail supports an order from the detail screen. Show pre-purchase chat only when the seller marked the listing negotiable. An accepted price belongs to that buyer and is held for 90 minutes; show the accepted price, expiry, and checkout action together. When negotiation expires or closes, explain that the listing may return to public availability according to its state.

### 4. Checkout and provider reconciliation

Before payment, summarize the item price, visible courier fee where applicable, total, campus, selected fulfilment, and destination/meetup details. Prevent submission when the listing is no longer eligible and explain the refreshed state. After starting payment, show **Payment pending** until an authenticated provider result is reconciled. A provider redirect or client-side success screen alone is not a paid order. On confirmed failure, explain that the reservation is released; on an unknown result, keep the order and payment controls in reconciliation state.

### 5. Seller readiness and fulfilment coordination

After confirmed payment, the order detail becomes the shared coordination surface. Show the seller's six-hour Ready deadline, then the four-hour grace period and its consequence, with the current stage clearly named. Once Ready, display the confirmed fulfilment path and the next party's task. For meetup, the buyer chooses a campus pickup window within the allowed period. For courier, identify manual assignment, show only order-scoped contact and buyer-preferred destination, and collect the buyer's delivery window/directions. A courier's collection or arrival attempt is not buyer receipt. At drop-off, make the ten-minute wait and logged attempt status visible to the parties who need it.

### 6. Handoff code and offline entry

Use one six-digit order code for the original handoff. At a meetup, the seller gives it to the buyer after handoff; for courier delivery, the seller gives it to the courier at pickup and the courier gives it to the buyer after delivery. The buyer inspects the item and enters the code. Online, distinguish validation progress from the server-confirmed Received state. Offline, confirm only that entry is saved for sync; keep the order **Pending sync**, preserve the attempt, and do not start the dispute timer or release funds. On reconnection, reconcile and prevent replay/duplicate use; show Received only after server validation.

### 7. Dispute, return, and refund

Show the 36-hour dispute deadline from server-confirmed receipt, and list only the eligible material reasons. Collect explanation plus relevant product/issue photos or video. After submission, show evidence submitted, seller-response deadline (18 hours), and Support's 12-hour decision target as a target rather than a promise. Keep funds held while unresolved. If return is required, show the decision, responsibility/cost outcome, original return method, 18-hour buyer-arrangement period, and the Support-set return-by time. Use a separate one-time return code. Do not mark a refund complete until the provider confirms it; leave it **Refund pending** for Support reconciliation and retry through the same provider/reference.

### 8. Cancellation, account, and staff decisions

Before cancellation, name what will be canceled, the effect on listing availability, and the refund or funds state that follows. Account deactivation is reversible through sign-in and reactivation; restore history while keeping seller listings paused until reviewed and republished. For Admin/Support/Ops, show assignment, relevant evidence and history, permitted decision controls, and resulting responsibility/funds state before submission. Record the decision with an audit outcome; never imply that a staff target is a guaranteed resolution time.

## Navigation, interruption, and accessibility behavior

- Preserve the user's task and entered data when moving between steps, returning from provider checkout, backgrounding, receiving a call, opening the keyboard, or switching windows.
- If leaving would lose unsaved or consequential work, explain what will be kept or lost before asking the user to confirm.
- Keep back navigation platform-appropriate; never make a gesture the only route to an important action.
- Keep errors, deadlines, status changes, and disabled reasons accessible to assistive technology. Move focus to the first invalid field after submission only when doing so helps correction; do not steal focus during asynchronous updates.
- Support text enlargement and reflow. On compact screens, preserve task order and the primary action; on expanded layouts, add supporting context without hiding the main task.
- Use inline status for immediate local validation, a stable in-context status area for pending/long-running work, and a notification for follow-up events only where the PSS calls for one.

## Traceability and later validation

The patterns above map to the approved PSS signup, seller verification, listing/negotiation, checkout, Ready deadline, fulfilment, code handoff, dispute/return/refund, account control, and staff-operation flows. They preserve the product's actor permissions and timing; they do not establish implementation feasibility.

Step 08 should turn these patterns into screen maps and low-fidelity task structures. Step 09 should exercise normal, pending, blocked, failure, retry, offline, and read-only states with realistic task content. Step 10 should verify coverage, accessibility, platform behavior, and that the visual status never promises an unconfirmed outcome.

## Open implementation and validation questions

- Runtime design for securely queuing, replay-protecting, and reconciling offline handoff-code entry.
- Provider-specific callbacks, payment/refund reconciliation, idempotency, and achievable status latency.
- Exact notification channels and reminder presentation remain governed by the approved PSS and provider/platform capabilities.
- Exact animation, haptic, copy, focus order, and responsive pane changes should be validated in Steps 08–10; none may alter an approved transition or deadline.
- This proposal does not claim legal review, provider approval, technical feasibility, usability validation, or accessibility conformance.

## Review checklist

- [x] Interaction states separate local response from server/provider-confirmed outcomes.
- [x] Core task patterns preserve PSS permissions, deadlines, and recovery paths.
- [x] Payment, handoff, refund, offline, cancellation, and read-only states have explicit feedback rules.
- [x] Owner approved the Step 07 interaction architecture on 2026-11-06.
- [ ] Step 08 maps these patterns to complete screen flows and low-fidelity structures.

**No final product screens, app code, payment behavior, or runtime workflow was created in Step 07. The interaction architecture is approved; screen mapping and low-fidelity structures are Step 08 work.**
