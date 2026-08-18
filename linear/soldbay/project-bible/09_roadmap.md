# 09. Product Roadmap

## Version 1: Landing Page & Pre-Launch (Current Phase)
The initial validation page designed to measure student interest across universities.
* **Milestones**:
  * [x] Design visual concept and logo mark (Tag Concept).
  * [x] Establish the visual theme system (Purple gradients and sparse Red CTAs).
  * [x] Deploy the web landing page with responsive layouts.
  * [x] Implement waitlist forms for both Buyers and Sellers.
  * [x] Add campus-specific surveys (level, category interests, selling frequency).
  * [x] Expose a live, anonymous waitlist signup counter for social validation.
  * [x] Create site queries mailbox submissions database.

---

## Version 2: Onboarding & Verified MVP
Establishing core buyer and seller workflows with identity verification.
* **Milestones**:
  * [ ] Connect React Native application screens to the backend database endpoints.
  * [ ] Build student profile management and campus registration screens.
  * [ ] Launch the Seller Verification workflow:
    * ID uploads to Vercel Blob.
    * Matriculation number validations.
    * Admin authorization interface.
  * [ ] Build category-based catalog listing browsers with elastic query search.
  * [ ] Implement listing creation (with photo uploads) and deletion forms.
  * [ ] Add simple, non-automated escrow mock flows:
    * Items marked as "PENDING COLLECTION" upon request.
    * Manual confirm delivery actions.

---

## Version 3: Transaction Automation & Payments
Introducing live cash collections, escrow controls, and wallet balance clearings.
* **Milestones**:
  * [ ] Integrate the Paystack payment gateway for debit cards, USSD, and bank transfers.
  * [ ] Implement secure automated escrow holds:
    * Intercept transactions and hold funds in platform accounts.
    * Configure 48-hour delivery countdowns.
  * [ ] Develop seller wallet withdraw mechanisms connecting to Nigerian banks (via Paystack Payouts API).
  * [ ] Deploy physical campus pickup hubs managed by verified student agents.
  * [ ] Build rating and feedback loops for buyers and sellers post-delivery.

---

## Future Roadmap Ideas
* **In-Hostel Delivery Logistics**: Activate a network of student gig-delivery drivers to transport purchases directly to buyer hostels for a minor fee.
* **Bulk Textbook Exchanges**: Allow senior students to donate or sell bundles of course textbooks directly to incoming freshmen.
* **Bidding & Auctions**: Introduce countdown bidding options for popular items like smartphones or study desks.
* **Instant Group Purchases**: Support group-buy configurations allowing students to group together and purchase wholesale food items at bulk discounts.
