/** @type {import('tailwindcss').Config} */

// SOLDBAY DESIGN SYSTEM: token source of truth for the mobile app.
// Source: LOCKED Design System Reference (Linear) + soldbay-design-system.html.
// Palette: Orange & Teal. Typography: Sora only (no Fraunces on mobile).
//
// This replaces the earlier config, which encoded the SUPERSEDED olive/tan
// palette and Manrope. Do not reintroduce those.
//
// Rules encoded here:
//   - Spacing: the locked 4px scale (4, 8, 12, 16, 24, 32, 48, 64) is a subset
//     of Tailwind's default scale (1=4px, 2=8px, 3=12px, 4=16px, 6=24px,
//     8=32px, 12=48px, 16=64px), so spacing is NOT overridden. Remapping the
//     numeric keys made `w-2` render 16px instead of 8px.
//   - Radius: sm 8 / md 12 / lg 16 / full 999.
//   - Elevation: light = tinted shadow; dark = NO shadow, step up a level
//     (darkBg -> darkBgStep) plus a hairline border-borderDark/24.
//   - Accent (#F47A32) is confined to buttons, badges, icons, large bold type.

import { colors } from "./src/theme/tokens";

export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const presets = [require("nativewind/preset")];
export const darkMode = "class";
export const theme = {
  extend: {
    colors,

    borderRadius: {
      sm: "8px", // inputs, small buttons
      md: "12px", // badges, chips
      lg: "16px", // product cards, modals
      full: "999px", // pills, avatars
    },

    // Locked opacity treatments: 12% inline-context tint, 15% divider on the
    // peach card surface (#031F21 @ 15%), 24% dark-mode hairline (#67B8B3 @ 24%).
    opacity: {
      12: "0.12",
      15: "0.15",
      24: "0.24",
    },

    boxShadow: {
      // Light mode only. Never use in dark mode.
      "elevation-1": "0 2px 8px rgba(3, 31, 33, 0.08)", // resting (locked)
      "elevation-2": "0 8px 24px rgba(3, 31, 33, 0.16)", // modals/floating (derived: "stronger", exact value not locked)
    },

    fontFamily: {
      // Weight lives in the family name: RN doesn't reliably synthesize
      // weights, so never pair these with font-bold / font-semibold.
      // Names assume @expo-google-fonts/sora. They must match whatever
      // useFonts() registers in _layout.tsx.
      sora: ["Sora_400Regular"],
      "sora-semibold": ["Sora_600SemiBold"],
      "sora-bold": ["Sora_700Bold"],
    },
  },
};
export const plugins = [
  function ({ addUtilities }) {
    // Locked type scale (Apple HIG hierarchy, Sora). Each utility sets
    // family + size + line-height together so screens can't drift.
    // Line heights follow the HIG values (the lock specifies size/weight only).
    const REGULAR = "Sora_400Regular";
    const SEMIBOLD = "Sora_600SemiBold";
    const BOLD = "Sora_700Bold";

    addUtilities({
      ".text-large-title": {
        fontFamily: BOLD,
        fontSize: "34px",
        lineHeight: "41px",
      }, // rare full-bleed moments
      ".text-title-1": {
        fontFamily: BOLD,
        fontSize: "28px",
        lineHeight: "34px",
      }, // major section headers
      ".text-title-2": {
        fontFamily: BOLD,
        fontSize: "22px",
        lineHeight: "28px",
      }, // card/modal headers, product title
      ".text-title-3": {
        fontFamily: SEMIBOLD,
        fontSize: "20px",
        lineHeight: "25px",
      }, // screen titles ("Browse")
      ".text-headline": {
        fontFamily: SEMIBOLD,
        fontSize: "17px",
        lineHeight: "22px",
      }, // list-item titles
      ".text-body": {
        fontFamily: REGULAR,
        fontSize: "17px",
        lineHeight: "22px",
      },
      ".text-callout": {
        fontFamily: REGULAR,
        fontSize: "16px",
        lineHeight: "21px",
      },
      ".text-subheadline": {
        fontFamily: REGULAR,
        fontSize: "15px",
        lineHeight: "20px",
      }, // price, timestamps
      ".text-footnote": {
        fontFamily: REGULAR,
        fontSize: "13px",
        lineHeight: "18px",
      },
      ".text-caption-1": {
        fontFamily: REGULAR,
        fontSize: "12px",
        lineHeight: "16px",
      }, // badge text
      ".text-caption-2": {
        fontFamily: SEMIBOLD,
        fontSize: "11px",
        lineHeight: "13px",
      }, // fine print, chat timestamps
    });
  },
];
