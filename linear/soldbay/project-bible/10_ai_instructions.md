# 10. AI Instructions

This document is written specifically for AI coding assistants working in the Soldbay repository. **Read these instructions carefully before proposing or executing code changes.**

---

## Architecture & Code Retention

* **Preserve Project Structure**: Never move, rename, or delete existing files or folders unless explicitly requested. Always review [04_folder_structure.md](file:///home/emanncode/Documents/code/soldbay/Project%20Bible/04_folder_structure.md) to understand where files belong.
* **No Code Deletion**: Avoid deleting existing logic, comments, or debug hooks. Modifying code should be additive or surgical. If refactoring is required, preserve legacy interfaces and compatibility.
* **Preserve Docstrings**: Do not strip JSDoc blocks, helper inline comments, or metadata annotations.

---

## Development Safekeeping

* **Do Not Invent UI Primitives**: 
  * On the web, leverage existing shadcn/ui components (`src/components/ui/`) and Tailwind CSS v4 variables in `src/app/globals.css`. 
  * On mobile, reuse the NativeWind setup. Do not create parallel, custom input fields, labels, buttons, or card outlines. Extend shadcn/ui variants instead.
* **TypeScript Integrity**: 
  * Write strictly typed TypeScript code. Do not use type assertions like `any` or compile bypass statements (`// @ts-ignore`).
  * If a data type is from Prisma, import it directly from `@/generated/prisma` or `@/generated/prisma/enums`. Do not create parallel local representations of database objects.
* **State & Performance**:
  * Avoid global state unless absolutely necessary.
  * Optimize list components on native apps. Propose key extractors and memoization optimization.

---

## Design System Enforcement

Always read [07_ui_design_system.md](file:///home/emanncode/Documents/code/soldbay/Project%20Bible/07_ui_design_system.md) before writing styling classes:
* **The Purple Gradient** (`#5b3df0` to `#4527c8`) is for atmosphere and layout frames in dark settings. Do not use it for interactive form buttons or content selectors.
* **Primary Red** (`#e1261c`) is reserved strictly for prices, "SOLD" status indicator badges, and primary action triggers.
* **Spacing**: All gaps, margins, and padding must utilize multiples of **8px** (e.g. `gap-8`, `p-4`, `m-6` mapped to tailwind scales). Do not use non-standard grids (`gap-3`, `p-7`).

---

## Communication Guidelines

* **Ask Before Refactoring**: If a change requires alterations to database schemas or endpoint parameter keys, prompt the user for clarification before applying changes.
* **Keep Edits Contextual**: When creating endpoints or routes, document inputs and responses in the [06_api_design.md](file:///home/emanncode/Documents/code/soldbay/Project%20Bible/06_api_design.md) file, and log updates inside the [11_progress_log.md](file:///home/emanncode/Documents/code/soldbay/Project%20Bible/11_progress_log.md) file before completing the task.
