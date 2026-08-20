import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from "react-native";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { PrimaryButton } from "@/components/primary-button";
import { Ionicons } from "@expo/vector-icons";

const OTP_LENGTH = 6;

export default function EnterCodeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const displayEmail = email || "you@email.com";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [resending, setResending] = useState(false);

  // Card layout animation
  const [cardOpacity] = useState(() => new Animated.Value(0));
  const [cardTranslateY] = useState(() => new Animated.Value(50));

  // Staggered list items (5 items)
  const [itemAnims] = useState(() =>
    Array.from({ length: 5 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Reset card and items values
      cardOpacity.setValue(0);
      cardTranslateY.setValue(50);
      itemAnims.forEach((anim) => {
        anim.opacity.setValue(0);
        anim.translateY.setValue(20);
      });

      // Compile staggered items animations
      const staggerAnimations = itemAnims.map((anim) =>
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateY, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ])
      );

      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(100),
          Animated.stagger(80, staggerAnimations),
        ]),
      ]).start();
    });

    return unsubscribe;
  }, [navigation, cardOpacity, cardTranslateY, itemAnims]);

  const textInputRefs = useRef<(TextInput | null)[]>([]);

  function handleOtpChange(text: string, index: number) {
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < OTP_LENGTH - 1) {
      textInputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyPress(key: string, index: number) {
    if (key === "Backspace" && !otp[index] && index > 0) {
      textInputRefs.current[index - 1]?.focus();
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
    <PageAtmosphere theme="green">
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header / Logo section on green gradient */}
            <View style={styles.headerContainer}>
              <Text style={styles.brandName}>SoldBay</Text>
              <Image
                source={require("../../../assets/soldbay_logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* White card container */}
            <Animated.View
              style={[
                styles.card,
                {
                  opacity: cardOpacity,
                  transform: [{ translateY: cardTranslateY }],
                },
              ]}
            >
              {/* Item 0: Back Row */}
              <Animated.View
                style={{
                  opacity: itemAnims[0].opacity,
                  transform: [{ translateY: itemAnims[0].translateY }],
                }}
              >
                <View style={styles.backRow}>
                  <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={22} color="#000000" />
                  </TouchableOpacity>
                  <Text style={styles.backTitle}>Reset password</Text>
                </View>
              </Animated.View>

              {/* Item 1: Card Title & Subtitle */}
              <Animated.View
                style={{
                  opacity: itemAnims[1].opacity,
                  transform: [{ translateY: itemAnims[1].translateY }],
                }}
              >
                <Text style={styles.cardTitle}>Enter verification code</Text>
                <View style={styles.subtitleContainer}>
                  <Text style={styles.cardSubtitle}>
                    {"We sent a 6-digit code to "}
                    <Text style={styles.boldEmail}>{displayEmail}</Text>
                  </Text>
                </View>
              </Animated.View>

              {/* Item 2: OTP inputs */}
              <Animated.View
                style={{
                  opacity: itemAnims[2].opacity,
                  transform: [{ translateY: itemAnims[2].translateY }],
                }}
              >
                <View style={styles.otpWrapper}>
                  {otp.map((digit, i) => (
                    <View
                      key={i}
                      style={[
                        styles.otpBox,
                        (digit || (i === 0 && !digit)) && styles.otpBoxActive,
                      ]}
                    >
                      <TextInput
                        ref={(el) => {
                          textInputRefs.current[i] = el;
                        }}
                        value={digit}
                        onChangeText={(t) => handleOtpChange(t, i)}
                        onKeyPress={({ nativeEvent }) =>
                          handleOtpKeyPress(nativeEvent.key, i)
                        }
                        keyboardType="number-pad"
                        maxLength={1}
                        style={[
                          styles.otpInput,
                          Platform.OS === "web" && {
                            outlineStyle: "none" as any,
                            outlineWidth: 0 as any,
                            boxShadow: "none" as any,
                          },
                        ]}
                      />
                    </View>
                  ))}
                </View>
              </Animated.View>

              {/* Item 3: Action container */}
              <Animated.View
                style={{
                  opacity: itemAnims[3].opacity,
                  transform: [{ translateY: itemAnims[3].translateY }],
                }}
              >
                <View style={styles.actionContainer}>
                  <PrimaryButton
                    label="Verify Code"
                    loading={verifying}
                    disabled={!isComplete}
                    onPress={handleVerify}
                  />

                  <View style={styles.resendRow}>
                    <Text style={styles.resendText}>{"Didn't receive a code? "}</Text>
                    <TouchableOpacity onPress={handleResend} disabled={resending}>
                      <Text style={styles.resendButton}>
                        {resending ? "Resending..." : "Resend Code"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>

              {/* Item 4: Login link row */}
              <Animated.View
                style={{
                  opacity: itemAnims[4].opacity,
                  transform: [{ translateY: itemAnims[4].translateY }],
                }}
              >
                <View style={styles.loginLinkRow}>
                  <Text style={styles.loginLinkText}>Remember your password?</Text>
                  <TouchableOpacity onPress={() => router.push("/login")}>
                    <Text style={styles.loginLinkButton}>Log in</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </Animated.View>
          </ScrollView>

          {showToast && (
            <View style={styles.toastContainer}>
              <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
              <Text style={styles.toastText}>Code resent!</Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PageAtmosphere>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "transparent",
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingBottom: 50,
  },
  logo: {
    width: 190,
    height: 190,
    marginTop: 15,
  },
  brandName: {
    fontFamily: "BricolageGrotesque-SemiBold",
    fontSize: 28,
    color: "#000000",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  backTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#000000",
  },
  cardTitle: {
    fontFamily: "BricolageGrotesque-Bold",
    fontSize: 26,
    color: "#000000",
  },
  subtitleContainer: {
    marginTop: 8,
    marginBottom: 32,
  },
  cardSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  boldEmail: {
    fontFamily: "Inter-SemiBold",
    color: "#000000",
  },
  otpWrapper: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    marginBottom: 32,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  otpBoxActive: {
    borderColor: "#3ba53b",
    borderWidth: 2,
    backgroundColor: "#ffffff",
  },
  otpInput: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    fontFamily: "Inter-SemiBold",
    fontSize: 24,
    color: "#000000",
    padding: 0,
  },
  actionContainer: {
    gap: 20,
    marginBottom: 24,
  },
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  resendText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748b",
  },
  resendButton: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#3ba53b",
  },
  loginLinkRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  loginLinkText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748b",
  },
  loginLinkButton: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#000000",
  },
  toastContainer: {
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toastText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#ffffff",
  },
});
