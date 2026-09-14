import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors } from "../theme/colors";

// Icon-only verified badge. Custom-drawn checkmark-in-shield — NOT a
// Lucide/Phosphor stock icon (design system, Section 10). A filled shield with
// the check punched out via the `evenodd` fill rule; viewBox 16 == node box.
const VERIFIED_SHIELD =
  "M8 1.3l6.3 2.4v4.9c0 3.6-2.6 6.1-6.3 6.7-3.7-0.6-6.3-3.1-6.3-6.7v-4.9z m-3.8 8.5l1.6-1.6 2 2-1.6 1.6z m3.6 2l-1.6-1.6 4.2-4.2 1.6 1.6z";

export interface VerifiedChipProps {
  size?: "sm" | "md";
  className?: string;
}

/**
 * SOLDBAY VERIFIED CHIP
 *
 * Rules from DESIGN.md:
 * - Icon-only: custom-drawn checkmark-in-shield, no text label.
 * - Accent gold icon (#B8A678) on the accent-gold-tint pill, so the badge reads
 *   on any surface. Same treatment everywhere: listing cards, profile, chat.
 */
export function VerifiedChip({ size = "md", className = "" }: VerifiedChipProps) {
  const isSm = size === "sm";
  const iconSize = isSm ? 12 : 14;

  return (
    <View
      className={`flex-row items-center rounded-full bg-accent-gold-tint ${
        isSm ? "px-1 py-0.5" : "px-1.5 py-0.5"
      } ${className}`}
    >
      <Svg width={iconSize} height={iconSize} viewBox="0 0 16 16">
        <Path d={VERIFIED_SHIELD} fill={colors.accentGold} fillRule="evenodd" />
      </Svg>
    </View>
  );
}