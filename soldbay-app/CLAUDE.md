@AGENTS.md

# Soldbay Mobile Design Reference

Source of truth for screen architecture, design tokens, and components:

- **Design spec**: [design/DESIGN.md](../design/DESIGN.md) — read this before styling anything
- **Pen.dev canvas**: `design/starter.pen` (39 screens, 36 components). Encrypted — open it
  through the Pencil MCP tools only, never with `Read` or `grep`
- **Token implementation**: [tailwind.config.js](tailwind.config.js) and
  [src/theme/](src/theme/)

## Core Design Rules

- **Typography**: **Manrope only**, three weights — 400 / 500 / 600. There is no
  header/body font split. Use the type utilities (`text-display`, `text-h1`, `text-h2`,
  `text-body`, `text-body-medium`, `text-body-semibold`, `text-small`, `text-caption`);
  never set a raw `fontSize`. Body copy is never below 16; caption 12 is the floor.
- **Colour**: **one accent** — teal `#0D9488` (pressed `#0F766E`, tint `#CCFBF1`). It
  appears on primary actions, active states, and the brand mark; nowhere else. Base
  background `#FAFAFA`, elevated surfaces `#FFFFFF`, text `#171717`. Status colours are
  `success #16A34A` / `error #DC2626` / `warning #D97706` — there is no fifth.
- **No glassmorphism or blur.** Rejected deliberately (old-Android GPU cost; it also
  contradicts the minimal personality). Depth = surface contrast + [elevation
  tokens](src/theme/elevation.ts) only. Do not reintroduce `expo-blur`,
  `expo-glass-effect`, or `expo-linear-gradient`.
- **Cards never get a border** — elevation only. Never border + shadow on one surface.
- **No hover states.** Touch-first. Pressed state is a deeper shade.
- **Spacing** 4 / 8 / 12 / 16 / 24 / 32. **Radius** `sm 6` / `md 10` / `lg 16` /
  `full 999` (no `xl`). Buttons and inputs 48 high; **48×48 minimum touch target, no
  exceptions**.
- **Icons**: a single **Lucide outline** set (`lucide-react-native`) at 16 / 20 / 24.
  Never mix outline and filled in one screen.
- **Motion**: 150ms micro / 250ms standard, ease-in-out only — **no spring, no bounce**
  (see [src/theme/motion.ts](src/theme/motion.ts)). Honour OS reduce-motion by degrading
  to instant/cross-fade *without* dropping the state feedback.
- **Trust UI is text, not decoration**: the Verified chip and the escrow stepper always
  carry a visible text label — never colour-only or icon-only.
- **Toasts are never teal** — green left border for success, red for error.
- The confirm-receipt pair ("Everything's good" / "Report a problem") has **equal visual
  weight**; neither is Primary. Deliberate, so the UI doesn't bias a fairness decision.
- Destructive confirmations use the **native** OS dialog.
- **Locked copy, no synonyms**: *Verified*, *Pickup*, *Order*, *Report a problem*.

**Out of scope** without a new explicit decision: dark mode / theme toggle, blur, delivery
or third-party drop-off, automated payout splits, referral system. See §8 of the spec.
