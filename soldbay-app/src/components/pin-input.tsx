import { useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";
import { colors } from "../theme/colors";

export interface PINInputProps {
  length?: number;
  value: string;
  onChangePIN: (pin: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * SOLDBAY PIN INPUT
 *
 * 4 separate input boxes for entering in-person handoff PIN code.
 * - Forces numeric keypad (`keyboardType="number-pad"`).
 * - Focused box has 2px accent ring.
 * - 6px radius (`rounded-sm`).
 */
export function PINInput({
  length = 4,
  value,
  onChangePIN,
  error,
  disabled = false,
  className = "",
}: PINInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputsRef = useRef<(TextInput | null)[]>([]);

  const digits = Array.from({ length }, (_, i) => value[i] || "");

  const handleDigitChange = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, "");
    if (!cleanText) return;

    const char = cleanText[cleanText.length - 1];
    const newChars = value.split("");
    newChars[index] = char;
    const newPin = newChars.join("").slice(0, length);
    onChangePIN(newPin);

    // Auto-focus next box
    if (index < length - 1 && char) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
        const newChars = value.split("");
        newChars[index - 1] = "";
        onChangePIN(newChars.join(""));
      } else {
        const newChars = value.split("");
        newChars[index] = "";
        onChangePIN(newChars.join(""));
      }
    }
  };

  return (
    <View className={`w-full items-center ${className}`}>
      <View className="flex-row items-center justify-center gap-1.5">
        {digits.map((digit, index) => {
          const isFocused = focusedIndex === index;
          const isFilled = Boolean(digit);
          const hasError = Boolean(error);

          const borderClass = hasError
            ? "border border-error"
            : isFocused
              ? "border-2 border-accent"
              : isFilled
                ? "border border-neutral-400"
                : "border border-neutral-300";

          return (
            <Pressable
              key={index}
              onPress={() => inputsRef.current[index]?.focus()}
              className={`h-7 w-6 items-center justify-center rounded-sm bg-surface-elevated ${borderClass}`}
            >
              <TextInput
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                value={digit}
                onChangeText={(text) => handleDigitChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={2}
                editable={!disabled}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                className="w-full text-center font-manrope-semibold text-h1 text-text-primary"
                selectionColor={colors.accent}
                selectTextOnFocus
              />
            </Pressable>
          );
        })}
      </View>

      {error ? (
        <Text className="mt-1 text-center text-small text-error">{error}</Text>
      ) : null}
    </View>
  );
}
