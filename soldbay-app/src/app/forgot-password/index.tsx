import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader, Button, TextField, ToastBanner } from "@/components";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendCode = async () => {
    setErrorMessage(null);
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid student email.");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email.trim().toLowerCase());

      router.push({
        pathname: "/forgot-password/enter-code",
        params: {
          email: email.trim().toLowerCase(),
          devOtp: res.devOtp || "",
        },
      });
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to send reset code. Please try again.");
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
            Reset Password
          </Text>
          <Text className="mt-0.5 font-manrope text-body text-text-secondary">
            Enter your student email and we'll send you a 6-digit verification code.
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

        <View className="gap-2">
          <TextField
            label="Student Email"
            placeholder="student@university.edu.ng"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View className="mt-2">
            <Button
              label="Send Reset Code"
              onPress={handleSendCode}
              loading={loading}
              variant="primary"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
