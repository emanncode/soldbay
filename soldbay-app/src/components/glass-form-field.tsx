import { type ReactNode } from "react";
import { View, Text, TextInput, Platform, type TextInputProps } from "react-native";

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
  disabled?: boolean;
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
  disabled,
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
          backgroundColor: disabled ? "#00000030" : "#00000059",
          borderWidth: 1,
          borderColor: error ? "#dc2626" : "#ffffff1f",
          borderRadius: 12,
          height: 44,
          paddingHorizontal: 14,
          flexDirection: "row",
          alignItems: "center",
          opacity: disabled ? 0.5 : 1,
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
          editable={!disabled}
          selectTextOnFocus={!disabled}
          style={[
            {
              fontFamily: "Inter-Regular",
              fontSize: 14,
              color: "#ffffff",
              padding: 0,
              flex: 1,
            },
            Platform.OS === "web" && {
              outlineStyle: "none" as any,
              outlineWidth: 0 as any,
              boxShadow: "none" as any,
            },
          ]}
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
