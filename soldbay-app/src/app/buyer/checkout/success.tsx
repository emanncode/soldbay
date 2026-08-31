import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle2 } from "lucide-react-native";
import { Button, OrderBadge } from "@/components";
import { colors } from "@/theme/colors";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    orderId: string;
    orderNumber: string;
    amount: string;
  }>();

  return (
    <View className="flex-1 items-center justify-center bg-surface-base px-3">
      <View className="mb-3 h-8 w-8 items-center justify-center rounded-full bg-accent-tint">
        <CheckCircle2 size={40} color={colors.accentHover} />
      </View>

      <Text className="text-center font-manrope-semibold text-h1 text-text-primary">
        Payment Secured
      </Text>

      <Text className="mt-1 text-center font-manrope text-body text-text-secondary">
        Your order {params.orderNumber} is confirmed. Funds are held in escrow until pickup.
      </Text>

      <View className="mt-3">
        <OrderBadge status="PICKUP_ARRANGED" labelOverride="Pickup arranged" />
      </View>

      <View className="mt-6 w-full gap-2">
        <Button
          label="View Order Status"
          onPress={() => router.replace(`/orders/detail?id=${params.orderId}`)}
          variant="primary"
        />
        <Button
          label="Back to Home"
          onPress={() => router.replace("/buyer/home")}
          variant="secondary"
        />
      </View>
    </View>
  );
}
