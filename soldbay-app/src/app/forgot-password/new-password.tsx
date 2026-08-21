import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SoldBayInputField } from "@/components/soldbay-input-field";
import { PrimaryButton } from "@/components/primary-button";
import { Ionicons } from "@expo/vector-icons";
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

export default function NewPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const displayEmail = email || "you@email.com";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  // Staggered list items (4 items: Title/subtitle, Password, Confirm Password, Button)
  const [itemAnims] = useState(() =>
    Array.from({ length: 4 }, () => ({
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
    <AuthLayoutWrapper
      backRoute="/forgot-password/enter-code"
      backTitle="Reset password"
      staggerAnimations={staggerAnimations}
    >
      {/* Item 0: Card Title & Subtitle */}
      <Animated.View
        style={{
          opacity: itemAnims[0].opacity,
          transform: [{ translateY: itemAnims[0].translateY }],
        }}
      >
        <Text style={styles.cardTitle}>Set a new password</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.cardSubtitle}>
            {"Create a new password for "}
            <Text style={styles.boldEmail}>{displayEmail}</Text>
          </Text>
        </View>
      </Animated.View>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {/* Item 1: New password input */}
        <Animated.View
          style={{
            opacity: itemAnims[1].opacity,
            transform: [{ translateY: itemAnims[1].translateY }],
          }}
        >
          <SoldBayInputField
            label="New password"
            icon="lock-closed-outline"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            disabled={saving}
            dense
            rightElement={
              <EyeToggle
                showing={showPassword}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
        </Animated.View>

        {/* Item 2: Confirm password input */}
        <Animated.View
          style={{
            opacity: itemAnims[2].opacity,
            transform: [{ translateY: itemAnims[2].translateY }],
          }}
        >
          <SoldBayInputField
            label="Confirm password"
            icon="lock-closed-outline"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            disabled={saving}
            dense
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

        {/* Item 3: Save password PrimaryButton */}
        <Animated.View
          style={{
            opacity: itemAnims[3].opacity,
            transform: [{ translateY: itemAnims[3].translateY }],
          }}
        >
          <PrimaryButton
            label={saving ? "Saving" : "Save Password"}
            loading={saving}
            onPress={handleSave}
            dense
          />
        </Animated.View>
      </View>
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
  subtitleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  cardSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  boldEmail: {
    fontFamily: "Inter-SemiBold",
    color: "#000000",
  },
  formContainer: {
    gap: 14,
  },
});
