import { Text, View } from "react-native";
import { Check } from "lucide-react-native";
import { colors } from "../theme/colors";

export interface EscrowStep {
  label: string;
  subtitle?: string;
}

export interface EscrowStepperProps {
  currentStep: number; // 1-indexed (1, 2, 3)
  steps?: EscrowStep[];
  className?: string;
}

const defaultSteps: EscrowStep[] = [
  { label: "Payment secured", subtitle: "Money held in escrow" },
  { label: "Pickup verified", subtitle: "4-digit PIN confirmed" },
  { label: "Funds released", subtitle: "Paid out to seller" },
];

/**
 * SOLDBAY ESCROW STEPPER
 *
 * Rules from DESIGN.md:
 * - Always carries an explicit text label. Never color-only or icon-only.
 * - Visualizes escrow milestone progression clearly.
 */
export function EscrowStepper({
  currentStep = 1,
  steps = defaultSteps,
  className = "",
}: EscrowStepperProps) {
  return (
    <View className={`w-full ${className}`}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isLast = index === steps.length - 1;

        const circleBg = isCompleted
          ? "bg-accent"
          : isCurrent
            ? "border-2 border-accent bg-accent-tint"
            : "border border-neutral-300 bg-neutral-100";

        const textClass = isCompleted || isCurrent
          ? "text-text-primary font-manrope-medium"
          : "text-text-tertiary font-manrope";

        const lineBg = isCompleted ? "bg-accent" : "bg-neutral-200";

        return (
          <View key={index} className="flex-row items-start">
            <View className="items-center">
              <View
                className={`h-3 w-3 items-center justify-center rounded-full ${circleBg}`}
              >
                {isCompleted ? (
                  <Check size={14} color={colors.textInverse} strokeWidth={2.5} />
                ) : (
                  <Text
                    className={`text-caption-medium ${
                      isCurrent ? "text-accent-hover" : "text-text-tertiary"
                    }`}
                  >
                    {stepNumber}
                  </Text>
                )}
              </View>

              {!isLast ? (
                <View className={`my-0.5 h-4 w-0.5 ${lineBg}`} />
              ) : null}
            </View>

            <View className="ml-1.5 flex-1 pb-1">
              <Text className={`text-body ${textClass}`}>{step.label}</Text>
              {step.subtitle ? (
                <Text className="mt-0.5 text-small text-text-tertiary">
                  {step.subtitle}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
