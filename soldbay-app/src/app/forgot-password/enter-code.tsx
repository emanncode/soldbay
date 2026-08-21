import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { PrimaryButton } from "@/components/primary-button";
import { Ionicons } from "@expo/vector-icons";
import { AuthLayoutWrapper } from "@/components/auth-layout-wrapper";

const OTP_LENGTH = 6;

export default function EnterCodeScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const displayEmail = email || "you@email.com";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [resending, setResending] = useState(false);

  // Staggered list items (4 items: Title/subtitle, OTP Grid, Action Button/Resend, Login link)
  const [itemAnims] = useState(() =>
    Array.from({ length: 4 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  );

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
      const next = [...otp];
      next[index - 1] = "";
      setOtp(next);
      textInputRefs.current[index - 1]?.focus();
    }
  }

  const isComplete = otp.every((val) => val !== "");

  function handleVerify() {
    if (!isComplete) return;
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      router.push(
        `/forgot-password/new-password?email=${encodeURIComponent(displayEmail)}`,
      );
    }, 1200);
  }

  function handleResend() {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  }

  return (
    <AuthLayoutWrapper
      backRoute="/forgot-password"
      backTitle="Reset password"
      staggerAnimations={staggerAnimations}
    >
      {/* Item 0: Card Title & Subtitle */}
      <Animated.View
        style={{
          opacity: itemAnims[0].opacity,
          transform: [{ translateY: itemAnims[0].translateY }],
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

      {/* Item 1: OTP inputs */}
      <Animated.View
        style={{
          opacity: itemAnims[1].opacity,
          transform: [{ translateY: itemAnims[1].translateY }],
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

      {/* Item 2: Action container */}
      <Animated.View
        style={{
          opacity: itemAnims[2].opacity,
          transform: [{ translateY: itemAnims[2].translateY }],
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

      {/* Item 3: Login link row */}
      <Animated.View
        style={{
          opacity: itemAnims[3].opacity,
          transform: [{ translateY: itemAnims[3].translateY }],
        }}
      >
        <View style={styles.loginLinkRow}>
          <Text style={styles.loginLinkText}>Remember your password?</Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.loginLinkButton}>Log in</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {showToast && (
        <View style={styles.toastContainer}>
          <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
          <Text style={styles.toastText}>Verification code resent</Text>
        </View>
      )}
    </AuthLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontFamily: "BricolageGrotesque-Bold",
    fontSize: 26,
    color: "#000000",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  cardSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  boldEmail: {
    fontFamily: "Inter-SemiBold",
    color: "#000000",
  },
  otpWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 20,
  },
  otpBox: {
    flex: 1,
    height: 48,
    borderRadius: 10,
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
    gap: 14,
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
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  toastText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#ffffff",
  },
});
