import Svg, { Path } from "react-native-svg";
import { colors } from "@/theme/colors";

export interface VerifiedShieldIconProps {
  size?: number;
  color?: string;
}

/**
 * SOLDBAY CUSTOM VERIFIED SHIELD CHECKMARK ICON
 *
 * Source: design/design.pen (ID: ZXAqa / mEA8F) & docs/soldbay-design-system.md (Sections 10 & 13)
 * Custom-drawn shield with internal checkmark path, locked Accent color.
 * Reserved exclusively for verified campus sellers.
 */
export function VerifiedShieldIcon({
  size = 14,
  color = colors.accent,
}: VerifiedShieldIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1.3l6.3 2.4v4.9c0 3.6-2.6 6.1-6.3 6.7-3.7-0.6-6.3-3.1-6.3-6.7v-4.9z m-3.8 8.5l1.6-1.6 2 2-1.6 1.6z m3.6 2l-1.6-1.6 4.2-4.2 1.6 1.6z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}
