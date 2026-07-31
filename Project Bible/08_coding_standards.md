# 08. Coding Standards

## File Naming & Project Architecture

* **Components & Page Files**:
  * React and React Native components must use kebab-case or camelCase matching existing directory layouts. (e.g. `create-listing.tsx`, `listing-detail.tsx`, `join-form.tsx`).
  * Shared React Native layout entry points use kebab-case or underscore prefixing (e.g., `_layout.tsx`, `dev-glass-test.tsx`).
* **Utility Modules**:
  * Non-component modules must be written in kebab-case. (e.g. `api-error.ts`, `mobile-auth.ts`, `sign-mobile-token.ts`).
* **Prisma Models**:
  * Database schema model names must use PascalCase (e.g. `WaitlistSignup`, `SellerProfile`, `Listing`).
  * Field names must use camelCase (e.g., `sellsWhat`, `walletBalance`, `idImageUrl`).

---

## TypeScript Rules

* **Strict Mode**: Maintain absolute strictness (`"strict": true` in `tsconfig.json`). Never bypass strict type checking.
* **No `any`**: Explicitly type all variables, function arguments, and return types. Ban the usage of `any`. Use `unknown` with runtime type guard narrowing if necessary.
* **Prisma Enums**: Import generated Prisma Client types and Enums directly from `@/generated/prisma` or `@/generated/prisma/enums` rather than duplicating local string constants.
* **Component Prop Interfaces**: Always define interfaces or type assertions for component inputs (e.g., `interface InputProps { ... }`).

---

## React & React Native Rules

* **Component Structure**:
  * Prefer functional components (`export function MyComponent()`) over arrow functions assigned to variables (`const MyComponent = ...`).
  * Maintain clean separation of hooks: State hooks first, side effect hooks second, custom hook selectors third.
* **Tailwind & Styling Hooks**:
  * Use the class utility helpers `cn(...)` (defined in `src/lib/utils.ts`) when merging conditional CSS strings to prevent tailwind style collisons.
  * In React Native, favor NativeWind v4 directives and reuse native utility styles to maintain styling parity.
* **Performance Enhancements**:
  * Wrap intensive computational operations in `useMemo`.
  * Wrap callback methods passed down to memoized children in `useCallback`.
  * Optimize list components in React Native by using standard virtualized listings like `<FlatList />` with optimized configurations (e.g. `initialNumToRender`).

---

## Code Comments & Documentation

* **Docstrings**: Include descriptive JSDoc block comments on all shared utility classes, custom hooks, and complex API endpoints.
* **Inline Comments**:
  * Write clear, actionable code comments explaining *why* an operation is performed rather than *what* the code does.
  * Tag temporary workarounds or technical debts with standardized markers: `// TODO:` or `// FIXME:`.
* **Database Annotations**: Document Prisma model fields that require manual review or admin validation (e.g. `idImageUrl`).

---

## Git Commit Guidelines

Write clear, structured commits adhering to the Conventional Commits specification:
```
<type>(<scope>): <short description>
```

* **Types**:
  * `feat`: Adding a brand new feature or API endpoint.
  * `fix`: Bug resolution.
  * `docs`: Documentation edits (such as updating files inside the `Project Bible`).
  * `style`: Code style modifications (formatting, white-space changes, CSS additions).
  * `refactor`: Refactoring production code without altering behaviors.
  * `test`: Adding or editing unit tests.
  * `chore`: Package dependency updates, config setups, build scripts.
* **Example Commit**:
  `feat(api): add seller verification status and id card upload endpoint`
