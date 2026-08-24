import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Animated,
  type TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SoldBayInputFieldProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  rightElement?: React.ReactNode;
  disabled?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  maxLength?: number;
}

export function SoldBayInputField({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  rightElement,
  disabled,
  onBlur,
  onFocus,
  maxLength,
}: SoldBayInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.();
  };

  const borderColor = error
    ? "#ef4444"
    : focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgba(255, 255, 255, 0.14)", "#22c55e"],
      });

  const iconColor = error
    ? "#ef4444"
    : isFocused
    ? "#22c55e"
    : "rgba(255, 255, 255, 0.6)";

  return (
    <View style={styles.inputGroup}>
      {label && (
        <Text style={[styles.inputLabel, isFocused && { color: "#4ade80" }]}>
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputWrapper,
          { borderColor },
          error ? styles.wrapperError : null,
          disabled ? styles.wrapperDisabled : null,
        ]}
      >
        {icon && (
          <>
            <Ionicons name={icon} size={20} color={iconColor} />
            <View style={styles.separator} />
          </>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.45)"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          style={[
            styles.textInput,
            Platform.OS === "web" && {
              outlineStyle: "none" as any,
              outlineWidth: 0 as any,
              boxShadow: "none" as any,
            },
          ]}
        />
        {rightElement}
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    gap: 8,
    position: "relative",
  },
  inputLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#f4f4f5",
    paddingLeft: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  wrapperError: {
    borderColor: "#ef4444",
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  wrapperDisabled: {
    backgroundColor: "#141416",
    opacity: 0.6,
  },
  separator: {
    width: 1,
    height: 18,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    marginHorizontal: 10,
  },
  textInput: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    color: "#ffffff",
    padding: 0,
    flex: 1,
  },
  errorText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#ef4444",
    paddingLeft: 4,
    marginTop: 4,
  },
});
