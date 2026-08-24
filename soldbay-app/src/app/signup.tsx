import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signup, login, ApiError } from "@/lib/api";
import { saveToken } from "@/lib/auth-storage";
import { SoldBayInputField } from "@/components/soldbay-input-field";
import { PrimaryButton } from "@/components/primary-button";
import { AuthLayoutWrapper } from "@/components/auth-layout-wrapper";

type Role = "buyer" | "seller";

function EyeToggle({
  showing,
  onPress,
  disabled,
}: {
  showing: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      style={{ padding: 4, opacity: disabled ? 0.5 : 1 }}
    >
      <Ionicons
        name={showing ? "eye-off-outline" : "eye-outline"}
        size={20}
        color="rgba(255, 255, 255, 0.6)"
      />
    </TouchableOpacity>
  );
}

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<Role>("buyer");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [slideAnim] = useState(() => new Animated.Value(role === "buyer" ? 0 : 1));
  const [containerWidth, setContainerWidth] = useState(0);

  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  // Staggered list items
  const [itemAnims] = useState(() =>
    Array.from({ length: 9 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  );

  // Compile staggered animations
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

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: role === "buyer" ? 0 : 1,
      duration: 250,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [role, slideAnim]);

  function clearError(field: keyof typeof errors) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError(null);
  }

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = "Enter a valid email";
    }
    if (!password) {
      e.password = "Password is required";
    } else if (password.length < 6) {
      e.password = "Password must be at least 6 characters";
    }
    if (confirmPassword !== password) {
      e.confirmPassword = "Passwords do not match";
    }
    if (!agreeToTerms) {
      e.terms = "You must agree to the terms";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSignup() {
    if (!validate()) return;
    setLoading(true);
    setFormError(null);

    try {
      // 1. Create account
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        role: role.toUpperCase() as "BUYER" | "SELLER",
      });

      // 2. Automatically log in upon successful signup
      const loginRes = await login({
        email: email.trim(),
        password,
      });

      await saveToken(loginRes.token);

      // 3. Forward to university selection screen
      router.replace("/select-university");
    } catch (err) {
      console.error("Signup error:", err);
      if (err instanceof ApiError) {
        if (err.status === 409 || err.message.toLowerCase().includes("exist") || err.message.toLowerCase().includes("registered")) {
          setErrors((prev) => ({
            ...prev,
            email: "This email is already registered",
          }));
        } else {
          setFormError(err.message);
        }
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
        <Text style={styles.cardTitle}>Register</Text>
        <Text style={styles.cardSubtitle}>
          Buy and sell items with verified students at your university
        </Text>
      </Animated.View>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {/* Item 1: Name Input */}
        <Animated.View
          style={{
            opacity: itemAnims[1].opacity,
            transform: [{ translateY: itemAnims[1].translateY }],
          }}
        >
          <SoldBayInputField
            label="Name"
            icon="person-outline"
            placeholder="Johan Mandela"
            value={name}
            onChangeText={(t) => {
              setName(t);
              clearError("name");
            }}
            error={errors.name}
            disabled={loading}
            autoCapitalize="words"
          />
        </Animated.View>

        {/* Item 2: Email Input */}
        <Animated.View
          style={{
            opacity: itemAnims[2].opacity,
            transform: [{ translateY: itemAnims[2].translateY }],
          }}
        >
          <SoldBayInputField
            label="Email"
            icon="mail-outline"
            placeholder="brittnilonda5487@gmail.com"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              clearError("email");
            }}
            error={errors.email}
            disabled={loading}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Animated.View>

        {/* Item 3: Password Input */}
        <Animated.View
          style={{
            opacity: itemAnims[3].opacity,
            transform: [{ translateY: itemAnims[3].translateY }],
          }}
        >
          <SoldBayInputField
            label="Password"
            icon="lock-closed-outline"
            placeholder="password"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              clearError("password");
            }}
            error={errors.password}
            disabled={loading}
            secureTextEntry={!showPassword}
            rightElement={
              <EyeToggle
                showing={showPassword}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              />
            }
          />
        </Animated.View>

        {/* Item 4: Confirm Password Input */}
        <Animated.View
          style={{
            opacity: itemAnims[4].opacity,
            transform: [{ translateY: itemAnims[4].translateY }],
          }}
        >
          <SoldBayInputField
            label="Confirm Password"
            icon="lock-closed-outline"
            placeholder="password"
            value={confirmPassword}
            onChangeText={(t) => {
              setConfirmPassword(t);
              clearError("confirmPassword");
            }}
            error={errors.confirmPassword}
            disabled={loading}
            secureTextEntry={!showConfirmPassword}
            rightElement={
              <EyeToggle
                showing={showConfirmPassword}
                onPress={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                disabled={loading}
              />
            }
          />
        </Animated.View>

        {/* Item 5: Role Selector */}
        <Animated.View
          style={{
            opacity: itemAnims[5].opacity,
            transform: [{ translateY: itemAnims[5].translateY }],
          }}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Choose your account type</Text>
            <View 
              style={styles.roleContainer}
              onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
            >
              {containerWidth > 0 && (
                <Animated.View
                  style={[
                    styles.roleIndicator,
                    {
                      width: containerWidth / 2 - 6,
                      left: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [4, containerWidth / 2 + 2],
                      }),
                    },
                  ]}
                />
              )}
              <TouchableOpacity
                style={styles.roleBtn}
                onPress={() => setRole("buyer")}
                activeOpacity={0.9}
                disabled={loading}
              >
                <Ionicons
                  name="cart-outline"
                  size={18}
                  color={role === "buyer" ? "#22c55e" : "rgba(255, 255, 255, 0.5)"}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.roleBtnText,
                    role === "buyer" && styles.roleBtnTextSelected,
                  ]}
                >
                  {"I'm a Buyer"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.roleBtn}
                onPress={() => setRole("seller")}
                activeOpacity={0.9}
                disabled={loading}
              >
                <Ionicons
                  name="cube-outline"
                  size={18}
                  color={role === "seller" ? "#22c55e" : "rgba(255, 255, 255, 0.5)"}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.roleBtnText,
                    role === "seller" && styles.roleBtnTextSelected,
                  ]}
                >
                  {"I'm a Seller"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Item 6: Terms and Conditions checkbox */}
        <Animated.View
          style={{
            opacity: itemAnims[6].opacity,
            transform: [{ translateY: itemAnims[6].translateY }],
          }}
        >
          <View style={styles.termsRow}>
            <TouchableOpacity
              onPress={() => {
                setAgreeToTerms(!agreeToTerms);
                clearError("terms");
              }}
              style={styles.checkboxContainer}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Ionicons
                name={agreeToTerms ? "checkbox" : "square-outline"}
                size={20}
                color={agreeToTerms ? "#22c55e" : "rgba(255, 255, 255, 0.4)"}
              />
              <Text
                style={[
                  styles.checkboxText,
                  loading && { opacity: 0.6 },
                ]}
              >
                I agree to the Term & Condition and Privacy
              </Text>
            </TouchableOpacity>
          </View>
          {errors.terms && (
            <Text style={[styles.errorText, { marginTop: 4 }]}>
              {errors.terms}
            </Text>
          )}
        </Animated.View>

        {/* Item 7: General form errors and Sign Up Button */}
        <Animated.View
          style={{
            opacity: itemAnims[7].opacity,
            transform: [{ translateY: itemAnims[7].translateY }],
            marginTop: 4,
            gap: 12,
          }}
        >
          {formError && (
            <View style={styles.formErrorContainer}>
              <Ionicons name="alert-circle" size={16} color="#ef4444" />
              <Text style={styles.formErrorText}>{formError}</Text>
            </View>
          )}

          <PrimaryButton
            label={loading ? "Creating account..." : "Sign up"}
            loading={loading}
            onPress={handleSignup}
          />
        </Animated.View>
      </View>

      {/* Item 8: Footer link to sign in */}
      <Animated.View
        style={{
          opacity: itemAnims[8].opacity,
          transform: [{ translateY: itemAnims[8].translateY }],
        }}
      >
        <View style={styles.footer}>
          <Text style={styles.footerMuted}>Already have an account? </Text>
          <TouchableOpacity 
            onPress={() => router.push("/login")}
            disabled={loading}
          >
            <Text style={[styles.footerLink, loading && { opacity: 0.6 }]}>
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </AuthLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  formContainer: {
    gap: 10,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 13,
    color: "#f4f4f5",
    paddingLeft: 2,
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#ef4444",
    paddingLeft: 4,
    marginTop: 2,
  },
  roleContainer: {
    flexDirection: "row",
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: 14,
    height: 46,
    padding: 3,
    position: "relative",
    alignItems: "center",
  },
  roleIndicator: {
    position: "absolute",
    top: 3,
    bottom: 3,
    borderRadius: 11,
    backgroundColor: "#2a2a30",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  roleBtn: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  roleBtnText: {
    fontFamily: "Inter-Medium",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.65)",
  },
  roleBtnTextSelected: {
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
  termsRow: {
    marginTop: 2,
    paddingHorizontal: 2,
    position: "relative",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkboxText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  formErrorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    padding: 10,
    borderRadius: 14,
  },
  formErrorText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#ef4444",
    flex: 1,
  },
  footer: {
    marginTop: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  footerMuted: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  footerLink: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#ffffff",
  },
});
