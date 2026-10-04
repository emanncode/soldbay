// src/theme/tokens.js
//
// Single source of truth for Soldbay design tokens in code.
// Values come from the LOCKED Design System Reference (Linear) and
// soldbay-design-system.html: Orange & Teal palette, Sora typography.
//
// CommonJS on purpose: tailwind.config.js requires this file, and components
// import the same object for values that can't be class names (Phosphor icon
// `color` props, etc.) so no hex is ever hardcoded in a component.
//
// Names match the Admin/Ops prototype Tailwind configs, so class strings from
// those prototypes port over directly.

const colors = {
  // Text
  primaryText: "#031F21", // light-mode body text
  secondaryText: "#063F42", // light-mode secondary text; also dark-mode step surface

  // Surfaces
  bgBase: "#FFFFFF", // light-mode base surface
  bgCard: "#FFD0A6", // light-mode cards / selected fills
  darkBg: "#031F21", // dark-mode base
  darkBgStep: "#063F42", // dark-mode elevated surface (one step up)

  // Accent: buttons, badges, icons only. Never small text.
  accent: "#F47A32",

  // Borders / icons
  borderLight: "#008080", // light mode only, on white surfaces
  borderDark: "#67B8B3", // dark mode only. Hairlines use it at 24% opacity

  // Discount badge: #FFB980 fill + 1.5px #F47A32 stroke. Also the unread-dot color.
  discountFill: "#FFB980",
  discountStroke: "#F47A32",

  // dark-mode text
  darkText: "#FFFFFF",

  // Semantic: light
  success: "#1A6B3A",
  warning: "#976F00",
  error: "#8B1A10",
  info: "#092853",
  
  // Semantic: dark
  darkSuccess: "#A9EFC2",
  darkWarning: "#E6B905",
  darkError: "#F53D3D",
  darkInfo: "#57A0FA",

  // New Tokens
  accentIcon: "#BE5F27",
  borderLightSolid: "#008080",
  borderDarkSolid: "#5C8A8A",
};

// Named export for ES modules
export { colors };
