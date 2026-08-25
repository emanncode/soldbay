import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Animated,
  TouchableOpacity,
  type TextInputProps,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface SoldBayInputFieldProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: boolean;
  rightElement?: React.ReactNode;
  disabled?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  onClear?: () => void;
  showClearButton?: boolean;
  maxLength?: number;
  variant?: "default" | "pill" | "search";
  size?: "sm" | "md" | "lg";
  showSeparator?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
}

const SIZES = {
  sm: { height: 40, paddingHorizontal: 12, fontSize: 13, iconSize: 16 },
  md: { height: 48, paddingHorizontal: 16, fontSize: 14, iconSize: 18 },
  lg: { height: 56, paddingHorizontal: 16, fontSize: 15, iconSize: 20 },
};

export function SoldBayInputField({
  label,
  icon,
  iconSize,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  rightElement,
  disabled,
  onBlur,
  onFocus,
  onClear,
  showClearButton = false,
  maxLength,
  variant = "default",
  size = variant === "search" || variant === "pill" ? "md" : "lg",
  showSeparator = variant === "default",
  containerStyle,
  inputStyle,
  wrapperStyle,
}: SoldBayInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;
  const config = SIZES[size];

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
        outputRange: [
          "rgba(255, 255, 255, 0.10)",
          "#3b7e68",
        ],
      });

  const iconColor = error
    ? "#ef4444"
    : isFocused
    ? "#3b7e68"
    : "rgba(255, 255, 255, 0.5)";

  const isPill = variant === "pill" || variant === "search";
  const borderRadius = isPill ? 999 : 16;
  const finalIconSize = iconSize ?? config.iconSize;

  return (
    <View style={[styles.inputGroup, containerStyle]}>
      {label && (
        <Text style={[styles.inputLabel, isFocused && { color: "#3b7e68" }]}>
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            borderRadius,
            height: config.height,
            paddingHorizontal: config.paddingHorizontal,
          },
          variant === "search" && styles.wrapperSearch,
          error ? styles.wrapperError : null,
          disabled ? styles.wrapperDisabled : null,
          wrapperStyle,
        ]}
      >
        {icon && (
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={finalIconSize} color={iconColor} />
            {showSeparator && <View style={styles.separator} />}
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          style={[
            styles.textInput,
            { fontSize: config.fontSize },
            Platform.OS === "web" && {
              outlineStyle: "none" as any,
              outlineWidth: 0 as any,
              boxShadow: "none" as any,
            },
            inputStyle,
          ]}
        />
        {showClearButton && value.length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              onChangeText("");
              onClear?.();
            }}
            hitSlop={8}
            style={styles.clearBtn}
          >
            <Ionicons name="close-circle" size={18} color="rgba(255, 255, 255, 0.45)" />
          </TouchableOpacity>
        ) : null}
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
    width: "100%",
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
    backgroundColor: "rgba(22, 24, 30, 0.95)",
    borderWidth: 1,
    gap: 8,
  },
  wrapperSearch: {
    backgroundColor: "rgba(22, 24, 30, 0.95)",
  },
  wrapperError: {
    borderColor: "#ef4444",
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  wrapperDisabled: {
    backgroundColor: "#141416",
    opacity: 0.6,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    width: 1,
    height: 18,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    marginLeft: 10,
    marginRight: 4,
  },
  textInput: {
    fontFamily: "Inter-Regular",
    color: "#ffffff",
    padding: 0,
    flex: 1,
  },
  clearBtn: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#ef4444",
    paddingLeft: 4,
    marginTop: 4,
  },
});
