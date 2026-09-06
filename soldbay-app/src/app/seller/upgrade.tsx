import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Store } from "lucide-react-native";
import { BackHeader, Button, TextField, ToastBanner } from "@/components";
import {
  saveLastActiveMode,
  saveToken,
  upgradeToSeller,
} from "@/lib/api";
import { goBackSafe } from "@/lib/navigation";
import { colors } from "@/theme/colors";

/**
 * In-place switch to campus seller for an existing BUYER account.
 *
 * Instead of routing the user back through the full signup flow, this screen
 * collects the few seller-only fields and lets the /api/sellers/upgrade
 * endpoint create the SellerProfile and flip the role. The returned token
 * (already carrying the SELLER role) replaces the stored one, then the user
 * lands on the verification screen.
 */
export default function SellerUpgradeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setErrorMessage(null);

    if (!username.trim()) {
      setErrorMessage("Please choose a username for your store.");
      return;
    }

    try {
      setLoading(true);
      const res = await upgradeToSeller({
        username: username.trim(),
        businessName: businessName.trim() || undefined,
        bio: bio.trim() || undefined,
      });

      await saveToken(res.token);
      await saveLastActiveMode("seller");
      router.replace("/seller/verify");
    } catch (err: any) {
      setErrorMessage(err?.message || "Switch failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-surface-base"
    >
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="px-1">
        <BackHeader onBack={() => goBackSafe(router, "/profile")} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom + 24, 32),
        }}
        className="flex-1 px-3"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center gap-2">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-accent-tint">
            <Store size={20} color={colors.accentHover} />
          </View>
          <View className="flex-1">
            <Text className="font-manrope-semibold text-h1 text-text-primary">
              Switch to Campus Seller
            </Text>
            <Text className="mt-0.5 font-manrope text-body text-text-secondary">
              Keep your account. Start selling on campus.
            </Text>
          </View>
        </View>

        <Text className="mt-4 font-manrope text-body text-text-secondary">
          Your account is already signed in, so there is no need to sign up
          again. Set up your store below, then complete a quick verification to
          start selling.
        </Text>

        {errorMessage ? (
          <View className="mt-2">
            <ToastBanner
              visible={Boolean(errorMessage)}
              message={errorMessage}
              type="error"
              onDismiss={() => setErrorMessage(null)}
            />
          </View>
        ) : null}

        <View className="mt-4 gap-2">
          <TextField
            label="Store Username"
            placeholder="e.g. adasbooks"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            helperText="Lowercase letters, numbers, dots, and underscores only"
          />

          <TextField
            label="Store Name (Optional)"
            placeholder="e.g. Ada's Campus Books"
            value={businessName}
            onChangeText={setBusinessName}
            autoCapitalize="words"
          />

          <TextField
            label="Bio (Optional)"
            placeholder="Tell buyers what you sell"
            value={bio}
            onChangeText={setBio}
            autoCapitalize="sentences"
            multiline
            helperText={`Up to 500 characters (${bio.trim().length}/500)`}
          />

          <View className="mt-2">
            <Button
              label="Start Selling"
              onPress={handleUpgrade}
              loading={loading}
              variant="primary"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}