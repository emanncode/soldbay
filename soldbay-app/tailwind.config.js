/** @type {import('tailwindcss').Config} */

// SOLDBAY DESIGN SYSTEM — token source of truth for the mobile app.
// Built on Fraunces & Sora brand kit from docs/soldbay-design-system.md & design/design.pen
// Aligned with soldbay-web/src/app/globals.css
//
// Rules encoded here:
//   - Primary (CTA/brand action): Olive ramp base #5A743E, pressed #2C381E, disabled #CDDBBD, text #F1EEE4
//   - Accent: Tan ramp base #B8A678, dark #C7B58A, discounted #96824F
//   - Secondary: Olive secondary #5C7048, dark #8BA670
//   - Canvas background: #F4F1E8 (dark #1A1F14), surface #E8E2D0 (dark #242A1D)
//   - Warm olive-tinted elevation shadows: #2D3A1F with low opacity
//   - Cards never get a border in light mode. Depth = surface contrast + elevation.

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    // 4px base / 8pt scale aligned with design system space-1 (4px) to space-16 (128px)
    spacing: {
      0: "0px",
      px: "1px",
      0.5: "4px", // space-1 (4px)
      1: "8px",   // space-2 (8px)
      1.5: "12px",// space-3 (12px)
      2: "16px",  // space-4 (16px)
      2.5: "20px",// space-5 (20px)
      3: "24px",  // space-6 (24px)
      4: "32px",  // space-8 (32px)
      5: "40px",  // space-10 (40px)
      6: "48px",  // space-12 (48px) - button/input height + min touch target
      7: "56px",
      8: "64px",
      10: "80px",
      12: "96px",
      14: "112px",
      16: "128px",
    },
    extend: {
      colors: {
        // --- Primary (Olive ramp 500 — CTA / brand actions) ------------------
        primary: {
          DEFAULT: "#5A743E", // base CTA fill
          hover: "#2C381E",   // ramp 700
          pressed: "#2C381E", // ramp 700 pressed state
          disabled: "#CDDBBD",// ramp 200 disabled state
          foreground: "#F1EEE4", // on-primary text
          tint: "#E6EDDE",    // ramp 100
          50: "#F2F6EE",
          100: "#E6EDDE",
          200: "#CDDBBD",
          300: "#A7C18B",
          400: "#81A659",
          500: "#5A743E",
          700: "#2C381E",
          900: "#1A2112",
        },

        // --- Secondary (Olive secondary — buttons, subheadings, tags) --------
        secondary: {
          DEFAULT: "#5C7048",
          foreground: "#F4F1E8",
          dark: "#8BA670",
        },

        // --- Accent (Tan — verified badge, focus rings, highlights) ---------
        accent: {
          DEFAULT: "#B8A678", // tan brand accent (ramp 500)
          hover: "#645735",   // ramp 700
          pressed: "#645735", // ramp 700
          tint: "#EDE9DE",    // ramp 100
          foreground: "#2D3A1F",
          400: "#96824F",     // discounted price
          50: "#F6F4EE",
          100: "#EDE9DE",
          200: "#DCD3BC",
          300: "#CABD9B",
          500: "#B8A678",
          700: "#645735",
          900: "#3C3420",
        },
        // Backward-compatible alias for existing components using accent-gold
        "accent-gold": {
          DEFAULT: "#B8A678",
          tint: "#E8E2D0",
        },

        // --- Semantic status (Section 16 & 18) -------------------------------
        success: {
          DEFAULT: "#2E7A6E",
          tint: "#D9E8E1",
          foreground: "#FFFFFF",
          dark: "#7BC4B6",
          darkTint: "#1F3A32",
        },
        info: {
          DEFAULT: "#4D6F89",
          tint: "#DDE4E9",
          foreground: "#FFFFFF",
          dark: "#86A7C1",
          darkTint: "#1F2D38",
        },
        warning: {
          DEFAULT: "#875931",
          tint: "#EEE2D8",
          foreground: "#FFFFFF",
          dark: "#CF9B6E",
          darkTint: "#3A2A1A",
        },
        error: {
          DEFAULT: "#9C453A",
          tint: "#EEDFDD",
          pressed: "#7D352B",
          foreground: "#FFFFFF",
          dark: "#CC7266",
          darkTint: "#3A1F1A",
        },
        destructive: {
          DEFAULT: "#9C453A",
          tint: "#EEDFDD",
          pressed: "#7D352B",
          foreground: "#FFFFFF",
          dark: "#CC7266",
        },

        // --- Neutrals (Olive-tinted warm neutrals) --------------------------
        neutral: {
          50: "#FAF8F2",
          100: "#F4F1E8",
          200: "#E8E2D0", // dividers / subtle surfaces
          300: "#D8D7CC", // input borders / lines
          400: "#B5B3A4",
          500: "#8A8070", // inactive tab items, disabled text
          600: "#5C7048",
          700: "#3D4730",
          800: "#2D3A1F",
          900: "#1A2112",
        },

        // --- Surfaces & Canvas ----------------------------------------------
        surface: {
          DEFAULT: "#E8E2D0", // cards, modals, sheets
          base: "#F4F1E8",    // base screen background
          elevated: "#FCFAF3",// resting card surface
          hover: "#DDD6C4",
          dark: "#242A1D",    // dark mode surface
          "dark-elevated": "#2C331F", // dark mode elevation-2
          "dark-modal": "#333B24",    // dark mode elevation-3
        },
        background: "#F4F1E8",
        card: { DEFAULT: "#E8E2D0", elevated: "#FCFAF3", foreground: "#2D3A1F" },

        // --- Text -----------------------------------------------------------
        text: {
          primary: "#2D3A1F",
          secondary: "#5C7048",
          tertiary: "#8A8070",
          inverse: "#F1EEE4",
          "primary-dark": "#F1EEE4",
          "secondary-dark": "#8BA670",
          "tertiary-dark": "#9A9480",
        },
        foreground: "#2D3A1F",

        // --- Lines & Inputs -------------------------------------------------
        border: {
          DEFAULT: "#D8D7CC", // dividers
          dark: "#3F4635",
          "dark-elevated": "#4A523E",
        },
        input: "#E8E2D0",  // input backgrounds
        ring: "#B8A678",   // focus ring in Accent
        muted: { DEFAULT: "#E8E2D0", foreground: "#8A8070" },
      },

      borderRadius: {
        sm: "6px",    // radius-sm: chips, tags, small badges
        md: "10px",   // radius-md: buttons, input fields
        lg: "16px",   // radius-lg: product cards, modals
        xl: "24px",   // radius-xl: bottom sheets, large hero cards
        full: "999px",// radius-full: avatar, pill buttons, toggle switches
      },

      boxShadow: {
        "elevation-0": "none",
        "elevation-1": "0 1px 2px rgba(45, 58, 31, 0.06)",
        "elevation-2": "0 2px 8px rgba(45, 58, 31, 0.10)",
        "elevation-3": "0 8px 24px rgba(45, 58, 31, 0.16)",
      },

      fontFamily: {
        // Explicit family per weight: RN does not reliably synthesise weights
        // from a single family, so never pair these with `font-bold` etc.
        manrope: ["Manrope-Regular"],
        "manrope-medium": ["Manrope-Medium"],
        "manrope-semibold": ["Manrope-SemiBold"],
        sora: ["Manrope-Regular"],
        "sora-medium": ["Manrope-Medium"],
        "sora-semibold": ["Manrope-SemiBold"],
        fraunces: ["Fraunces-SemiBold"],
        satisfy: ["Satisfy-Regular"],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      // Type scale utilities: Display 32 / H1 24 / H2 20 / Body 16 / Small 14 / Caption 12.
      // Each utility sets family + size + line-height together so screens can't
      // drift into an unlisted size or a fourth weight.
      //
      // Deliberate details:
      //   - Values carry `px` for NativeWind number parsing.
      //   - No `fontWeight` property; weight is carried by the font family name.
      const REGULAR = "Manrope-Regular";
      const MEDIUM = "Manrope-Medium";
      const SEMIBOLD = "Manrope-SemiBold";

      addUtilities({
        // Headings — always Semibold 600.
        ".text-display": {
          fontFamily: SEMIBOLD,
          fontSize: "32px",
          lineHeight: "40px",
        },
        ".text-h1": {
          fontFamily: SEMIBOLD,
          fontSize: "24px",
          lineHeight: "32px",
        },
        ".text-h2": {
          fontFamily: SEMIBOLD,
          fontSize: "20px",
          lineHeight: "28px",
        },

        // Body 16 — never below 16 for body copy.
        ".text-body": {
          fontFamily: REGULAR,
          fontSize: "16px",
          lineHeight: "24px",
        },
        ".text-body-medium": {
          fontFamily: MEDIUM,
          fontSize: "16px",
          lineHeight: "24px",
        },
        ".text-body-semibold": {
          fontFamily: SEMIBOLD,
          fontSize: "16px",
          lineHeight: "24px",
        },

        // Small 14
        ".text-small": {
          fontFamily: REGULAR,
          fontSize: "14px",
          lineHeight: "20px",
        },
        ".text-small-medium": {
          fontFamily: MEDIUM,
          fontSize: "14px",
          lineHeight: "20px",
        },

        // Caption 12 — the floor. Nothing smaller.
        ".text-caption": {
          fontFamily: REGULAR,
          fontSize: "12px",
          lineHeight: "16px",
        },
        ".text-caption-medium": {
          fontFamily: MEDIUM,
          fontSize: "12px",
          lineHeight: "16px",
        },
      });
    },
  ],
};
