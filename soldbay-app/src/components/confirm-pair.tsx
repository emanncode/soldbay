import { View } from "react-native";
import { Button } from "./button";

export interface ConfirmPairProps {
  onConfirm: () => void;
  onReportProblem: () => void;
  confirmLoading?: boolean;
  reportLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * SOLDBAY CONFIRM PAIR
 *
 * Rules from DESIGN.md:
 * - "Everything's good" / "Report a problem" must have EQUAL VISUAL WEIGHT.
 * - Neither button is Primary (teal).
 * - Both are secondary so the interface never biases a fairness-critical decision.
 */
export function ConfirmPair({
  onConfirm,
  onReportProblem,
  confirmLoading = false,
  reportLoading = false,
  disabled = false,
  className = "",
}: ConfirmPairProps) {
  return (
    <View className={`w-full flex-col gap-1.5 ${className}`}>
      <Button
        label="Everything's good"
        variant="secondary"
        onPress={onConfirm}
        loading={confirmLoading}
        disabled={disabled || reportLoading}
      />
      <Button
        label="Report a problem"
        variant="secondary"
        onPress={onReportProblem}
        loading={reportLoading}
        disabled={disabled || confirmLoading}
      />
    </View>
  );
}
