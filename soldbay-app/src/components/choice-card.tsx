import { type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { CheckCircle2 } from "lucide-react-native";
import { colors } from "../theme/colors";
import { elevation } from "../theme/elevation";

export interface ChoiceCardProps {
  title: string;
  description: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
  className?: string;
}

/**
 * SOLDBAY CHOICE CARD
 *
 * Selection card for role choice and option lists:
 * - 10px radius (`rounded-md`).
 * - Resting: Level 1 elevation, white surface.
 * - Selected: 2px accent border (#0D9488) + accent-tint background (#CCFBF1).
 */
export function ChoiceCard({
  title,
  description,
  selected = false,
  onPress,
  icon,
  className = "",
}: ChoiceCardProps) {
  const borderClass = selected
    ? "border-2 border-accent bg-accent-tint/30"
    : "border border-neutral-200 bg-surface-elevated";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${title}, ${description}`}
      style={selected ? undefined : elevation.card}
      className={`w-full flex-row items-center rounded-md p-2 ${borderClass} ${className}`}
    >
      {icon ? <View className="mr-1.5">{icon}</View> : null}

      <View className="flex-1">
        <Text className="font-manrope-semibold text-body-medium text-text-primary">
          {title}
        </Text>
        <Text className="mt-0.5 font-manrope text-small text-text-secondary">
          {description}
        </Text>
      </View>

      <View className="ml-1">
        {selected ? (
          <CheckCircle2 size={24} color={colors.accent} />
        ) : (
          <View className="h-3 w-3 rounded-full border border-neutral-300 bg-surface-elevated" />
        )}
      </View>
    </Pressable>
  );
}
