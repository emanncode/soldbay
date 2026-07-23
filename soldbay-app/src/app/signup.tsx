import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { GlassPanel } from "@/components/glass-panel";
import { LogoWordmark } from "@/components/logo-wordmark";
import { GlassFormField } from "@/components/glass-form-field";
import { PrimaryButton } from "@/components/primary-button";
import { RoleCard } from "@/components/role-card";
import { signup, login, ApiError } from "@/lib/api";
import { saveToken } from "@/lib/auth-storage";

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
        color="rgba(255,255,255,0.6)"
      />
    </TouchableOpacity>
  );
}

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<Role>("buyer");
  const [loading, setLoading] = useState(false);
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
    if (!university.trim()) e.university = "University is required";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Must be 8+ characters";
    if (!confirmPassword) e.confirmPassword = "Confirm your password";
    else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSignup() {
    if (!validate()) return;
    setLoading(true);
    setFormError(null);
    try {
      await signup({
        email: email.trim(),
        password,
        name: name.trim(),
        role: role === "buyer" ? "BUYER" : "SELLER",
        universityId: university.trim(),
      });
      const loginRes = await login({ email: email.trim(), password });
      await saveToken(loginRes.token);
      router.replace("/");
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.status) {
          case 409:
            setFormError("An account with this email already exists.");
            break;
          case 404:
            setFormError("Please select a valid university.");
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
            <View style={{ alignItems: "center", paddingBottom: 24 }}>
              <LogoWordmark height={78} />
            </View>

            <GlassPanel variant="panel" style={{ borderRadius: 24 }}>
              <View style={{ padding: 28, gap: 20 }}>
                <Text
                  style={{
                    fontFamily: "BricolageGrotesque-SemiBold",
                    fontSize: 32,
                    color: "#ffffff",
                  }}
                >
                  Create your account
                </Text>

                <GlassFormField
                  label="Full name"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={(t) => { setName(t); clearError("name"); }}
                  error={errors.name}
                  autoCapitalize="words"
                />

                <GlassFormField
                  label="Email"
                  placeholder="name@university.edu"
                  value={email}
                  onChangeText={(t) => { setEmail(t); clearError("email"); }}
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <GlassFormField
                  label="University"
                  placeholder="Select your university"
                  value={university}
                  onChangeText={(t) => { setUniversity(t); clearError("university"); }}
                  error={errors.university}
                  autoCapitalize="words"
                />

                <GlassFormField
                  label="Password"
                  placeholder="Create a password"
                  value={password}
                  onChangeText={(t) => { setPassword(t); clearError("password"); }}
                  error={errors.password}
                  secureTextEntry={!showPassword}
                  rightElement={
                    <EyeToggle
                      showing={showPassword}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />

                <GlassFormField
                  label="Confirm password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChangeText={(t) => { setConfirmPassword(t); clearError("confirmPassword"); }}
                  error={errors.confirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  rightElement={
                    <EyeToggle
                      showing={showConfirmPassword}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  }
                />

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <RoleCard
                    icon="🛍"
                    label="I'm a Buyer"
                    selected={role === "buyer"}
                    onPress={() => setRole("buyer")}
                  />
                  <RoleCard
                    icon="📦"
                    label="I'm a Seller"
                    selected={role === "seller"}
                    onPress={() => setRole("seller")}
                  />
                </View>

                {role === "seller" && (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 6,
                      alignItems: "flex-start",
                    }}
                  >
                    <Text
                      style={{ fontSize: 14, color: "#ffffff80", marginTop: 1 }}
                    >
                      ⓘ
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter-Regular",
                        fontSize: 13,
                        color: "#ffffff80",
                        flex: 1,
                        lineHeight: 18,
                      }}
                    >
                      You can always browse as a buyer even if you plan to sell
                      too
                    </Text>
                  </View>
                )}

                {formError && (
                  <Text
                    style={{
                      fontFamily: "Inter-Regular",
                      fontSize: 13,
                      color: "#dc2626",
                      textAlign: "center",
                    }}
                  >
                    {formError}
                  </Text>
                )}

                <PrimaryButton
                  label="Create account"
                  loading={loading}
                  onPress={handleSignup}
                />
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
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text
                  style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#ffffffcc" }}
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
