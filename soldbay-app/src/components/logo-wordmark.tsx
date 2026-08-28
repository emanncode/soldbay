import { Text, View } from "react-native";

export interface LogoWordmarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * SOLDBAY LOGO WORDMARK
 *
 * Rules from DESIGN.md:
 * - Plain styled text wordmark: "Soldbay".
 * - Manrope Semibold (600), accent teal (#0D9488).
 * - No icon, no gradient, no decoration.
 */
export function LogoWordmark({ size = "md", className = "" }: LogoWordmarkProps) {
  const sizeClass =
    size === "lg"
      ? "text-display"
      : size === "sm"
        ? "text-h2"
        : "text-h1";

  return (
    <View className={`flex-row items-center ${className}`}>
      <Text className={`font-manrope-semibold tracking-tight text-accent ${sizeClass}`}>
        Soldbay
      </Text>
    </View>
  );
}
