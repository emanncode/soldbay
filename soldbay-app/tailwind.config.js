/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    spacing: {
      0: "0px",
      px: "1px",
      0.5: "4px",
      1: "8px",
      2: "16px",
      3: "24px",
      4: "32px",
      5: "40px",
      6: "48px",
      7: "56px",
      8: "64px",
      10: "80px",
      12: "96px",
      14: "112px",
      16: "128px",
    },
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#1d1d1f",
        primary: {
          DEFAULT: "#e1261c",
          hover: "#c91f16",
          active: "#a91912",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f5f5f7",
          hover: "#ebebee",
          foreground: "#1d1d1f",
        },
        accent: { DEFAULT: "#e1261c", foreground: "#ffffff" },
        muted: { DEFAULT: "#f5f5f7", foreground: "#6e6e73" },
        card: { DEFAULT: "#ffffff", foreground: "#1d1d1f" },
        popover: { DEFAULT: "#ffffff", foreground: "#1d1d1f" },
        border: "#d2d2d7",
        input: "#d2d2d7",
        ring: "#e1261c",
        success: { DEFAULT: "#16a34a", foreground: "#ffffff" },
        warning: { DEFAULT: "#f59e0b", foreground: "#ffffff" },
        info: { DEFAULT: "#2563eb", foreground: "#ffffff" },
        destructive: { DEFAULT: "#dc2626", foreground: "#ffffff" },
        text: {
          primary: "#1d1d1f",
          secondary: "#6e6e73",
          tertiary: "#8e8e93",
        },
        surface: {
          DEFAULT: "#f5f5f7",
          hover: "#ececef",
          elevated: "#ffffff",
        },
        brand: {
          start: "#5b3df0",
          end: "#4527c8",
          light: "#8b6cff",
          dark: "#2e1f8d",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "8px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
        full: "9999px",
      },
      fontFamily: {
        display: [
          "BricolageGrotesque-ExtraBold",
          "BricolageGrotesque-Bold",
          "BricolageGrotesque-SemiBold",
          "BricolageGrotesque-Medium",
        ],
        sans: ["Inter-SemiBold", "Inter-Medium", "Inter-Regular"],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-display-xl": {
          fontFamily: "BricolageGrotesque-Bold",
          fontSize: 56,
          lineHeight: 57,
          fontWeight: "700",
        },
        ".text-display-l": {
          fontFamily: "BricolageGrotesque-Bold",
          fontSize: 40,
          lineHeight: 42,
          fontWeight: "700",
        },
        ".text-display-m": {
          fontFamily: "BricolageGrotesque-SemiBold",
          fontSize: 40,
          lineHeight: 44,
          fontWeight: "600",
        },
        ".text-heading-l": {
          fontFamily: "BricolageGrotesque-SemiBold",
          fontSize: 32,
          lineHeight: 38,
          fontWeight: "600",
        },
        ".text-heading-m": {
          fontFamily: "BricolageGrotesque-SemiBold",
          fontSize: 24,
          lineHeight: 31,
          fontWeight: "600",
        },
        ".text-heading-s": {
          fontFamily: "BricolageGrotesque-Medium",
          fontSize: 20,
          lineHeight: 28,
          fontWeight: "500",
        },
        ".text-body-l": {
          fontFamily: "Inter-Regular",
          fontSize: 18,
          lineHeight: 29,
          fontWeight: "400",
        },
        ".text-body-m": {
          fontFamily: "Inter-Regular",
          fontSize: 16,
          lineHeight: 26,
          fontWeight: "400",
        },
        ".text-body-s": {
          fontFamily: "Inter-Regular",
          fontSize: 14,
          lineHeight: 21,
          fontWeight: "400",
        },
        ".text-caption": {
          fontFamily: "Inter-Medium",
          fontSize: 12,
          lineHeight: 17,
          fontWeight: "500",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
