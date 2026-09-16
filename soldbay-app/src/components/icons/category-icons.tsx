import Svg, { Path, Rect } from "react-native-svg";
import { colors } from "@/theme/colors";

export interface CategoryIconProps {
  size?: number;
  color?: string;
  accentColor?: string;
}

/**
 * TEXTBOOKS CATEGORY ICON
 * Open book with accent bookmark ribbon
 */
export function TextbooksIcon({
  size = 24,
  color = colors.textPrimary,
  accentColor = colors.accent,
}: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Book pages */}
      <Path
        d="M2 5.5C4.5 4.5 8 4.5 12 6.5C16 4.5 19.5 4.5 22 5.5V19.5C19.5 18.5 16 18.5 12 20.5C8 18.5 4.5 18.5 2 19.5V5.5Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Spine divider */}
      <Path
        d="M12 6.5V20.5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      {/* Accent bookmark ribbon */}
      <Path
        d="M16 5V12L18 10.5L20 12V5.5"
        fill={accentColor}
        stroke={accentColor}
        strokeWidth={0.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * ELECTRONICS CATEGORY ICON
 * Smartphone with notch and dynamic signal wave
 */
export function ElectronicsIcon({
  size = 24,
  color = colors.textPrimary,
  accentColor = colors.accent,
}: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Device frame */}
      <Rect
        x="6"
        y="2"
        width="12"
        height="20"
        rx="2.5"
        stroke={color}
        strokeWidth={1.8}
      />
      {/* Screen speaker / notch */}
      <Path
        d="M10 5H14"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      {/* Home indicator bar */}
      <Path
        d="M10 19H14"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      {/* Accent power/spark pulse */}
      <Path
        d="M12 9.5L10.5 12.5H13.5L12 15.5"
        stroke={accentColor}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * FASHION CATEGORY ICON
 * Tailored clothes hanger silhouette with accent hook
 */
export function FashionIcon({
  size = 24,
  color = colors.textPrimary,
  accentColor = colors.accent,
}: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Accent hanger hook */}
      <Path
        d="M12 8.5C12 7 13 5.5 14.5 5.5C15.88 5.5 17 6.62 17 8C17 9.5 15.5 10.5 13.8 11.5L12 12.5"
        stroke={accentColor}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      {/* Hanger shoulders */}
      <Path
        d="M12 12.5L3.5 17.5C2.67 18 2.8 19.5 3.8 19.5H20.2C21.2 19.5 21.33 18 20.5 17.5L12 12.5Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom trouser bar */}
      <Path
        d="M4.5 19.5H19.5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * DORM ESSENTIALS CATEGORY ICON
 * Bedside lamp / essentials with glowing ray
 */
export function DormEssentialsIcon({
  size = 24,
  color = colors.textPrimary,
  accentColor = colors.accent,
}: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Lampshade */}
      <Path
        d="M8 4L6 11H18L16 4H8Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lamp stand & base */}
      <Path
        d="M12 11V19"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M8 19H16"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      {/* Accent light rays */}
      <Path
        d="M5 14L3.5 15.5"
        stroke={accentColor}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Path
        d="M19 14L20.5 15.5"
        stroke={accentColor}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Path
        d="M12 13V15"
        stroke={accentColor}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}
