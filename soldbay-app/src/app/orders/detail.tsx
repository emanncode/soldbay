import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MapPin } from "lucide-react-native";
import {
  BackHeader,
  Button,
  DisputeBanner,
  Divider,
  EscrowStepper,
  type EscrowStep,
  OrderBadge,
  PINDisplay,
  StickyActionBar,
} from "@/components";
import {
  getOrderDetail,
  revealOrderPin,
  type OrderDetailResponse,
} from "@/lib/api";
import { alertDialog } from "@/lib/dialogs";
import { goBackSafe } from "@/lib/navigation";
import { colors } from "@/theme/colors";

export default function OrderDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();

  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [pinRevealed, setPinRevealed] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [pinExpiresAt, setPinExpiresAt] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      if (!params.id) return;
      try {
        setLoading(true);
        const data = await getOrderDetail(params.id);
        setOrder(data);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [params.id]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSecondsLeft(null);
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const handleRevealPin = async () => {
    if (!order || revealing) return;
    setRevealing(true);
    try {
      const res = await revealOrderPin(order.id);
      setPinRevealed(true);
      setPinExpiresAt(res.pinExpiresAt);
      setSecondsLeft(res.expiresInSeconds);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === null || prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      await alertDialog({
        title: "Couldn't show code",
        message: err?.message || "Please try again.",
      });
    } finally {
      setRevealing(false);
    }
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-base">
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-base px-3">
        <Text className="font-manrope-semibold text-h2 text-text-primary">
          Order not found
        </Text>
        <Button
          label="Back to Orders"
          onPress={() => router.replace("/orders")}
          variant="secondary"
          className="mt-3"
        />
      </View>
    );
  }

  const formattedAmount = `₦${Number(order.amount).toLocaleString()}`;

  // Calculate stepper index (1: Payment secured, 2: Pickup verified, 3: Completed)
  let currentStep = 1;
  let stepperSteps: EscrowStep[] | undefined;
  let stepperTone: "accent" | "error" = "accent";
  if (order.status === "AWAITING_CONFIRMATION") currentStep = 2;
  if (order.status === "COMPLETED") currentStep = 3;
  if (order.status === "REFUNDED") {
    // Refunded is a terminal escrow state. Funds were returned to the buyer,
    // NOT released to the seller — show an accurate "Refund issued" end step
    // instead of the misleading "Funds released".
    currentStep = 3;
    stepperSteps = [
      {
        label: "Payment secured",
        subtitle: "Money held in escrow",
      },
      {
        label: "Pickup verified",
        subtitle: "4-digit PIN confirmed",
      },
      {
        label: "Refund issued",
        subtitle: "Amount returned to buyer",
      },
    ];
  }
  if (order.status === "DISPUTED") {
    // Disputes arise after pickup verification, during buyer inspection. Show
    // the two completed milestones plus a red terminal "Dispute in review" step.
    currentStep = 3;
    stepperSteps = [
      {
        label: "Payment secured",
        subtitle: "Money held in escrow",
      },
      {
        label: "Pickup verified",
        subtitle: "4-digit PIN confirmed",
      },
      {
        label: "Dispute in review",
        subtitle: "Support is investigating",
      },
    ];
    stepperTone = "error";
  }

  return (
    <View className="flex-1 bg-surface-base">
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="px-1 border-b border-border bg-surface-elevated">
        <BackHeader onBack={() => goBackSafe(router, "/orders")} title={order.orderNumber} />
      </View>

      <ScrollView className="flex-1 px-3 pt-3" showsVerticalScrollIndicator={false}>
        {/* Status Badge & Header */}
        <View className="flex-row items-center justify-between">
          <Text className="font-manrope-semibold text-h1 text-text-primary">
            {formattedAmount}
          </Text>
          <OrderBadge status={order.status} />
        </View>

        {/* Dispute Banner if Disputed */}
        {order.status === "DISPUTED" ? (
          <View className="mt-3">
            <DisputeBanner
              title="Dispute Under Review"
              description={order.dispute?.reason || "Support is investigating this order."}
            />
          </View>
        ) : null}

        {/* Item Summary Card */}
        <View className="mt-3 flex-row rounded-md border border-neutral-200 bg-surface-elevated p-2">
          <View className="h-7 w-7 overflow-hidden rounded-sm bg-neutral-100 mr-2">
            {order.images[0] ? (
              <Image source={{ uri: order.images[0] }} className="h-full w-full" contentFit="cover" transition={200} />
            ) : null}
          </View>
          <View className="flex-1 justify-center">
            <Text numberOfLines={1} className="font-manrope-medium text-body text-text-primary">
              {order.title}
            </Text>
            <Text className="font-manrope text-caption text-text-tertiary">
              Seller: @{order.sellerUsername}
            </Text>
          </View>
        </View>

        {/* Campus Pickup Spot */}
        {order.pickupLocation ? (
          <View className="mt-3 flex-row items-center rounded-md border border-neutral-200 bg-surface-elevated p-2">
            <MapPin size={20} color={colors.accent} />
            <View className="ml-2 flex-1">
              <Text className="font-manrope-medium text-small text-text-primary">
                Pickup Meeting Location
              </Text>
              <Text className="font-manrope text-caption text-text-secondary">
                {order.pickupLocation}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Seller In-Person PIN Display (Security: shown only on seller device) */}
        {order.isSeller &&
        order.sellerPin &&
        (order.status === "PAYMENT_SECURED" || order.status === "PICKUP_ARRANGED") ? (
          <View className="mt-4">
            {pinRevealed ? (
              <>
                <PINDisplay
                  pin={order.sellerPin}
                  subtitle="Show this 4-digit code to the buyer during in-person pickup"
                />
                <View className="mt-2 flex-row items-center justify-between">
                  <Text className="font-manrope text-caption text-text-tertiary">
                    {secondsLeft != null && secondsLeft > 0
                      ? `Code expires in ${formatCountdown(secondsLeft)}`
                      : "Code expired — tap below to show a fresh one"}
                  </Text>
                  <Button
                    label={secondsLeft != null && secondsLeft > 0 ? "Show Again" : "Show Code"}
                    onPress={handleRevealPin}
                    loading={revealing}
                    variant="secondary"
                  />
                </View>
              </>
            ) : (
              <View className="w-full items-center rounded-md border border-neutral-200 bg-surface-elevated p-3">
                <Text className="text-center font-manrope-medium text-small text-text-primary">
                  The pickup PIN is hidden until you are about to hand over the product.
                </Text>
                <Button
                  label="Show Code"
                  onPress={handleRevealPin}
                  loading={revealing}
                  variant="primary"
                  className="mt-3 w-full"
                />
              </View>
            )}
          </View>
        ) : null}

        <Divider className="my-4" />

        {/* Escrow Stepper */}
        <Text className="font-manrope-semibold text-h2 text-text-primary mb-2">
          Escrow Timeline
        </Text>
        <EscrowStepper
          currentStep={currentStep}
          steps={stepperSteps}
          tone={stepperTone}
        />
      </ScrollView>

      {/* Buyer Action Button: Enter PIN when meeting seller */}
      {order.isBuyer && (order.status === "PAYMENT_SECURED" || order.status === "PICKUP_ARRANGED") ? (
        <StickyActionBar>
          <Button
            label="Enter Seller's Pickup PIN"
            onPress={() => router.push(`/handoff/enter-pin?orderId=${order.id}`)}
            variant="primary"
          />
        </StickyActionBar>
      ) : order.isBuyer && order.status === "AWAITING_CONFIRMATION" ? (
        <StickyActionBar>
          <Button
            label="Inspect & Confirm Receipt"
            onPress={() => router.push(`/handoff/confirm-receipt?orderId=${order.id}`)}
            variant="primary"
          />
        </StickyActionBar>
      ) : null}
    </View>
  );
}
