import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { login, ApiError } from "@/lib/api";
import { saveToken } from "@/lib/auth-storage";
import { Ionicons } from "@expo/vector-icons";
import { SoldBayInputField } from "@/components/soldbay-input-field";
import { PrimaryButton } from "@/components/primary-button";

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
      // Demo login bypass for Test@gmail.com
      if (email.trim().toLowerCase() === "test@gmail.com") {
        await saveToken("demo-token");
        router.replace("/buyer/home");
        return;
      }

      // API login
      const res = await login({ email: email.trim(), password });
      await saveToken(res.token);
      router.replace(
        res.user.role === "SELLER" ? "/seller/dashboard" : "/buyer/home",
      );
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof ApiError && err.status === 401) {
        setFormError("Invalid email or password.");
      } else if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError("Something went wrong on our end. Please try again.");
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
            {/* Header / Logo section on green gradient */}
            <View style={styles.headerContainer}>
              <Text style={styles.brandName}>SoldBay</Text>
              <Image
                source={require("../../assets/soldbay_logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* White card container */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Welcome back</Text>
              <Text style={styles.cardSubtitle}>
                Buy and sell items with verified students at your university
              </Text>

              {/* Form Fields */}
              <View style={styles.formContainer}>
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
                  rightElement={
                    <EyeToggle
                      showing={showPassword}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />

                {/* Remember me & Forgot password row */}
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

                  <TouchableOpacity
                    onPress={() => router.push("/forgot-password")}
                  >
                    <Text style={styles.forgotPasswordText}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* General form errors */}
                {formError && (
                  <View style={styles.formErrorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#ef4444" />
                    <Text style={styles.formErrorText}>{formError}</Text>
                  </View>
                )}

                {/* Log In Button with Green-to-Gold Gradient */}
                <PrimaryButton
                  label={loading ? "Logging in" : "Log in"}
                  loading={loading}
                  onPress={handleLogin}
                />
              </View>

              {/* Footer link to sign up */}
              <View style={styles.footer}>
                <Text style={styles.footerMuted}>
                  {"Don't have an account? "}
                </Text>
                <TouchableOpacity onPress={() => router.push("/signup")}>
                  <Text style={styles.footerLink}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    gap: 20,
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
    height: 52,
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
  loginBtnContainer: {
    marginTop: 8,
    borderRadius: 26,
    overflow: "hidden",
  },
  loginGradient: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtnText: {
    fontFamily: "Inter-Bold",
    fontSize: 15,
    color: "#000000",
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
