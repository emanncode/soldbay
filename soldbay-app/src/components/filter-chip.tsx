import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export interface FilterChipProps {
  label: string;
  isActive?: boolean;
  variant?: "secondary" | "accent";
  badgeCount?: number;
  icon?: React.ElementType<any>;
  isFilterTrigger?: boolean;
  onPress?: () => void;
}

export function FilterChip({
  label,
  isActive = false,
  badgeCount,
  icon: Icon,
  isFilterTrigger = false,
  onPress,
}: FilterChipProps) {
  const iconColor = isActive ? "#F1EEE4" : colors.textSecondary;

  const textColorClass = isActive
    ? "text-[#F1EEE4]"
    : isFilterTrigger
      ? "text-text-primary"
      : "text-text-secondary";

  const fontClass = isActive ? "font-sora-semibold" : "font-sora-medium";

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      style={[
        styles.chip,
        isActive ? styles.chipActive : styles.chipInactive,
        isFilterTrigger ? styles.filterTriggerPadding : styles.categoryPadding,
      ]}
      className={`flex-row items-center rounded-full ${
        isActive ? "bg-secondary" : "bg-surface border border-border"
      }`}
    >
      {Icon && (
        <View style={styles.iconWrapper}>
          <Icon
            size={14}
            weight={isActive ? "bold" : "regular"}
            color={iconColor}
          />
        </View>
      )}
      <Text
        style={styles.label}
        className={`text-[13px] ${fontClass} ${textColorClass}`}
      >
        {label}
      </Text>
      {badgeCount !== undefined && badgeCount > 0 && (
        <View className="ml-1 bg-accent rounded-full w-4 h-4 items-center justify-center">
          <Text className="text-[10px] font-sora-bold text-foreground leading-none">
            {badgeCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    paddingVertical: 7,
    backgroundColor: colors.secondary,
  },
  chipInactive: {
    paddingVertical: 7,
  },
  categoryPadding: {
    paddingHorizontal: 14,
  },
  filterTriggerPadding: {
    paddingHorizontal: 12,
  },
  iconWrapper: {
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    lineHeight: 16,
  },
});
