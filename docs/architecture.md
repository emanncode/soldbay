# Soldbay Product & System Definition — MVP Contract

> **Status (2026-11-03): product workflow and PSS complete and approved as intended product behavior.** This document is the canonical intended-product and system contract for the full rework. The previous codebase, stack, routes, and Figma designs are historical and do not constrain the rework. Technology selection, brand, design system, Pencil screens, implementation, and production are separate later work. This is not legal clearance or provider approval.
>
> **Evidence labels:** **Approved** = owner-confirmed product behavior; **Proposed** = recommended but not yet owner-approved; **Open** = requires product, legal, or provider resolution; **Deferred** = belongs to later Pencil design or architecture/implementation work. No previous implementation state is evidence for the new product.

## 1. Authority and scope

Product decisions come from AllOnSoldBay Linear: [Workflow Review — Signup & Seller Verification](https://linear.app/emanncode/document/workflow-review-signup-and-seller-verification-1046998b012d), [Feature/Workflow Inventory](https://linear.app/emanncode/document/featureworkflow-inventory-53ba70f8db9b), [Screen Flow (IA)](https://linear.app/emanncode/document/screen-flow-ia-69bc776e3097), [Admin/Ops Screen Flow (IA)](https://linear.app/emanncode/document/adminops-screen-flow-ia-2c5640ccd906), and [Privacy & Legal Review](https://linear.app/emanncode/document/privacy-and-legal-review-data-processing-retention-and-account-338ec34bf6ac). Linear is the decision source; this document consolidates product requirements, system boundaries, conceptual data, and acceptance criteria. It does not select implementation technologies or claim that any behavior has shipped.

## 2. Product model and scope

**Approved product model:** Nigeria-first campus marketplace; each account selects a university and required campus; buyers purchase one listing at a time, with no cart. Accounts start as buyers. Selling requires university-format matric number, one student proof, store profile, payout information, Soldbay Admin review, and seller 2FA before publishing or accessing proceeds.

**Not selected in this PSS:** frontend/backend frameworks, database, storage, hosting, authentication vendor, email vendor, analytics, and specific courier company. Flutterwave is the selected payment provider subject to written approval of the marketplace funds flow. MVP courier coordination is manual through Soldbay Ops; courier API integration is deferred.

### Product goal, hypothesis and outcomes

Soldbay's intended goal is to let university students discover and complete campus-scoped, single-item transactions with seller verification, explicit negotiation rules, held payment, confirmed handoff, and a defined dispute path. This is the chosen product model; it is not evidence that market demand or trust problems have been validated.

The underlying demand and differentiation remain hypotheses. Planned student interviews were scrapped as unimportant and were not conducted; do not cite interviews or competitor comparisons as user validation. Useful post-launch measures may include completed orders, payment-to-handoff time, failed handoffs, disputes, refunds, and repeat buyer/seller use. Numeric success thresholds are not set in this PSS and should not be invented before the operating model and measurement plan are defined.

### Product scope boundary

The MVP includes the capabilities in the 17-section Feature/Workflow Inventory: buyer signup and campus-scoped discovery; seller verification/drafts/listing; negotiable conversations; buy-now checkout; meetup or manually assigned courier; order handoff; order chat, notifications, disputes, returns/refunds; seller proceeds; account controls; and Admin/Support/Ops work. The product language is English for v1; the app follows the device appearance setting and has no manual theme toggle. Pencil will define visual styling separately.

The approved v1 boundaries include no cart or multi-unit listing stock, no buyer wallet/top-up, no global chat inbox, no pre-purchase chat for fixed-price listings, no seller ratings of buyers, no self-serve account deletion, and no live map tracking. Later/cut items remain recorded in the Feature/Workflow Inventory and are not pulled into this PSS by implication.

## 3. Actors, boundaries, and authorization

| Actor | Intended scope |
|---|---|
| Buyer | Public listings on own campus; own orders, chats, disputes, checkout and receipt code. Never another buyer's private data. |
| Seller | Own verification, store, drafts/listings, sales and proceeds. Listing edits/deletion blocked during active buyer/seller/Ops processing. |
| Admin | Seller verification, moderation, campus petitions and account decisions; private access least-privilege and audited. |
| Support | Assigned disputes, failed handoffs/cancellations and account recovery; hold funds while responsibility is unclear. |
| Ops | Manual courier assignment, order-specific contacts, delivery destination/fee review and event records. |
| Courier | Minimum details for assigned delivery; cannot mark Received or release funds. |
| Payment/email providers | External boundary; trust only authenticated callbacks/reconciliation, never client redirects. |

~~~mermaid
flowchart LR
  Buyer[Buyer experience] --> Soldbay[Soldbay product system]
  Seller[Seller experience] --> Soldbay
  Admin[Admin operations] --> Soldbay
  Support[Support operations] --> Soldbay
  Ops[Courier operations] --> Soldbay
  Soldbay <--> Records[(Product records - technology undecided)]
  Soldbay <--> Media[(Private verification and listing media - technology undecided)]
  Soldbay <--> Pay[Flutterwave - approval pending]
  Soldbay --> Mail[Email delivery provider - undecided]
  Ops <--> Courier[Manually assigned courier]
  Buyer <--> TOTP[Compatible authenticator app]
  Seller <--> TOTP
~~~

This system context diagram shows intended actors, systems, and trust boundaries, not a selected deployment. Detailed server authorization belongs in later architecture and implementation design.

### Logical product boundary and trust zones (technology-neutral)

~~~mermaid
flowchart LR
  subgraph ClientZone[Untrusted client devices]
    UserClient[Buyer / Seller experience]
    StaffClient[Admin / Support / Ops experience]
  end
  subgraph SoldbayZone[Soldbay controlled application boundary]
    Product[Soldbay application and workflow services]
    Records[(Product records - technology undecided)]
    Media[(Private proof and listing media - technology undecided)]
    Product --> Records
    Product --> Media
  end
  subgraph ExternalZone[External providers and human operations]
    Email[Email / OTP provider - undecided]
    Payments[Flutterwave - approval pending]
    Courier[Manually assigned courier]
    Ops[Soldbay Ops staff]
  end
  UserClient --> Product
  StaffClient --> Product
  Product --> Email
  Product <--> Payments
  Product <--> Ops
  Ops <--> Courier
~~~

This conceptual system view answers which actors and external parties interact with Soldbay and where privileged access exists. It is not a deployment topology. Specific clients, services, data stores, vendors, regions, and infrastructure are deferred until after the PSS and separate design work.

Target access matrix:

| Operation | Buyer | Seller | Admin | Support | Ops | Courier |
|---|---|---|---|---|---|---|
| Read public campus listings | Own campus | Own campus | Moderation | No routine access | No routine access | No |
| Edit listing | No | Own listing, only when unlocked | No routine edit | No | No | No |
| Publish | No | Approved + 2FA + eligible listing | No | No | No | No |
| View order/chat | Own order | Own order | Case/decision need | Assigned case only | Assigned fulfilment only | Assigned delivery only |
| Submit handoff code | Buyer on own order | No | No | No | No | No |
| View proof/bank data | No | Own data | Authorized verification/payout duties | Only recovery/case need | No routine access | No |
| Decide verification/dispute | No | No | Verification/moderation | Assigned dispute decision | No | No |
| Deactivate/reactivate | Own account | Own account | Audited exception only | No | No | No |

Explicit denies: a client cannot set role, campus ownership, payment state, verification, refund, or terminal order state; courier cannot confirm receipt; buyers/sellers cannot access another party's private records; seller cannot self-approve or change bank details in settings.

## 4. Approved workflow summary

1. **Buyer signup:** separately accept Terms and Privacy, select university and required campus, create buyer account, verify email immediately before app entry. No matric at initial signup.
2. **Seller onboarding:** submit matric in the university's format and one student proof (eduportal student homepage preferred; current-year school ID alternative); complete store and payout bank information; Soldbay Admin reviews all inputs. Pending/clarification/rejected users can edit drafts but cannot publish. Approval plus TOTP enrollment permits publishing.
3. **Listing and negotiation:** photos, title, price, description, condition and negotiable choice. Pre-purchase chat only for explicitly negotiable listings. Accepted price is recorded and reserved for that buyer for 90 minutes. After 24 hours without a message, negotiation chat becomes read-only and item is released if eligible.
4. **Checkout:** order from Product Detail; pay full item price plus shown courier fee. Choose fixed campus meetup or courier to buyer's preferred location on selected campus. Quote and destination are recorded. Provider-pending payment reserves the item until reconciled; failure releases it.
5. **Ready and fulfilment:** seller marks Ready within 6 hours. If missed, 4-hour grace with funds held; at 10 hours auto-cancel and initiate full refund including delivery. After Ready, seller confirms availability. Meetup: fixed campus point, buyer books a window within 24 hours. Courier: Ops manually assigns; seller coordinates collection; buyer confirms delivery window/directions. Courier waits 10 minutes at drop-off before logging an attempt.
6. **Handoff:** unique single-use six-digit order code. Meetup: seller gives it to buyer. Courier: seller gives it to courier at pickup; courier gives it to buyer after delivery. Buyer inspects and enters it. Offline entry is Pending sync; only server validation marks Received and starts the 36-hour dispute timer.
7. **Dispute:** within 36 hours of server-validated receipt, buyer submits one of four material reasons (materially not as described; damaged in courier delivery; materially incomplete/unusable despite represented condition; serious authenticity/prohibited-item concern where relevant), a short explanation, and relevant item/issue photos and/or video. Change of mind, subjective dislike, and disclosed flaws are excluded. Seller has 18 hours to respond; Support targets a decision within 12 hours after response/expiry. Funds stay held. If return is required, the buyer arranges it within 18 hours after decision; Support sets a practical return-by time. Return follows original fulfilment method and uses a separate one-time code; refund completes after server validation.
8. **Account controls:** deactivate, do not delete. Resolve open transactions first; retain activity and bind identity/matric to same account. Sign-in asks whether to reactivate. History returns, listings remain paused until seller reviews/republishes. Campus change waits for resolved orders; active listings pause during review.

### Target activity diagram

This is a product activity view. Diamonds are decisions and arrows indicate order. Failure/cancellation specifics are in the relevant workflow text above.

~~~mermaid
flowchart TD
  A[Buyer signup and email verification] --> B[Browse selected campus]
  B --> C{Negotiable?}
  C -->|Yes| D[Negotiate; accepted price locks 90m]
  C -->|No| E[Order at listed price]
  D --> E
  E --> F[Choose meetup or courier; pay]
  F --> G{Provider outcome}
  G -->|Pending| H[Reserve and reconcile]
  H --> G
  G -->|Failed| B
  G -->|Paid| I[Seller Ready by 6h]
  I -->|Missed| J[4h grace; cancel/refund at 10h]
  I -->|Ready| K{Fulfilment}
  K --> L[Buyer inspects and enters handoff code]
  L -->|Offline| M[Pending sync]
  M -->|Server validates| N[Received; 36h dispute window]
  L -->|Server validates| N
  N --> O{Dispute?}
  O -->|No| P[Release proceeds after 36h]
  O -->|Yes| Q[Seller response 18h; Support target 12h]
  Q --> R{Return required?}
  R -->|Yes| S[Original method; return code; refund]
  R -->|No| T[Refund or release per decision]
~~~

First failed handoff starts a 24-hour resolution window with one replacement. Second failure goes to Support fault/cost review; unclear fault keeps funds held. Failed meetup without handoff refunds full item price. Courier fault returns full payment; seller fault returns full payment and seller bears applicable return cost; buyer fault after dispatch retains only disclosed actual delivery/return costs after replacement.

### Refund provider outcome

**Confirmed / Intended:** every buyer refund is routed to the original payment provider and transaction reference. If the provider has not confirmed completion, the order remains **Refund pending** and funds remain reserved. Support checks the provider status and retries through that same provider with the same idempotent reference. Do not offer an alternate refund route or mark the order refunded until provider confirmation. Do not collect bank details by email; if the provider requires additional details, collect them through a secure in-app flow. This policy applies to cancellation, failed handoff, and dispute refunds.

### Payment provider selection

**Selected MVP provider: Flutterwave.** Before integration, Soldbay must obtain confirmation from Flutterwave that it approves the buyer-seller marketplace model and permits the intended funds flow: collect the buyer's full payment, hold funds through handoff and the dispute window, release proceeds to the seller when policy allows, and refund the buyer to the original payment method when policy requires. Confirm settlement timing, refund completion semantics, and payout support as part of that company confirmation; ordinary merchant settlement or transfer support alone does not establish approval for this held-funds model.

Paystack has comparable marketplace and third-party-payment approval limitations, so those limitations do not reopen provider selection or create a separate Paystack evaluation decision. Flutterwave remains selected. If Flutterwave does not confirm the required use and funds flow, pause integration and return the incompatibility for a product decision; do not switch providers automatically.

### Payment and receipt sequence

This target sequence shows when the payment provider and Soldbay may hold different states. Provider confirmation determines external payment outcome; Soldbay records its order state from verified provider events and internal workflow decisions. Receipt is not implied by courier collection. This is a target contract.

~~~mermaid
sequenceDiagram
  participant B as Buyer app
  participant API as Soldbay API
  participant DB as Database
  participant Pay as Payment provider
  participant S as Seller
  participant C as Courier or meetup
  B->>API: Start checkout with listing, campus, method, destination
  API->>DB: Reserve eligible listing and persist pending checkout
  API->>Pay: Initialize payment with stable reference
  Pay-->>B: Provider checkout / pending result
  Pay-->>API: Authenticated success, pending, or failure event
  API->>DB: Idempotently reconcile provider event and order state
  API-->>B: Payment/order status
  S->>API: Mark order Ready
  API-->>C: Ops assignment and scoped delivery details if courier
  C-->>API: Collection/delivery attempt events
  C-->>B: Deliver item and handoff code
  B->>API: Submit code, possibly queued offline
  API->>DB: Validate code once and transition to Received
  API-->>B: Received plus dispute deadline
  API->>DB: Hold funds through 36-hour window
~~~

A provider redirect alone must not mark Paid. Duplicate provider events and client retries must not duplicate reservations, orders, ledger entries, refunds, or releases. If the buyer is offline, local submission stays pending until server validation.

## 5. Domain model and state

Target conceptual associations (not a physical schema proposal): User owns a SellerProfile; SellerProfile owns Listings; Listing has Negotiations and Orders; each Order belongs to one buyer and seller, has Handoff events, optional CourierAssignment, Disputes, and ledger entries. Orders snapshot price, fee, destination, campus, fulfilment and event data so profile changes cannot rewrite history.

~~~mermaid
classDiagram
  class User {
    id
    email
    universityId
    campusId
    accountStatus
  }
  class SellerProfile {
    userId
    username
    storeInfo
    verificationStatus
    payoutDetails
    twoFactorStatus
  }
  class Listing {
    sellerId
    campusId
    price
    negotiable
    availabilityState
  }
  class Negotiation {
    listingId
    buyerId
    messages
    acceptedPrice
    lockExpiresAt
  }
  class Order {
    listingId
    buyerId
    sellerId
    agreedPrice
    deliveryFee
    destination
    fulfillmentMethod
    lifecycleState
  }
  class Handoff {
    orderId
    kind
    codeHash
    validatedAt
  }
  class Dispute {
    orderId
    reason
    evidence
    sellerResponse
    decision
  }
  class CourierAssignment {
    orderId
    courierContact
    eventTimeline
  }
  class LedgerEntry {
    ownerId
    orderId
    amount
    providerReference
  }
  User "1" --> "0..1" SellerProfile
  SellerProfile "1" --> "*" Listing
  Listing "1" --> "*" Negotiation
  User "1" --> "*" Order : buyer
  SellerProfile "1" --> "*" Order : seller
  Order "1" --> "*" Handoff
  Order "1" --> "0..*" Dispute
  Order "1" --> "0..1" CourierAssignment
  Order "1" --> "*" LedgerEntry
~~~

This conceptual UML class view explains entity ownership and lifecycle associations, not physical columns, indexes, or database constraints. It is a product-level model, not a schema proposal.

### Conceptual data needs and access

This is a product-level data inventory, not a database schema. Keep retention durations open for the purpose-based privacy schedule; apply least-privilege access and audit to sensitive data.

| Data group | Related requirements | Needed for | Sensitivity and access boundary | Lifecycle / open point |
|---|---|---|---|---|
| Account and campus | FR-01, FR-14–15, EXT-01 | Email verification, declared 18+ checkbox, separate Terms/Privacy acceptance, university/campus selection, account status and reactivation. | Personal account data; user sees own record, trusted services process it, Support/Admin only for assigned account duties. | Deactivation/reactivation as agreed; retention schedule and identity non-reuse basis remain in Privacy & Legal Review. |
| University and campus registry | FR-01–02, FR-14 | Campus-scoped discovery and per-university matric-number format validation. | Public registry/configuration; registry owner and update access still need definition. | Registry coverage and supported formats need configuration before seller verification build. |
| Seller verification | FR-02–03, FR-16, NFR-02 | Matric number, selected proof method and private evidence reference, application status, clarification, reviewer and decision history. | Sensitive student data; seller sees own submission, authorized Admin reviews, Support only when assigned. | Retention duration, old-upload deletion, and legal basis are open; do not expose proof through public media URLs. |
| Store, username and payout profile | FR-02–03, FR-13, NFR-02 | Public store name/bio/avatar and username; private payout bank details and change-request history. | Store fields may be public; username is personal; payout data is restricted to seller and authorized Admin/Ops staff, with audit. | Store edits allowed; username cooldown is 90 days; bank changes use audited Support workflow; retention is purpose-based. |
| Listing and media | FR-04–05, FR-07 | Photos, title, price, description, condition, negotiability, campus, availability and public sold/unavailable state. | Published listing details/media public; drafts private to seller and authorized moderation. | Temporarily unavailable remains tagged/openable; Sold is unclickable for one hour, then hidden; preserve sale history. Media retention follows listing/order purpose and deletion policy. |
| Negotiation and chat | FR-04–05, FR-13, NFR-02 | Buyer/seller messages, accepted buyer-specific price, 90-minute lock, message times, read-only/archive state. | Private to participants; assigned Support/Ops only for case or operational need; no public listing exposure. | Negotiation closes read-only after 24 hours without a message; order chat read-only after 48 hours from validated receipt; retention duration remains open. |
| Order, payment and refund | FR-06, FR-08–11, FR-13, NFR-03, EXT-02 | Order parties, listing/campus/price/fee/destination snapshots, provider/reference/status, reconciliation/refund attempts, event times. | Transaction and financial metadata; buyer/seller see their order, authorized Admin/Ops/Support see minimum assigned case/payment scope. Never store raw card credentials. | Preserve through order/refund resolution; retention and provider event contract remain external/legal design items. |
| Handoff, courier and return | FR-07, FR-09–12, FR-13, NFR-03, EXT-03 | One-time code verifier, submission/validation attempts, courier assignment/contact, route/delivery-window, collection/delivery/return events. | Code verifier and delivery contact/location are restricted to order parties and assigned Ops/Support/courier; never public. | Keep event evidence through order/dispute/return resolution; retention period and courier contract remain open. Courier cannot mark Received. |
| Dispute and evidence | FR-10–12, FR-13, NFR-02–03 | Eligible reason, explanation, buyer photos/video, seller response/evidence, Support findings and resolution. | Sensitive case data visible to parties and assigned Support; Admin access only when authorized; log staff access. | Retain according to dispute/accounting purpose after legal review; return/refund status linked to the order. |
| Wallet, ledger and payout | FR-06, FR-11, FR-13, NFR-03, EXT-02 | Held/released/refunded amounts, seller balance, withdrawal request/status, provider references and reconciliations. | Financial records; seller sees own ledger, authorized payout staff and Support see case-required fields. | Immutable transaction history needed for reconciliation; legal/accounting retention schedule remains to be set. |
| Authentication, 2FA and audit | FR-15–16, FR-13, NFR-01–02, BR-01 | Password recovery events, TOTP secret, single-use recovery-code verifiers, privileged decisions and material state-change audit events. | Credentials/secrets highly restricted; store secret material securely and never expose recovery codes in logs; audit access to sensitive records. | Security-event retention period and backup/deletion treatment remain to be set in security/privacy review. |

The table records the data needed to support the approved workflows and access boundaries. It does not settle database normalization, encryption implementation, legal retention duration, production provider region, or audit retention; those require design after workflow, privacy, and provider gates.

~~~mermaid
stateDiagram-v2
  [*] --> PaymentPending
  PaymentPending --> Paid: provider confirms success
  PaymentPending --> Cancelled: definitive failure or expiry
  Paid --> Preparing
  Preparing --> Ready
  Paid --> Cancelled: missed Ready at 10h
  Ready --> MeetupBooked
  Ready --> CourierAssigned
  MeetupBooked --> Received: server validates buyer code
  CourierAssigned --> InTransit: courier pickup recorded
  InTransit --> Received: server validates buyer code
  MeetupBooked --> ResolutionWindow: first attempt fails
  InTransit --> ResolutionWindow: first delivery fails
  ResolutionWindow --> MeetupBooked: one replacement
  ResolutionWindow --> CourierAssigned: one replacement
  ResolutionWindow --> Refunded: Support fault/cost decision
  Received --> DisputeWindow
  DisputeWindow --> Completed: 36h, no dispute
  DisputeWindow --> Disputed: buyer opens case
  Disputed --> ReturnRequired: Support requires item return
  ReturnRequired --> Refunded: return code validated
  Disputed --> Refunded: Support awards refund without return
  Disputed --> Completed: Support releases payment
  Cancelled --> [*]
  Refunded --> [*]
  Completed --> [*]
~~~

This target state diagram captures the principal order transitions. Detailed cancellation, return/refund substates, and provider reconciliation states will be refined in later architecture work without changing the approved workflow.

Target state transitions:
- **Account:** Pending email verification -> Active Buyer -> Seller application Pending / Needs clarification / Rejected / Approved -> Active Seller with required 2FA. Active -> Deactivation pending until transactions resolve -> Deactivated -> explicit reactivation. Seller listings remain paused after reactivation.
- **Listing:** Draft -> Active -> Temporarily unavailable during negotiation/accepted-price/payment reservation -> paid Sold card for 1h -> hidden while paid order unresolved -> completed/archive. Restore only after cancellation/refund resolution, return where required, and resale eligibility.
- **Negotiation:** Open -> accepted offer (buyer-bound 90-minute lock) -> payment pending/order after provider success. 24h inactivity closes chat read-only and releases eligible listing. Provider-pending payment keeps reservation pending reconciliation.
- **Order:** Payment pending -> Paid -> Preparing -> Ready -> Meetup booked or Courier assigned -> In transit on courier collection -> Received only after server validates buyer code -> 36h dispute window -> completed/released. Branches: 10h missed-Ready refund; cancellation; first failed handoff + 24h/one replacement; second failure Support; dispute/return.
- **Dispute:** Open with reason/evidence -> Seller response due 18h -> Support decision target 12h after response/expiry; funds held. Return-required -> buyer arranges within 18h after decision -> Support records practical return-by -> original method + separate code -> validated return -> refund.

These are product target states. They do not prescribe implementation enums or storage values.

## 6. External systems and operational boundaries

| Boundary | Product purpose and data exchanged | Trigger and expected behavior | Status / dependency |
|---|---|---|---|
| Email delivery | Send signup verification and password-recovery OTPs to the registered email. | Account access is blocked until signup email is verified. Password recovery requires email OTP and does not reactivate a deactivated account. Delivery failure must not bypass verification; exact expiry/resend rules are an implementation detail to define later. | Provider undecided; email notifications generally are Later scope, except required verification/recovery. |
| Payment provider | Receive checkout amount and transaction reference; return pending/success/failure status; process original-method refunds and seller payouts under the approved policy. | Create the paid order only on provider-confirmed success; keep pending/refunds unresolved until provider reconciliation; use idempotent transaction identity. | Flutterwave selected subject to written approval of marketplace use, held funds, payouts and refunds. No escrow or provider capability is claimed before approval. |
| Courier service | Receive the minimum pickup/delivery details, agreed destination/window, contact details and fee arrangement for an assigned order; provide assignment, pickup, attempt and return evidence. | Soldbay Ops manually assigns after Ready; the courier's collection is intermediate; only buyer-entered server-validated code confirms receipt. | Manual Ops coordination in MVP; provider coverage, operating terms, cost/liability allocation and escalation are open before activation. API integration is deferred. |
| Authenticator app | User pairs a compatible app to generate TOTP codes; Soldbay verifies enrollment and later sign-in codes. | Seller publishing and proceeds remain blocked until 2FA enrollment; recovery codes are single-use; seller manual reset needs a second reviewer. | Protocol selected; app/vendor unspecified. Technical secret-storage and recovery implementation are later architecture/security design. |
| University/campus configuration | Supply signup university/campus choices and per-university matric-number format rules. | Signup requires university and campus; seller verification validates matric format for the selected university. | Required internal product data. Registry owner, source and update process are open operational details; no external registry is assumed. |
| Manual support operations | Receive and resolve seller verification, dispute, account recovery/detail-change, campus petition, moderation and courier coordination cases. | Assign to the authorized Admin, Support or Ops owner; keep funds/listings in the defined state until a decision is recorded; notify affected users. | MVP operational capability. Staffing and coverage needed to meet agreed response targets remain to be planned. |

These boundaries describe product responsibilities and information flow, not APIs, vendors (except conditional Flutterwave selection), contracts, deployment, or technical architecture.

## Appendix A. Legacy API catalog — excluded from the rework contract

The routes below describe the discarded implementation only. They are preserved as historical material, not a target API design or requirement. Do not reuse or migrate them by default. Select API boundaries and technology only after the product and system definition is approved.

Current route names below are not proof that intended behavior is complete. All private mutations need server authorization, ownership/scope validation, input/state guards, safe errors, audit events for material/admin/financial changes, and idempotent retry semantics.

| Current route(s) | Caller and intended boundary | Current evidence / gap |
|---|---|---|
| GET /api/universities, GET /api/categories, GET /api/listings, GET /api/listings/[id] | Public reads; only eligible listings within selected campus; exclude private fields. | Public reads exist; campus scope/availability differs. |
| POST /api/auth/signup; POST /api/auth/mobile-login; POST /api/auth/verify-otp; POST /api/auth/forgot-password; POST /api/auth/reset-password; POST /api/auth/refresh-token; NextAuth routes | Public login/signup rate-limited; OTP expiring/single-use; buyer signup requires campus, university and policy consent; 2FA challenge as enabled. | Signup accepts role, requires matric, university optional. OTP verification only validates; full email gate absent in reviewed routes. Forgot-password logs OTP; email delivery unverified. No 2FA. |
| GET/PATCH /api/users/me | Authenticated owner; only allowed profile fields; campus through petition; bank changes through Support; deactivation rather than deletion. | Legacy soft-delete/delete behavior conflicts with policy. |
| POST/GET /api/sellers/petition; POST /api/sellers/verify; GET /api/sellers/me; GET /api/sellers/me/id-image | Owner submits/reads own application; private proof; university-format matric; Admin-only review. | Partial legacy seller flow; proof and payout package differ. |
| GET/POST /api/listings; /api/listings/drafts; /api/listings/drafts/[id]; /api/listings/[id]; POST /api/listings/drafts/[id]/publish; POST /api/upload/listing-image | Public read; seller-owner writes; approved + 2FA publish gate; validate campus, fields, active lock and image visibility/size/type. | Routes exist; negotiation, campus lifecycle, locks, Sold display absent; current gate is legacy. |
| POST /api/orders/checkout; GET /api/orders; GET /api/orders/[id] | Authenticated buyer checkout; only order parties read. Checkout validates current offer, campus, quote, fulfillment and item state; provider pending is reconciled. | Checkout reserves stock and initializes Paystack; TEST_MODE bypass exists; no webhook/reconciler found. |
| POST /api/orders/[id]/reveal-pin; POST /api/orders/[id]/verify-pin; POST /api/orders/[id]/confirm-receipt | Seller reveals only at allowed stage; buyer submits one-use code; server validates stage/replay/offline idempotency; receipt does not directly release funds. | Legacy four-digit PIN and receipt/payout paths; target code/offline/window unsupported. |
| POST /api/orders/[id]/dispute; GET /api/admin/disputes; GET /api/admin/disputes/[id]; POST /api/admin/disputes/[id]/resolve | Buyer on eligible own order; validate 36-hour window, allowed reason, explanation and media evidence; authorized Support/Admin records decision; provider refund/release is idempotent. | Reason-only case and basic Admin routes; evidence, timing, returns and provider refund missing. Refunds remain pending until the original provider confirms them; Support reconciles/retries through that provider using the same idempotent reference. |
| GET /api/admin/verifications; POST /api/admin/verifications/[id]/decision | Admin-only private seller review; record actor, reason and outcome. | API exists; UI/package partial. |
| GET /api/wallet | Authenticated owner sees own ledger; withdrawals require tracked provider state and immutable entries. | Wallet read/model exists; target escrow/refund/payout incomplete. |
| GET/POST /api/sellers/petition (campus change) | Target campus change needs separate Support petition, no unresolved order gate, listing pause/restore. | Existing petition is seller verification, not campus change; campus workflow absent. |
| GET /api/cron/purge-accounts; GET /api/cron/purge-drafts | Scheduler secret, bounded/retry-safe work, audit; do not purge unresolved financial/legal data. | Routes/config present; actual schedule/runtime unverified; retention policy unconfirmed. |
| POST /api/questions; POST/GET /api/waitlist | Public, abuse-limited; bounded data and safe email forwarding. | Routes exist; delivery unverified. |

Backend invariants: re-check current actor/role/account and resource ownership server-side; use transactions/compare-and-set for listing, order and money transitions; idempotency keys and provider event deduplication prevent duplicate charges/refunds/releases; persist pending external operations for reconciliation because external calls are not atomic with DB; append actor/time/state/evidence; redact private proof, bank data and contact details. Distinguish invalid input, unauthenticated, unauthorized/out-of-scope, conflict, rate-limit, provider pending/failure and internal errors without leaking records.

## Appendix B. Historical repository snapshot — excluded from the rework contract

All details in this section describe the former implementation and are not evidence for, requirements of, or blockers to the new product. Keep them only as archival context; do not use them to shape the PSS or new architecture.

- **Mobile:** route/screen structure exists; README says browse/search are mock data, chat in-memory, order views placeholder, seller verification mocked.
- **Web/API:** Next.js App Router, NextAuth sessions, mobile bearer JWT, Prisma, selected API routes. Route existence does not establish route-level authorization correctness; audit each mutation before launch.
- **Schema:** existing fields include User role/email/university/matric/retention, SellerProfile username/store/verification, Listing stock/status/draft, Order amount/status/pickupLocation/four-digit PIN, Dispute reason/status/resolution, WalletTransaction.
- **Data-handling code evidence (2026-11-02):** The web app uses Prisma/PostgreSQL via `DATABASE_URL`. Seller proof images are stored in private Vercel Blob and served through an authenticated route; listing images use public Vercel Blob. The seller-proof upload route overwrites `idImageUrl` on resubmission without deleting the old object, and the account-purge helper deletes listing images but does not clear/delete seller-proof images. This is a likely retention gap requiring a deletion policy and implementation fix. Waitlist submissions are stored in PostgreSQL, forwarded via FormSubmit, and may receive email through Resend; public questions are stored and forwarded via FormSubmit. Current signup code still requires matric, accepts buyer/seller roles, and allows university to be omitted, unlike the approved target flow. Checkout still initializes Paystack. These are repository observations only; production regions, live use, contracts, deployed settings, backups, and actual data volumes are unverified.
- **Payment:** checkout initializes Paystack; no payment webhook/reconciliation route found. TEST_MODE creates PAYMENT_SECURED without real payment. No evidence of live escrow.
- **Order/dispute:** receipt endpoint credits seller wallet on confirmation; current order states and PIN differ from agreed six-digit code, 36-hour held-fund lifecycle, offline sync, evidence, return, refund and fault rules.
- **Account:** soft-delete and purge implementation conflicts with deactivate/reactivate and identity no-reuse policy.
- **Operations:** Admin APIs exist; actual Admin/Ops screens, courier assignment, support recovery and campus petition are not evidenced.
- **Not runtime-verified:** live environment, migrations, access policies, provider accounts, schedules, payment/email/storage/courier behavior.

## 7. PSS requirement and acceptance baseline

The requirements below translate the approved product workflow into a first testable baseline. They are **intended requirements**, not implementation evidence or authorization to build. Numeric timing requirements are product decisions already recorded in Linear. External legal/provider obligations remain subject to specialist confirmation.

### Functional requirements

| ID | Requirement | Source workflow |
|---|---|---|
| FR-01 | Create every account as a buyer; require one 18+ checkbox, university, campus, and separate Terms of Service and Privacy Policy acceptance before account creation; require email verification before app access; do not collect date of birth, government ID, matric or student proof at buyer signup. Do not create an account if the age checkbox is unchecked; an under-18 route is outside the MVP. | Signup |
| FR-02 | Allow a buyer to apply to sell by submitting university-format matric, one chosen student proof, store profile and payout details; route the complete package to Soldbay Admin review. | Seller onboarding |
| FR-03 | Keep seller listings as private editable drafts during pending, clarification or rejected verification; publishing requires approval and seller 2FA. | Seller onboarding/listings |
| FR-04 | Support one-unit listings with photos, title, price, description, condition, and an explicit negotiable/not-negotiable selection; only negotiable listings permit pre-purchase chat; accepted price is buyer-specific and locked for 90 minutes. | Listing/negotiation |
| FR-05 | Prevent edits, deletion or a second reservation while a listing has an active negotiation, checkout or unresolved order; show temporary unavailability with disabled purchase/chat actions; show a sold card as unclickable for one hour after payment, then remove it from public results; restore only eligible items after order resolution. | Listing lifecycle |
| FR-06 | Create an order only after provider-confirmed payment; charge full agreed item price plus disclosed courier fee; hold funds through handoff and the dispute window. | Checkout/payment |
| FR-07 | Support campus meetup and manually assigned courier delivery to the buyer's selected-campus preferred location; quote and record delivery fee before payment. | Fulfilment |
| FR-08 | Enforce seller Ready timing (6 hours plus 4-hour grace); cancel and initiate full refund at 10 hours if still not Ready. | Order preparation |
| FR-09 | Confirm receipt only from a server-validated unique one-time handoff code; queue offline code entry as Pending sync; do not infer receipt from elapsed time or courier report. | Handoff |
| FR-10 | Open the buyer dispute window for 36 hours after server-validated receipt; collect an eligible reason, explanation and item/issue media; allow seller response for 18 hours; route resolution to Support. | Dispute |
| FR-11 | Keep funds held while disputes, returns, failed handoffs or provider refund status are unresolved; process refunds through the original provider and do not mark complete before provider confirmation. | Dispute/refund |
| FR-12 | Apply the original fulfilment method to required returns; use a separate one-time return code; restore an item for sale only when back with seller and eligible. | Returns/relisting |
| FR-13 | Support order-scoped buyer, seller, Support, Admin, Ops and courier actions under the approved permission matrix; record material order, verification and financial decisions. | All role workflows |
| FR-14 | Support campus-change petitions with the distinct buyer and seller order gates; pause eligible listings during review; preserve completed order campus history. | Campus change |
| FR-15 | Deactivate rather than self-delete accounts; require explicit reactivation of the same account; restore retained history and keep listings paused for seller review. | Account lifecycle |
| FR-16 | Support seller 2FA using TOTP and single-use recovery codes; manual recovery requires the approved Support checks and second reviewer for sellers. | Account security |
| FR-17 | Show a campus-scoped home feed with category browsing, Recently Added ordered by listing time, loading/empty states, refresh and pagination. | Feed/browse |
| FR-18 | Search listings by keyword and support category, price, verified-seller, condition and availability filters plus price and recency sort. Popularity sorting is deferred until real campus usage can support a useful ranking. | Search |
| FR-19 | Let buyers add and remove listings from a personal wishlist and access it from Profile. | Wishlist |
| FR-20 | Provide a product detail view with the complete published listing, photo gallery/zoom, seller verification status, listing-report action, and self-purchase prevention; expose pre-purchase chat only for negotiable listings. | Product detail |
| FR-21 | Allow one buyer-only seller review per qualifying final-outcome order, consisting of a 1–5 star rating and optional text; display seller ratings/reviews; do not allow seller-to-buyer ratings. Admin may remove a policy-violating review with a recorded reason. | Ratings/reviews |
| FR-22 | Keep messaging scoped to a negotiation or order, with no global inbox; support push notifications for new messages, on-demand read-receipt details, and contact/off-platform-payment flagging. Blocking prevents new pre-purchase contact, but does not disable an active paid-order channel needed for fulfilment; safety concerns can be reported to Support. | Messaging/safety |
| FR-23 | Provide an in-app notification center for MVP order, pickup, message, listing, dispute and verification events; support in-app banners/toasts. Push settings and email notifications are later scope. | Notifications |
| FR-24 | Give sellers an order/sales queue, earnings summary, and active/sold/unlisted listing management consistent with listing locks and relisting eligibility. | Seller tools |
| FR-25 | Allow reporting listings, users and fraud/scam concerns; provide Admin moderation and ban/suspend/reinstate actions. Restrictions block new marketplace activity but do not silently cancel existing orders, decide disputes, or release/forfeit funds; Support resolves active orders under the normal rules. MVP has no appeal workflow. | Trust and moderation |
| FR-26 | Provide Admin/Support/Ops tools for seller verification, listing/content moderation, dispute decisions, account actions, campus-change petitions, manual courier assignment and operational event recording. | Admin/Ops |
| FR-27 | Maintain the supported university/campus options needed at signup and the university-specific matric-number format rules used for seller verification. Soldbay Admin owns configuration and change history; only configured launch campuses are selectable. | Campus and verification configuration |
| FR-28 | Provide Help/FAQ access and routes to Support requests, including campus-change and account-detail change requests. | Help/support |
| FR-29 | Provide an authenticated password-change action in Account Security requiring current-password confirmation and, when enabled, the existing 2FA factor; changing a password does not reset 2FA or reactivate a deactivated account. Lost-password recovery remains the separate email-OTP flow. | Account security |
| FR-30 | Support an optional seller-set sale price below the normal listing price. Display the normal and effective sale prices; the buyer pays the effective public price unless a buyer-specific accepted offer is active, in which case the accepted amount takes precedence for its 90-minute lock. Sale pricing can be changed only while the listing is unlocked; no scheduled promotions or coupons are included. | Listing pricing |
| FR-31 | Provide an About/app-version entry point for the current release and support information. | Profile/settings |
| FR-32 | Provide the MVP user experience in English and follow the device's appearance preference; do not include an in-app language or light/dark mode switch in v1. | Cross-cutting product scope |

### Quality, business and external requirements

| ID | Requirement | Status / evidence needed |
|---|---|---|
| NFR-01 | Enforce authentication, role, resource ownership, campus scope and state-transition guards on the server for every private operation. | Intended; security review and implementation tests required. |
| NFR-02 | Restrict student proof, payout data, dispute media and delivery contact details to role and case need; audit privileged access. | Intended; DPIA/security review and deployed access verification required. |
| NFR-03 | Make payment, refund, handoff, payout and retry transitions idempotent; preserve pending state for external operations until reconciled. | Intended; provider contract, event model and failure-path tests required. |
| NFR-04 | Define availability, latency, backup/recovery, deletion from primary and backup systems, monitoring and incident response targets before production. | Unresolved; set measurable targets during technical/operations design. |
| NFR-05 | Make signup and core task flows accessible and usable on supported mobile devices and constrained networks, including Pending sync visibility. | Intended; measurable acceptance thresholds and device/network coverage remain to define. |
| BR-01 | Soldbay Admin owns seller verification; Support owns assigned disputes, recovery and petitions; Ops owns manual courier assignment and event coordination; no party may approve their own restricted action. | Intended role/permission model. |
| EXT-01 | Review Nigerian privacy/legal requirements relevant to the checkbox-only 18+ signup policy alongside lawful bases, notice/consent wording, rights and retention, DPIA, controller classification, processors and cross-border transfers. | Open legal gate; privacy register. |
| EXT-02 | Obtain Flutterwave's written confirmation of marketplace use, held-funds, seller payout and original-method refund flow before integration. | Open provider gate; not production approval. |
| EXT-03 | Establish courier coverage/terms, fee and liability allocation, event evidence and escalation before activating manual courier fulfilment. | Open operating dependency. |

### Quality-target register — measures identified, values not guessed

The following values are not set yet. They need evidence from selected providers, a supported-device/network definition, operational capacity, and the production hosting/recovery plan. Do not turn these into arbitrary promises.

| Quality area | Measure to establish | Evidence needed before choosing a target |
|---|---|---|
| Core service availability | Monthly availability for signup, browse, checkout, order status, and Admin/Support operations, with a defined measurement window and exclusions. | Hosting/service plan, launch support expectations, and monitoring design. |
| User-visible latency | p95 duration for signup, listing browse/detail, checkout initiation, and order updates under representative campus mobile networks. | Baseline measurements on agreed supported devices and network profiles. |
| Email verification | OTP delivery and successful verification time distribution; expiry/retry thresholds. | Email provider delivery behavior and production-path verification. |
| Payment/refund reconciliation | Maximum tolerated time in pending state before alert/escalation; webhook/polling cadence and idempotent retry behavior. | Flutterwave's confirmed callbacks, settlement/refund semantics, and reconciliation support. |
| Data recovery | RPO/RTO per transaction, identity, and media data class, plus restore-test frequency. | Database/blob provider capabilities, retention/legal policy, and acceptable business loss/downtime. |
| Mobile and offline support | Supported OS/device range, representative constrained-network profiles, and handoff pending-sync recovery success criteria. | Target market device information, platform support policy, and repeatable test setup. |
| Accessibility | Applicable conformance target and auditable checks for signup, checkout, order, dispute, and seller verification. | Product/platform scope and qualified accessibility review. |
| Support operations | Staffing/coverage needed to meet already approved 12-hour resolution targets and incident escalation duties. | Support rota, workload estimates, and courier/provider escalation contracts. |

The existing workflow deadlines (such as seller response, meetup resolution, and dispute handling) are product-policy timers. They do not establish service availability, API latency, provider settlement time, or a guaranteed refund arrival time.

### Acceptance criteria baseline

| ID | Acceptance criterion |
|---|---|
| AC-01 | Signup rejects an unchecked 18+ box, missing university/campus or either required policy control; creates only a buyer; no app route is available until email verification succeeds; no age step beyond the single checkbox and no DOB/ID or matric/proof fields appear in buyer signup. |
| AC-02 | Seller application cannot be submitted until matric, exactly one supported proof, store fields and payout fields are present; only authorized Admin can approve/reject/request clarification; pending/unapproved sellers cannot publish. |
| AC-03 | A buyer cannot start pre-purchase chat on a fixed-price listing; an accepted negotiation price is unavailable to another buyer and expires at 90 minutes absent a still-pending provider transaction. |
| AC-04 | Two simultaneous attempts to reserve/buy a one-unit item cannot both succeed; locked items cannot be edited/deleted; cancellation/refund restores availability only after resolution and resale eligibility. |
| AC-05 | Checkout displays item amount, any courier fee and total before payment; a client redirect alone cannot create a paid order; duplicate/retried provider events do not duplicate order or ledger effects. |
| AC-06 | No Ready event at hour 6 starts a visible 4-hour grace; at hour 10 the order is canceled and a full refund is initiated; an unresolved provider refund remains pending. |
| AC-07 | A valid handoff code marks Received once and starts the 36-hour dispute window; invalid/replayed codes fail; offline entry remains Pending sync and funds held until server validation. |
| AC-08 | A timely eligible dispute stores the required media and explanation, notifies the seller, records the 18-hour response deadline and keeps funds held until an authorized Support decision. |
| AC-09 | A required return uses the original fulfilment mode and separate return code; refund completion waits for validated return and provider confirmation, except the documented Support-verified seller refusal/no-show path. |
| AC-10 | Campus changes cannot be approved under the role-specific unresolved-order conditions; pending review pauses listings; completed order history remains on its original campus. |
| AC-11 | Deactivation does not create a replacement account; sign-in asks to reactivate the same account; reactivated seller listings remain paused until explicit republish. |
| AC-12 | Seller sensitive-data routes deny buyers and unauthorized staff; access to proof/payout data is scoped and audited; approved 2FA recovery blocks seller publishing/proceeds until re-enrollment. |
| AC-13 | If a negotiation has no message for 24 hours, its chat becomes read-only and the listing returns to public availability only if no other lock or order prevents relisting. An accepted buyer-specific price expires after 90 minutes unless its checkout is still awaiting provider reconciliation. |
| AC-14 | While payment status is pending, the item remains reserved and the order is not treated as paid; only provider-confirmed payment creates the paid order. A definitive failure releases the reservation. A refund without provider confirmation remains pending and keeps funds reserved. |
| AC-15 | For a first failed meetup or delivery, record the attempt and open the 24-hour resolution window with one replacement attempt. If that also fails, route to Support for fault/cost review, keep funds held, and target a decision within 12 hours after required evidence is available. A failed meetup has no courier charge; courier outcomes use the approved fault-based cost allocation. |
| AC-16 | At courier drop-off, record the agreed buyer location and delivery window. If the buyer is absent, the courier waits 10 minutes, records the attempt, and contacts the buyer through the order-scoped channel; the courier cannot mark the order Received or trigger fund release. |
| AC-17 | Offline handoff-code entry is visibly Pending sync. It does not mark the order Received, start the 36-hour dispute window, release funds, or make the listing available until the server validates the one-time code. Replays and invalid codes fail without changing order state. |
| AC-18 | A dispute can be submitted only within 36 hours of server-validated receipt for materially-not-as-described, courier damage, materially incomplete/unusable despite the listing, or serious authenticity/prohibited-item concern where relevant. Require a short explanation and relevant item/issue photos and/or video; exclude change of mind, subjective dislike, and clearly disclosed flaws. The seller receives an 18-hour response window; Support reviews after response or expiry, targets a decision within 12 hours, and keeps funds held until the decision is recorded. |
| AC-19 | When a buyer-favouring item dispute requires return, the return uses the original fulfilment mode and a separate one-time code. Refund completion waits for validated return and provider confirmation. If Support verifies seller refusal/no-show, it may authorize the refund without seller-entered code; the listing remains unavailable until physically returned. |
| AC-20 | A seller who misses Ready at 6 hours receives the agreed 4-hour grace period with funds held and both parties notified. At 10 hours, the system cancels and initiates a full refund including delivery fee. The listing remains unavailable until cancellation is resolved and resale eligibility is confirmed. |
| AC-21 | A campus-change request is not approved while the user's role-specific order conditions remain unresolved. Active listings are paused during review; approval moves eligible listings to the new campus, while rejection restores eligible listings to the old campus. Completed order campus history never changes. |
| AC-22 | Deactivation is blocked while unresolved transactions exist. Once eligible, it removes listings from public availability but retains activity under the purpose-based schedule. Reactivation restores retained history on the same account; seller listings remain paused until individually reviewed and republished. |
| AC-23 | A temporarily unavailable listing remains visible with a status tag and openable details, but purchase and negotiation actions are disabled. After successful payment, show a Sold label and check icon for one hour on an unclickable card, then remove it from public results. Restore a canceled/refunded item only after resolution and confirmation that it is eligible for resale. |
| AC-24 | After Ready, the seller confirms availability and the buyer confirms meetup/courier timing; use the campus's single fixed meetup point for in-person pickup. Complete the first handoff within 24 hours after Ready (30 hours after payment when Ready is on time). For courier delivery, delivery to the buyer's preferred location on their selected campus is the deadline event; seller collection is intermediate. Ops assigns the courier manually and shares order-scoped contact details; the buyer confirms a delivery window with the courier. |
| AC-25 | The paid order chat supports coordination through handoff and remains writable for 48 hours after server-validated receipt. It then becomes read-only while history remains accessible. If canceled before handoff, make it read-only when cancellation is confirmed and refund is initiated. |
| AC-26 | Before preparation starts and before courier dispatch, either party may self-cancel and receive a full refund including delivery fee; restore the listing only after cancellation is confirmed. After preparation starts or dispatch, route cancellation through Support and apply the documented phase-specific fault/cost rules; never infer preparation start from Ready status. |
| AC-27 | Seller verification submissions include the university-format matric number, exactly one student proof option, store information, and payout information. Pending/clarification/rejected sellers may edit and resubmit drafts but cannot publish until Admin approval and seller 2FA are complete; payout details are not editable through account settings. |
| AC-28 | The seller provides the one-time purchase code to the courier at collection; the courier passes it to the buyer at delivery. The buyer enters it in Soldbay. Courier collection or delivery reports alone never mark the order Received. |
| AC-29 | After two failed campus meetups, Support records responsibility and targets a decision within 12 hours after the failed replacement and evidence. Because no item was handed off, refund the full item price; do not deduct courier or return costs. Keep the listing unavailable until the order is resolved and resale eligibility is confirmed. |
| AC-30 | For failed courier delivery, Support uses the order timeline, agreed location/window, attempts, return record, and in-app communication to assign fault before refunding. Seller fault returns the full buyer payment and charges applicable actual return cost to seller; courier fault returns full payment with Soldbay initially covering delivery/return costs; buyer fault after dispatch permits one reschedule, then refunds item price less only actual disclosed delivery/return costs. Unclear fault keeps funds held until decided. |
| AC-31 | A buyer may review the seller only after a final Completed or Refunded outcome. Do not invite a review while an order, dispute, return, or refund remains unresolved; sellers cannot rate buyers. |
| AC-32 | After the 36-hour dispute window closes without an open dispute, the seller can request wallet withdrawal. Show Requested, Processing, Paid, or Failed; allow retry/correction after failure when appropriate; do not show a guaranteed arrival date unless the payout provider supports it. |
| AC-33 | Sellers may update store name, bio, and avatar without a cooldown. Username changes are limited to once per 90 days. Bank and other personal account details cannot be changed in settings; a dedicated support request securely collects and audits the change, then notifies the seller. |
| AC-34 | Password recovery requires email OTP before password reset. Resetting the password alone does not reactivate a deactivated account; after sign-in, declining reactivation keeps the same account deactivated, while accepting restores retained history and leaves seller listings paused for review. |
| AC-35 | TOTP enrollment requires confirmation with a generated code and issues single-use recovery codes. Enabled 2FA is required at sign-in; sellers without enrolled 2FA cannot publish or access proceeds. Lost authenticator plus recovery codes invokes the logged Support recovery procedure and a second reviewer for sellers; seller restrictions remain until re-enrollment. |
| AC-36 | University configuration controls matric-number format, including numeric-only and alphanumeric schools; reject invalid formats for that university and allow valid formats without applying one global pattern. Buyer signup collects no matric number. |
| AC-37 | A listing cannot publish until photos, title, price, description, condition, and an explicit negotiable/not-negotiable selection are present. Missing fields block publishing and preserve the draft for correction. |
| AC-38 | For meetup, the buyer selects a pickup window within 24 hours after Ready. If they do not select one or miss the booked first meetup, record the first failed handoff, hold funds, and open the 24-hour resolution window. The seller posts replacement availability; the buyer selects the one permitted replacement window, which must occur before that window expires. |
| AC-39 | Courier delivery is quoted to the buyer's preferred drop-off location on their selected campus and shown before payment. A precise meetup point/direction adjustment within that destination may proceed if it does not materially change the route. A material route change requires Ops review and buyer confirmation of any fee difference before dispatch or cost; otherwise retain the original destination or use cancellation/support. Never charge an unconfirmed extra fee. |
| AC-40 | Scope courier contact details to the active delivery order. Notify both parties on courier assignment, logged pickup/In transit, and delivery confirmation. A failed 10-minute drop-off attempt is recorded and follows the 24-hour resolution window with one replacement; if abandoned, the courier returns the item to the seller. Live map tracking is not required for MVP. |
| AC-41 | Courier handoff does not complete at seller collection. The order remains In transit until the buyer enters the one-time order code and Soldbay validates it; courier-reported delivery alone cannot mark Received or start the dispute/release timers. |
| AC-42 | Seller proof is choose-one: preferred eduportal student homepage or the school ID card for the academic year of application. Do not require or imply both proofs. If Admin requests clarification, show the reason, allow editing/resubmission, and return the application to Under review; keep publishing blocked until approved and 2FA is active. |
| AC-43 | When an item-quality dispute requires return, the seller bears return-courier cost. Soldbay arranges and initially pays the courier, then records and recovers the actual cost from held proceeds or seller balance where the payout workflow permits. |
| AC-44 | Deactivation preserves transaction/activity records according to a purpose-based schedule, not one blanket period. Keep the verified identity and matric number bound to the same account and prevent replacement signup only to the extent supported by the approved lawful retention basis; restore retained history on reactivation. |
| AC-45 | After a recorded handoff/delivery, if the buyer has not submitted a valid one-time code, remind them every 3 hours during the following 24 hours and stop reminders once valid submission occurs. If no valid code is submitted by hour 24, notify Support; Support reviews evidence and targets a decision within 12 hours after notification and necessary evidence are available. Never infer Received or release funds from elapsed time or courier report. |
| AC-46 | The buyer's feed is scoped to the selected campus, supports category browsing, and orders Recently Added by listing time. Listing visibility follows the lifecycle in AC-23, including temporarily unavailable and one-hour Sold states. Loading, empty, refresh and pagination states are supported. |
| AC-47 | Keyword search can be combined with category, price, verified-seller, condition and availability filters; price and recency sorts apply the selected order. Popularity sorting is not offered in MVP; revisit only after sufficient real usage data exists. |
| AC-48 | A buyer can add/remove a listing from their wishlist and access saved listings from Profile. A saved listing reflects its current availability and does not bypass campus scope or listing purchase/negotiation locks. |
| AC-49 | Product Detail shows all published listing information and photos, seller verification status, and report action; blocks self-purchase; and exposes pre-purchase chat only when the listing is marked Negotiable. |
| AC-50 | Only the buyer associated with a final Completed or Refunded order can submit one seller review for that order: a 1–5 star rating and optional text. Published reviews contribute to the seller's displayed rating/review list. Sellers cannot rate buyers. A reviewer cannot edit after submission; Admin may remove a review for a recorded policy reason. |
| AC-51 | Negotiation and order chats remain scoped to their relevant listing/order. New messages can trigger push notifications; read-receipt details appear only when requested, not as persistent checkmarks. The MVP has no global inbox, typing indicator or chat photo attachment. Blocking stops new pre-purchase contact but does not disable active-order coordination; users can report concerns to Support. Off-platform contact/payment attempts can be flagged for review. |
| AC-52 | The in-app notification center can present the MVP event classes: message, order update, pickup reminder, handoff code, listing sold, dispute update and seller-verification status. In-app banners/toasts supplement the center. Email notifications and user-configurable push settings are not MVP requirements. |
| AC-53 | Seller tools show active, sold and unlisted listings, the seller's order/sales queue and earnings summary; every listing action obeys the active-process lock, seller-approval/2FA gate and resale-eligibility rules. |
| AC-54 | A report submitted from a listing, user or relevant safety surface creates a report for Admin moderation. Admin can remove content or ban/suspend/reinstate an account with a recorded reason and user notice. Restrictions block new marketplace activity but do not silently cancel existing orders, decide disputes, or release/forfeit funds; Support resolves affected active orders under the normal rules. No appeal workflow is in MVP. |
| AC-55 | Admin/Support/Ops actions are separated by assigned responsibility: Admin reviews sellers and moderation, Support owns assigned dispute/recovery/petition decisions, and Ops coordinates manual courier assignment and order events. Each material decision records actor, time, reason and outcome. |
| AC-56 | Signup requires a university and campus from the supported registry. Seller matric format validation follows the selected university's configured rules; no single global format may reject valid formats for supported universities. Soldbay Admin maintains the supported entries and records changes; only configured launch campuses are offered. |
| AC-57 | Help/FAQ is reachable from Profile and can initiate the defined Support request types, including campus change and account-detail changes. Requests remain linked to the requesting account and expose status and Soldbay communications to that user. |
| AC-58 | A signed-in user changes a password only after confirming the current password and, if enabled, 2FA. This does not reactivate a deactivated account or reset 2FA; users who cannot authenticate use the separate email-OTP recovery flow. |
| AC-59 | A seller may set an optional sale price below the normal price while the listing is unlocked. Buyers see both normal and effective price; checkout uses the effective price except when an active buyer-specific accepted offer sets the amount. Price edits are blocked during negotiation/order locks; no coupons or timed promotions are offered. |
| AC-60 | The user can reach an About/version view that identifies the current app release and links to support information. Exact visual presentation is part of later Pencil design. |
| AC-61 | MVP user-facing text is in English and the app follows the device appearance preference. No in-app language or light/dark mode selector is presented. |

### Traceability

The following first-pass crosswalk maps the current canonical workflow sections to requirement IDs and the acceptance cases intended to verify them. Section 3 (“Scope and open details”) remains source scope/context rather than a separate runtime workflow.

| Canonical workflow section | Requirement IDs | Acceptance cases |
|---|---|---|
| 1. Buyer account signup | FR-01, NFR-02, EXT-01 | AC-01 |
| 2. Becoming a seller | FR-02–03, FR-16, NFR-02 | AC-02, AC-12, AC-27, AC-35–36, AC-42 |
| 4. Negotiation and accepted-price lock | FR-04–05 | AC-03–04, AC-13, AC-23 |
| 5. Checkout, payment, and fulfilment | FR-06–09, NFR-03, EXT-02–03 | AC-05–07, AC-14, AC-16, AC-20, AC-24, AC-28, AC-37–41 |
| 6. Missed or failed handoff and refunds | FR-10–12, NFR-03, EXT-02–03 | AC-08–09, AC-14–20, AC-26, AC-28–30, AC-38–41, AC-43, AC-45 |
| 7. Listing availability and deletion controls | FR-05 | AC-04, AC-13, AC-23 |
| 8. Seller listing setup and fulfilment details | FR-04, FR-07–08, BR-01, EXT-03 | AC-16, AC-20, AC-24, AC-37–42 |
| 9. Campus-change petition | FR-14, BR-01 | AC-10, AC-21 |
| 10. Account deactivation and retained identity | FR-15, NFR-02, EXT-01 | AC-11, AC-22, AC-44 |
| 11. Password recovery and reactivation | FR-15 | AC-11, AC-22, AC-34 |
| 12. Two-factor authentication | FR-16, NFR-02 | AC-12, AC-27, AC-35, AC-42 |

Feature/Workflow Inventory crosswalk:

| Feature inventory section | Requirement IDs | Acceptance criteria |
|---|---|---|
| 1. Onboarding & Auth | FR-01–03, FR-15–16 | AC-01–02, AC-11–12, AC-22, AC-27, AC-34–36, AC-42, AC-44 |
| 2. Feed / Browse | FR-17 | AC-23, AC-46 |
| 3. Search & Filters | FR-18 | AC-47 |
| 4. Product Listing | FR-04–05, FR-24, FR-30 | AC-02, AC-04, AC-20, AC-23, AC-37, AC-53, AC-59 |
| 5. Product Detail | FR-20 | AC-49 |
| 6. Checkout | FR-06, NFR-03, EXT-02 | AC-05, AC-14, AC-26 |
| 7. Pickup Coordination | FR-07–08, FR-13, FR-26, EXT-03 | AC-06, AC-16, AC-20, AC-24, AC-30, AC-38–40 |
| 8. Order Status & Handoff | FR-06, FR-08–13 | AC-06–07, AC-14–20, AC-24, AC-26, AC-28–30, AC-38–45 |
| 9. Messaging / Chat | FR-22–23 | AC-03, AC-13, AC-25, AC-45, AC-51–52 |
| 10. Trust & Verification | FR-02–03, FR-20–21, FR-25–26 | AC-02, AC-12, AC-27, AC-31, AC-42, AC-49–50, AC-54–55 |
| 11. Seller Tools / Dashboard | FR-03–05, FR-24 | AC-02, AC-04, AC-23, AC-27, AC-37, AC-53 |
| 12. Wallet / Payments (Seller) | FR-06, FR-11, FR-24, NFR-03, EXT-02 | AC-05–06, AC-14, AC-30, AC-32, AC-43 |
| 13. Profile / Settings | FR-15–16, FR-19, FR-27–29, FR-31–32 | AC-11–12, AC-22, AC-33–36, AC-44, AC-48, AC-56–58, AC-60–61 |
| 14. Disputes | FR-10–13, NFR-03 | AC-08–09, AC-15, AC-18–19, AC-26, AC-29–30, AC-43, AC-45 |
| 15. Notifications | FR-23 | AC-06, AC-20, AC-45, AC-52 |
| 16. Admin / Ops | FR-02, FR-10–14, FR-26–28, BR-01, EXT-03 | AC-02, AC-08–10, AC-12, AC-21, AC-27, AC-42–43, AC-54–57 |
| 17. Cross-Cutting / Platform-Wide | FR-29, FR-32, NFR-01–05 | AC-01, AC-05, AC-07, AC-12, AC-17, AC-34–35, AC-45–48, AC-58, AC-61 |

These are intended outcome hypotheses, not validated market findings; no numerical success thresholds are approved.

| Product objective | Requirement chain |
|---|---|
| Help buyers find relevant products and campus sellers | FR-17–20, AC-46–49 |
| Build trust between campus buyers and sellers | FR-01–05, FR-09–13, FR-20–22, FR-25, NFR-01–03, AC-01–05, AC-07–09, AC-13, AC-17–19, AC-23, AC-25, AC-28, AC-31, AC-37, AC-41, AC-49–51, AC-54 |
| Protect buyer payment and resolve failed transactions fairly | FR-06–12, NFR-03, EXT-02–03, AC-04–09, AC-14–20, AC-26, AC-28–30, AC-38–41, AC-43 |
| Verify and support student sellers | FR-02–03, FR-16, FR-24, NFR-02, AC-02, AC-12, AC-27, AC-32–37, AC-42, AC-53 |
| Keep campus-specific discovery and operations coherent | FR-01, FR-07, FR-14, FR-17, FR-26–27, BR-01, EXT-03, AC-01, AC-05, AC-10, AC-21, AC-23–24, AC-36, AC-38–40, AC-46, AC-55–56 |
| Respect account continuity and privacy obligations | FR-15, NFR-02, EXT-01, AC-11–12, AC-22, AC-33–36, AC-44 |
| Support safe operations and responsive service | FR-22–23, FR-25–28, NFR-04–05, AC-51–57 |

This is an initial traceability baseline. A first crosswalk maps the core transactional workflows to requirements and acceptance criteria. Section 3 ("Scope and open details") remains source scope/context rather than a separate runtime workflow. The feature-level crosswalk and acceptance coverage for the broader MVP inventory are being completed in this PSS pass.

## 8. Decision record and external gates

### Foundation decision D-FOUND-01 — Student interviews

- **Context:** The Linear Market Validation Plan proposed student interviews before expanding the build.
- **Decision:** The planned interviews were scrapped and tagged as unimportant by the product owner. They were not conducted.
- **Rationale:** Deprioritized as unimportant; no additional rationale was provided.
- **Consequences:** Close the interview task as scrapped, not completed. No interview evidence was collected, so the underlying market assumptions remain hypotheses rather than validated findings.
- **Status/date:** Owner-approved, 2026-10-31. Recorded in the AllOnSoldBay Market Validation Plan and Project Overview on 2026-11-02.

### Security decision D-SEC-01 — Two-factor account recovery

- **Context:** Users may lose both their authenticator access and unused recovery codes; seller accounts can publish listings and access proceeds.
- **Decision:** Support verifies control of the registered email with a fresh OTP, compares the request with existing verified account records, and logs the recovery decision. Seller resets require approval from a second authorized reviewer. Sellers remain blocked from publishing and accessing proceeds until 2FA is re-enrolled.
- **Rationale:** The checks add review effort while reducing account-takeover risk for seller access and funds.
- **Consequences:** Password reset alone cannot reset 2FA. Recovery must not rely on newly emailed identity or bank documents.
- **Status/date:** Owner-approved, 2026-11-02; recorded in the AllOnSoldBay Workflow Review, Screen Flow, and Feature/Workflow Inventory.

### Product decision D-FEED-01 — Recently Added ranking

- **Context:** The proposed Most Searched feed section depends on search-count data that will not be meaningful at launch.
- **Decision:** Use Recently Added in the MVP feed, ordered by listing creation time. Defer trending and usage-based campus segmentation until real usage data supports them.
- **Rationale:** Listing time provides an immediate, explainable ranking without inventing popularity signals or adding search-tracking work to the launch path.
- **Consequences:** Do not implement search-count ranking for this MVP section.
- **Status/date:** Owner-approved, 2026-11-02; recorded in the AllOnSoldBay Screen Flow and Feature/Workflow Inventory.

### Privacy decision D-PRIV-01 — Purpose-based retention

- **Context:** Account, verification, transaction, chat, and audit data serve different purposes; one blanket retention period would not fit all categories.
- **Decision:** Set retention periods by data category and lawful purpose after privacy/legal review; disclose applicable periods to users. Do not promise one blanket five-year or indefinite retention period. Preserve the approved deactivation/reactivation behavior and identity non-reuse policy, while defining the minimum anti-duplication record and its lawful retention basis in the schedule.
- **Rationale:** Retention should match the documented purpose and applicable obligations for each data class.
- **Consequences:** Reactivation restores activity/history still retained under the approved schedule. Retention periods and erasure exceptions remain for qualified privacy/legal review.
- **Status/date:** Owner-approved, 2026-11-02; recorded in AllOnSoldBay Workflow Review, Screen Flow, Feature/Workflow Inventory, and MVP Scope & Decisions.

### Product decision D-PROD-AGE-01 — 18+ confirmation at signup

- **Context:** University enrollment does not establish that every account holder is an adult. NDPA section 31 requires appropriate mechanisms to verify age and consent in child-data contexts; it does not specifically prescribe an 18+ checkbox.
- **Decision:** Require one checkbox at initial signup with the label “I confirm that I am 18 or older.” If unchecked, do not create an account. This is the only age step in the MVP; no under-18 or guardian-consent signup route is included.
- **Rationale:** Owner direction on 2026-11-02, updating the earlier no-age-cutoff decision.
- **Consequences:** Buyer signup records the declared university and required campus and verifies email before app access. It does not collect date of birth, government ID, matriculation number or student proof for age/student verification. Student proof remains collected only when a buyer applies to become a seller. The checkbox is the product's sole age control; this product choice is not a claim of legal clearance.
- **Status/date:** Owner-approved product direction, 2026-11-02; verification sufficiency is an external legal gate. Recorded in AllOnSoldBay Workflow Review and Privacy & Legal Review.

### Decisions closed under owner delegation (2026-11-03)

The owner asked the agent to make the remaining product decisions to avoid spending more time on routine choices. The following decisions are therefore recorded as the product direction for the rework; they may be changed by the owner later.

| ID | Decision | Rationale / consequence |
|---|---|---|
| D-SEARCH-02 | Defer popularity sorting from MVP until real campus usage supports a useful ranking. Keep price and recency sorts; keep the home feed's Recently Added order by listing time. | Avoids inventing a popularity signal or collecting low-value launch search/view history. Update the Feature Inventory from MVP to Later for popularity sort. |
| D-REVIEW-01 | One review per qualifying buyer/order after final Completed or Refunded outcome; use a 1–5 rating and optional text; display seller reviews/aggregate; sellers do not rate buyers; reviews cannot be edited after submission; Admin can remove policy-violating content with a reason. | Keeps reviews tied to real transactions and simple to moderate. No public seller response or appeals flow is added to MVP. |
| D-SAFETY-01 | Blocking stops new pre-purchase contact and negotiation. It does not disable essential communication on an active paid order. Users can report a concern to Support. Reports create Admin moderation cases; ban/suspension prevents new marketplace activity but does not cancel active orders, decide disputes, or release/forfeit held funds. No appeal workflow in MVP. | Preserves transaction coordination and existing order protections while stopping future unsolicited contact; Support handles safety issues that intersect active orders. |
| D-REGISTRY-01 | Soldbay Admin owns the supported university/campus registry and per-university matric-format rules. Only configured launch campuses are selectable; Admin records registry changes. | Provides one accountable internal owner and avoids assuming a school-system integration. Actual launch coverage is configured during launch planning. |
| D-PRICE-01 | A seller may set one optional sale price below the normal listing price. Show both normal and effective sale price; checkout uses the sale price unless a live buyer-specific accepted offer sets the amount. Price changes are blocked while the listing is locked. No timed promotions or coupons in MVP. | Provides the scoped discount/sale feature without adding a promotion engine; negotiated price lock remains the controlling buyer-specific price. |
| D-SEC-02 | A signed-in user confirms the current password and, if enabled, current 2FA to change password. This does not reset 2FA or reactivate a deactivated account; forgotten-password recovery remains email OTP. | Separates routine credential change from account recovery and 2FA recovery. Password-strength/session details remain technical security design. |

### External legal, provider and operating gates

- **Privacy/legal:** qualified Nigerian privacy counsel or licensed DPCO reviews lawful bases, retention periods and erasure exceptions, minimum anti-duplication data, checkbox/notice wording, DPIA screening, and applicable regulator classification. The product decision remains checkbox-only for age absent a specific legal incompatibility.
- **Payment:** Flutterwave must confirm in writing that the marketplace held-funds, seller-payout, and original-method refund flow is permitted before integration. Do not describe this as approved escrow until both provider and legal advice support that characterization.
- **Courier:** confirm campus coverage, fee/cost settlement, operational evidence, and escalation before activating manual courier fulfilment. This is a business/operations dependency, not a reason to redesign the already-approved buyer/seller flow.

**Workflow status:** approved as product intent after the cross-role consistency pass. **PSS status:** product definition complete and ready for a separate Pencil brand/design-system phase. This contract contains 32 functional requirements, 5 quality requirements, 1 business rule, 3 external requirements, 61 acceptance criteria, UML-informed system/domain/state flows, product-level integration boundaries, and a crosswalk to all 17 Feature/Workflow Inventory sections. The product-level data inventory is in the linked Privacy & Legal Review. Legal review, Flutterwave written approval, courier operating readiness, supported-device/network targets, numeric technical quality targets, test fixtures, and operational staffing remain separate legal/provider/launch or later technical-design gates; they do not reopen the approved workflow or block the Pencil design phase. No implementation is authorized by this approval.

## 9. Contradiction and maintenance

The canonical Linear workflow controls timing, roles, and product behavior. Earlier implementation/docs or design notes may contain superseded details; they are historical only. Account recovery, seller verification, campus changes and account lifecycle should remain aligned with the current canonical workflow and feature inventory.

On an approved product change, update the Linear decision source and this document. Implementation-specific API, schema, provider, and deployment design begins only after the later architecture phase and must not be copied from the appendices by default. Historical logs/prototypes are not workflow sources; this file is the product/system contract for the full rework.
