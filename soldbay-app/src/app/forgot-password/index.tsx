import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { GlassPanel } from "@/components/glass-panel";
import { LogoWordmark } from "@/components/logo-wordmark";
import { GlassFormField } from "@/components/glass-form-field";
import { PrimaryButton } from "@/components/primary-button";

import { Ionicons } from "@expo/vector-icons";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return false;
    }
    setError(undefined);
    return true;
  }

  async function handleSendCode() {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    router.push(
      `/forgot-password/code-sent?email=${encodeURIComponent(email)}`,
    );
  }

  return (
    <PageAtmosphere>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingHorizontal: 24,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
                alignSelf: "flex-start",
              }}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color="rgba(255,255,255,0.6)"
              />
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                Back
              </Text>
            </TouchableOpacity>

            <View style={{ alignItems: "center", paddingBottom: 24 }}>
              <LogoWordmark height={78} />
            </View>

            <GlassPanel variant="panel" style={{ borderRadius: 24 }}>
              <View style={{ padding: 28, gap: 20 }}>
                <Text
                  style={{
                    fontFamily: "BricolageGrotesque-SemiBold",
                    fontSize: 32,
                    color: "#ffffff",
                  }}
                >
                  Forgot password
                </Text>

                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    fontSize: 13,
                    color: "#ffffff99",
                    lineHeight: 18,
                  }}
                >
                  Enter your email address and we'll send you a code to reset
                  your password.
                </Text>

                <GlassFormField
                  label="Email"
                  placeholder="name@university.edu"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    setError(undefined);
                  }}
                  error={error}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <PrimaryButton
                  label="Send Reset Code"
                  loading={loading}
                  onPress={handleSendCode}
                />
              </View>
            </GlassPanel>

            <View
              style={{ paddingVertical: 24, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 4 }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 14,
                  color: "#ffffff80",
                }}
              >
                Remember your password?
              </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text
                  style={{
                    fontFamily: "Inter-SemiBold",
                    fontSize: 14,
                    color: "#ffffffcc",
                  }}
                >
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PageAtmosphere>
  );
}
