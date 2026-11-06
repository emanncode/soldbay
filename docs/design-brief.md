# Soldbay Design Brief — Stage 04, Step 01

**Status:** Step 01 approved by owner on 2026-11-05. Preparation artifact retained as design scope baseline.
**Updated:** 2026-11-05
**Product authority:** Product & System Definition (architecture.md) and its linked, current AllOnSoldBay workflow and IA documents.
**Design workspace:** `design/soldbay-design-documentation.pen`, initially empty at the reset; now the canonical documentation canvas.

## Purpose

Translate the approved product and system contract into a design scope, requirement map, platform boundary, and review plan. This brief records what design must cover. It does not introduce a visual direction, screen layout, component, product rule, or implementation choice.

## Product and design goals

Design the MVP experience for campus-scoped discovery and one-listing transactions, with clear seller eligibility, negotiation, payment, handoff, dispute, refund, and support states. Each interface must make the user's next action and the current transaction state understandable while respecting the approved role permissions and workflow timings.

This is the selected product model, not evidence that market demand or the trust hypothesis has been validated. Planned student interviews were scrapped and were not conducted.

## Users, roles, and permission boundaries

| Role          | Design scope                                                                                                                                                           | Key boundary                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Buyer         | Signup, discovery, search, listing detail, negotiation where enabled, checkout, order/chat, handoff, disputes, returns/refunds, reviews, profile/help/account security | Campus-scoped public listings; only own private orders, chats, and cases                                            |
| Seller        | Seller application, verification status, store profile, private listing drafts, publish controls, sales/order queue, fulfilment, proceeds, profile and security        | Cannot publish before Soldbay Admin approval and 2FA; active listing processes lock edits/deletion                  |
| Soldbay Admin | Seller verification, moderation, user actions, campus-change petitions                                                                                                 | Least-privilege access to sensitive student and payout data; material decisions recorded                            |
| Support       | Assigned dispute, failed-handoff, cancellation, recovery, and account/campus requests                                                                                  | Access limited to assigned case or recovery need; holds funds when responsibility or provider outcome is unresolved |
| Ops           | Manual courier assignment, scoped delivery coordination, fee/destination review, event recording                                                                       | Access limited to assigned fulfilment; no authority to confirm receipt or release funds                             |
| Courier       | Assigned delivery details and delivery/attempt coordination                                                                                                            | Minimum order-scoped details; cannot mark an order Received or release funds                                        |

## Critical tasks and requirement traceability

Requirement IDs refer to the canonical PSS. This map groups them by design work; it does not replace the PSS or alter its acceptance criteria.

