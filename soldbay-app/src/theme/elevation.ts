import { Platform, type ViewStyle } from "react-native";

/**
 * SOLDBAY ELEVATION TOKENS
 *
 * Source of truth: docs/soldbay-design-system.md (Section 4) & design/design.pen
 * Aligned with soldbay-web/src/app/globals.css
 *
 * Light mode:
 * Shadows use a low-opacity tint of Primary foreground (#2D3A1F, rgb 45, 58, 31),
 * keeping shadows warm rather than generic cold grey/black.
 *
 * Dark mode:
 * Elevation leans on surface lightness steps + borders rather than shadows alone.
 *
 * NativeWind cannot express RN's platform-split shadow props, so these are
 * plain style objects applied via `style={elevation.card}` or `style={elevation[1]}`.
 */

type Elevation = ViewStyle;

/** Base screens. No depth. */
export const elevation0: Elevation = {};

/** Resting product card. Spec: `0 1px 2px rgba(45, 58, 31, 0.06)`. */
export const elevation1: Elevation =
  Platform.select<Elevation>({
    ios: {
      shadowColor: "#2D3A1F",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
    },
    android: { elevation: 1 },
    web: { boxShadow: "0px 1px 2px rgba(45, 58, 31, 0.06)" },
  }) ?? {};

/** Raised card (hover/pressed), dropdowns. Spec: `0 2px 8px rgba(45, 58, 31, 0.10)`. */
export const elevation2: Elevation =
  Platform.select<Elevation>({
    ios: {
      shadowColor: "#2D3A1F",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    web: { boxShadow: "0px 2px 8px rgba(45, 58, 31, 0.10)" },
  }) ?? {};

/** Modals, bottom sheets. Spec: `0 8px 24px rgba(45, 58, 31, 0.16)`. */
export const elevation3: Elevation =
  Platform.select<Elevation>({
    ios: {
      shadowColor: "#2D3A1F",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 24,
    },
    android: { elevation: 8 },
    web: { boxShadow: "0px 8px 24px rgba(45, 58, 31, 0.16)" },
  }) ?? {};

/** Dark mode elevation surface styles (Section 4) */
export const darkElevation0: Elevation = {
  backgroundColor: "#1A1F14",
};

export const darkElevation1: Elevation = {
  backgroundColor: "#242A1D",
  borderColor: "#3F4635",
  borderWidth: 1,
};

export const darkElevation2: Elevation = {
  backgroundColor: "#2C331F",
  borderColor: "#4A523E",
  borderWidth: 1,
};

export const darkElevation3: Elevation = {
  backgroundColor: "#333B24",
  borderColor: "rgba(199, 181, 138, 0.08)",
  borderWidth: 1,
};

export const elevation = {
  0: elevation0,
  1: elevation1,
  2: elevation2,
  3: elevation3,
  card: elevation1,
  raised: elevation2,
  modal: elevation3,
  sheet: elevation3,
} as const;

export const darkElevation = {
  0: darkElevation0,
  1: darkElevation1,
  2: darkElevation2,
  3: darkElevation3,
  card: darkElevation1,
  raised: darkElevation2,
  modal: darkElevation3,
  sheet: darkElevation3,
} as const;

export type ElevationLevel = keyof typeof elevation;
