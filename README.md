# Soldbay

Soldbay is a Nigeria-first university-campus marketplace for students to buy and sell with each other.

## Source of truth

- [Product & System Definition](docs/architecture.md) is the local canonical reference for the approved product workflow, requirements, acceptance criteria, logical system boundaries, and external gates. The PSS is complete; privacy/legal review and provider/launch readiness remain separate work.
- The AllOnSoldBay Linear project holds approved product decisions. More-specific workflow docs supersede older summaries.
- [design/soldbay-design-documentation.pen](design/soldbay-design-documentation.pen) is the canonical Pencil documentation canvas. It records foundations, component architecture/specifications, interaction maps, responsive rules, and decision boards. Stage 04 Steps 01–06 are owner-approved; Step 07 interaction patterns are under review. A — Grounded Market is the selected direction. Separate `soldbay-ios.pen` and `soldbay-android.pen` files will hold real platform screens from Step 08 onward. No final screens are approved yet.
- Repository source and migrations show what is implemented; they do not prove production behavior.
- Historical logs and superseded local design documents are not current product policy.

## Product model

**Confirmed / Intended:** accounts start as buyers; signup requires one 18+ checkbox, university and campus selection, and email verification before app access. If the age box is unchecked, account creation is blocked. The age checkbox is the only age step in the MVP. Becoming a seller requires student verification, store and payout information, Soldbay Admin review, and 2FA before listing or accessing proceeds. Buyers choose campus meetup or courier delivery. Funds remain held through server-validated handoff and the 36-hour dispute window. Refunds return through the original provider and remain pending until provider confirmation; Support reconciles and retries through that provider. See the architecture document for complete happy and failure paths.

This workflow is approved as product intent, not as a claim that it is implemented or production-ready.

## Historical repository snapshot (excluded from the full rework)

- **Mobile:** `soldbay-app` — React Native / Expo client for buyer and seller workflows.
- **Web/API:** `soldbay-web` — Next.js public site, shared API, and limited Admin pages.
- **Backend:** Prisma and PostgreSQL; selected Vercel Blob and Paystack code.

These descriptions record the prior implementation only. Do not use its framework, storage, payment-provider code, routes, or design as constraints for the rework. The mobile README reports mock browse/search data, in-memory chat, placeholder order screens, and mock seller verification. Payment webhook/reconciliation, courier operations, 2FA and several other agreed workflows are not evidenced in the repository. Production provider setup and runtime behavior have not been verified.

See [web setup](soldbay-web/SETUP.md), [web/API README](soldbay-web/README.md), and [mobile README](soldbay-app/README.md) for the prior implementation's local development details. The previous Figma file is historical and is not a design source for the rework; brand and product design are being developed in Pencil.