| Journey / capability                                 | Roles and intended surfaces                                                 | Requirements                                                                               | Design-critical states and constraints                                                                                                                                                                                                                                                                                  |
| ---------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Signup, authentication, recovery, and reactivation   | Buyer; shared account/security surfaces                                     | FR-01, FR-15, FR-16, FR-29; AC-01, AC-11, AC-22, AC-34–36, AC-44, AC-58                    | Buyer account only; university and required campus; separate Terms and Privacy acceptance; one 18+ checkbox; email verification before app entry; no DOB, matric, student proof, or age-verification screens; recovery and reactivation remain distinct                                                                 |
| Seller onboarding and verification                   | Buyer becoming seller; Admin review queue/detail                            | FR-02, FR-03, FR-16, FR-27; AC-02, AC-12, AC-27, AC-35–36, AC-42, AC-56                    | University-specific matric format; exactly one proof (eduportal homepage preferred or current-year school ID); store and payout information; under-review/clarification/rejected/approved states; drafts remain private; publish only after approval and 2FA; no promised review turnaround                             |
| Campus-scoped discovery, search, and wishlist        | Buyer feed, category browse, search/filter, wishlist, product detail        | FR-17–20, FR-27, FR-30; AC-23, AC-46–49, AC-56, AC-59                                      | Campus selected at signup and visible in context; Recently Added; loading/empty/no-results/pagination/refresh; campus and availability scope apply to search and saved items; negotiated accepted price supersedes sale price only for that buyer during its lock                                                       |
| Listing setup, pricing, availability, and sale       | Seller dashboard, listing draft/edit, buyer feed/detail                     | FR-03–05, FR-24, FR-30; AC-03–04, AC-13, AC-20, AC-23, AC-37, AC-46, AC-53, AC-59          | One item per listing; required photo/title/price/description/condition/negotiability; draft/pending/active/locked/unavailable/sold/archived/resalable states; seller cannot edit/delete during active process; public unavailable and one-hour sold presentation follow PSS                                             |
| Negotiation and messaging safety                     | Buyer/seller negotiation chat; order-scoped chat; notification center       | FR-04, FR-22–23; AC-03–04, AC-13, AC-25, AC-51–52                                          | Pre-purchase contact only for negotiable listings; buyer-specific accepted price expires after 90 minutes; negotiation closes read-only after 24 hours without a message; no global inbox; paid-order coordination remains available as specified; flag/report off-platform payment attempts                            |
| Checkout, payment, and order preparation             | Buyer checkout/order; seller order queue and Ready action                   | FR-06–08, FR-13, FR-23–24; AC-05–06, AC-14, AC-20, AC-24, AC-26, AC-32, AC-38–39           | Single listing; full agreed item price plus disclosed courier fee; pending provider state must be visible and remain reserved; no order treated as paid until provider confirmation; Ready in 6 hours, then 4-hour grace, auto-cancel/refund at 10 hours; no guaranteed refund-arrival claim                            |
| Meetup and courier delivery/handoff                  | Buyer, seller, Ops, courier; order detail/chat/status                       | FR-07, FR-09, FR-13; AC-07, AC-15–17, AC-24, AC-28–30, AC-38–41, AC-45                     | One campus meetup point; courier to buyer's preferred location on selected campus; manual Ops assignment; role-scoped contact; first attempt/replacement/failure paths; one-time code; courier collection is not receipt; offline entry remains Pending sync until server validation                                    |
| Disputes, returns, refunds, and proceeds             | Buyer case submission; seller response; Support resolution; seller earnings | FR-10–13, FR-24, FR-26; AC-08–09, AC-15, AC-18–20, AC-29–32, AC-43, AC-45                  | 36-hour dispute period after validated handoff; eligible reasons and media; 18-hour seller response; Support target 12 hours after response/expiry; funds held while unresolved; original fulfilment method and separate return code; refund remains pending until provider confirmation; do not guarantee arrival time |
| Reviews, reports, and moderation                     | Buyer review; buyer report; Admin moderation/user management                | FR-21, FR-25–26; AC-31, AC-50, AC-54–55                                                    | Buyer may review seller only after qualifying final outcome; no seller-to-buyer rating; moderation restriction does not silently resolve an order or financial state; recorded reason and notice                                                                                                                        |
| Campus change, help, and account-detail requests     | Buyer/seller Help; Admin petition queue; Support request handling           | FR-14, FR-28; AC-10, AC-21, AC-33, AC-57                                                   | Block approval while role-specific active orders remain unresolved; pause active listings while review is pending; preserve old-campus order history; store fields editable as allowed; username 90-day limit; bank changes through secure Support request                                                              |
| Staff operations and configuration                   | Admin, Support, Ops staff surface; mobile fallback                          | FR-13, FR-26–28; BR-01; AC-12, AC-16, AC-18–21, AC-30, AC-35, AC-39–40, AC-42–43, AC-55–57 | Admin, Support, and Ops duties are distinct; queue/detail/action flows; sensitive evidence access scoped and audited; manual courier coordination; university/campus/matric-format configuration; full-capability mobile fallback required                                                                              |
| Cross-cutting content, platform, access, and quality | All product roles and staff roles                                           | FR-32; NFR-01–05; EXT-01–03                                                                | English v1; follow device appearance with no in-app theme toggle; accessible mobile flows on constrained networks; permissions and campus scope; pending external operations remain explicit; legal, Flutterwave, courier operations, and measurable service targets remain separate gates                              |

