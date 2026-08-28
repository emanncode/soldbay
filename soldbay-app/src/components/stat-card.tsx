import { Text, View } from "react-native";
import { elevation } from "../theme/elevation";

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  className?: string;
}

/**
 * SOLDBAY STAT CARD
 *
 * Metric card for Seller Dashboard:
 * - Level 1 elevation, 10px radius (`rounded-md`).
 * - Caption label in text-secondary (#525252).
 * - Large number in H1 / H2 Semibold.
 */
export function StatCard({
  label,
  value,
  subtext,
  className = "",
}: StatCardProps) {
  return (
    <View
      style={elevation.card}
      className={`flex-1 rounded-md bg-surface-elevated p-2 ${className}`}
    >
      <Text className="font-manrope text-caption text-text-secondary">
        {label}
      </Text>

      <Text className="mt-0.5 font-manrope-semibold text-h2 text-text-primary">
        {value}
      </Text>

      {subtext ? (
        <Text className="mt-0.5 font-manrope text-caption text-text-tertiary">
          {subtext}
        </Text>
      ) : null}
    </View>
  );
}
