---
name: soldbay-ai-instructions
description: Linear Document - Ai Instructions
---

# Ai Instructions

# 10. AI Instructions

This document is written specifically for AI coding assistants working in the Soldbay repository. **Read these instructions carefully before proposing or executing code changes.**

---

## Architecture & Code Retention

* **Preserve Project Structure**: Never move, rename, or delete existing files or folders unless explicitly requested. Check `Folder Structure` (Linear doc) to understand where files belong.
* **No Code Deletion**: Avoid deleting existing logic, comments, or debug hooks. Modifying code should be additive or surgical. If refactoring is required, preserve legacy interfaces and compatibility.
* **Preserve Docstrings**: Do not strip JSDoc blocks, helper inline comments, or metadata annotations.

---

## Development Safekeeping

* **Do Not Invent UI Primitives**:
  * On the web, leverage existing shadcn/ui components (`src/components/ui/`) and Tailwind CSS v4 variables in `src/app/globals.css`.
  * On mobile, reuse the NativeWind setup. Do not create parallel, custom input fields, labels, buttons, or card outlines. Extend shadcn/ui and NativeWind variants instead.
* **TypeScript Integrity**:
  * Write strictly typed TypeScript code. Do not use type assertions like `any` or compile bypass statements (`// @ts-ignore`).
  * If a data type is from Prisma, import it directly from `@/generated/prisma` or `@/generated/prisma/enums`. Do not create parallel local representations of database objects.
* **State & Performance**:
  * Avoid global state unless absolutely necessary.
  * Optimize list components on native apps. Propose key extractors and memoization optimization.

---

## Design System & Typography Enforcement

Always read the **Ui Design System** Linear doc and `design/DESIGN.md` before writing styling classes:

* **Typography Rule (Mandatory — Manrope only)**:
  * There is **no header/body font split**. Manrope is the only font, at three weights: 400 Regular / 500 Medium / 600 Semibold.
  * Mobile app fonts: `Manrope-Regular`, `Manrope-Medium`, `Manrope-SemiBold` (loaded from `@expo-google-fonts/manrope`).
  * Body copy is never below 16. Caption 12 is the floor. Prices are deliberately heavier (600) than the title beside them.
* **Colour System (Mandatory)**:
  * **Accent (Teal **`#0D9488`**)**: The only brand hue. Primary CTAs, verified chip, active states, brand mark. Hover: `#0F766E`. Tint: `#CCFBF1`.
  * **No coral, no terracotta, no warm gradients.** These have been removed from the system.
  * Status colours: success `#16A34A` / `#DCFCE7`, error `#DC2626` / `#FEE2E2`, warning `#D97706` / `#FEF3C7`.
  * Surfaces: base `#FAFAFA`, elevated `#FFFFFF`. Text: primary `#171717`, secondary `#525252`, tertiary `#737373`.
* **Spacing**: All gaps, margins, and padding must use multiples of the spacing scale: **4 / 8 / 12 / 16 / 24 / 32**. Half-step (4px) only for micro-alignments. Do not invent non-standard values.
* **Elevation**: Cards use shadow (no border). Modals/sheets use a deeper shadow. **No glassmorphism or blur** — rejected deliberately for performance and hardware compatibility reasons.
* **Buttons**: Four variants only — Primary (`bg-accent`), Secondary (bordered), Ghost (`bg-transparent`), Destructive (`bg-error`). Pressed state is a deeper shade; no hover states on touch.

---

## Database & Migration Rules

* **Do not use** `prisma migrate dev` — the project uses Prisma Postgres (`db.prisma.io`) which does not allow direct connections for migrations.
* After editing `schema.prisma`, run:

  ```bash
  npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script > prisma/migrations/<name>.sql
  # review migration.sql, then:
  npx prisma migrate deploy
  npx prisma generate
  ```

---

## Seller Verification

* Verification uses a **student portal screenshot** (not a physical ID card), stored **PRIVATE** on Vercel Blob under `seller-portals/`.
* Verification states: `PENDING` → `APPROVED` / `REJECTED` (tracked via `SellerProfile.verificationStatus`).
* Rejection always carries a `rejectionReason`, and sellers can resubmit.

---

## Communication Guidelines

* **Ask Before Refactoring**: If a change requires alterations to database schemas or endpoint parameter keys, prompt the user for clarification before applying changes.
* **Keep Edits Contextual**: When creating endpoints or routes, document inputs and responses in the **Api Design** Linear doc, and log updates inside the **Progress Log** before completing the task.
