import { useState, type ReactNode } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { colors } from "../theme/colors";

export interface TextFieldProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isPassword?: boolean;
  className?: string;
}

/**
 * SOLDBAY TEXT FIELD
 *
 * Rules from DESIGN.md:
 * - Fixed 48px height (h-6 in 8pt scale / 48px), 6px radius (`rounded-sm`).
 * - 1px neutral-300 border resting, 2px accent ring on focus.
 * - Label sits ABOVE the field in Medium weight (#171717) — never floating.
 * - Errors are 1px red border + Small red text below the field.
 * - Minimum touch target 48x48.
 */
export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  leftIcon,
  rightIcon,
  isPassword = false,
  keyboardType = "default",
  autoCapitalize = "none",
  editable = true,
  className = "",
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = Boolean(error);

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
        className={`h-6 flex-row items-center rounded-sm px-1.5 ${bgClass} ${borderClass}`}
      >
        {leftIcon ? (
          <View className="mr-1 items-center justify-center">{leftIcon}</View>
        ) : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral400}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="h-full flex-1 font-manrope text-body text-text-primary"
          style={{ paddingVertical: 0 }}
          selectionColor={colors.accent}
          {...rest}
        />

        {isPassword ? (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            className="ml-1 h-6 w-6 items-center justify-center"
            hitSlop={8}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.neutral500} />
            ) : (
              <Eye size={20} color={colors.neutral500} />
            )}
          </Pressable>
        ) : rightIcon ? (
          <View className="ml-1 items-center justify-center">{rightIcon}</View>
        ) : null}
      </View>

      {hasError ? (
        <Text className="mt-0.5 text-small text-error">{error}</Text>
      ) : helperText ? (
        <Text className="mt-0.5 text-small text-text-tertiary">{helperText}</Text>
      ) : null}
    </View>
  );
}
