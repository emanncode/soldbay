import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  TextInputProps,
} from "react-native";
import { MagnifyingGlass, XCircle } from "phosphor-react-native";
import { colors } from "../../theme/tokens";

interface SearchBarProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = "Search...",
  ...props
}: SearchBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const iconColor = isDark ? colors.borderDark : colors.secondaryText;
  const textColor = isDark ? colors.darkText : colors.primaryText;

  return (
    <View className="flex-row items-center h-[49px] bg-primaryText/5 dark:bg-darkBgStep rounded-full px-4">
      <MagnifyingGlass size={20} color={iconColor} weight="bold" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={iconColor}
        className="flex-1 ml-2 text-[15px] font-sora text-primaryText dark:text-darkText"
        style={{ color: textColor, paddingVertical: 0 }}
        {...props}
      />
      {value.length > 0 && onClear && (
        <TouchableOpacity onPress={onClear} className="ml-2">
          <XCircle size={20} color={iconColor} weight="fill" />
        </TouchableOpacity>
      )}
    </View>
  );
}
