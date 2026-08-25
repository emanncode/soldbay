import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, type ViewStyle, type StyleProp } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "glass" | "primary" | "dark" | "ghost";
  color?: string;
  iconSize?: number;
  hasBadgeDot?: boolean;
  badgeCount?: number;
  badgeColor?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const SIZES = {
  sm: { box: 28, radius: 14, icon: 15 },
  md: { box: 36, radius: 18, icon: 18 },
  lg: { box: 40, radius: 20, icon: 18 },
};

export function IconButton({
  icon,
  onPress,
  size = "md",
  variant = "glass",
  color,
  iconSize,
  hasBadgeDot,
  badgeCount,
  badgeColor = "#df4a32",
  disabled,
  style,
  accessibilityLabel,
}: IconButtonProps) {
  const config = SIZES[size];
  const finalIconSize = iconSize ?? config.icon;

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: "#3b7e68",
          borderWidth: 0,
        };
      case "dark":
        return {
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          borderWidth: 0,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          borderWidth: 0,
        };
      case "glass":
      default:
        return {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
        };
    }
  };

  const getDefaultIconColor = () => {
    if (color) return color;
    if (variant === "primary") return "#ffffff";
    return "#ffffff";
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.base,
        {
          width: config.box,
          height: config.box,
          borderRadius: config.radius,
        },
        getVariantStyles(),
        disabled && styles.disabled,
        style,
      ]}
    >
      <Ionicons name={icon} size={finalIconSize} color={getDefaultIconColor()} />

      {/* Dot Badge Indicator */}
      {hasBadgeDot && (
        <View
          style={[
            styles.badgeDot,
            {
              backgroundColor: badgeColor,
              top: size === "sm" ? 2 : size === "md" ? 8 : 9,
              right: size === "sm" ? 2 : size === "md" ? 8 : 9,
            },
          ]}
        />
      )}

      {/* Count Badge Indicator */}
      {typeof badgeCount === "number" && badgeCount > 0 && (
        <View
          style={[
            styles.badgeCount,
            {
              backgroundColor: badgeColor,
            },
          ]}
        >
          <Text style={styles.badgeText}>
            {badgeCount > 99 ? "99+" : badgeCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  disabled: {
    opacity: 0.5,
  },
  badgeDot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeCount: {
    position: "absolute",
    top: -3,
    right: -5,
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontFamily: "Inter-Bold",
    fontSize: 8,
    color: "#ffffff",
  },
});
