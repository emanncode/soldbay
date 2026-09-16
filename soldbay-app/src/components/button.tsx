import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, View } from "react-native";
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
    let textSizeClass = "text-base leading-6 font-sora-medium";
    switch (size) {
      case "default":
        sizeClass = "h-12 px-6";
        break;
      case "sm":
        sizeClass = "h-9 px-4";
        textSizeClass = "text-sm leading-5 font-sora-medium";
        break;
      case "lg":
        sizeClass = "h-14 px-8";
        textSizeClass = "text-lg leading-7 font-sora-semibold";
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
