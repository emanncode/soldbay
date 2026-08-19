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
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { SoldBayInputField } from "@/components/soldbay-input-field";
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
        color="rgba(0,0,0,0.35)"
      />
    </TouchableOpacity>
  );
}

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
            <View style={styles.card}>
              <View style={styles.backRow}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={22} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.backTitle}>Reset password</Text>
              </View>

              <Text style={styles.cardTitle}>Set a new password</Text>
              <View style={styles.subtitleContainer}>
                <Text style={styles.cardSubtitle}>
                  {"Create a new password for "}
                  <Text style={styles.boldEmail}>{displayEmail}</Text>
                </Text>
              </View>

              {/* Form Fields */}
              <View style={styles.formContainer}>
                <SoldBayInputField
                  label="New password"
                  icon="lock-closed-outline"
                  placeholder="Create a password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  disabled={saving}
                  rightElement={
                    <EyeToggle
                      showing={showPassword}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />

                <SoldBayInputField
                  label="Confirm password"
                  icon="lock-closed-outline"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  disabled={saving}
                  rightElement={
                    <EyeToggle
                      showing={showConfirmPassword}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  }
                />

                <PrimaryButton
                  label={saving ? "Saving" : "Save Password"}
                  loading={saving}
                  onPress={handleSave}
                />
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
  formContainer: {
    gap: 20,
  },
});
