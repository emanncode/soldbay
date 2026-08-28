import { Text, View } from "react-native";

export type OrderBadgeStatus =
  | "PAYMENT_SECURED"
  | "PICKUP_ARRANGED"
  | "AWAITING_CONFIRMATION"
  | "COMPLETED"
  | "REFUNDED"
  | "DISPUTED"
  | "CANCELLED";

export interface OrderBadgeProps {
  status: OrderBadgeStatus | string;
  labelOverride?: string;
  className?: string;
}

interface BadgeConfig {
  label: string;
  bgClass: string;
  textClass: string;
}

const statusConfigs: Record<string, BadgeConfig> = {
  PAYMENT_SECURED: {
    label: "Payment secured",
    bgClass: "bg-accent-tint",
    textClass: "text-accent-hover",
  },
  PICKUP_ARRANGED: {
    label: "Pickup arranged",
    bgClass: "bg-accent-tint",
    textClass: "text-accent-hover",
  },
  AWAITING_CONFIRMATION: {
    label: "Awaiting your confirmation",
    bgClass: "bg-warning-tint",
    textClass: "text-text-secondary",
  },
  COMPLETED: {
    label: "Completed",
    bgClass: "bg-success-tint",
    textClass: "text-success",
  },
  REFUNDED: {
    label: "Refunded",
    bgClass: "bg-neutral-100",
    textClass: "text-text-secondary",
  },
  DISPUTED: {
    label: "Under review",
    bgClass: "bg-error-tint",
    textClass: "text-error",
  },
  CANCELLED: {
    label: "Cancelled",
    bgClass: "bg-neutral-100",
    textClass: "text-text-tertiary",
  },
};

/**
 * SOLDBAY ORDER BADGE
 *
 * Rules from DESIGN.md:
 * - Pickup arranged → accent-tint (#CCFBF1) / accentHover (#0F766E)
 * - Awaiting your confirmation → warning-tint (#FEF3C7) / text-secondary (#525252)
 * - Completed → success-tint (#DCFCE7) / success (#16A34A)
 * - Refunded → neutral-100 (#F5F5F5) / text-secondary (#525252)
 */
export function OrderBadge({
  status,
  labelOverride,
  className = "",
}: OrderBadgeProps) {
  const config =
    statusConfigs[status] || {
      label: status,
      bgClass: "bg-neutral-100",
      textClass: "text-text-secondary",
    };

  return (
    <View
      className={`self-start rounded-full px-1.5 py-0.5 ${config.bgClass} ${className}`}
    >
      <Text className={`font-manrope-medium text-caption ${config.textClass}`}>
        {labelOverride || config.label}
      </Text>
    </View>
  );
}
