import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { signup, login, ApiError } from "@/lib/api";
import { saveToken } from "@/lib/auth-storage";
import { SoldBayInputField } from "@/components/soldbay-input-field";
import { PrimaryButton } from "@/components/primary-button";

type Role = "buyer" | "seller";

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

  // Card layout animation
  const [cardOpacity] = useState(() => new Animated.Value(0));
  const [cardTranslateY] = useState(() => new Animated.Value(60));

  // Staggered list items
  const [itemAnims] = useState(() =>
    Array.from({ length: 9 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  );

  useEffect(() => {
    // Staggered animations compilation
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
        duration: 700,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(100),
        Animated.stagger(80, staggerAnimations),
      ]),
    ]).start();
  }, [cardOpacity, cardTranslateY, itemAnims]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: role === "buyer" ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [role, slideAnim]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  function clearError(field: string) {
    setErrors((e) => {
      const n = { ...e };
      delete n[field];
      return n;
    });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Must be 8+ characters";
    if (!confirmPassword) e.confirmPassword = "Confirm your password";
    else if (password !== confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!agreeToTerms) e.terms = "You must agree to the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSignup() {
    if (!validate()) return;
    setLoading(true);
    setFormError(null);
    try {
      // Signup without university — collected on a follow-up screen
      await signup({
        email: email.trim(),
        password,
        name: name.trim(),
        role: role === "buyer" ? "BUYER" : "SELLER",
      });
      // Login immediately after signup to get a token
      const loginRes = await login({ email: email.trim(), password });
      await saveToken(loginRes.token);
      router.replace("/select-university");
    } catch (err) {
      console.error("Signup error:", err);
      if (err instanceof ApiError) {
        switch (err.status) {
          case 409:
            setFormError("An account with this email already exists.");
            break;
          case 400:
            setFormError(err.message);
            break;
          default:
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
            {/* Header section on green background */}
            <View style={styles.headerContainer}>
              <Text style={styles.brandName}>SoldBay</Text>
              <Image
                source={require("../../assets/soldbay_logo.png")}
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
                  {/* Role Selector styled as clean pill buttons */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Choose your account type</Text>
                    <View 
                      style={styles.roleContainer}
                      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
                    >
                      {/* Animated Sliding Pill Highlight */}
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
                          color={role === "buyer" ? "#3ba53b" : "rgba(0,0,0,0.5)"}
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
                          color={role === "seller" ? "#3ba53b" : "rgba(0,0,0,0.5)"}
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
                    >
                      <Ionicons
                        name={agreeToTerms ? "checkbox" : "square-outline"}
                        size={20}
                        color={agreeToTerms ? "#3ba53b" : "rgba(0,0,0,0.3)"}
                      />
                      <Text style={styles.checkboxText}>
                        I agree to the Term & Condition and Privacy
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {errors.terms && (
                    <Text style={[styles.errorText, { position: "absolute", bottom: -16, left: 4, marginTop: 0 }]}>
                      {errors.terms}
                    </Text>
                  )}
                </Animated.View>

                {/* Item 7: General form errors and Sign Up Button */}
                <Animated.View
                  style={{
                    opacity: itemAnims[7].opacity,
                    transform: [{ translateY: itemAnims[7].translateY }],
                  }}
                >
                  {formError && (
                    <View style={styles.formErrorContainer}>
                      <Ionicons name="alert-circle" size={16} color="#ef4444" />
                      <Text style={styles.formErrorText}>{formError}</Text>
                    </View>
                  )}

                  <PrimaryButton
                    label={loading ? "Creating account" : "Sign up"}
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
                  <TouchableOpacity onPress={() => router.push("/login")}>
                    <Text style={styles.footerLink}>Sign in</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </Animated.View>
          </ScrollView>
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
    paddingTop: 50,
    paddingBottom: 35,
  },
  logo: {
    width: 140,
    height: 140,
    marginTop: 12,
  },
  brandName: {
    fontFamily: "BricolageGrotesque-SemiBold",
    fontSize: 26,
    color: "#000000",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },
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
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 13,
    color: "#222222",
    paddingLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 26,
    height: 50,
    paddingHorizontal: 16,
  },
  wrapperError: {
    borderColor: "#ef4444",
    backgroundColor: "rgba(239, 68, 68, 0.02)",
  },
  separator: {
    width: 1,
    height: 18,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 12,
  },
  textInput: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#000000",
    padding: 0,
    flex: 1,
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
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 26,
    height: 52,
    padding: 4,
    position: "relative",
    alignItems: "center",
  },
  roleIndicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    borderRadius: 22,
    backgroundColor: "rgba(59, 165, 59, 0.08)",
    borderWidth: 1,
    borderColor: "#3ba53b",
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
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
  },
  roleBtnTextSelected: {
    fontFamily: "Inter-Bold",
    color: "#3ba53b",
  },
  termsRow: {
    marginTop: 4,
    paddingHorizontal: 4,
    position: "relative",
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
  signUpBtnContainer: {
    marginTop: 8,
    borderRadius: 26,
    overflow: "hidden",
  },
  signUpGradient: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  signUpBtnText: {
    fontFamily: "Inter-Bold",
    fontSize: 15,
    color: "#000000",
  },
  footer: {
    marginTop: 28,
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
