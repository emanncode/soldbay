import Svg, { Path } from "react-native-svg";
import { colors } from "@/theme/colors";

export interface EmptyCrateIllustrationProps {
  size?: number;
  crateColor?: string;
  sparkleColor?: string;
}

/**
 * SOLDBAY CUSTOM EMPTY CRATE ILLUSTRATION & ICON
 *
 * Source: design/design.pen (IDs: pt_filt_crate, pt37ac8) & docs/soldbay-design-system.md (Section 9)
 * Vector geometry:
 * - Crate Shelf Lines: geometric wireframe crate representing catalog shelves
 * - Accent Sparkle & Price Tag: marketplace discovery sparkles and attached price tag
 */
export function EmptyCrateIllustration({
  size = 64,
  crateColor = colors.textPrimary,
  sparkleColor = colors.accent,
}: EmptyCrateIllustrationProps) {
  return (
    <Svg width={size} height={(size * 60) / 64} viewBox="0 0 64 60" fill="none">
      {/* Primary Crate Shelf Lines */}
      <Path
        d="M12 28 L32 16 L52 28 L32 40 Z M12 28 L12 44 L32 56 L52 44 L52 28 M32 40 L32 56 M12 36 L32 48 L52 36"
        stroke={crateColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Accent Sparkle & Price Tag */}
      <Path
        d="M32 4 Q32 10 38 10 Q32 10 32 16 Q32 10 26 10 Q32 10 32 4 Z M16 10 Q16 13 19 13 Q16 13 16 16 Q16 13 13 13 Q16 13 16 10 Z M36 44 L34 50 L40 54 L42 48 Z M35 46 A 1 1 0 1 1 35 45.9"
        stroke={sparkleColor}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
