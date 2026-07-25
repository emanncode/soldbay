import { useState, useRef, createRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { PrimaryButton } from "@/components/primary-button";
import { Ionicons } from "@expo/vector-icons";

const OTP_LENGTH = 6;

export default function EnterCodeScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const displayEmail = email || "you@email.com";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [resending, setResending] = useState(false);

  const refs = useRef(
    Array.from({ length: OTP_LENGTH }, () => createRef<TextInput>()),
  );

  function handleOtpChange(text: string, index: number) {
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < OTP_LENGTH - 1) {
      refs.current[index + 1].current?.focus();
    }
  }

  function handleOtpKeyPress(key: string, index: number) {
    if (key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1].current?.focus();
    }
  }

  const code = otp.join("");
  const isComplete = code.length === OTP_LENGTH;

  async function handleVerify() {
    if (!isComplete) return;
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 1200));
    setVerifying(false);
    router.push(`/forgot-password/new-password?email=${encodeURIComponent(displayEmail)}`);
  }

  async function handleResend() {
    setResending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setResending(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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
                gap: 32,
              }}
            >
              <View style={{ gap: 8 }}>
                <Text
                  style={{
                    fontFamily: "BricolageGrotesque-SemiBold",
                    fontSize: 28,
                    color: "#ffffff",
                  }}
                >
                  Enter verification code
                </Text>

                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    fontSize: 15,
                    color: "#ffffff80",
                  }}
                >
                  We sent a 6-digit code to
                </Text>

                <Text
                  style={{
                    fontFamily: "Inter-SemiBold",
                    fontSize: 15,
                    color: "#ffffff",
                  }}
                >
                  {displayEmail}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                  justifyContent: "center",
                }}
              >
                {otp.map((digit, i) => (
                  <View
                    key={i}
                    style={{
                      width: 48,
                      height: 56,
                      borderRadius: 12,
                      backgroundColor: "#00000059",
                      borderWidth: i === 0 && !digit ? 2 : 1,
                      borderColor:
                        digit || (i === 0 && !digit)
                          ? "#e1261c"
                          : "#ffffff1f",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TextInput
                      ref={refs.current[i]}
                      value={digit}
                      onChangeText={(t) => handleOtpChange(t, i)}
                      onKeyPress={({ nativeEvent }) =>
                        handleOtpKeyPress(nativeEvent.key, i)
                      }
                      keyboardType="number-pad"
                      maxLength={1}
                      style={{
                        width: "100%",
                        height: "100%",
                        textAlign: "center",
                        fontFamily: "Inter-SemiBold",
                        fontSize: 24,
                        color: "#ffffff",
                        padding: 0,
                        outline: "none",
                      }}
                    />
                  </View>
                ))}
              </View>

              <PrimaryButton
                label="Verify Code"
                loading={verifying}
                disabled={!isComplete}
                onPress={handleVerify}
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
                    fontSize: 14,
                    color: "#ffffff80",
                  }}
                >
                  Didn't receive a code?{" "}
                </Text>
                <Text
                  onPress={handleResend}
                  style={{
                    fontFamily: "Inter-SemiBold",
                    fontSize: 14,
                    color: resending ? "#ffffff50" : "#e1261c",
                  }}
                >
                  {resending ? "Resending..." : "Resend Code"}
                </Text>
              </View>
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

          {showToast && (
            <View
              style={{
                position: "absolute",
                bottom: 84,
                alignSelf: "center",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingHorizontal: 20,
                paddingVertical: 12,
                backgroundColor: "#16a34a",
                borderRadius: 12,
              }}
            >
              <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: 14,
                  color: "#ffffff",
                }}
              >
                Code resent!
              </Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PageAtmosphere>
  );
}
