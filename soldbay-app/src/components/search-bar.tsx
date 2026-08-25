import React from "react";
import { View, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { SoldBayInputField } from "./soldbay-input-field";
import { IconButton } from "./icon-button";

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  onClear?: () => void;
  showFilterButton?: boolean;
  filterActive?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  size?: "sm" | "md" | "lg";
  autoFocus?: boolean;
  disabled?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search textbooks, gadgets...",
  onFilterPress,
  onClear,
  showFilterButton = true,
  filterActive = false,
  containerStyle,
  size = "md",
  disabled = false,
}: SearchBarProps) {
  const filterBtnSize = size === "sm" ? "sm" : "md";

  return (
    <View style={[styles.container, containerStyle]}>
      <SoldBayInputField
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        icon="search"
        iconSize={18}
        variant="search"
        size={size}
        showClearButton={true}
        onClear={onClear}
        disabled={disabled}
        showSeparator={false}
        autoCapitalize="none"
        autoCorrect={false}
        rightElement={
          showFilterButton && onFilterPress ? (
            <IconButton
              icon="options-outline"
              size={filterBtnSize}
              variant={filterActive ? "primary" : "primary"}
              onPress={onFilterPress}
              color="#ffffff"
              style={styles.filterBtn}
              accessibilityLabel="Search filters"
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  filterBtn: {
    marginLeft: 4,
  },
});
