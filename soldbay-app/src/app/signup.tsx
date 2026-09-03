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
import { BackHeader, Button, TextField, ToastBanner } from "@/components";
import { login, saveToken, signup } from "@/lib/api";
import { goBackSafe } from "@/lib/navigation";

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ role?: string }>();
  const role = (params.role === "SELLER" ? "SELLER" : "BUYER") as
    "BUYER" | "SELLER";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignup = async () => {
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid student email address.");
      return;
    }
    if (!password || password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);
      await signup({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        businessName: businessName.trim() || undefined,
      });

      // Auto-login to obtain session token
      const loginRes = await login({
        email: email.trim().toLowerCase(),
        password,
      });

      await saveToken(loginRes.token);
      router.replace("/select-university");
    } catch (err: any) {
      setErrorMessage(err?.message || "Registration failed. Please try again.");
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
          justifyContent: "center",
        }}
        className="flex-1 px-3"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-4">
          <Text className="font-manrope-semibold text-h1 text-text-primary">
            Create Account
          </Text>
          <Text className="mt-0.5 font-manrope text-body text-text-secondary">
            Signing up as a{" "}
            {role === "SELLER" ? "Campus Seller" : "Student Buyer"}
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
            label="Full Name"
            placeholder="e.g. Ada Lovelace"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <TextField
            label="Student Email"
            placeholder="e.g. yourname@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            helperText="Used to sign in and receive order updates"
          />

          <TextField
            label="Password"
            placeholder="Create a strong password"
            value={password}
            onChangeText={setPassword}
            isPassword
            helperText="At least 8 characters"
          />

          {role === "SELLER" ? (
            <TextField
              label="Shop Name (Optional)"
              placeholder="e.g. Campus Tech & Books"
              value={businessName}
              onChangeText={setBusinessName}
              autoCapitalize="words"
            />
          ) : null}

          <View className="mt-2">
            <Button
              label="Create Account"
              onPress={handleSignup}
              loading={loading}
              variant="primary"
            />
          </View>
        </View>

        <View className="mt-6 flex-row items-center justify-center">
          <Text className="font-manrope text-body text-text-secondary">
            Already have an account?{" "}
          </Text>
          <Pressable
            onPress={() => router.push("/login")}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            hitSlop={8}
          >
            <Text className="font-manrope-medium text-body text-accent">
              Sign in
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
