import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

// Primary + Secondary only. Outline is cut and no button has a border
// (decided 07-10-26). Icon-only circular buttons live in IconButton.tsx.
export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "md" | "sm";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize; // md = default (.btn), sm = compact (e.g. Withdraw)
  fullWidth?: boolean; // .btn is width:100% by default; false = width:auto
  label?: string;
  icon?: React.ReactNode; // caller sets icon color (tokens only)
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string; // required in practice for icon-only buttons
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = true,
  label,
  icon,
  onPress,
  disabled = false,
  accessibilityLabel,
  style,
  labelStyle,
}: ButtonProps) {
  const containerClass = [
    "flex-row items-center justify-center rounded-full overflow-hidden",
    fullWidth ? "w-full" : "self-start",
    // md: padding 16 (icon-only: 16/20). sm: padding 10/16.
    size === "sm" ? "py-2.5 px-4" : label ? "p-4" : "py-4 px-5",
    variant === "primary"
      ? "bg-accent"
      : "bg-primaryText/5 dark:bg-borderDark/24",
    disabled ? "opacity-50" : "",
  ].join(" ");

  const labelClass = [
    "font-sora-bold",
    size === "sm" ? "text-[13px]" : "text-[15px]",
    // Primary label is always darkBg (#031F21), never white, in both modes.
    variant === "primary"
      ? "text-primaryText"
      : "text-primaryText dark:text-darkText",
  ].join(" ");

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      className={containerClass}
      style={style}
    >
      {icon ? <View className={label ? "mr-2" : ""}>{icon}</View> : null}
      {label ? (
        <Text className={labelClass} style={labelStyle}>
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}
