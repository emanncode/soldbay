import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, ViewStyle, TextStyle, View } from "react-native";
import { forwardRef } from "react";

export interface ButtonProps extends TouchableOpacityProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  label: string;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<View, ButtonProps>(
  ({ variant = "primary", size = "default", label, loading, icon, className, disabled, ...props }, ref) => {
    let bgClass = "";
    let textClass = "";
    let borderClass = "";

    switch (variant) {
      case "primary":
        bgClass = disabled ? "bg-primary/50" : "bg-primary active:bg-primary-700";
        textClass = "text-background";
        break;
      case "secondary":
        bgClass = disabled ? "bg-secondary/50" : "bg-secondary active:opacity-80";
        textClass = "text-primary dark:text-background";
        break;
      case "outline":
        bgClass = disabled ? "bg-transparent opacity-50" : "bg-transparent active:bg-surface";
        borderClass = "border border-primary";
        textClass = "text-primary dark:text-background";
        break;
      case "ghost":
        bgClass = disabled ? "bg-transparent opacity-50" : "bg-transparent active:bg-surface";
        textClass = "text-primary dark:text-background";
        break;
    }

    let sizeClass = "";
    let textSizeClass = "text-[16px] leading-[24px] font-sora-medium";
    switch (size) {
      case "default":
        sizeClass = "h-[48px] px-6";
        break;
      case "sm":
        sizeClass = "h-[36px] px-4";
        textSizeClass = "text-[14px] leading-[20px] font-sora-medium";
        break;
      case "lg":
        sizeClass = "h-[56px] px-8";
        textSizeClass = "text-[18px] leading-[26px] font-sora-semibold";
        break;
    }

    return (
      <TouchableOpacity
        ref={ref}
        activeOpacity={0.8}
        disabled={disabled || loading}
        className={`flex-row items-center justify-center rounded-md ${sizeClass} ${bgClass} ${borderClass} ${className || ""}`}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={variant === "primary" ? "#F4F1E8" : "#5A743E"} />
        ) : (
          <>
            {icon && <View className="mr-2">{icon}</View>}
            <Text className={`${textClass} ${textSizeClass}`}>{label}</Text>
          </>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = "Button";
