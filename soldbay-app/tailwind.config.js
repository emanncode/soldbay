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
        background: "#fcfbf9",
        foreground: "#111827",
        primary: {
          DEFAULT: "#3b7e68",
          hover: "#2e7d60",
          active: "#235c47",
          light: "#eaf4f0",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f5f5f7",
          hover: "#ebebee",
          foreground: "#111827",
        },
        accent: { DEFAULT: "#df4a32", foreground: "#ffffff" },
        coral: {
          DEFAULT: "#df4a32",
          light: "#fdf2f0",
          foreground: "#ffffff",
        },
        muted: { DEFAULT: "#f5f5f7", foreground: "#6b7280" },
        card: { DEFAULT: "#ffffff", foreground: "#111827" },
        popover: { DEFAULT: "#ffffff", foreground: "#111827" },
        border: "#eeebe5",
        input: "#eeebe5",
        ring: "#3b7e68",
        success: { DEFAULT: "#10b981", foreground: "#ffffff" },
        warning: { DEFAULT: "#f59e0b", foreground: "#ffffff" },
        info: { DEFAULT: "#2563eb", foreground: "#ffffff" },
        destructive: { DEFAULT: "#dc2626", foreground: "#ffffff" },
        text: {
          primary: "#111827",
          secondary: "#6b7280",
          tertiary: "#9ca3af",
        },
        surface: {
          DEFAULT: "#ffffff",
          subtle: "#f9f8f5",
          hover: "#f3f0ea",
          elevated: "#ffffff",
        },
        brand: {
          green: "#3b7e68",
          greenDark: "#235c47",
          greenLight: "#eaf4f0",
          coral: "#df4a32",
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
