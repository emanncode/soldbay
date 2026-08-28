import { type ReactNode } from "react";
import { Text, View } from "react-native";
import { Button } from "./button";

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
  className?: string;
}

/**
 * SOLDBAY EMPTY STATE
 *
 * Rules from DESIGN.md:
 * - Empty states nudge, they do not guilt.
 * - Neutral circular container for Lucide outline icon.
 * - Title in H2 Semibold, description in Body text-secondary.
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onActionPress,
  className = "",
}: EmptyStateProps) {
  return (
    <View className={`w-full items-center justify-center p-3 ${className}`}>
      <View className="mb-2 h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
        {icon}
      </View>

      <Text className="text-center font-manrope-semibold text-h2 text-text-primary">
        {title}
      </Text>

      <Text className="mt-1 text-center font-manrope text-body text-text-secondary">
        {description}
      </Text>

      {actionLabel && onActionPress ? (
        <View className="mt-3 w-full max-w-xs">
          <Button
            label={actionLabel}
            onPress={onActionPress}
            variant="primary"
          />
        </View>
      ) : null}
    </View>
  );
}
