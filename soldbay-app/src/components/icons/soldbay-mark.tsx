import Svg, { Circle, Rect } from "react-native-svg";
import { colors } from "@/theme/colors";

export interface SoldbayMarkProps {
  size?: number;
  variant?: "light" | "dark" | "inverted";
}

/**
 * SOLDBAY BRAND LOGO MARK
 *
 * Source: design/design.pen (AppMark / SplashMark) & soldbay-logo-primary.svg
 * Concentric medallion with signature tan accent dot.
 */
export function SoldbayMark({
  size = 32,
  variant = "light",
}: SoldbayMarkProps) {
  const outerFill =
    variant === "dark"
      ? colors.background
      : variant === "inverted"
        ? colors.textInverse
        : colors.textPrimary;

  const dotFill = colors.accent;
  const coreFill =
    variant === "inverted" ? colors.textPrimary : colors.textInverse;

  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Rect width="32" height="32" rx="16" fill={outerFill} />
      <Circle cx="16" cy="16" r="6" fill={dotFill} />
      <Circle cx="16" cy="16" r="2.5" fill={coreFill} />
    </Svg>
  );
}
