import { type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { colors } from "../theme/colors";

export interface SettingsRowProps {
  label: string;
  onPress?: () => void;
  icon?: ReactNode;
  value?: string;
  badge?: ReactNode;
  destructive?: boolean;
  showChevron?: boolean;
  className?: string;
}

/**
 * SOLDBAY SETTINGS ROW
 *
 * Profile and settings list item:
 * - 48px min height (touch-first).
 * - Optional left icon, label (16px Medium), optional value/badge, trailing ChevronRight.
 */
export function SettingsRow({
  label,
  onPress,
  icon,
  value,
  badge,
  destructive = false,
  showChevron = true,
  className = "",
}: SettingsRowProps) {
  const labelColor = destructive ? "text-error" : "text-text-primary";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={`h-6 w-full flex-row items-center justify-between px-2 active:bg-neutral-100 ${className}`}
    >
      <View className="flex-row items-center flex-1 mr-1">
        {icon ? <View className="mr-1.5">{icon}</View> : null}
        <Text
          numberOfLines={1}
          className={`font-manrope-medium text-body ${labelColor}`}
        >
          {label}
        </Text>
      </View>

      <View className="flex-row items-center gap-1">
        {badge ? badge : null}

        {value ? (
          <Text className="font-manrope text-small text-text-secondary">
            {value}
          </Text>
        ) : null}

        {showChevron ? (
          <ChevronRight size={20} color={colors.neutral400} />
        ) : null}
      </View>
    </Pressable>
  );
}
