import { type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

export interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
  rightElement?: ReactNode;
  className?: string;
}

/**
 * SOLDBAY SECTION HEADER
 *
 * Section title with:
 * - H2 Semibold title (#171717).
 * - Optional right action (e.g. "See all" or custom element).
 */
export function SectionHeader({
  title,
  actionText,
  onActionPress,
  rightElement,
  className = "",
}: SectionHeaderProps) {
  return (
    <View
      className={`w-full flex-row items-center justify-between py-1 ${className}`}
    >
      <Text className="font-manrope-semibold text-h2 text-text-primary">
        {title}
      </Text>

      {rightElement ? (
        rightElement
      ) : actionText ? (
        <Pressable
          onPress={onActionPress}
          accessibilityRole="button"
          accessibilityLabel={actionText}
          className="py-0.5"
          hitSlop={8}
        >
          <Text className="font-manrope-medium text-body text-accent">
            {actionText}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
