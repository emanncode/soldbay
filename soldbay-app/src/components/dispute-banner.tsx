import { Text, View } from "react-native";
import { AlertCircle } from "lucide-react-native";
import { colors } from "../theme/colors";

export interface DisputeBannerProps {
  title?: string;
  description?: string;
  className?: string;
}

/**
 * SOLDBAY DISPUTE BANNER
 *
 * Rules from DESIGN.md:
 * - Escrow disputes are a red banner override during active review.
 * - Error-tint background (#FEE2E2), error text (#DC2626), 10px radius (`rounded-md`).
 * - Icon: Lucide AlertCircle.
 */
export function DisputeBanner({
  title = "Problem reported · Under review",
  description = "Funds are on hold while support reviews this order.",
  className = "",
}: DisputeBannerProps) {
  return (
    <View
      className={`w-full flex-row rounded-md border border-error bg-error-tint p-1.5 ${className}`}
    >
      <View className="mr-1 mt-0.5">
        <AlertCircle size={20} color={colors.error} />
      </View>

      <View className="flex-1">
        <Text className="font-manrope-medium text-body-medium text-error">
          {title}
        </Text>
        {description ? (
          <Text className="mt-0.5 text-small text-error opacity-90">
            {description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
