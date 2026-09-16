import { Text, View } from "react-native";

export interface SoldStampProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * SOLDBAY CUSTOM SOLD / UNAVAILABLE STAMP
 *
 * Source: design/design.pen (ID: oAzqV / j2Uor) & docs/soldbay-design-system.md (Sections 6 & 13)
 * Tilted administrative stamp with Border background and deep Olive bold text.
 * Strictly distinct from alarm-red error states.
 */
export function SoldStamp({
  label = "SOLD",
  size = "md",
  className = "",
}: SoldStampProps) {
  const containerSize = {
    sm: "px-2 py-0.5 rounded",
    md: "px-3 py-1 rounded-sm",
    lg: "px-4 py-1.5 rounded-md",
  }[size];

  const textStyle = {
    sm: "text-[10px] font-manrope-semibold tracking-wider",
    md: "text-caption font-manrope-semibold tracking-widest",
    lg: "text-body font-manrope-semibold tracking-widest",
  }[size];

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={label}
      style={{ transform: [{ rotate: "-4deg" }] }}
      className={`border border-border bg-border/95 items-center justify-center shadow-sm ${containerSize} ${className}`}
    >
      <Text className={`text-text-primary uppercase ${textStyle}`}>{label}</Text>
    </View>
  );
}
