import { useState } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { colors } from "../theme/colors";

export interface TextAreaProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  minHeight?: number;
  className?: string;
}

/**
 * SOLDBAY TEXT AREA
 *
 * Multi-line text input with:
 * - Label above in Medium weight.
 * - 6px radius (`rounded-sm`), 1px neutral-300 border resting, 2px accent focus.
 * - Error message or character counter below.
 */
export function TextArea({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  maxLength,
  minHeight = 100,
  editable = true,
  className = "",
  ...rest
}: TextAreaProps) {
  const [focused, setFocused] = useState(false);

  const hasError = Boolean(error);
  const currentLength = value?.length || 0;

  const borderClass = hasError
    ? "border border-error"
    : focused
      ? "border-2 border-accent"
      : "border border-neutral-300";

  const bgClass = editable ? "bg-surface-elevated" : "bg-neutral-100";

  return (
    <View className={`w-full ${className}`}>
      {label ? (
        <Text className="mb-1 text-body-medium text-text-primary">
          {label}
        </Text>
      ) : null}

      <View
        className={`rounded-sm p-1.5 ${bgClass} ${borderClass}`}
        style={{ minHeight }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral400}
          multiline
          maxLength={maxLength}
          editable={editable}
          textAlignVertical="top"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 font-manrope text-body text-text-primary"
          selectionColor={colors.accent}
          {...rest}
        />
      </View>

      <View className="mt-0.5 flex-row items-center justify-between">
        {hasError ? (
          <Text className="flex-1 text-small text-error">{error}</Text>
        ) : helperText ? (
          <Text className="flex-1 text-small text-text-tertiary">{helperText}</Text>
        ) : (
          <View className="flex-1" />
        )}

        {maxLength ? (
          <Text className="text-caption text-text-tertiary">
            {currentLength}/{maxLength}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
