import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MapPin, ShieldCheck } from "lucide-react-native";
import {
  BackHeader,
  Button,
  Divider,
  StickyActionBar,
  TextField,
  ToastBanner,
} from "@/components";
import { checkoutOrder } from "@/lib/api";
import { colors } from "@/theme/colors";

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    listingId: string;
    title: string;
    price: string;
    universityName?: string;
  }>();

  const [pickupLocation, setPickupLocation] = useState("SUB Main Gate / Campus Quad");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const priceNum = Number(params.price) || 0;
  const formattedPrice = `₦${priceNum.toLocaleString()}`;

  const handlePay = async () => {
    setErrorMessage(null);
    if (!pickupLocation.trim()) {
      setErrorMessage("Please specify a campus pickup location.");
      return;
    }

    try {
      setLoading(true);
      const res = await checkoutOrder({
        listingId: params.listingId,
        pickupLocation: pickupLocation.trim(),
      });

      // Navigate to Order Confirmation / Success
      router.replace({
        pathname: "/buyer/checkout/success",
        params: {
          orderId: res.orderId,
          orderNumber: res.orderNumber,
          amount: String(res.amount),
        },
      });
    } catch (err: any) {
      setErrorMessage(err?.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-surface-base"
    >
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="px-1">
        <BackHeader onBack={() => router.back()} title="Checkout" />
      </View>

      <ScrollView className="flex-1 px-3 pt-2" keyboardShouldPersistTaps="handled">
        <Text className="font-manrope-semibold text-h1 text-text-primary">
          Order Summary
        </Text>

        {errorMessage ? (
          <View className="mt-2">
            <ToastBanner
              visible={Boolean(errorMessage)}
              message={errorMessage}
              type="error"
              onDismiss={() => setErrorMessage(null)}
            />
          </View>
        ) : null}

        {/* Item Summary Card */}
        <View className="mt-3 rounded-md border border-neutral-200 bg-surface-elevated p-2">
          <Text className="font-manrope-medium text-body-medium text-text-primary">
            {params.title}
          </Text>
          <Text className="mt-1 font-manrope-semibold text-h2 text-text-primary">
            {formattedPrice}
          </Text>
        </View>

        {/* Pickup Location Input */}
        <View className="mt-4">
          <Text className="font-manrope-semibold text-h2 text-text-primary mb-1">
            Campus Pickup Meeting Spot
          </Text>
          <Text className="font-manrope text-small text-text-secondary mb-2">
            Choose a safe public place on campus to meet the seller.
          </Text>

          <TextField
            label="Pickup Location"
            value={pickupLocation}
            onChangeText={setPickupLocation}
            placeholder="e.g. Library front steps, Faculty foyer"
            leftIcon={<MapPin size={20} color={colors.neutral500} />}
          />
        </View>

        {/* Escrow Guarantee */}
        <View className="mt-4 rounded-md border border-accent-tint bg-accent-tint/30 p-2 flex-row items-center">
          <ShieldCheck size={24} color={colors.accent} />
          <View className="ml-2 flex-1">
            <Text className="font-manrope-medium text-small text-accent-hover">
              Escrow Protection
            </Text>
            <Text className="font-manrope text-caption text-text-secondary">
              Your money is protected until you meet and confirm the item in person.
            </Text>
          </View>
        </View>

        <Divider className="my-4" />

        {/* Cost Breakdown */}
        <View className="gap-1 mb-6">
          <View className="flex-row justify-between">
            <Text className="text-body text-text-secondary">Item Price</Text>
            <Text className="text-body text-text-primary">{formattedPrice}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-body text-text-secondary">Campus Delivery / Pickup</Text>
            <Text className="text-body text-success">Free (In-person)</Text>
          </View>
          <Divider className="my-1" />
          <View className="flex-row justify-between">
            <Text className="font-manrope-semibold text-h2 text-text-primary">Total</Text>
            <Text className="font-manrope-semibold text-h2 text-accent">{formattedPrice}</Text>
          </View>
        </View>
      </ScrollView>

      <StickyActionBar>
        <Button
          label={`Pay ${formattedPrice}`}
          onPress={handlePay}
          loading={loading}
          variant="primary"
        />
      </StickyActionBar>
    </KeyboardAvoidingView>
  );
}
