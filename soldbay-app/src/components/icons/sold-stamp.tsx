import { Text, View } from "react-native";

export interface SoldStampProps {
  label?: string;
  className?: string;
}

/**
 * SOLDBAY CUSTOM SOLD / UNAVAILABLE STAMP
 *
 * Source: design/design.pen (ID: oAzqV / i0Un3E) & docs/soldbay-design-system.md (Sections 6 & 13)
 * Full-width horizontal administrative bar across the top of product photo.
 * Straight bar with Border fill ($border), height 32px, cornerRadius 4px,
 * and bold text ($text-primary, Sora 13px, weight 600).
 */
export function SoldStamp({
  label = "SOLD",
  className = "",
}: SoldStampProps) {
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={label}
      className={`w-full h-8 bg-border rounded items-center justify-center ${className}`}
    >
      <Text className="font-sora-semibold text-[13px] text-text-primary tracking-widest uppercase">
        {label}
      </Text>
    </View>
  );
}
