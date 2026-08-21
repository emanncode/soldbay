import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
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
  maxLength,
}: SoldBayInputFieldProps) {
  return (
    <View style={styles.inputGroup}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          error ? styles.wrapperError : null,
          disabled ? styles.wrapperDisabled : null,
        ]}
      >
        {icon && (
          <>
            <Ionicons name={icon} size={20} color="rgba(0,0,0,0.35)" />
            <View style={styles.separator} />
          </>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(0,0,0,0.3)"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          onBlur={onBlur}
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
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    gap: 6,
    position: "relative",
  },
  inputLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 13,
    color: "#222222",
    paddingLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 26,
    height: 52,
    paddingHorizontal: 16,
  },
  wrapperError: {
    borderColor: "#ef4444",
    backgroundColor: "rgba(239, 68, 68, 0.02)",
  },
  wrapperDisabled: {
    backgroundColor: "#f1f5f9",
    opacity: 0.7,
  },
  separator: {
    width: 1,
    height: 18,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 12,
  },
  textInput: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#000000",
    padding: 0,
    flex: 1,
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#ef4444",
    paddingLeft: 4,
    position: "absolute",
    bottom: -16,
    left: 0,
  },
});
