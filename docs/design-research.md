# Soldbay UX Research & Visual Analysis — Stage 04, Step 02

**Status:** Desk-research synthesis; owner approved Step 02 exit on 2026-11-05.
**Reviewed:** 2026-11-05
**Product authority:** Product & System Definition and current AllOnSoldBay workflow/IA documents.
**Scope:** Existing project evidence, public competitor positioning, and current official Apple/Android design guidance.

## Purpose and method

Step 02 identifies relevant user/task context, category conventions, platform guidance, constraints and design hypotheses before brand-direction work. This report uses approved workflow documents and publicly accessible primary sources.

No student interviews were conducted or scheduled. The owner explicitly scrapped them as unimportant. This review does not claim user validation. The competitor pages are self-published product/marketing material; their usage, testimonials, safety, escrow operation, and outcomes are not independently verified. The live in-app product pages were not readable through the available research view, so this report does not claim a screen-by-screen usability or visual audit of those apps.

## Evidence boundary and prior records

| Record                                                                                | Current treatment                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product & System Definition and current AllOnSoldBay workflow/IA                      | Approved product behavior, roles, constraints and acceptance expectations. Use as design input.                                                                                                                                                                                                                                  |
| Market Validation Plan & Business Findings                                            | Historical plan; the interview plan is explicitly scrapped and was not conducted. Its market conclusions and competitor references remain hypotheses, not validated findings.                                                                                                                                                    |
| Competitive Context & Differentiation                                                 | Historical and not authoritative for the rework. Its four-digit code, immediate payment release, and meetup-only model conflict with the current PSS, which specifies a unique six-digit handoff code, a 36-hour dispute period and meetup or courier. Do not reuse its product claims or prototype details as current behavior. |
| Design System Reference, previous Figma, old local screens and previous repository UI | Explicitly historical for the full rework; no colors, fonts, icons, components, layout, or screenshots are carried forward.                                                                                                                                                                                                      |
| `design/soldbay-design-documentation.pen`                                             | Empty after the 2026-11-05 reset. It is now the documentation canvas; that historical snapshot does not approve screens or assets.                                                                                                                                                                                               |

## Category and competitor context

The following findings describe what the referenced organizations currently say about their products. They are not independent product audits or evidence that these approaches work.

