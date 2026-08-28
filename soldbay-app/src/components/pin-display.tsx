import { Text, View } from "react-native";

export interface PINDisplayProps {
  pin: string;
  subtitle?: string;
  className?: string;
}

/**
 * SOLDBAY PIN DISPLAY
 *
 * Displays the 4-digit in-person handoff PIN on the seller's device.
 * - Large spaced digits in Display font (32px Semibold).
 * - Clean surface container with subtle border.
 */
export function PINDisplay({
  pin,
  subtitle = "Show this 4-digit code to buyer at pickup",
  className = "",
}: PINDisplayProps) {
  const formattedPin = pin.split("").join("  ");

  return (
    <View
      className={`w-full items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 p-3 ${className}`}
    >
      <Text className="font-manrope-semibold text-display tracking-widest text-text-primary">
        {formattedPin}
      </Text>
      {subtitle ? (
        <Text className="mt-1 text-center text-small text-text-secondary">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
