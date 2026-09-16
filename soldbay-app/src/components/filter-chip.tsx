import { TouchableOpacity, Text, View } from "react-native";
import { elevation } from "../theme/elevation";

interface FilterChipProps {
  label: string;
  isActive?: boolean;
  variant?: "secondary" | "accent";
  badgeCount?: number;
  icon?: React.ElementType<any>;
  onPress?: () => void;
}

export function FilterChip({
  label,
  isActive = false,
  variant = "accent",
  badgeCount,
  icon: Icon,
  onPress,
}: FilterChipProps) {
  let bgClass = "bg-surface";
  let textClass = "text-text-secondary";
  let borderClass = "border border-border";

  if (isActive) {
    borderClass = "border-transparent";
    if (variant === "secondary") {
      bgClass = "bg-secondary";
      textClass = "text-[#F1EEE4] dark:text-[#1A1F14]";
    } else {
      bgClass = "bg-accent";
      textClass = "text-[#2D3A1F] dark:text-[#1A1F14]";
    }
  }

  // Adjust padding depending on if it's the filter trigger or regular category
  const isFilterTrigger = badgeCount !== undefined;
  const paddingClass = isFilterTrigger ? "px-[12px]" : "px-[14px]";

  return (
    <TouchableOpacity style={elevation.raised}
      activeOpacity={0.7}
      onPress={onPress}
      className={`h-[32px] rounded-full flex-row items-center justify-center py-[7px] ${paddingClass} ${bgClass} ${borderClass}`}
    >
      {Icon && (
        <View className="mr-1.5">
          <Icon
            size={14}
            weight={isActive ? "bold" : "regular"}
            // In a real app we might pass the precise color derived from the textClass,
            // but for simplicity we rely on inheriting or we can force it here.
            color={
              isActive
                ? variant === "secondary"
                  ? "#F1EEE4"
                  : "#2D3A1F"
                : "#5C7048" // text-secondary light mode approx
            }
          />
        </View>
      )}
      <Text className={`text-[13px] font-sora-medium ${textClass}`}>
        {label}
      </Text>
      {badgeCount !== undefined && badgeCount > 0 && (
        <View className="ml-1.5 bg-accent rounded-full w-4 h-4 items-center justify-center">
          <Text className="text-[10px] font-sora-bold text-[#2D3A1F] leading-none mt-[1px]">
            {badgeCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
