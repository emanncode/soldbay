import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { GlassPanel } from "@/components/glass-panel";
import { LogoWordmark } from "@/components/logo-wordmark";
import { login, ApiError } from "@/lib/api";
import { saveToken } from "@/lib/auth-storage";

import { Ionicons } from "@expo/vector-icons";

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
        color="rgba(255,255,255,0.6)"
      />
    </TouchableOpacity>
  );
}

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("Test@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        setFormError("Something went wrong on our end. Please Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageAtmosphere>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo area */}
            <View style={styles.logoWrapper}>
              <LogoWordmark height={105} />
            </View>

            {/* Main Login card */}
            <GlassPanel variant="panel" style={styles.card}>
              <View style={styles.cardContent}>
                {/* Title and subtitle */}
                <View style={styles.titleWrapper}>
                  <Text style={styles.cardTitle}>Welcome to SoldBay</Text>
                  <Text style={styles.cardSubtitle}>
                    Buy and sell items with verified students at your university
                  </Text>
                </View>

                {/* Form Inputs */}
                <View style={{ gap: 16 }}>
                  {/* Email Field */}
                  <View style={styles.inputGroup}>
                    <Text
                      style={[
                        styles.inputLabel,
                        errors.email && styles.labelError,
                        isEmailValid && !errors.email && styles.labelSuccess,
                      ]}
                    >
                      Email
                    </Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        errors.email && styles.wrapperError,
                        isEmailValid && !errors.email && styles.wrapperSuccess,
                      ]}
                    >
                      <TextInput
                        value={email}
                        onChangeText={(t) => {
                          setEmail(t);
                          setErrors((e) => ({ ...e, email: undefined }));
                          setFormError(null);
                        }}
                        placeholder="you@email.com"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                        style={styles.textInput}
                      />
                      {isEmailValid && !errors.email && (
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color="#10b981"
                          style={{ marginLeft: 8 }}
                        />
                      )}
                    </View>
                    {errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  {/* Password Field */}
                  <View style={styles.inputGroup}>
                    <Text
                      style={[
                        styles.inputLabel,
                        errors.password && styles.labelError,
                      ]}
                    >
                      Password
                    </Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        errors.password && styles.wrapperError,
                      ]}
                    >
                      <TextInput
                        value={password}
                        onChangeText={(t) => {
                          setPassword(t);
                          setErrors((e) => ({ ...e, password: undefined }));
                          setFormError(null);
                        }}
                        placeholder="Enter your password"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        secureTextEntry={!showPassword}
                        editable={!loading}
                        style={styles.textInput}
                      />
                      <EyeToggle
                        showing={showPassword}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    </View>
                    {errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>

                  {/* Warning / Error message matching the phone display */}
                  {formError && (
                    <View style={styles.errorContainer}>
                      <Ionicons
                        name="warning"
                        size={16}
                        color="#ef4444"
                        style={{ marginTop: 2 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.errorText}>{formError}</Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Login Action Button */}
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.8}
                  style={[styles.loginBtn, loading && { opacity: 0.7 }]}
                >
                  <Text style={styles.loginBtnText}>
                    {loading ? "Logging in..." : "Login"}
                  </Text>
                </TouchableOpacity>
              </View>
            </GlassPanel>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerMuted}>
                {"Don't have an account? "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={styles.footerLink}>Create an account</Text>
              </TouchableOpacity>
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
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  logoWrapper: {
    alignItems: "center",
    paddingBottom: 24,
  },
  card: {
    borderRadius: 24,
    backgroundColor: "rgba(21, 20, 25, 0.65)",
  },
  cardContent: {
    padding: 24,
    gap: 20,
  },
  titleWrapper: {
    alignItems: "center",
    gap: 6,
  },
  cardTitle: {
    fontFamily: "BricolageGrotesque-SemiBold",
    fontSize: 22,
    color: "#ffffff",
    textAlign: "center",
  },
  cardSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    paddingLeft: 2,
  },
  labelSuccess: {
    color: "#10b981",
  },
  labelError: {
    color: "#ef4444",
  },
  inputWrapper: {
    backgroundColor: "#16151a",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  wrapperSuccess: {
    borderColor: "#10b981",
  },
  wrapperError: {
    borderColor: "#ef4444",
    backgroundColor: "rgba(239, 68, 68, 0.03)",
  },
  textInput: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#ffffff",
    padding: 0,
    flex: 1,
  },
  errorContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
    paddingHorizontal: 2,
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#ef4444",
    lineHeight: 16,
  },
  loginBtn: {
    backgroundColor: "#ff4f18",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtnText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 15,
    color: "#ffffff",
  },

  footer: {
    paddingVertical: 24,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  footerMuted: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
  },
  footerLink: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#ff4f18",
  },
});
