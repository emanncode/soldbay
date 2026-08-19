import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { SoldBayInputField } from "@/components/soldbay-input-field";
import { PrimaryButton } from "@/components/primary-button";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [showSentModal, setShowSentModal] = useState(false);
  const [resending, setResending] = useState(false);

  function validate() {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return false;
    }
    setError(undefined);
    return true;
  }

  async function handleSendCode() {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setShowSentModal(true);
  }

  async function handleResend() {
    setResending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setResending(false);
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

              <Text style={styles.cardTitle}>Reset your password</Text>
              <Text style={styles.cardSubtitle}>
                {"Enter the email associated with your account and we'll send you a verification code."}
              </Text>

              {/* Form Fields */}
              <View style={styles.formContainer}>
                <SoldBayInputField
                  label="Email"
                  icon="mail-outline"
                  placeholder="you@email.com"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    setError(undefined);
                  }}
                  error={error}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  disabled={loading}
                />

                <PrimaryButton
                  label="Send Reset Code"
                  loading={loading}
                  onPress={handleSendCode}
                />

                <View style={styles.loginLinkRow}>
                  <Text style={styles.loginLinkText}>Back to</Text>
                  <TouchableOpacity onPress={() => router.push("/login")}>
                    <Text style={styles.loginLinkButton}>Log in</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal transparent visible={showSentModal} animationType="fade">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="mail" size={32} color="#e1261c" />
              </View>

              <Text style={styles.modalTitle}>Check your email</Text>
              <Text style={styles.modalSubtitle}>
                {"We've sent a 6-digit verification code to"}
              </Text>
              <Text style={styles.modalEmail}>{email}</Text>

              <PrimaryButton
                label="Continue"
                onPress={() => {
                  setShowSentModal(false);
                  router.push(
                    `/forgot-password/enter-code?email=${encodeURIComponent(email)}`,
                  );
                }}
              />

              <View style={styles.resendRow}>
                <Text style={styles.resendText}>{"Didn't get it? "}</Text>
                <TouchableOpacity onPress={handleResend} disabled={resending}>
                  <Text
                    style={[
                      styles.resendButton,
                      resending && { color: "rgba(0,0,0,0.3)" },
                    ]}
                  >
                    {resending ? "Resending..." : "Resend"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
    paddingTop: 40,
    paddingBottom: 30,
  },
  logo: {
    width: 130,
    height: 130,
    marginTop: 12,
  },
  brandName: {
    fontFamily: "BricolageGrotesque-SemiBold",
    fontSize: 24,
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
  cardSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 32,
  },
  formContainer: {
    gap: 20,
  },
  loginLinkRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginTop: 8,
  },
  loginLinkText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748b",
  },
  loginLinkButton: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#e1261c",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 342,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 28,
    gap: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(225,38,28,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontFamily: "BricolageGrotesque-SemiBold",
    fontSize: 24,
    color: "#000000",
    textAlign: "center",
  },
  modalSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
  modalEmail: {
    fontFamily: "Inter-SemiBold",
    fontSize: 15,
    color: "#000000",
    textAlign: "center",
  },
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  resendText: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#64748b",
  },
  resendButton: {
    fontFamily: "Inter-SemiBold",
    fontSize: 13,
    color: "#e1261c",
  },
});
