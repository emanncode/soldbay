import { TextInput, TextInputProps, View, Text } from "react-native";
import { forwardRef, useState } from "react";

export interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    let borderClass = "border-border border";
    if (error) {
      borderClass = "border-error border-2"; // Error color
    } else if (isFocused) {
      borderClass = "border-primary border-2";
    }

    const bgClass = props.editable === false ? "bg-surface/60 opacity-60" : "bg-surface";

    return (
      <View className={`w-full ${className || ""}`}>
        {label && (
          <Text className="text-sm font-sora-medium text-foreground mb-2">
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor="#A8C090"
          className={`h-12 px-4 rounded-md font-sora text-base text-foreground ${bgClass} ${borderClass}`}
          {...props}
        />
        {(error || helperText) && (
          <Text
            className={`text-sm mt-1.5 font-sora ${
              error ? "text-error" : "text-text-secondary"
            }`}
          >
            {error || helperText}
          </Text>
        )}
      </View>
    );
  }
);

TextField.displayName = "TextField";
