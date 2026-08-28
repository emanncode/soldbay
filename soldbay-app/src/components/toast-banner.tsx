import { useEffect } from "react";
import { Text, View } from "react-native";
import { CheckCircle2, AlertCircle } from "lucide-react-native";
import { colors } from "../theme/colors";
import { elevation } from "../theme/elevation";

export type ToastType = "success" | "error" | "info";

export interface ToastBannerProps {
  visible?: boolean;
  message?: string | null;
  type?: ToastType;
  onDismiss?: () => void;
  duration?: number;
  className?: string;
}

/**
 * SOLDBAY TOAST BANNER
 *
 * Rules from DESIGN.md:
 * - Toasts are NEVER teal.
 * - Success = green left border (#16A34A).
 * - Error = red left border (#DC2626).
 * - Elevated surface with Level 2 shadow, rounded-md (10px).
 */
export function ToastBanner({
  visible,
  message,
  type = "success",
  onDismiss,
  duration = 3000,
  className = "",
}: ToastBannerProps) {
  const isVisible = visible ?? Boolean(message);

  useEffect(() => {
    if (isVisible && onDismiss) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onDismiss]);

  if (!isVisible || !message) return null;

  const isError = type === "error";
  const borderLeftColor = isError ? colors.error : colors.success;
  const icon = isError ? (
    <AlertCircle size={20} color={colors.error} />
  ) : (
    <CheckCircle2 size={20} color={colors.success} />
  );

  return (
    <View
      style={[
        elevation.modal,
        {
          borderLeftWidth: 4,
          borderLeftColor,
        },
      ]}
      className={`w-full flex-row items-center rounded-md bg-surface-elevated p-1.5 ${className}`}
    >
      <View className="mr-1">{icon}</View>
      <Text className="flex-1 font-manrope-medium text-body text-text-primary">
        {message}
      </Text>
    </View>
  );
}
