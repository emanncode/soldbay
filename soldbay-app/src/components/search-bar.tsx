import { Pressable, TextInput, View } from "react-native";
import { Search, X, SlidersHorizontal } from "lucide-react-native";
import { colors } from "../theme/colors";

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
  className?: string;
}

/**
 * SOLDBAY SEARCH BAR
 *
 * 48px height, 10px radius (`rounded-md`), Lucide outline icons.
 */
export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search textbooks, calculators, electronics...",
  onClear,
  onFilterPress,
  showFilter = false,
  className = "",
}: SearchBarProps) {
  const hasValue = Boolean(value);

  const handleClear = () => {
    onChangeText("");
    onClear?.();
  };

  return (
    <View className={`h-6 w-full flex-row items-center gap-1 ${className}`}>
      <View className="h-full flex-1 flex-row items-center rounded-md border border-neutral-300 bg-surface-elevated px-1.5">
        <Search size={20} color={colors.neutral500} />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral400}
          className="ml-1 h-full flex-1 font-manrope text-body text-text-primary"
          style={{ paddingVertical: 0 }}
          selectionColor={colors.accent}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {hasValue ? (
          <Pressable
            onPress={handleClear}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            className="h-6 w-6 items-center justify-center"
            hitSlop={8}
          >
            <X size={18} color={colors.neutral500} />
          </Pressable>
        ) : null}
      </View>

      {showFilter ? (
        <Pressable
          onPress={onFilterPress}
          accessibilityRole="button"
          accessibilityLabel="Filters"
          className="h-6 w-6 items-center justify-center rounded-md border border-neutral-300 bg-surface-elevated active:bg-neutral-100"
          hitSlop={8}
        >
          <SlidersHorizontal size={20} color={colors.textPrimary} />
        </Pressable>
      ) : null}
    </View>
  );
}