| Source                                                                                                                                                             | Publicly described focus                                                                                                                                                             | Possible relevance to Soldbay                                                                                                                 | Evidence limit                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Shopydash](https://shopydash.com/)                                                                                                                                | Markets a Nigerian campus marketplace, verified campus vendors, categories spanning books, food, electronics, fashion and services, escrow payments, vendor tools and in-app chat.   | Campus context, product-category discovery, buyer/seller framing, and visible transaction-state communication are relevant comparison topics. | Its public app link returned no readable interface content in this review. Site claims and testimonials are self-published and unverified. No app-screen behavior is inferred.                                        |
| [TrustBill Market](https://www.trustbillmarket.com/) and [Google Play listing](https://play.google.com/store/apps/details?id=com.ibegladness.trustbillmarketplace) | Describes campus-focused listings, categories, seller verification, chat and voice/video calls, public campus spots, and direct buyer-to-seller payments without a held-funds model. | Shows a different transaction model and a broad, campus-oriented set of discovery and communication features.                                 | Website and Play listing are developer-provided. Download counts, safety claims and feature behavior are not independently verified. Screenshots were listed, but not available for visual inspection in this review. |
| [UniSyncT Google Play listing](https://play.google.com/store/apps/details?id=ng.unisynct.app)                                                                      | Describes a student marketplace combined with social and campus-community features.                                                                                                  | Useful as a reminder that adjacent products may broaden beyond item commerce.                                                                 | Listing last updated October 11, 2025; not treated as current feature or adoption evidence. Its public marketplace page was not readable, so no detailed UI findings are recorded.                                    |

### Category-level observations

- Campus-focused discovery, student/seller identity claims, product categories and in-app communication appear in the self-described positioning of multiple products.
- The competitor set describes materially different payment arrangements: some advertise held/escrow payments while TrustBill describes direct payment. The word “escrow” alone does not establish regulatory status, payment-provider approval, or actual settlement behavior.
- Public marketing copy emphasizes safety and campus relevance, but it cannot establish student priorities, trust, demand, retention or the usability of a live app.
- The old AllOnSoldBay competitor comparison overstated uniqueness and described an obsolete handoff model. Soldbay’s current handoff and held-funds model remain approved product intent; market differentiation is not validated.

No competitor feature is being recommended for adoption solely because another product advertises it.

## Platform and accessibility references

| Reference                                                                                                                   | Guidance relevant to later design                                                                                                                                                    | Classification and limit                                                                                           |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| [Apple HIG — Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)                              | Tab bars represent top-level navigation, should keep labels, and should remain stable. The appropriate number and placement depend on the product hierarchy.                         | Current platform convention; it does not decide Soldbay navigation.                                                |
| [Apple HIG — Search fields](https://developer.apple.com/design/human-interface-guidelines/search-fields)                    | Search should clarify what is searchable; filters can narrow results; search placement depends on the relationship between search, navigation and content.                           | Current platform convention; Soldbay’s required campus scope, search fields and filters come from the PSS.         |
| [Apple HIG — Color](https://developer.apple.com/design/human-interface-guidelines/color)                                    | Keep color meaning consistent, check light/dark and increased-contrast contexts, and do not use color alone to communicate important state.                                          | Platform accessibility guidance; no palette or theme has been selected.                                            |
| [Android — Adapt layouts](https://developer.android.com/design/ui/mobile/guides/layout-and-content/adapt-layout)            | Adapt to window width and device context using reflow, reveal or presentation changes; avoid stretching content; compact layouts can use one pane while larger layouts can use more. | Current platform guidance; supported OS/device matrix and breakpoints remain undecided.                            |
| [Android — Compose accessibility API defaults](https://developer.android.com/develop/ui/compose/accessibility/api-defaults) | Android Material guidance sets a 48 dp minimum touch target and recommends using components with appropriate accessibility semantics.                                                | Platform-specific guidance; it is not a finalized shared cross-platform token or the project's conformance target. |

## Information architecture and task findings

The approved buyer/seller IA and Admin/Ops IA provide the journey and role structure. The following are task constraints to carry into later stages, not proposed screen layouts:

1. **Discovery always has a campus boundary.** A required campus is chosen before app entry and determines available products. Search, filters, wishlist and listing availability must preserve this scope.
2. **A listing has a lifecycle, not just a product card.** Draft, published, negotiation-locked, order-locked, temporarily unavailable, briefly sold, archived and eligible-for-relist states have different actions and visibility.
3. **Negotiation and fixed-price purchase begin differently but enter one order path.** Only a negotiable listing exposes pre-purchase chat; accepted price belongs to one buyer and has a 90-minute lock.
4. **Order status is time- and actor-dependent.** Payment pending, seller preparation, meetup booking, courier assignment, transit, handoff, Pending sync, Received, dispute, return, refund pending and final outcome cannot be collapsed into a generic “complete” state.
5. **Courier pickup is an intermediate event.** Only the buyer's server-validated one-time code confirms receipt. A courier report or elapsed time cannot start the dispute period or release funds.
6. **Support, Admin and Ops need different authority and evidence.** Queue/detail/action work should expose the case context each role needs while restricting student proof, payout data, dispute media and delivery details.
7. **Failures are first-class tasks.** No seller Ready by deadline, missed meetup/delivery, offline code entry, disputed item, required return, unresolved provider refund, campus change, account recovery and reactivation all have defined consequences.

These findings are directly traceable to FR-01–32, NFR-01–05, EXT-01–03 and AC-01–61 in the PSS and the corresponding current IA records.

## Design hypotheses for later evaluation

These are assumptions derived from product requirements and platform conventions, not research findings:

- **H1 — Campus context:** people will need an obvious reminder of which campus scopes the current catalogue, without implying that changing it is a casual browsing action.
- **H2 — Availability comprehension:** buyers and sellers will understand listing availability faster when its current status and permitted next action are communicated together.
- **H3 — Transaction progress:** an order timeline may help users understand who acts next and which deadline applies across meetup and courier paths.
- **H4 — Negotiation price:** the buyer-specific accepted amount and 90-minute expiry need to remain distinct from the public listing/sale price.
- **H5 — Staff casework:** staff need the relevant evidence, responsibility and deadline visible together, while sensitive fields remain protected by role and case assignment.

These hypotheses should inform future wireframes and usability evaluation; they must not be described as validated preferences.

## Opportunities and constraints

### Opportunities

- Make campus and listing availability unambiguous throughout discovery.
- Explain exactly what is included in the amount due before payment, including courier cost.
- Show the user's next required action and the relevant timer without promising provider or support outcomes outside the PSS.
- Make offline handoff entry visibly pending until server validation.
- Treat support resolution and manual courier coordination as designed service work, not hidden backstage exceptions.

### Constraints

- Do not add a cart, public buyer contact option for fixed-price listings, buyer wallet, live map tracking, or other cut/deferred scope by visual implication.
- Do not present campus verification, escrow, competitor claims, interview insights, or demand as validated evidence.
- Do not imply a courier's collection equals buyer receipt or that a refund is complete before provider confirmation.
- Do not inherit old visual tokens, fonts, navigation layouts or screen designs.
- Product timings and permissions are fixed by the current PSS unless a real contradiction is escalated to the owner.

## Open questions for later stages

- What device/OS versions, viewport ranges and orientations are supported on iOS and Android?
- What measurable accessibility conformance target and evaluation method are in scope?
- What interaction and layout adaptations make Admin/Ops usable on both desktop and its required full-capability mobile fallback?
- What validation method, if any, will be used later? Student interviews remain scrapped; this report does not decide whether prototype usability testing is included.
- Which actual user-facing terms and privacy wording will be supplied after legal review?

These questions do not block the approved workflow. They belong to their relevant design, validation or external-review stages.

## Step 02 exit review

- [x] Existing research records classified by current validity.
- [x] Student interviews excluded and no demand/user validation claimed.
- [x] Current product IA and failure paths summarized for design.
- [x] Public competitor positioning compared with explicit source limitations.
- [x] Official iOS/Android references annotated by relevance and boundary.
- [x] Assumptions, opportunities, constraints and later questions recorded.
- [x] No visual asset, brand direction, screen, token or component created.
- [x] Owner approved Step 02 exit on 2026-11-05.

**Follow-on:** Step 03 — Brand Strategy & Visual Exploration. The owner approved the strategy and exploration scope on 2026-11-05. The resulting territory proposals and direction-selection gate are recorded in [docs/design-territories.md](design-territories.md). This Step 02 report remains a desk-research record and does not claim user validation.
