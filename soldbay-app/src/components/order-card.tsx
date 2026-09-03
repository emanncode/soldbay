import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { OrderBadge, OrderBadgeStatus } from "./order-badge";
import { elevation } from "../theme/elevation";

export interface OrderCardProps {
  id: string;
  orderNumber: string;
  title: string;
  amount: number;
  status: OrderBadgeStatus | string;
  date?: string;
  thumbnailUrl?: string | null;
  onPress?: () => void;
  className?: string;
}

/**
 * SOLDBAY ORDER CARD
 *
 * Rules from DESIGN.md:
 * - Orders list card.
 * - 10px radius (`rounded-md`), Level 1 elevation, no border.
 * - Displays thumbnail, title, formatted price, order number, and status badge.
 */
export function OrderCard({
  orderNumber,
  title,
  amount,
  status,
  date,
  thumbnailUrl,
  onPress,
  className = "",
}: OrderCardProps) {
  const formattedAmount = `₦${amount.toLocaleString()}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Order ${orderNumber}, ${title}, ${formattedAmount}`}
      style={elevation.card}
      className={`w-full flex-row rounded-md bg-surface-elevated p-1.5 active:opacity-90 ${className}`}
    >
      <View className="h-7 w-7 overflow-hidden rounded-sm bg-neutral-100">
        {thumbnailUrl ? (
          <Image
            source={{ uri: thumbnailUrl }}
            className="h-full w-full"
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-neutral-100">
            <Text className="text-caption text-text-tertiary">Item</Text>
          </View>
        )}
      </View>

      <View className="ml-1.5 flex-1 justify-between">
        <View>
          <View className="flex-row items-center justify-between">
            <Text className="text-caption text-text-tertiary">
              {orderNumber}
            </Text>
            {date ? (
              <Text className="text-caption text-text-tertiary">{date}</Text>
            ) : null}
          </View>

          <Text
            numberOfLines={1}
            className="mt-0.5 font-manrope-medium text-body-medium text-text-primary"
          >
            {title}
          </Text>
        </View>

        <View className="mt-1 flex-row items-center justify-between">
          <Text className="font-manrope-semibold text-body-semibold text-text-primary">
            {formattedAmount}
          </Text>
          <OrderBadge status={status} />
        </View>
      </View>
    </Pressable>
  );
}
