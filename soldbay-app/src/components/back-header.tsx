import { type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { colors } from "../theme/colors";

export interface BackHeaderProps {
  title?: string;
  onBack?: () => void;
  rightAction?: ReactNode;
  showBack?: boolean;
  className?: string;
}

/**
 * SOLDBAY BACK HEADER
 *
 * Header with:
 * - 48x48 touch target back button with ArrowLeft.
 * - Screen title in H2 (20px Semibold).
 * - Optional right action (e.g. Save, Share, Cancel).
 */
export function BackHeader({
  title,
  onBack,
  rightAction,
  showBack = true,
  className = "",
}: BackHeaderProps) {
  return (
    <View
      className={`h-6 w-full flex-row items-center justify-between px-2 ${className}`}
    >
      <View className="flex-row items-center">
        {showBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="h-6 w-6 items-center justify-center -ml-1 rounded-sm active:bg-neutral-100"
            hitSlop={8}
          >
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>
        ) : null}

        {title ? (
          <Text
            numberOfLines={1}
            className={`font-manrope-semibold text-h2 text-text-primary ${
              showBack ? "ml-1" : ""
            }`}
          >
            {title}
          </Text>
        ) : null}
      </View>

      {rightAction ? (
        <View className="flex-row items-center">{rightAction}</View>
      ) : (
        <View className="w-6" />
      )}
    </View>
  );
}
