/**
 * SOLDBAY COLOUR TOKENS (TypeScript mirror of tailwind.config.js)
 *
 * Prefer NativeWind classNames (`bg-accent`, `text-text-secondary`) in JSX.
 * These constants exist for the APIs that take a colour *prop* rather than a
 * class: Lucide icons (`color`), `ActivityIndicator`, `TextInput`
 * `placeholderTextColor` / `selectionColor`, `StatusBar`, and RN shadow props.
 *
 * If you change a value here, change tailwind.config.js to match.
 */

export const colors = {
  /** The only brand hue. Primary actions, active states, brand mark. */
  accent: "#0D9488",
  /** Pressed state; also the readable text colour on `accentTint`. */
  accentHover: "#0F766E",
  /** A tint of the accent, not a second hue. Verified chip, selected states. */
  accentTint: "#CCFBF1",

  success: "#16A34A",
  successTint: "#DCFCE7",
  error: "#DC2626",
  errorTint: "#FEE2E2",
  /** Pressed state for destructive buttons. */
  errorPressed: "#B91C1C",
  warning: "#D97706",
  warningTint: "#FEF3C7",

  neutral50: "#FAFAFA",
  neutral100: "#F5F5F5",
  neutral200: "#E5E5E5",
  neutral300: "#D4D4D4",
  neutral400: "#A3A3A3",
  neutral500: "#737373",
  neutral600: "#525252",
  neutral700: "#404040",
  neutral800: "#262626",
  neutral900: "#171717",

  /** Base screen background. */
  surfaceBase: "#FAFAFA",
  /** Cards, sheets, modals. */
  surfaceElevated: "#FFFFFF",

  textPrimary: "#171717",
  textSecondary: "#525252",
  textTertiary: "#737373",
  textInverse: "#FFFFFF",

  /** Dividers. */
  border: "#E5E5E5",
  /** Input outlines. */
  inputBorder: "#D4D4D4",
} as const;

export type ColorToken = keyof typeof colors;
