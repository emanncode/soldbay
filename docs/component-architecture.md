# Soldbay UI Kit & Component Architecture — Stage 04, Step 06

**Status:** The conceptual component inventory/specification was approved by the owner on 2026-11-06. The owner rejected the visual specimens on 2026-11-08 and is clearing the Pencil canvas. Keep this Markdown component/workflow record; do not treat old specimen visuals or Step 04 tokens as approved. Rebuild visual component studies only after sourced screen studies and a newly approved theme. Wireframing stays deferred.
**Prepared:** 2026-11-06
**Depends on:** Approved product workflows and platform requirements. The former Step 04 visual foundations are withdrawn. A high-level MVP visual direction is approved; select replacement foundations before defining component appearance.
**Authority:** `docs/architecture.md` for product behavior. This document does not add product scope.
**Artifact boundary:** Markdown is the source for written component specifications. The Pencil canvas is visual work only: sourced reference studies first, then component studies and product designs after review. `soldbay-ios.pen` and `soldbay-android.pen` remain reserved for later platform screen work.

**Visual draft history:** The previous “Step 06 UI Kit Visual Library Draft” and “Step 06 Control State Matrix” were rejected by the owner on 2026-11-08 and are being cleared. No component appearance is currently approved. The written component inventory and behavior requirements below remain the working specification, subject to the new visual-reference process.

## Purpose

Define the smallest useful set of shared UI building blocks before composing screens. The goal is consistent, accessible presentation of the approved workflows without forcing iOS and Android into identical navigation or system behavior.

Components are specifications, not code. They must follow a future approved theme and the applicable platform rules. The PSS determines when an action is available, blocked, pending, or complete; a component only communicates that state.

## Component hierarchy

| Layer       | Role                           | Examples                                                                                              |
| ----------- | ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Foundations | Approved visual rules          | semantic color roles, type scale, spacing, radii, motion                                              |
| Primitives  | Small, composable controls     | button, field, checkbox, radio, icon, badge, divider, avatar                                          |
| Composites  | Reusable task-level structures | listing card, price block, form group, message bubble, alert, order timeline                          |
| Patterns    | Repeated interaction behavior  | authentication, seller verification, filters, checkout, handoff-code entry, cancellation confirmation |
| Templates   | Reusable screen structures     | browse feed, product detail, form, order detail, chat, staff queue                                    |
| Screens     | A specific user task/state     | deferred until the Step 06 UI kit and Step 07 interaction work are complete                           |

## Shared primitives

| Component                    | Variants and required states                                                                                   | Accessibility and content rule                                                                                                             |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Button                       | primary, secondary, tertiary, destructive; default, pressed, disabled, loading                                 | Platform-sized hit target; visible label for consequential actions; loading does not hide the action outcome.                              |
| Icon button                  | navigation, close, overflow, contextual action; default, pressed, disabled                                     | Accessible name is mandatory; do not use an icon alone for an unfamiliar or irreversible action.                                           |
| Text field                   | text, email, password, numeric, currency, multiline; empty, focus, filled, validation error, disabled, pending | Persistent label, helpful error text, suitable keyboard, visible focus. Matric format follows selected university, never a global pattern. |
| Selection control            | checkbox, radio, select/list picker, segmented control where appropriate                                       | Use radio for mutually exclusive choices such as negotiable or not; label the selected state in text.                                      |
| Status badge                 | listing, order, verification, payout, report/dispute status                                                    | Color accompanies explicit state text. A badge never grants an unavailable action.                                                         |
| Avatar and media placeholder | person, store, listing-photo fallback                                                                          | Accessible alternative text or a non-redundant label; never imply identity verification from an avatar.                                    |
| Divider and section label    | standard, grouped, destructive boundary                                                                        | Use hierarchy and spacing before adding decoration.                                                                                        |

## Shared composites

