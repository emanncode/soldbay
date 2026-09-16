import { Text, View } from "react-native";
import { colors } from "@/theme/colors";

export interface SoldbayAppIconProps {
  size?: number;
  variant?: "ios" | "android" | "monochrome";
  rounded?: boolean;
}

/**
 * SOLDBAY OFFICIAL PROJECT LOGO & APP ICON
 *
 * Source: design/design.pen (EXPORT — iOS Icon / EXPORT — Android Foreground)
 * & docs/soldbay-design-system.md (Section 22)
 *
 * - iOS: Cream background (#F4F1E8), Fraunces SemiBold "S" in Dark Olive (#2D3A1F),
 *   Tan Accent period dot (#B8A678).
 * - Android Adaptive: Dark Olive background (#2D3A1F), Foreground has Cream "S"
 *   (#F4F1E8) + Tan Accent dot (#B8A678).
 * - Monochrome: Themed icon with pure white glyphs on dark olive or transparent canvas.
 */
export function SoldbayAppIcon({
  size = 64,
  variant = "ios",
  rounded = true,
}: SoldbayAppIconProps) {
  const isAndroid = variant === "android";
  const isMono = variant === "monochrome";

  const bgColor = isAndroid || isMono ? colors.textPrimary : colors.background;
  const sColor =
    isAndroid
      ? colors.background
      : isMono
        ? "#FFFFFF"
        : colors.textPrimary;
  const dotColor = isMono ? "#FFFFFF" : colors.accent;

  // Exact proportional scales from design.pen 1024x1024 / 512x512
  const sFontSize = size * 0.566;
  const dotSize = size * 0.07;
  const dotOffsetBottom = size * 0.29;
  const dotOffsetRight = size * 0.22;
  const cornerRadius = rounded ? size * 0.22 : 0;

  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        borderRadius: cornerRadius,
      }}
      className="relative items-center justify-center overflow-hidden"
    >
      <Text
        style={{
          fontFamily: "Fraunces-SemiBold",
          fontSize: sFontSize,
          color: sColor,
          includeFontPadding: false,
          textAlignVertical: "center",
          marginTop: -size * 0.02,
          marginRight: size * 0.04,
        }}
      >
        S
      </Text>

      {/* Signature Tan Accent Period Dot */}
      <View
        style={{
          position: "absolute",
          bottom: dotOffsetBottom,
          right: dotOffsetRight,
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: dotColor,
        }}
      />
    </View>
  );
}
