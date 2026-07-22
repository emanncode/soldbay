import { type ReactNode } from "react";
import { View, Text, TextInput, type TextInputProps } from "react-native";

interface GlassFormFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  rightElement?: ReactNode;
}

export function GlassFormField({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  rightElement,
}: GlassFormFieldProps) {
  return (
    <View style={{ gap: 6 }}>
      {label && (
        <Text
          style={{
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: "#ffffffe6",
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          backgroundColor: "#00000059",
          borderWidth: 1,
          borderColor: error ? "#dc2626" : "#ffffff1f",
          borderRadius: 12,
          height: 44,
          paddingHorizontal: 14,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#ffffff66"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={{
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: "#ffffff",
            padding: 0,
            flex: 1,
            outline: "none",
          }}
        />
        {rightElement}
      </View>
      {error && (
        <Text
          style={{
            fontFamily: "Inter-Regular",
            fontSize: 12,
            color: "#dc2626",
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
