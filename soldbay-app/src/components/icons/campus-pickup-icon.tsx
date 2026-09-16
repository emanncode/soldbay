import Svg, { Path } from "react-native-svg";
import { colors } from "@/theme/colors";

export interface CampusPickupIconProps {
  size?: number;
  color?: string;
  accentColor?: string;
}

/**
 * SOLDBAY CUSTOM CAMPUS PICKUP POINT ICON
 *
 * Source: design/design.pen (ID: EECdL / icCampus) & docs/soldbay-design-system.md (Section 13)
 * Student marketplace campus meetup / pickup location pin.
 */
export function CampusPickupIcon({
  size = 24,
  color = colors.textPrimary,
  accentColor = colors.accent,
}: CampusPickupIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Map Pin Outline */}
      <Path
        d="M12 21.5C12 21.5 19 15.2 19 9.8C19 5.5 15.87 2 12 2C8.13 2 5 5.5 5 9.8C5 15.2 12 21.5 12 21.5Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Campus Mortarboard / Landmark cap */}
      <Path
        d="M12 6.8L16.2 8.8L12 10.8L7.8 8.8L12 6.8Z"
        fill={accentColor}
        stroke={accentColor}
        strokeWidth={0.8}
        strokeLinejoin="round"
      />
      <Path
        d="M9.2 9.7V12C9.2 12.8 10.4 13.5 12 13.5C13.6 13.5 14.8 12.8 14.8 12V9.7"
        stroke={color}
        strokeWidth={1.3}
        strokeLinecap="round"
      />
      <Path
        d="M15.8 9V11.2"
        stroke={accentColor}
        strokeWidth={1.3}
        strokeLinecap="round"
      />
    </Svg>
  );
}
