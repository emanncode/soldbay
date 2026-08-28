import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, LogoWordmark, TextField, ToastBanner } from "@/components";
import { getMe, login, saveToken } from "@/lib/api";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMessage(null);
    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your student email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await login({
        email: email.trim().toLowerCase(),
        password,
      });

      await saveToken(res.token);
      const user = await getMe();

      if (!user.universityId) {
        router.replace("/select-university");
        return;
      }

      if (user.role === "SELLER") {
        router.replace("/seller/dashboard");
      } else {
        router.replace("/buyer/home");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-surface-base"
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: Math.max(insets.top + 24, 48),
          paddingBottom: Math.max(insets.bottom + 24, 32),
        }}
        className="flex-1 px-3"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-4">
          <LogoWordmark size="md" />
          <Text className="mt-3 font-manrope-semibold text-h1 text-text-primary">
            Welcome back
          </Text>
          <Text className="mt-0.5 font-manrope text-body text-text-secondary">
            Sign in to your campus account
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

          <View>
            <TextField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              isPassword
            />
            <Pressable
              onPress={() => router.push("/forgot-password")}
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
              className="self-end pt-1"
              hitSlop={8}
            >
              <Text className="font-manrope-medium text-small text-accent">
                Forgot password?
              </Text>
            </Pressable>
          </View>

          <View className="mt-2">
            <Button
              label="Sign In"
              onPress={handleLogin}
              loading={loading}
              variant="primary"
            />
          </View>
        </View>

        <View className="mt-6 flex-row items-center justify-center">
          <Text className="font-manrope text-body text-text-secondary">
            Don't have an account?{" "}
          </Text>
          <Pressable
            onPress={() => router.push("/select-role")}
            accessibilityRole="button"
            accessibilityLabel="Sign up"
            hitSlop={8}
          >
            <Text className="font-manrope-medium text-body text-accent">
              Sign up
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
