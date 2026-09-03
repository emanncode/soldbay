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
import { BackHeader, Button, TextField, ToastBanner } from "@/components";
import { resetPassword } from "@/lib/api";
import { goBackSafe } from "@/lib/navigation";

export default function NewPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ email?: string; otp?: string }>();
  const email = params.email || "";
  const otp = params.otp || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdatePassword = async () => {
    setErrorMessage(null);

    if (!newPassword || newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword({
        email,
        otp,
        newPassword,
      });

      router.replace("/forgot-password/success");
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to update password. Please try again.");
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
        <BackHeader onBack={() => goBackSafe(router, "/login")} />
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
            Set New Password
          </Text>
          <Text className="mt-0.5 font-manrope text-body text-text-secondary">
            Must be at least 8 characters long.
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
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            isPassword
            helperText="At least 8 characters"
          />

          <TextField
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
          />

          <View className="mt-2">
            <Button
              label="Update Password"
              onPress={handleUpdatePassword}
              loading={loading}
              variant="primary"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
