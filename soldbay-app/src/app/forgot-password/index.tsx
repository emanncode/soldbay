import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { GlassPanel } from "@/components/glass-panel";
import { GlassFormField } from "@/components/glass-form-field";
import { PrimaryButton } from "@/components/primary-button";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [showSentModal, setShowSentModal] = useState(false);
  const [resending, setResending] = useState(false);

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
    setShowSentModal(true);
  }

  async function handleResend() {
    setResending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setResending(false);
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
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingTop: 52,
                paddingHorizontal: 24,
                paddingBottom: 32,
              }}
            >
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} color="#ffffff" />
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: 17,
                  color: "#ffffff",
                }}
              >
                Reset password
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 24,
                paddingBottom: 24,
                gap: 24,
              }}
            >
              <Text
                style={{
                  fontFamily: "BricolageGrotesque-SemiBold",
                  fontSize: 28,
                  color: "#ffffff",
                }}
              >
                Reset your password
              </Text>

              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 15,
                  color: "#ffffff80",
                  lineHeight: 22,
                }}
              >
                Enter the email associated with your account and we'll send you
                a verification code.
              </Text>

              <GlassFormField
                label="Email"
                placeholder="you@email.com"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  setError(undefined);
                }}
                error={error}
                keyboardType="email-address"
                autoCapitalize="none"
                disabled={loading}
              />

              <PrimaryButton
                label="Send Reset Code"
                loading={loading}
                onPress={handleSendCode}
              />
            </View>

            <View
              style={{
                paddingVertical: 24,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 14,
                  color: "#ffffff80",
                }}
              >
                Back to
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

      <Modal transparent visible={showSentModal} animationType="fade">
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#00000099",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 342,
                backgroundColor: "#1a1827",
                borderRadius: 24,
                borderWidth: 1,
                borderColor: "#ffffff1f",
                padding: 28,
                gap: 20,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: "rgba(225,38,28,0.1)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="mail" size={32} color="#e1261c" />
              </View>

              <Text
                style={{
                  fontFamily: "BricolageGrotesque-SemiBold",
                  fontSize: 24,
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                Check your email
              </Text>

              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 14,
                  color: "#ffffff80",
                  textAlign: "center",
                  lineHeight: 20,
                }}
              >
                We've sent a 6-digit verification code to
              </Text>

              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: 15,
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                {email}
              </Text>

              <PrimaryButton
                label="Continue"
                onPress={() => {
                  setShowSentModal(false);
                  router.push(
                    `/forgot-password/enter-code?email=${encodeURIComponent(email)}`,
                  );
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    fontSize: 13,
                    color: "#ffffff66",
                  }}
                >
                  Didn't get it?{" "}
                </Text>
                <TouchableOpacity onPress={handleResend} disabled={resending}>
                  <Text
                    style={{
                      fontFamily: "Inter-SemiBold",
                      fontSize: 13,
                      color: resending ? "#ffffff50" : "#e1261c",
                    }}
                  >
                    {resending ? "Resending..." : "Resend"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </PageAtmosphere>
  );
}
