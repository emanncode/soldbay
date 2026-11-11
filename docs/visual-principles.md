# Soldbay Visual Principles — Working Draft

**Status:** Candidate principles for owner review. None are approved as a complete set yet. These rules are derived from the approved MVP direction, the current product workflows and screen inventory, existing real-screen studies, and platform accessibility guidance. They are not a theme, token set, component library, or screen design.
**Product authority:** [`architecture.md`](architecture.md), [`screen-architecture.md`](screen-architecture.md), and [`screen-specifications.md`](screen-specifications.md).
**Reference record:** [`design-reference-studies.md`](design-reference-studies.md). Historical foundation values remain archived in [`design-foundations.md`](design-foundations.md) and must not be reused as defaults.
**Artifact boundary:** Rules, reasoning, evidence, and review state live here in Markdown. Pencil is reserved for source-faithful reconstructions of real product screens; do not create Soldbay screens or component specimens while these principles are being reviewed.

## Agreed visual direction

The approved MVP direction is calm and scannable, gives listings a strong image role with consistent comparison facts, and uses a distinctive but controlled editorial voice. It does not select colors, fonts, corner shapes, icons, materials, or component styling.

## Candidate principles

### VP-01 — Let the item attract attention; keep comparison facts in a stable order

- **Rule:** Give the product photo enough space to identify the item. In public browse, search, and saved-listing contexts, present title, public listing price, condition, and negotiability in a stable, easy-to-scan order. Keep those baseline facts identifiable as the buyer enters product detail.
- **Soldbay tasks:** Campus browse, search results, saved listings, and product detail (BY-01–BY-04).
- **Reference evidence:** The Airbnb Explore study shows image-led cards with title, price, and rating grouped consistently. The Pinterest study shows a more varied, denser image rhythm. Things 3 demonstrates restrained type hierarchy. See the dated observations in [`design-reference-studies.md`](design-reference-studies.md#research-log-2026-11-08).
- **Soldbay application:** Borrow image prominence and careful grouping, but preserve text fields that support marketplace comparison. The approved listing fields (price, condition, title, photos, negotiable status) remain visible according to their importance.
- **Limits and checks:** Image quality and aspect ratio can vary, so title and price must remain clear without depending on photo overlays. Do not adopt Pinterest masonry if it makes price and condition harder to compare. This is a craft hypothesis, not a usability result.

### VP-02 — Keep item identity and agreed terms connected as a transaction progresses

- **Rule:** Maintain a clear visual link to the product and the buyer-specific agreed price as the buyer moves from product detail to negotiation, checkout, and order status. Make any change in availability or terms explicit.
- **Soldbay tasks:** Negotiation, accepted-price lock, checkout, payment confirmation, and order coordination (BY-03, BY-05, CO-01, OR-01–OR-04).
- **Reference evidence:** No inspected product-detail or checkout capture currently shows both product identity and the buyer-specific accepted price across transaction steps. The visible Etsy product-detail capture is still a loading skeleton, and its checkout capture only shows address entry. This principle is grounded in Soldbay's approved workflow; visual evidence remains open. See [`design-reference-studies.md`](design-reference-studies.md#commerce-and-transaction-reference-check-2026-11-11).
- **Soldbay application:** Reuse product identity and distinguish the accepted item price, delivery fee, and total in the relevant order context. Do not imply that the listing's ordinary public price is the buyer's locked price when they differ.
- **Limits and checks:** Never suggest that a payment, reservation, or handoff is complete before the authoritative system state confirms it. Do not conceal fee or price changes in secondary text.

### VP-03 — Make the current state, next actor, and next action easy to identify

- **Rule:** On transaction screens, visually separate the current confirmed state from the next permitted action; show the responsible person or system and any relevant deadline together.
- **Soldbay tasks:** Payment result, seller readiness, meetup/courier coordination, PIN handoff, dispute/return, refund, and seller verification.
- **Reference evidence:** No inspected screen provides a sufficiently aligned example of Soldbay's actor-owned order states, deadlines, and system-confirmed transitions. This rule comes from the approved Soldbay workflow. Apple's guidance supports using semantic, accessible cues and not relying on color alone; it does not validate Soldbay's flow. See [Apple HIG — Color](https://developer.apple.com/design/human-interface-guidelines/color) and [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility).
- **Soldbay application:** Use plain status wording and hierarchy; add an icon or color only as supporting cues. Keep pending, confirmed, failed, and unknown/reconciling results visibly distinct. Show the actor and deadline when the user needs to act.
- **Limits and checks:** Do not make a status more certain than its authoritative event. Verify status cues in light and dark appearances, with sufficient contrast, and without relying on hue alone.

### VP-04 — Show the full commitment before asking the buyer to confirm it

- **Rule:** Before the buyer commits to payment, make the agreed item price, courier fee, selected delivery choice, and full payable total clear in the order-review context. During negotiation, distinguish an accepted amount and its expiry from informal proposals.
- **Soldbay tasks:** Buyer-specific price negotiation, checkout, and payment confirmation (BY-05, CO-01, OR-01).
- **Reference evidence:** No inspected checkout capture shows the full amount, delivery choice, and payment action together before commitment. The available Etsy checkout capture is an address-entry step and does not show order costs or payment. This is a Soldbay workflow requirement; its visual treatment still needs a relevant source study. See [`design-reference-studies.md`](design-reference-studies.md#commerce-and-transaction-reference-check-2026-11-11).
- **Soldbay application:** Give the amount the buyer will pay a clear hierarchy without hiding the fee breakdown or the price-lock expiry. Keep agreed and proposed amounts distinguishable.
- **Limits and checks:** This rule does not set pricing policy, payment-provider behavior, or checkout duration. Those remain governed by the PSS.

### VP-05 — Use brand expression to support the task, not compete with it

- **Rule:** Express Soldbay's character through deliberate type, image treatment, spacing, and restrained accents. Keep expressive moments subordinate to item comparison and transaction clarity.
- **Soldbay tasks:** Marketplace discovery and all buyer/seller transaction tasks.
- **Reference evidence:** Substack demonstrates strong editorial hierarchy; Airbnb demonstrates image-led browsing; Calm demonstrates atmospheric photography. The studies also show why these qualities cannot be imported wholesale into a campus marketplace. See [`design-reference-studies.md`](design-reference-studies.md#candidate-contributions-to-soldbay).
- **Soldbay application:** Allow selective editorial emphasis while keeping repeated listing facts, fees, statuses, and next actions consistent and readable.
- **Limits and checks:** A source's mood is not Soldbay's theme. Avoid decorative effects, image treatments, or density that reduce legibility, contrast, or listing comparability.

## Cross-cutting accessibility guardrails

- Use text, hierarchy, and where useful an icon or shape alongside color for status and interactivity; never rely on color alone.
- Check foreground/background contrast in both light and dark appearances. Apple recommends at least 4.5:1 for regular text and 3:1 for large or bold text as WCAG AA guidance; inspect icons, borders, and focus states separately. [Apple HIG — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility).
- Preserve readable labels and system text scaling. Keep action targets comfortable for the iPhone platform; the current device foundation records the project target sizes.
- Treat these as guardrails, not a claim that any screen or palette has passed an accessibility audit.

## Coherence and overlap review

- VP-01 and VP-05 both address visual emphasis. VP-01 sets the marketplace information hierarchy; VP-05 limits brand expression so it does not disrupt that hierarchy. They are complementary, not duplicate rules.
- VP-02 and VP-04 both protect transaction context. VP-02 preserves item/terms continuity across screens; VP-04 makes the financial commitment explicit before payment.
- VP-03 applies across the whole transaction and is kept separate because it governs state, ownership, and deadlines rather than item or price presentation.
- A single source cannot define the full Soldbay theme. References inform craft; the approved workflows determine what information and state must remain clear.

## Evidence gaps and next work

The current Pencil file is reported by Pencil as containing the `SECTION — Real screen reference studies` top-level section only; no old foundation boards or component specimens were present in the active document inventory when checked on 2026-11-11. Existing local captures cover browse/home-style references. Specific detail, checkout, and order-tracking screens were inspected in signed-in Uiland/Pixlpin sessions on 2026-11-11 and recorded in [`design-reference-studies.md`](design-reference-studies.md#commerce-and-transaction-reference-check-2026-11-11); no new Pencil reconstruction has been added yet.

The available Etsy captures provide narrow visual evidence only: a product-detail loading state and a checkout address form. They do not show Soldbay's buyer-specific 90-minute price lock, its agreed item price plus courier fee, or its actor-owned order transitions. VP-02 through VP-04 therefore remain workflow-derived principles with visual evidence gaps. UIguana is excluded from this research per the owner's direction because it is not connecting. Continue searching Pixlpin, available Uiland captures, and other free-first sources for specific relevant screens; assess each source on visual quality and task fit before retaining it. Do not use Jiji or Jumia as visual references.

After the owner reviews and approves or revises the principles, derive the visual theme and foundations. Do not select or restore a palette, typeface, shape language, icon family, motion values, components, or product screens before that review.
