import React from "react";
import {
  TouchableOpacity,
  useColorScheme,
  StyleProp,
  ViewStyle,
} from "react-native";
import { colors } from "../../theme/tokens";

export interface IconButtonProps {
  icon: React.ElementType; // Phosphor icon component
  onPress: () => void;
  accessibilityLabel: string; // required: icon-only control
  style?: StyleProp<ViewStyle>;
  iconColor?: string; // Optional override for icon color
}

// 44x44, no border (decided 07-10-26). Light: bgBase + elevation-1.
// Dark: no shadow, one step up (darkBgStep) per the elevation rule.
export function IconButton({
  icon: Icon,
  onPress,
  accessibilityLabel,
  style,
  iconColor,
}: IconButtonProps) {
  const isDark = useColorScheme() === "dark";
  const defaultIconColor = isDark ? colors.darkText : colors.primaryText;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="w-11 h-11 rounded-full items-center justify-center bg-bgBase dark:bg-darkBgStep shadow-elevation-1 dark:shadow-none"
      style={style}
    >
      <Icon size={24} color={iconColor || defaultIconColor} weight="regular" />
    </TouchableOpacity>
  );
}
