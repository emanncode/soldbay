/**
 * SOLDBAY COLOUR TOKENS (TypeScript mirror of tailwind.config.js)
 *
 * Source of truth: docs/soldbay-design-system.md (Sections 14–18) & design/design.pen
 * Aligned with soldbay-web/src/app/globals.css
 *
 * Built on the Fraunces & Sora brand kit:
 * - Primary: Olive ramp (hue 89°, base #5A743E, pressed #2C381E, disabled #CDDBBD, on-primary text #F1EEE4)
 * - Accent: Tan ramp (hue 43°, base #B8A678, dark #C7B58A, discounted price #96824F)
 * - Secondary: #5C7048 (dark #8BA670)
 * - Canvas Background: #F4F1E8 (dark #1A1F14)
 * - Surface / Card: #E8E2D0 (dark #242A1D)
 * - Border: #D8D7CC (dark #3F4635)
 * - Semantic set: Success #2E7A6E, Info #4D6F89, Warning #875931, Error #9C453A
 *
 * Prefer NativeWind classNames (`bg-primary`, `bg-accent`, `text-text-primary`) in JSX.
 * These constants exist for the APIs that take a colour prop rather than a class:
* Lucide icons (`color`), `ActivityIndicator`, `TextInput` placeholder/selection,
 * `StatusBar`, and RN shadow props.
 *
 * If you change a value here, change tailwind.config.js to match.
 */

export const colors = {
  // --- Primary (Olive — CTA / brand actions, ramp 500) ----------------------
  /** Exact design system token $soldbay-primary (#2D3A1F). */
  soldbayPrimary: "#2D3A1F",
  /** Primary CTA background (#5A743E). */
  primary: "#5A743E",
  /** Pressed/active state (#2C381E, ramp 700). */
  primaryHover: "#2C381E",
  primaryPressed: "#2C381E",
  /** Disabled primary button background (#CDDBBD, ramp 200). */
  primaryDisabled: "#CDDBBD",
  /** Text on primary CTA (#F1EEE4). */
  primaryForeground: "#F1EEE4",
  /** Subtle primary tint (#E6EDDE, ramp 100). */
  primaryTint: "#E6EDDE",

  // --- Secondary (Olive accent — secondary buttons, subheadings, tag pills) --
  /** Secondary brand color (#5C7048). AA contrast on cream background. */
  secondary: "#5C7048",
  secondaryForeground: "#F4F1E8",
  secondaryDark: "#8BA670",

  // --- Accent (Tan — verified badges, highlights, focus rings) ---------------
  /** Accent brand hue (#B8A678, ramp 500). */
  accent: "#B8A678",
  /** Pressed accent state (#645735, ramp 700). */
  accentHover: "#645735",
  accentPressed: "#645735",
  /** Tint of accent (#EDE9DE, ramp 100). */
  accentTint: "#EDE9DE",
  /** Discounted price highlight (#96824F, ramp 400). */
  accent400: "#96824F",
  /** Dark mode accent (#C7B58A). */
  accentDark: "#C7B58A",
  /** Verified badge gold icon & pill tokens (backward-compatible aliases). */
  accentGold: "#B8A678",
  accentGoldTint: "#E8E2D0",

  // --- Semantic status (Light Mode) -----------------------------------------
  /** Success teal (#2E7A6E, shifted to teal ~170° per Section 16). */
  success: "#2E7A6E",
  successTint: "#D9E8E1",
  successForeground: "#FFFFFF",

  /** Info dusty slate blue (#4D6F89, 206°). */
  info: "#4D6F89",
  infoTint: "#DDE4E9",
  infoForeground: "#FFFFFF",

  /** Warning burnt terracotta (#875931, 28°). */
  warning: "#875931",
  warningTint: "#EEE2D8",
  warningForeground: "#FFFFFF",

  /** Error / Destructive muted brick red (#9C453A, 7°). */
  error: "#9C453A",
  errorTint: "#EEDFDD",
  errorPressed: "#7D352B",
  errorForeground: "#FFFFFF",

  /** Destructive aliases for standard component support. */
  destructive: "#9C453A",
  destructiveTint: "#EEDFDD",
  destructivePressed: "#7D352B",
  destructiveForeground: "#FFFFFF",

  // --- Neutrals (Earthy / Olive tinted scale) -------------------------------
  neutral50: "#FAF8F2",
  neutral100: "#F4F1E8",
  neutral200: "#E8E2D0",
  neutral300: "#D8D7CC",
  neutral400: "#B5B3A4",
  neutral500: "#8A8070",
  neutral600: "#5C7048",
  neutral700: "#3D4730",
  neutral800: "#2D3A1F",
  neutral900: "#1A2112",

  // --- Surfaces & Background ------------------------------------------------
  /** Base screen canvas (#F4F1E8). */
  background: "#F4F1E8",
  surfaceBase: "#F4F1E8",
  /** Cards, sheets, modals (#E8E2D0). */
  surface: "#E8E2D0",
  surfaceElevated: "#FCFAF3",
  surfaceHover: "#DDD6C4",

  // --- Typography -----------------------------------------------------------
  /** Text / Primary foreground (#2D3A1F). */
  textPrimary: "#2D3A1F",
  /** Subtitles, metadata (#5C7048). */
  textSecondary: "#5C7048",
  /** Placeholder, muted text (#8A8070). */
  textTertiary: "#8A8070",
  /** On-primary and inverted text (#F1EEE4). */
  textInverse: "#F1EEE4",

  // --- Dividers & Form elements ---------------------------------------------
  /** Subtle dividers (#D8D7CC). */
  border: "#D8D7CC",
  /** Form input background (#E8E2D0) & border (#D8D7CC). */
  input: "#E8E2D0",
  inputBorder: "#D8D7CC",
  /** Focus ring (#B8A678). */
  ring: "#B8A678",
} as const;

