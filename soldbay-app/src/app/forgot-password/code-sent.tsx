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
  const displayEmail = email || "you@email.com";
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
                  {displayEmail}
                </Text>

                <View style={{ width: "100%" }}>
                  <PrimaryButton
                    label="Continue"
                    onPress={() =>
                      router.push(
                        `/forgot-password/enter-code?email=${encodeURIComponent(displayEmail)}`,
                      )
                    }
                  />
                </View>

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
                  <TouchableOpacity
                    onPress={handleResend}
                    disabled={resending}
                  >
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
