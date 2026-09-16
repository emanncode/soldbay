import { View, TextInput, TextInputProps } from "react-native";
import { MagnifyingGlass } from "phosphor-react-native";
import { forwardRef } from "react";
import { colors } from "../theme/colors";

export const SearchBar = forwardRef<TextInput, TextInputProps>(({ className, ...props }, ref) => {
  return (
    <View
      className={`h-[44px] flex-row items-center bg-surface border border-border rounded-md px-3 ${
        className || ""
      }`}
    >
      <MagnifyingGlass size={18} color={colors.textSecondary} weight="regular" />
      <TextInput
        ref={ref}
        placeholderTextColor={colors.textSecondary}
        className="flex-1 ml-2 font-sora text-[14px] text-foreground h-full"
        {...props}
      />
    </View>
  );
});

SearchBar.displayName = "SearchBar";