| Component                               | Required variants/states                                                                                                                    | Product boundary it must express                                                                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Listing card                            | active, temporarily unavailable/openable, sold one-hour/un-clickable, hidden is no card; saved; verified seller indicator                   | Availability controls whether opening, negotiation, and purchase are possible; follow AC-23, AC-46 and AC-48.                                 |
| Product media and detail block          | photo carousel, title, condition, normal/effective price, negotiable, seller status, report action, self-purchase block                     | Never imply that a listing is current while offline/stale. Pre-purchase chat appears only for negotiable listings.                            |
| Price and money summary                 | normal/effective price, buyer-specific accepted price, expiry, item price, courier fee, total, refund/proceeds status                       | Use Naira formatting; show a clear distinction between paid, pending, held, released, and refunded. No guaranteed payout/refund arrival date. |
| Form group and evidence upload          | default, incomplete, validation error, uploaded, replace, private evidence                                                                  | Seller proof is choose-one; verification proof remains private. Preserve drafts and correctable errors.                                       |
| Alert, inline notice, banner and toast  | information, success, warning, danger; dismissible only when safe                                                                           | Match an actual state. Banners/toasts supplement the notification center; do not claim provider confirmation prematurely.                     |
| Empty, loading, error and offline state | no listings, no results, no orders/messages, loading, retryable error, stale/offline                                                        | Explain what is absent or pending and offer an available next action.                                                                         |
| Confirmation surface                    | cancel listing/order, destructive moderation, irreversible submission, reactivation                                                         | State consequence and recoverability. Do not add confirmation where the PSS gives a reversible direct action.                                 |
| Message thread and composer             | negotiable pre-purchase, paid-order, read-only archive, blocked pre-purchase contact                                                        | Scope messages to listing/order; no global inbox, typing indicator, or photo attachment in MVP.                                               |
| Order timeline and action panel         | payment pending, paid, preparing, ready, booking/assignment, in transit, pending sync, received, dispute, return, refund pending, completed | Courier collection is intermediate. Only buyer-entered, server-validated code changes the order to Received.                                  |
| Six-digit code entry                    | ready to enter, validation error, offline pending-sync, validated                                                                           | Never represent local/offline entry as received or released; error/retry must preserve the user's input when safe.                            |
| Review and report modules               | buyer-to-seller review after final outcome; listing/user/report reasons                                                                     | Seller cannot rate buyers. Report and dispute are distinct flows with different eligibility/evidence rules.                                   |

## Templates and staff surfaces

| Template                  | Core composition                                                                                       | Required adaptations                                                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Browse/search             | campus context, search, filters, listing collection, loading/empty/error                               | One-column phone flow; expanded windows can reveal filters or more listings without hiding access.                                |
| Product detail            | media, facts, seller/review evidence, availability, primary action, safety/report route                | Primary action changes with listing lock/state; platform back behavior remains native.                                            |
| Multi-step form           | task title/progress where helpful, fields, inline validation, persistent next action                   | Reflow with keyboard and enlarged text; retain drafts.                                                                            |
| Checkout and order detail | explicit price/fee/total, fulfilment choice or current fulfilment status, pending/reconciliation state | High-consequence actions need exact status language and duplicate-submission protection.                                          |
| Chat and coordination     | contextual order/listing header, timeline facts, messages, composer/read-only state                    | Preserve input during interruption; expose contact only in the scope permitted by the PSS.                                        |
| Seller workspace          | listing state collection, drafts, sales/order queue, earnings/proceeds                                 | Listing locks and approval/2FA gates must be clear before an action is attempted.                                                 |
| Admin staff queue/context | filterable case/order collection, detail panel, decision/action form, audit history                    | One flat Admin role; Support and Ops are task contexts. Desktop supports dense tables/panes; mobile fallback preserves full completion capability through stacked detail/action sections. |

## Cross-platform rules

