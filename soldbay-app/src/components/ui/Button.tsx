import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps {
  variant?: ButtonVariant;
  label?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export function Button({
  variant = "primary",
  label,
  icon,
  onPress,
  disabled = false,
  fullWidth = true,
  style,
  labelStyle,
}: ButtonProps) {
  const isDisabled = disabled || !onPress;

  const getContainerStyles = () => {
    let base =
      "flex-row items-center justify-center overflow-hidden rounded-full py-4 px-4 ";

    if (fullWidth) {
      base += "w-full ";
    }

    switch (variant) {
      case "primary":
        base += "bg-accent ";
        break;
      case "secondary":
        base += "bg-primaryText/5 dark:bg-borderDark/24 ";
        break;
    }

    if (isDisabled) {
      base += "opacity-50 ";
    }

    return base;
  };

  const getLabelStyles = () => {
    let base = "font-sora-bold text-[15px] ";

    switch (variant) {
      case "primary":
        base += "text-primaryText "; // always dark text on accent background
        break;
      case "secondary":
        base += "text-primaryText dark:text-darkText ";
        break;
    }

    return base;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      onPress={onPress}
      className={getContainerStyles()}
      style={style}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      accessibilityLabel={label}
    >
      {icon && <View className={label ? "mr-2" : ""}>{icon}</View>}
      {label && (
        <Text className={getLabelStyles()} style={labelStyle}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
