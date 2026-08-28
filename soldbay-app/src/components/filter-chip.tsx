import { Pressable, Text } from "react-native";

export interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  className?: string;
}

/**
 * SOLDBAY FILTER CHIP
 *
 * Category / filter pill:
 * - Inactive: neutral-100 bg (#F5F5F5), text-secondary (#525252).
 * - Active: accent bg (#0D9488), text-inverse (#FFFFFF).
 * - Full pill radius (`rounded-full`), 36px touch target.
 */
export function FilterChip({
  label,
  active = false,
  onPress,
  className = "",
}: FilterChipProps) {
  const bgClass = active ? "bg-accent" : "bg-neutral-100";
  const textClass = active
    ? "text-text-inverse font-manrope-medium"
    : "text-text-secondary font-manrope";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      className={`h-4.5 items-center justify-center rounded-full px-2 py-0.5 active:opacity-80 ${bgClass} ${className}`}
    >
      <Text className={`text-small ${textClass}`}>{label}</Text>
    </Pressable>
  );
}
