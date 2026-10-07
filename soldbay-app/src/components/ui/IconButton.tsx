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
  accessibilityLabel: string; // Required for screen readers
  style?: StyleProp<ViewStyle>;
  iconColor?: string; // Optional override for icon color
}

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
      className="w-[44px] h-[44px] rounded-full items-center justify-center bg-bgBase dark:bg-darkBgStep shadow-elevation-1 dark:shadow-none"
      style={[{ elevation: isDark ? 0 : 2 }, style]}
    >
      <Icon size={24} color={iconColor || defaultIconColor} weight="regular" />
    </TouchableOpacity>
  );
}
