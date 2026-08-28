import { Platform, type ViewStyle } from "react-native";

/**
 * SOLDBAY ELEVATION TOKENS
 *
 * Depth comes from surface contrast (#FFFFFF card on #FAFAFA base) plus a
 * subtle shadow. There is no glassmorphism/blur in this system — it was
 * rejected deliberately: blur is expensive on older Android GPUs, and the
 * product ships to mixed low-end Android hardware.
 *
 * NativeWind can't express RN's platform-split shadow props, so these are
 * plain style objects applied via `style={elevation1}`.
 *
 * Reminder: cards use elevation ONLY — never pair these with a border.
 */

type Elevation = ViewStyle;

/** Base screens. No depth. */
export const elevation0: Elevation = {};

/** Cards. Spec: `0 1px 3px rgba(0,0,0,0.08)`. */
export const elevation1: Elevation =
  Platform.select<Elevation>({
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
    },
    // Android renders its own shadow from elevation; opacity isn't controllable,
    // so these values are tuned to read as close to the iOS/web spec as it gets.
    android: { elevation: 2 },
    web: { boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)" },
  }) ?? {};

/** Modals, bottom sheets, dropdowns. Spec: `0 4px 12px rgba(0,0,0,0.12)`. */
export const elevation2: Elevation =
  Platform.select<Elevation>({
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
    web: { boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.12)" },
  }) ?? {};

export const elevation = {
  0: elevation0,
  1: elevation1,
  2: elevation2,
  card: elevation1,
  modal: elevation2,
} as const;

export type ElevationLevel = keyof typeof elevation;