## Platform and device scope

| Surface                  | Required scope                                      | Inputs from PSS / current IA                                                                                                                                                                                                  |
| ------------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Buyer and seller product | iOS and Android mobile experiences                  | Respect device appearance; English v1; campus selection; constrained-network and offline pending-sync behavior; platform safe areas, system UI, keyboard, accessibility and device adaptations remain for later design steps  |
| Soldbay staff            | Desktop plus a full-capability mobile fallback      | Admin/Ops IA requires mobile fallback. Its role responsibilities and six screen purposes are inputs; its older visual treatments, component framework, typography, and implementation assumptions are historical and excluded |
| External participants    | Provider and manually assigned courier interactions | Show only approved transaction state and scoped contact/process information; do not imply provider confirmation, courier collection, or elapsed time is buyer receipt                                                         |

Exact OS/version support, viewport matrix, orientation policy, supported input devices, and measurable accessibility conformance are not set in the PSS and must be resolved in later design/technical planning.

## Existing-design and asset audit

| Source                                    | Step 01 treatment                                                                                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `design/soldbay-design-documentation.pen` | Intentionally empty on 2026-11-05; now holds approved foundations and platform documentation, not final screens or reusable components                         |
| Previous Figma file and old local screens | Historical; excluded from the rework and not visual precedent                                                                                                 |
| Previous repository UI and implementation | Historical; may only be consulted for migration facts if separately requested, not as design authority                                                        |
| AllOnSoldBay workflow and IA documents    | Product behavior and role boundaries are authoritative; older layout/theme/framework statements are not design approval where marked historical or superseded |
| Brand assets                              | No approved logo, identity system, imagery, icon set, or design token inventory has been established for this rework                                          |

## Assumptions, open design questions, and separate gates

### Design questions to resolve in their assigned stage

- Which specific iOS/Android versions, device sizes, and viewport ranges will be supported?
- What measurable accessibility target and validation coverage will be used for the critical paths?
- What responsive and interaction adaptations are needed for the full-capability staff mobile fallback?
- Which approved visual identity assets exist, if any, outside the cleared Pencil canvas?

### Product choices intentionally not reopened

Signup requirements, campus selection, seller proof, payout review, negotiation rules, order timing, handoff, dispute/refund paths, roles, and MVP inclusions are defined by the PSS and current AllOnSoldBay product documents. Design must represent these rules rather than propose alternatives silently.

Student interviews were scrapped as unimportant and were not conducted. Do not schedule or imply student-interview research as a prerequisite. Do not describe past desk research or competitor comparisons as validation of Soldbay demand.

### External gates to show accurately in design

- Privacy/legal review remains open, including age handling, notices, retention, rights, DPIA, processors, and cross-border issues.
- Flutterwave written confirmation of the marketplace held-funds, payout, and refund flow remains required before integration.
- Courier coverage, terms, liability, event evidence, and escalation remain operating dependencies.
- Service availability, latency, recovery, and support-capacity targets remain undefined; do not invent user-facing guarantees.

These gates do not reopen the approved workflow unless a specific incompatibility is established by the relevant review.

## Step 01 exit checklist and approval gate

- [x] Approved PSS and primary workflows identified.
- [x] User roles and authorization boundaries inventoried.
- [x] Critical journeys mapped to functional and acceptance IDs.
- [x] Product, staff, and external participant surfaces listed.
- [x] Existing design sources and rework exclusions recorded.
- [x] Platform scope and unresolved device/accessibility details recorded.
- [x] Student interviews explicitly excluded as a scrapped activity.
- [x] Legal, provider, courier, and service-quality gates kept distinct from design decisions.
- [x] Owner reviewed this brief and approved Step 01 exit on 2026-11-05.

**Step 02 artifact:** See docs/design-research.md for the desk-research synthesis, source annotations, competitor evidence limits, hypotheses, and review gate. Student interviews remain excluded.
