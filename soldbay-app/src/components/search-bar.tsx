import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { MagnifyingGlass } from "phosphor-react-native";
import { forwardRef } from "react";
import { colors } from "../theme/colors";

export interface SearchBarProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export const SearchBar = forwardRef<TextInput, SearchBarProps>(
  (
    {
      className,
      containerStyle,
      style,
      placeholder = "Search textbooks, tech, dorm…",
      ...props
    },
    ref,
  ) => {
    return (
      <View
        style={[styles.container, containerStyle]}
        className={`h-13 flex-row items-center border border-border rounded-full  ${
          className || ""
        }`}
      >
        <MagnifyingGlass
          size={18}
          color={colors.textPrimary}
          weight="bold"
          style={{ marginLeft: 10 }}
        />
        <TextInput
          ref={ref}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, style]}
          className="flex-1 ml-1 font-sora text-[16px] text-text-primary h-full outline-none"
          {...props}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    height: 44,
    borderRadius: 22,
  },
  input: {
    fontSize: 14,
    paddingVertical: 0,
  },
});

SearchBar.displayName = "SearchBar";
