import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import { login, ApiError } from "@/lib/api";
import { saveToken } from "@/lib/auth-storage";
import { Ionicons } from "@expo/vector-icons";
import { SoldBayInputField } from "@/components/soldbay-input-field";
import { PrimaryButton } from "@/components/primary-button";
import { AuthLayoutWrapper } from "@/components/auth-layout-wrapper";

function EyeToggle({
  showing,
  onPress,
}: {
  showing: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={8} style={{ padding: 4 }}>
      <Ionicons
        name={showing ? "eye-off-outline" : "eye-outline"}
        size={20}
        color="rgba(0,0,0,0.4)"
      />
    </TouchableOpacity>
  );
}

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  // Staggered list items inside the card (Title/subtitle, Email, Password, Options, Buttons, Footer)
  const [itemAnims] = useState(() =>
    Array.from({ length: 6 }, () => ({
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

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  function validate() {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!isEmailValid) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    setFormError(null);
    try {
      const res = await login({ email: email.trim(), password });
      await saveToken(res.token);
      router.replace(
        res.user.role === "SELLER" ? "/seller/dashboard" : "/buyer/home",
      );
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayoutWrapper staggerAnimations={staggerAnimations}>
      {/* Item 0: Title and Subtitle */}
      <Animated.View
        style={{
          opacity: itemAnims[0].opacity,
          transform: [{ translateY: itemAnims[0].translateY }],
        }}
      >
        <Text style={styles.cardTitle}>Welcome back</Text>
        <Text style={styles.cardSubtitle}>
          Buy and sell items with verified students at your university
        </Text>
      </Animated.View>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {/* Item 1: Email Input */}
        <Animated.View
          style={{
            opacity: itemAnims[1].opacity,
            transform: [{ translateY: itemAnims[1].translateY }],
          }}
        >
          <SoldBayInputField
            label="Email"
            icon="mail-outline"
            placeholder="brittnilonda5487@gmail.com"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setErrors((e) => ({ ...e, email: undefined }));
              setFormError(null);
            }}
            error={errors.email}
            disabled={loading}
            keyboardType="email-address"
            autoCapitalize="none"
            dense
            rightElement={
              isEmailValid && !errors.email ? (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color="#4BB543"
                  style={{ marginLeft: 8 }}
                />
              ) : undefined
            }
          />
        </Animated.View>

        {/* Item 2: Password Input */}
        <Animated.View
          style={{
            opacity: itemAnims[2].opacity,
            transform: [{ translateY: itemAnims[2].translateY }],
          }}
        >
          <SoldBayInputField
            label="Password"
            icon="lock-closed-outline"
            placeholder="password"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setErrors((e) => ({ ...e, password: undefined }));
              setFormError(null);
            }}
            error={errors.password}
            disabled={loading}
            secureTextEntry={!showPassword}
            dense
            rightElement={
              <EyeToggle
                showing={showPassword}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
        </Animated.View>

        {/* Item 3: Remember me & Forgot password row */}
        <Animated.View
          style={{
            opacity: itemAnims[3].opacity,
            transform: [{ translateY: itemAnims[3].translateY }],
          }}
        >
          <View style={styles.optionsRow}>
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              style={styles.checkboxContainer}
              activeOpacity={0.8}
            >
              <Ionicons
                name={rememberMe ? "checkbox" : "square-outline"}
                size={20}
                color={rememberMe ? "#3ba53b" : "rgba(0,0,0,0.3)"}
              />
              <Text style={styles.checkboxText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/forgot-password")}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Item 4: General form errors and Log In Button */}
        <Animated.View
          style={{
            opacity: itemAnims[4].opacity,
            transform: [{ translateY: itemAnims[4].translateY }],
          }}
        >
          {formError && (
            <View style={styles.formErrorContainer}>
              <Ionicons name="alert-circle" size={16} color="#ef4444" />
              <Text style={styles.formErrorText}>{formError}</Text>
            </View>
          )}

          <PrimaryButton
            label={loading ? "Logging in" : "Log in"}
            loading={loading}
            onPress={handleLogin}
            dense
          />
        </Animated.View>
      </View>

      {/* Item 5: Footer link to sign up */}
      <Animated.View
        style={{
          opacity: itemAnims[5].opacity,
          transform: [{ translateY: itemAnims[5].translateY }],
        }}
      >
        <View style={styles.footer}>
          <Text style={styles.footerMuted}>{"Don't have an account? "}</Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.footerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
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
  cardSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "rgba(0, 0, 0, 0.45)",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  formContainer: {
    gap: 14,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkboxText: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "rgba(0,0,0,0.6)",
  },
  forgotPasswordText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 13,
    color: "#000000",
  },
  formErrorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239, 68, 68, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.15)",
    padding: 12,
    borderRadius: 12,
  },
  formErrorText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#ef4444",
    flex: 1,
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  footerMuted: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
  },
  footerLink: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#000000",
  },
});
