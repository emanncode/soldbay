import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { GlassFormField } from "@/components/glass-form-field";
import { PrimaryButton } from "@/components/primary-button";
import { Ionicons } from "@expo/vector-icons";

export default function NewPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const displayEmail = email || "you@email.com";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      router.push(
        `/forgot-password/success?email=${encodeURIComponent(displayEmail)}`,
      );
    }, 1200);
  }

  return (
    <PageAtmosphere>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
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
                gap: 24,
              }}
            >
              <Text
                style={{
                  fontFamily: "BricolageGrotesque-SemiBold",
                  fontSize: 28,
                  color: "#ffffff",
                }}
              >
                Set a new password
              </Text>

              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 15,
                  color: "#ffffff80",
                }}
              >
                Create a new password for
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

              <GlassFormField
                label="New password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                disabled={saving}
                rightElement={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={8}
                    style={{ padding: 4 }}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="rgba(255,255,255,0.6)"
                    />
                  </TouchableOpacity>
                }
              />

              <GlassFormField
                label="Confirm password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                disabled={saving}
                rightElement={
                  <TouchableOpacity
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    hitSlop={8}
                    style={{ padding: 4 }}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color="rgba(255,255,255,0.6)"
                    />
                  </TouchableOpacity>
                }
              />

              <PrimaryButton
                label={saving ? "Saving" : "Save Password"}
                loading={saving}
                onPress={handleSave}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PageAtmosphere>
  );
}
