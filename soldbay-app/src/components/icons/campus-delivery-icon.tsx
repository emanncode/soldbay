import Svg, { Path } from "react-native-svg";
import { colors } from "@/theme/colors";

export interface CampusDeliveryIconProps {
  size?: number;
  color?: string;
  accentColor?: string;
}

/**
 * SOLDBAY CUSTOM DELIVERY-ON-CAMPUS ICON
 *
 * Source: design/design.pen (ID: Owa0b / icDelivery-on-campus) & docs/soldbay-design-system.md (Section 13)
 * Soldbay-only fast on-campus handoff & delivery concept.
 */
export function CampusDeliveryIcon({
  size = 24,
  color = colors.textPrimary,
  accentColor = colors.accent,
}: CampusDeliveryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 3D Parcel Box Profile */}
      <Path
        d="M3 8.5L12 4L21 8.5L12 13L3 8.5Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 8.5V15.5L12 20V13"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 8.5V15.5L12 20"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Accent Parcel Tape & Motion dashes */}
      <Path
        d="M9.5 5.2L14.5 7.7"
        stroke={accentColor}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M12 13V17"
        stroke={accentColor}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M2 18.5H5"
        stroke={accentColor}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Path
        d="M19 18.5H22"
        stroke={accentColor}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}
