import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckCircle2, ShieldAlert } from "lucide-react-native";
import {
  BackHeader,
  Button,
  ConfirmPair,
  StickyActionBar,
  TextArea,
  ToastBanner,
} from "@/components";
import { confirmOrderReceipt, disputeOrder } from "@/lib/api";
import { alertDialog } from "@/lib/dialogs";
import { colors } from "@/theme/colors";

export default function ConfirmReceiptScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ orderId: string }>();

  const [confirming, setConfirming] = useState(false);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputing, setDisputing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async () => {
    try {
      setConfirming(true);
      await confirmOrderReceipt(params.orderId);

      await alertDialog({
        title: "Order Completed",
        message: "Thank you! Funds have been released to the seller.",
        buttonText: "OK",
      });
      router.replace(`/orders/detail?id=${params.orderId}`);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to confirm order receipt.");
    } finally {
      setConfirming(false);
    }
  };

  const handleDisputeSubmit = async () => {
    if (!disputeReason.trim()) {
      setErrorMessage("Please describe the problem with the item.");
      return;
    }

    try {
      setDisputing(true);
      await disputeOrder(params.orderId, disputeReason.trim());

      await alertDialog({
        title: "Problem Reported",
        message:
          "Your report has been submitted. Our support team is reviewing the transaction and funds remain securely on hold.",
        buttonText: "View Order",
      });
      router.replace(`/orders/detail?id=${params.orderId}`);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to submit dispute.");
    } finally {
      setDisputing(false);
    }
  };

  return (
    <View className="flex-1 bg-surface-base">
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="px-1">
        <BackHeader onBack={() => router.back()} title="Inspection & Confirmation" />
      </View>

      <ScrollView className="flex-1 px-3 pt-2">
        <Text className="font-manrope-semibold text-h1 text-text-primary">
          Check Your Item
        </Text>
        <Text className="mt-0.5 font-manrope text-body text-text-secondary">
          Inspect the item carefully with the seller before making a final decision.
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

        {/* Informational Guidance */}
        <View className="mt-4 rounded-md border border-neutral-200 bg-surface-elevated p-2">
          <View className="flex-row items-center mb-1">
            <CheckCircle2 size={18} color={colors.success} />
            <Text className="ml-1 font-manrope-medium text-body text-text-primary">
              Everything matches description?
            </Text>
          </View>
          <Text className="font-manrope text-small text-text-secondary">
            {'Tap "Everything\'s good" to complete the order and release payment to the seller.'}
          </Text>
        </View>

        <View className="mt-2 rounded-md border border-neutral-200 bg-surface-elevated p-2">
          <View className="flex-row items-center mb-1">
            <ShieldAlert size={18} color={colors.error} />
            <Text className="ml-1 font-manrope-medium text-body text-text-primary">
              Something wrong with the item?
            </Text>
          </View>
          <Text className="font-manrope text-small text-text-secondary">
            {'Tap "Report a problem" to place funds on hold while support reviews.'}
          </Text>
        </View>

        {showDisputeForm ? (
          <View className="mt-4">
            <TextArea
              label="Describe the issue"
              placeholder="e.g. Broken screen, missing components, wrong model..."
              value={disputeReason}
              onChangeText={setDisputeReason}
            />
            <View className="mt-2">
              <Button
                label="Submit Problem Report"
                onPress={handleDisputeSubmit}
                loading={disputing}
                variant="destructive"
              />
            </View>
          </View>
        ) : null}
      </ScrollView>

      {!showDisputeForm ? (
        <StickyActionBar>
          <ConfirmPair
            onConfirm={handleConfirm}
            onReportProblem={() => setShowDisputeForm(true)}
            confirmLoading={confirming}
          />
        </StickyActionBar>
      ) : null}
    </View>
  );
}
