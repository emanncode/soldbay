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
import { BackHeader, Button, PINInput, ToastBanner } from "@/components";
import { verifyOrderPin } from "@/lib/api";

export default function EnterPinScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ orderId: string }>();

  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVerify = async () => {
    setErrorMessage(null);
    if (!pin || pin.length !== 4) {
      setErrorMessage("Please enter the 4-digit PIN.");
      return;
    }

    try {
      setLoading(true);
      await verifyOrderPin(params.orderId, pin);

      router.replace({
        pathname: "/handoff/confirm-receipt",
        params: { orderId: params.orderId },
      });
    } catch (err: any) {
      setErrorMessage(err?.message || "Incorrect PIN code. Ask the seller to show their code.");
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
        <BackHeader onBack={() => router.back()} title="Enter Pickup PIN" />
      </View>

      <ScrollView className="flex-1 px-3 pt-2" keyboardShouldPersistTaps="handled">
        <Text className="font-manrope-semibold text-h1 text-text-primary">
          Verify Campus Handoff
        </Text>
        <Text className="mt-0.5 font-manrope text-body text-text-secondary">
          Ask the seller to open their Soldbay app and show you their 4-digit confirmation PIN.
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

        <View className="my-6 items-center">
          <PINInput
            length={4}
            value={pin}
            onChangePIN={setPin}
          />
        </View>

        <Button
          label="Verify Pickup"
          onPress={handleVerify}
          loading={loading}
          disabled={pin.length !== 4}
          variant="primary"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
