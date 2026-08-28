import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader, Button, PINInput, ToastBanner } from "@/components";
import { forgotPassword, verifyOtp } from "@/lib/api";

export default function EnterCodeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ email?: string; devOtp?: string }>();
  const email = params.email || "";

  const [code, setCode] = useState(params.devOtp || "");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    params.devOtp ? `Test Code: ${params.devOtp}` : null
  );

  const handleVerify = async () => {
    setErrorMessage(null);
    if (!code || code.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);
      await verifyOtp(email, code);

      router.push({
        pathname: "/forgot-password/new-password",
        params: { email, otp: code },
      });
    } catch (err: any) {
      setErrorMessage(err?.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      const res = await forgotPassword(email);
      if (res.devOtp) {
        setCode(res.devOtp);
        setSuccessMessage(`New code sent: ${res.devOtp}`);
      } else {
        setSuccessMessage("A new verification code was sent to your email.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-surface-base"
    >
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="px-1">
        <BackHeader onBack={() => router.back()} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom + 24, 32),
        }}
        className="flex-1 px-3"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-4">
          <Text className="font-manrope-semibold text-h1 text-text-primary">
            Enter Verification Code
          </Text>
          <Text className="mt-0.5 font-manrope text-body text-text-secondary">
            We sent a 6-digit code to {email || "your email"}.
          </Text>
        </View>

        {errorMessage ? (
          <View className="mb-2">
            <ToastBanner
              visible={Boolean(errorMessage)}
              message={errorMessage}
              type="error"
              onDismiss={() => setErrorMessage(null)}
            />
          </View>
        ) : null}

        {successMessage ? (
          <View className="mb-2">
            <ToastBanner
              visible={Boolean(successMessage)}
              message={successMessage}
              type="success"
              onDismiss={() => setSuccessMessage(null)}
            />
          </View>
        ) : null}

        <View className="my-3 items-center">
          <PINInput
            length={6}
            value={code}
            onChangePIN={setCode}
            error={errorMessage ? " " : undefined}
          />
        </View>

        <View className="mt-2">
          <Button
            label="Verify Code"
            onPress={handleVerify}
            loading={loading}
            disabled={code.length !== 6}
            variant="primary"
          />
        </View>

        <View className="mt-4 flex-row items-center justify-center">
          <Text className="font-manrope text-body text-text-secondary">
            Didn't receive the code?{" "}
          </Text>
          <Pressable
            onPress={handleResend}
            disabled={resending}
            accessibilityRole="button"
            accessibilityLabel="Resend code"
            hitSlop={8}
          >
            <Text className="font-manrope-medium text-body text-accent">
              {resending ? "Sending..." : "Resend"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
