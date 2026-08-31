/** @type {import('tailwindcss').Config} */

// SOLDBAY DESIGN SYSTEM — token source of truth for the mobile app.
// See design/DESIGN.md. Rules that are easy to violate by accident:
//   - ONE accent (teal). `primary` is an alias of `accent`, not a second hue.
//   - No glassmorphism/blur anywhere. Depth = surface contrast + elevation only.
//   - Cards never get a border. Never border + shadow on the same surface.
//   - Three font weights only: 400 / 500 / 600.
//   - No hover states — touch-first.

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    // 8pt scale. Spec scale is 4/8/12/16/24/32 — `1.5` (12px) exists because
    // 12 was missing from the previous scale.
    spacing: {
      0: "0px",
      px: "1px",
      0.5: "4px",
      1: "8px",
      1.5: "12px",
      2: "16px",
      3: "24px",
      4: "32px",
      5: "40px",
      6: "48px", // button/input height + min touch target
      7: "56px",
      8: "64px",
      10: "80px",
      12: "96px",
      14: "112px",
      16: "128px",
    },
    extend: {
      colors: {
        // --- Accent: the only brand hue -------------------------------------
        accent: {
          DEFAULT: "#0D9488", // buttons, links, active states, brand
          hover: "#0F766E", // pressed state; also "dark teal" text on tint
          tint: "#CCFBF1", // verified chip bg, selected states — a tint, not a hue
          foreground: "#FFFFFF",
        },
        // Alias so existing `bg-primary` picks up the new accent immediately.
        primary: {
          DEFAULT: "#0D9488",
          hover: "#0F766E",
          tint: "#CCFBF1",
          foreground: "#FFFFFF",
        },

        // --- Semantic status -------------------------------------------------
        success: { DEFAULT: "#16A34A", foreground: "#FFFFFF" },
        error: { DEFAULT: "#DC2626", foreground: "#FFFFFF" },
        warning: { DEFAULT: "#D97706", foreground: "#FFFFFF" },
        // `destructive` kept as an alias of error for existing button usages.
        destructive: { DEFAULT: "#DC2626", foreground: "#FFFFFF" },

        // --- Neutrals --------------------------------------------------------
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5", // dividers
          300: "#D4D4D4", // input borders
          400: "#A3A3A3",
          500: "#737373", // inactive tab items, disabled text
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },

        // --- Surfaces --------------------------------------------------------
        surface: {
          DEFAULT: "#FFFFFF",
          base: "#FAFAFA", // base screen background
          elevated: "#FFFFFF", // cards, modals
        },
        background: "#FAFAFA",
        card: { DEFAULT: "#FFFFFF", foreground: "#171717" },

        // --- Text ------------------------------------------------------------
        text: {
          primary: "#171717",
          secondary: "#525252",
          tertiary: "#737373",
          inverse: "#FFFFFF",
        },
        foreground: "#171717",

        // --- Lines -----------------------------------------------------------
        border: "#E5E5E5", // dividers
        input: "#D4D4D4", // input borders
        ring: "#0D9488",
        muted: { DEFAULT: "#F5F5F5", foreground: "#737373" },
      },

      borderRadius: {
        sm: "6px", // inputs, small buttons, chips
        md: "10px", // cards, standard buttons
        lg: "16px", // modals, bottom sheets
        full: "999px", // avatars, pill chips
        // `xl` / `2xl` intentionally absent — prevents per-screen one-offs.
      },

      fontFamily: {
        // Explicit family per weight: RN does not reliably synthesise weights
        // from a single family, so never pair these with `font-bold` etc.
        manrope: ["Manrope-Regular"],
        "manrope-medium": ["Manrope-Medium"],
        "manrope-semibold": ["Manrope-SemiBold"],
        satisfy: ["Satisfy-Regular"],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      // Type scale: Display 32 / H1 24 / H2 20 / Body 16 / Small 14 / Caption 12.
      // Each utility sets family + size + line-height together so screens can't
      // drift into an unlisted size or a fourth weight.
      //
      // Two deliberate details:
      //   - Values carry `px`. Unitless numbers are invalid CSS and NativeWind
      //     needs a unit to parse them into RN numbers.
      //   - No `fontWeight`. Weight is carried entirely by the family name.
      //     Setting both on Android makes the font matcher look for a
      //     family+weight pair that isn't registered and silently fall back to
      //     the system font.
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
          // listing card titles, input labels
          fontFamily: MEDIUM,
          fontSize: "16px",
          lineHeight: "24px",
        },
        ".text-body-semibold": {
          // prices — deliberately heavier than the title beside them
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
