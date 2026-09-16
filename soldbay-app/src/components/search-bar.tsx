import { View, TextInput, TextInputProps } from "react-native";
import { elevation } from "../theme/elevation";
import { MagnifyingGlass } from "phosphor-react-native";
import { forwardRef } from "react";
import { colors } from "../theme/colors";

export const SearchBar = forwardRef<TextInput, TextInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <View
        style={elevation.raised}
        className={`h-11 flex-row items-center bg-surface border border-border rounded-full px-3 ${
          className || ""
        }`}
      >
        <MagnifyingGlass
          size={18}
          color={colors.textSecondary}
          weight="regular"
        />
        <TextInput
          ref={ref}
          placeholderTextColor={colors.textSecondary}
          className="flex-1 ml-2 font-sora text-sm text-foreground h-full"
          {...props}
        />
      </View>
    );
  },
);

SearchBar.displayName = "SearchBar";
