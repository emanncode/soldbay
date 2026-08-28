import { Text, View } from "react-native";
import { CheckCircle } from "lucide-react-native";
import { colors } from "../theme/colors";

export interface VerifiedChipProps {
  size?: "sm" | "md";
  className?: string;
}

/**
 * SOLDBAY VERIFIED CHIP
 *
 * Rules from DESIGN.md:
 * - Always carries a text label ("Verified"). Never color-only or icon-only.
 * - Icon: Lucide CheckCircle.
 * - Colors: accent-tint background (#CCFBF1) with accentHover text (#0F766E).
 */
export function VerifiedChip({ size = "md", className = "" }: VerifiedChipProps) {
  const isSm = size === "sm";

  return (
    <View
      className={`flex-row items-center rounded-full bg-accent-tint ${
        isSm ? "px-1 py-0.5" : "px-1.5 py-0.5"
      } ${className}`}
    >
      <CheckCircle size={isSm ? 12 : 14} color={colors.accentHover} />
      <Text
        className={`ml-0.5 font-manrope-medium ${
          isSm ? "text-caption text-accent-hover" : "text-small text-accent-hover"
        }`}
      >
        Verified
      </Text>
    </View>
  );
}
