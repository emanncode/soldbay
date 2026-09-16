@AGENTS.md

# Soldbay Mobile Design Reference

Source of truth for screen architecture, design tokens, and components:

- **Design spec**: [docs/soldbay-design-system.md](../docs/soldbay-design-system.md) and [design/design.pen](../design/design.pen) — primary source of truth
- **Token implementation**: [tailwind.config.js](tailwind.config.js) and [src/theme/](src/theme/)

## Core Design Rules

- **Typography**: Sora for UI/body, Fraunces display for marketing. Mobile app uses UI font scale:
  three weights — 400 / 500 / 600. Use the type utilities (`text-display`, `text-h1`, `text-h2`,
  `text-body`, `text-body-medium`, `text-body-semibold`, `text-small`, `text-caption`);
  never set a raw `fontSize`. Body copy is never below 16; caption 12 is the floor.
- **Colour**:
  - **Primary**: Olive CTA `#5A743E` (pressed `#2C381E`, disabled `#CDDBBD`, text `#F1EEE4`).
  - **Secondary**: Olive secondary `#5C7048` (dark `#8BA670`).
  - **Accent**: Tan brand accent `#B8A678` (dark `#C7B58A`, discounted price `#96824F`).
  - **Canvas & Surface**: Base background `#F4F1E8` (dark `#1A1F14`), Surface `#E8E2D0` (dark `#242A1D`).
  - **Text**: Text primary `#2D3A1F` (dark `#F1EEE4`), secondary `#5C7048`, tertiary `#8A8070`.
  - **Semantic Status**: Success `#2E7A6E` (teal), Info `#4D6F89` (slate blue), Warning `#875931` (terracotta), Error/Destructive `#9C453A` (brick red).
- **No glassmorphism or blur on mobile.** Depth = surface contrast + [elevation
  tokens](src/theme/elevation.ts) (warm olive-tinted shadows in light mode, surface lightness step + border in dark mode).
- **Cards never get a border in light mode** — elevation only. Never border + shadow on one surface in light mode.
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
