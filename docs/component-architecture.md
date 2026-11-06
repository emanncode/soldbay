# Soldbay UI Kit & Component Architecture — Stage 04, Step 06

**Status:** Component architecture approved by the owner on 2026-11-06; detailed component specs and product screens remain later work.
**Prepared:** 2026-11-06
**Depends on:** Approved Step 04 foundations and Step 05 platform/device foundations.
**Authority:** `docs/architecture.md` for product behavior. This document does not add product scope.
**Pencil structure:** `design/soldbay-design-documentation.pen` remains the component-specification source. `soldbay-ios.pen` and `soldbay-android.pen` start with real screen work in Step 08.

## Purpose

Define the smallest useful set of shared UI building blocks before composing screens. The goal is consistent, accessible presentation of the approved workflows without forcing iOS and Android into identical navigation or system behavior.

Components are specifications, not code. They use Step 04 semantic tokens and Step 05 platform rules. The PSS determines when an action is available, blocked, pending, or complete; a component only communicates that state.

## Component hierarchy

| Layer       | Role                           | Examples                                                                                              |
| ----------- | ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Foundations | Approved visual rules          | semantic color roles, type scale, spacing, radii, motion                                              |
| Primitives  | Small, composable controls     | button, field, checkbox, radio, icon, badge, divider, avatar                                          |
| Composites  | Reusable task-level structures | listing card, price block, form group, message bubble, alert, order timeline                          |
| Patterns    | Repeated interaction behavior  | authentication, seller verification, filters, checkout, handoff-code entry, cancellation confirmation |
| Templates   | Reusable screen structures     | browse feed, product detail, form, order detail, chat, staff queue                                    |
| Screens     | A specific user task/state     | produced from Step 08 onward                                                                          |

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
| Admin/Support/Ops queue   | filterable case/order collection, detail panel, decision/action form, audit history                    | Desktop supports dense tables/panes; mobile fallback preserves full completion capability through stacked detail/action sections. |

## Cross-platform rules

| Area                      | Shared requirement                                                        | iOS / Android adaptation                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation                | Same destinations, labels, permissions and task outcomes                  | Use platform-appropriate back behavior, presentation surfaces and system-bar treatment. Do not recreate OS chrome.                       |
| Buttons and fields        | Same semantic roles and validation behavior                               | Meet 44 pt iOS / 48 dp Android target guidance; use native input and keyboard conventions at implementation.                             |
| Dialogs, sheets and menus | Same consequence, focus, dismissal and recovery rule                      | Platform-specific presentation is allowed when it preserves the shared behavior and accessibility semantics.                             |
| Lists, search and filters | Same results, sort/filter semantics and empty states                      | Android may use window-size/adaptive arrangements; iOS may use its native presentation patterns. Neither platform hides a core function. |
| Motion and feedback       | Approved timing principles, reduced-motion respect, truthful system state | Use platform motion conventions; do not make motion the sole indicator of success or failure.                                            |

## Global state contract

Every interactive component that needs the state must specify default, focus, pressed, disabled, loading/pending, success, validation error, general error, empty/no-results, offline/stale, long-content, and read-only behavior. Not every component needs every state; omission requires a reason.

Component specifications must include: purpose, anatomy, allowed variants, state behavior, content rules, accessibility semantics, responsive behavior, platform exceptions, PSS traceability, and examples/anti-patterns. No component may hard-code an order state or bypass authorization.

## Open decisions and Step 07 handoff

- Select and validate a coherent product icon family during detailed component design; OS-owned symbols remain platform-specific.
- Refine exact component anatomy, sizing, copy, focus order and platform exceptions alongside realistic screen flows in Steps 08–09.
- Step 07 now defines loading, retries, validation timing, destructive confirmations, permission failures and recovery against the PSS.
- Test components in realistic flows before final handoff. Static specifications do not establish usability, accessibility conformance, or implementation readiness.

## Review checklist

- [x] Component inventory traces core marketplace, transaction, verification, chat, support and staff work to the PSS.
- [x] Shared state rules distinguish PSS authority from presentational components.
- [x] iOS/Android differences are bounded to platform conventions without duplicating product behavior.
- [x] Separate screen files remain deferred until Step 08.
- [x] Owner approved the Step 06 component architecture on 2026-11-06.
- [ ] Refine exact component anatomy, sizing, copy, icon treatment and platform exceptions alongside realistic screen flows in Steps 08–09.

**No reusable component instances, iOS screens, Android screens, or implementation code were created in Step 06. The component architecture is approved; detailed component design and validation remain later work.**