export const darkColors = {
  background: "#1A1F14",
  surfaceBase: "#1A1F14",
  surface: "#242A1D",
  surfaceElevated: "#2C331F",
  surfaceModal: "#333B24",
  surfaceHover: "#2C331F",

  foreground: "#F1EEE4",
  textPrimary: "#F1EEE4",
  textSecondary: "#8BA670",
  textTertiary: "#9A9480",
  textInverse: "#1A1F14",

  primary: "#5A743E",
  soldbayPrimary: "#8BA670",
  primaryHover: "#2C381E",
  primaryPressed: "#2C381E",
  primaryForeground: "#F1EEE4",

  secondary: "#8BA670",
  secondaryForeground: "#1A1F14",

  accent: "#C7B58A",
  accentHover: "#645735",
  accentPressed: "#645735",
  accentForeground: "#1A1F14",

  border: "#3F4635",
  borderElevated: "#4A523E",
  input: "#242A1D",
  inputBorder: "#3F4635",
  ring: "#C7B58A",

  // Dark-mode semantic colors (Section 18)
  success: "#7BC4B6",
  successTint: "#1F3A32",
  info: "#86A7C1",
  infoTint: "#1F2D38",
  warning: "#CF9B6E",
  warningTint: "#3A2A1A",
  error: "#CC7266",
  errorTint: "#3A1F1A",
  destructive: "#CC7266",
  destructiveTint: "#3A1F1A",
} as const;

/** Extended Primary ramp (olive, hue 89°) — Section 17 */
export const primaryRamp = {
  50: "#F2F6EE",
  100: "#E6EDDE",
  200: "#CDDBBD",
  300: "#A7C18B",
  400: "#81A659",
  500: "#5A743E",
  700: "#2C381E",
  900: "#1A2112",
} as const;

/** Extended Accent ramp (tan, hue 43°) — Section 17 */
export const accentRamp = {
  50: "#F6F4EE",
  100: "#EDE9DE",
  200: "#DCD3BC",
  300: "#CABD9B",
  400: "#96824F",
  500: "#B8A678",
  700: "#645735",
  900: "#3C3420",
} as const;

export type ColorToken = keyof typeof colors;
