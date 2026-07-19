/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
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
        surface: {
          DEFAULT: "#f5f5f7",
          hover: "#ececef",
          elevated: "#ffffff",
        },
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
        brand: {
          start: "#5b3df0",
          end: "#4527c8",
          light: "#8b6cff",
          dark: "#2e1f8d",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        full: "9999px",
      },
      fontFamily: {
        display: ["BricolageGrotesque-Bold", "BricolageGrotesque-SemiBold"],
        sans: ["Inter-Regular", "Inter-Medium", "Inter-SemiBold"],
      },
    },
  },
  plugins: [],
};
