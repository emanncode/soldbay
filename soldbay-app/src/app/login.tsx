import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { GlassPanel } from "@/components/glass-panel";
import { LogoWordmark } from "@/components/logo-wordmark";
import { GlassFormField } from "@/components/glass-form-field";
import { PrimaryButton } from "@/components/primary-button";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  function validate() {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
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
                  Welcome back
                </Text>

                <GlassFormField
                  label="Email"
                  placeholder="name@university.edu"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    setErrors((e) => ({ ...e, email: undefined }));
                  }}
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <GlassFormField
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    setErrors((e) => ({ ...e, password: undefined }));
                  }}
                  error={errors.password}
                  secureTextEntry={!showPassword}
                  rightElement={
                    <EyeToggle
                      showing={showPassword}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />

                <TouchableOpacity
                  onPress={() => router.push("/forgot-password")}
                  style={{ alignItems: "flex-end" }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: 13,
                      color: "#ffffff99",
                    }}
                  >
                    Forgot password?
                  </Text>
                </TouchableOpacity>

                <PrimaryButton
                  label="Log in"
                  loading={loading}
                  onPress={handleLogin}
                />
              </View>
            </GlassPanel>

            <TouchableOpacity
              onPress={() => router.push("/signup")}
              style={{ paddingVertical: 24, alignItems: "center" }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 14,
                  color: "#ffffff80",
                }}
              >
                Don't have an account?{" "}
                <Text
                  style={{ fontFamily: "Inter-SemiBold", color: "#ffffffcc" }}
                >
                  Sign up
                </Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PageAtmosphere>
  );
}
