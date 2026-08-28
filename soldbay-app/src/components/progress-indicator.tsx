import { Text, View } from "react-native";

export interface ProgressIndicatorProps {
  currentStep: number; // 1-indexed (e.g. 1 to 4)
  totalSteps?: number;
  showLabel?: boolean;
  className?: string;
}

/**
 * SOLDBAY PROGRESS INDICATOR
 *
 * 4-step listing creation progress bar with accent teal fill.
 */
export function ProgressIndicator({
  currentStep,
  totalSteps = 4,
  showLabel = true,
  className = "",
}: ProgressIndicatorProps) {
  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <View className={`w-full ${className}`}>
      {showLabel ? (
        <View className="mb-1 flex-row items-center justify-between">
          <Text className="font-manrope-medium text-small text-text-secondary">
            Step {currentStep} of {totalSteps}
          </Text>
        </View>
      ) : null}

      <View className="h-1 w-full overflow-hidden rounded-full bg-neutral-200">
        <View
          className="h-full rounded-full bg-accent"
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}
