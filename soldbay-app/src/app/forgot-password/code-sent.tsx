import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { GlassPanel } from "@/components/glass-panel";
import { LogoWordmark } from "@/components/logo-wordmark";
import { PrimaryButton } from "@/components/primary-button";

import { Ionicons } from "@expo/vector-icons";

export default function CodeSentScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const displayEmail = email || "name@university.edu";
  const [resending, setResending] = useState(false);

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
              <View style={{ padding: 28, gap: 20, alignItems: "center" }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: "rgba(225,38,28,0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="mail" size={24} color="#e1261c" />
                </View>

                <Text
                  style={{
                    fontFamily: "BricolageGrotesque-SemiBold",
                    fontSize: 28,
                    color: "#ffffff",
                    textAlign: "center",
                  }}
                >
                  Check your email
                </Text>

                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    fontSize: 13,
                    color: "#ffffff99",
                    textAlign: "center",
                    lineHeight: 18,
                  }}
                >
                  We sent a 6-digit reset code to
                </Text>

                <Text
                  style={{
                    fontFamily: "Inter-SemiBold",
                    fontSize: 14,
                    color: "#ffffffe6",
                    textAlign: "center",
                  }}
                >
                  {displayEmail}
                </Text>

                <View style={{ width: "100%" }}>
                  <PrimaryButton
                    label="Enter Code"
                    onPress={() =>
                      router.push(
                        `/forgot-password/enter-code?email=${encodeURIComponent(displayEmail)}`,
                      )
                    }
                  />
                </View>

                <TouchableOpacity
                  onPress={handleResend}
                  disabled={resending}
                  style={{ alignItems: "center" }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: 13,
                      color: resending ? "#ffffff50" : "#ffffff99",
                    }}
                  >
                    {resending ? "Resending..." : "Didn't get it? Resend"}
                  </Text>
                </TouchableOpacity>
              </View>
            </GlassPanel>

            <TouchableOpacity
              onPress={() => router.push("/login")}
              style={{ paddingVertical: 24, alignItems: "center" }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 14,
                  color: "#ffffff80",
                }}
              >
                Remember your password?{" "}
                <Text
                  style={{
                    fontFamily: "Inter-SemiBold",
                    color: "#ffffffcc",
                  }}
                >
                  Log in
                </Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PageAtmosphere>
  );
}