| Area                      | Shared requirement                                                                                                                                  | iOS / Android adaptation                                                                                                                 |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation                | Same destinations, labels, permissions and task outcomes                                                                                            | Use platform-appropriate back behavior, presentation surfaces and system-bar treatment. Do not recreate OS chrome.                       |
| Buttons and fields        | Same semantic roles and validation behavior                                                                                                         | Meet 44 pt iOS / 48 dp Android target guidance; use native input and keyboard conventions at implementation.                             |
| Dialogs, sheets and menus | Same consequence, focus, dismissal and recovery rule                                                                                                | Platform-specific presentation is allowed when it preserves the shared behavior and accessibility semantics.                             |
| Lists, search and filters | Same results, sort/filter semantics and empty states                                                                                                | Android may use window-size/adaptive arrangements; iOS may use its native presentation patterns. Neither platform hides a core function. |
| Component-specific motion | Use future Step 04 motion tokens only for component state changes that benefit from animation (for example, progress or expansion); respect reduced motion | Platform conventions apply; never make motion the only signal of status or success. Flow-level transitions belong to Step 07.            |

## Global state contract

Every interactive component that needs the state must specify default, focus, pressed, disabled, loading/pending, success, validation error, general error, empty/no-results, offline/stale, long-content, and read-only behavior. Not every component needs every state; omission requires a reason.

Component specifications must include: purpose, anatomy, allowed variants, state behavior, content rules, accessibility semantics, responsive behavior, platform exceptions, PSS traceability, and examples/anti-patterns. No component may hard-code an order state or bypass authorization.

### Control-state behavior

- **Buttons:** Keep keyboard focus visibly distinct. A pending label may explain the operation (for example, “Submitting…”), and repeat submission stays blocked until the operation is reconciled. Disabled actions remain understandable; show the unmet condition nearby when it helps the user recover. Pressed feedback is brief and never substitutes for a confirmed outcome.
- **Text fields:** Keep labels visible after entry. Match the keyboard and input format to the field and selected university. Put specific error text beside the field, expose it to assistive technology, preserve correctable values, and avoid relying on border color alone.
- **Selection controls:** Expose the prompt and selected/unselected value as one labeled group. Keep the radio/checkbox state understandable without color or animation; do not replace a platform control with a decorative symbol that has no semantic counterpart.
- **Targets and text:** Meet the Step 05 minimum target guidance (44 pt iOS / 48 dp Android) for the usable hit area. At larger text sizes, reflow labels and instructions rather than clipping or truncating essential content.
- **Motion:** Component-local animation is limited to a useful state change, will use replacement Step 04 tokens after visual direction is revisited, and respects reduced motion. Task-flow transitions remain specified in Step 07.

## Open decisions and Step 07 handoff

- Select and validate a coherent product icon family during detailed component design; OS-owned symbols remain platform-specific.
- Keep written component anatomy, sizing, copy, focus order, variants, states, platform exceptions, and PSS traceability in Markdown. Add visual component studies to Pencil only after reference studies and theme approval.
- Treat status bars, network/battery glyphs, cutouts, home indicators, and Android system navigation as OS-owned chrome. Document them as viewport/safe-area context from Step 05; do not invent Soldbay components for them or draw fake chrome inside app screens.
- Step 07 now defines loading, retries, validation timing, destructive confirmations, permission failures and recovery against the PSS.
- Test components in realistic flows before final handoff. Static specifications do not establish usability, accessibility conformance, or implementation readiness.

## Review checklist

- [x] Component inventory traces core marketplace, transaction, verification, chat, support and staff work to the PSS.
- [x] Shared state rules distinguish PSS authority from presentational components.
- [x] iOS/Android differences are bounded to platform conventions without duplicating product behavior.
- [x] Separate screen files remain deferred until the reusable UI kit is complete and reviewed.
- [x] Owner approved the Step 06 component architecture on 2026-11-06.
- [x] First reusable visual specimens were created (historical only; owner rejected them on 2026-11-08; visual component design remains open).
- [ ] Complete component variants and states, including the required focus/pressed/loading/error/disabled/offline/read-only cases where applicable.
- [ ] Document accessibility semantics, text scaling, target sizes, content constraints, and usage guidance for each component.
- [ ] Review light/dark semantic mappings and define platform-specific presentation adaptations.
- [ ] Select a coherent product icon family and document when OS-owned symbols remain platform-specific.
- [ ] Complete component specifications and usage guidance before starting Step 08 wireframes.

**The component architecture is approved, but the UI kit/library is not complete. No product screens should be composed until the component specimens, specifications, and platform adaptations are reviewed.**
