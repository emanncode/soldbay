import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertCircle, CheckCircle2, Clock, Store } from "lucide-react-native";
import { BackHeader, Button, ToastBanner } from "@/components";
import {
  getPetitionStatus,
  petitionToBecomeSeller,
  refreshToken,
  saveLastActiveMode,
  saveToken,
  type PetitionStatus as PetitionStatusType,
} from "@/lib/api";
import { goBackSafe } from "@/lib/navigation";
import { colors } from "@/theme/colors";

type ScreenState = "loading" | "ask" | "pending" | "rejected" | "approved";

/**
 * Buyer-mode petition to become a campus seller.
 *
 * This replaces the old "switch to seller" upgrade screen: the user is NOT
 * converted to SELLER here, no new fields are collected from them, and the
 * backend never flips their role. It is a Yes/No request only. When they say
 * yes, they get the same "awaiting review" message a new seller sees, and they
 * are sent back to normal buyer pages until an admin approves the petition.
 * On approval their next app launch heals into seller mode automatically.
 */
export default function SellerPetitionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [state, setState] = useState<ScreenState>("loading");
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const applyPetitionStatus = (status: PetitionStatusType, reason: string | null) => {
    if (status === "PENDING") setState("pending");
    else if (status === "REJECTED") {
      setRejectionReason(reason);
      setState("rejected");
    } else if (status === "APPROVED") setState("approved");
    else setState("ask");
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await getPetitionStatus();
        applyPetitionStatus(res.petitionStatus, res.rejectionReason ?? null);
      } catch (err: any) {
        setErrorMessage(err?.message || "Could not load your request.");
        setState("ask");
      }
    })();
  }, []);

  const handlePetition = async () => {
    setErrorMessage(null);
    setSubmitting(true);
    try {
      const res = await petitionToBecomeSeller();
      applyPetitionStatus(res.verificationStatus, null);
    } catch (err: any) {
      if (err?.status === 409) {
        // Already a seller (e.g. role flipped but token not yet healed).
        setState("approved");
      } else {
        setErrorMessage(err?.message || "Request failed. Please try again.");
        setState("ask");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnterSellerMode = async () => {
    setErrorMessage(null);
    setSubmitting(true);
    try {
      const res = await refreshToken();
      await saveToken(res.token);
      await saveLastActiveMode("seller");
      router.replace("/seller/dashboard");
    } catch {
      setErrorMessage("Could not refresh your session. Please sign in again.");
      setState("approved");
    } finally {
      setSubmitting(false);
    }
  };

  if (state === "loading") {
    return (
      <View className="flex-1 items-center justify-center bg-surface-base">
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  // Pending — same awaiting message a newly-signed-up seller sees.
  if (state === "pending") {
    return (
      <View className="flex-1 bg-surface-base px-3 justify-center items-center">
        <View className="mb-3 h-8 w-8 items-center justify-center rounded-full bg-warning-tint">
          <Clock size={40} color={colors.warning} />
        </View>
        <Text className="text-center font-manrope-semibold text-h1 text-text-primary">
          Petition Sent
        </Text>
        <Text className="mt-1 text-center font-manrope text-body text-text-secondary">
          Our team is reviewing your request to become a campus seller. This
          typically takes under 24 hours.
        </Text>
        <Text className="mt-3 text-center font-manrope text-small text-text-tertiary">
          You’ll keep browsing and buying as a buyer for now — you get full
          seller mode as soon as your petition is approved.
        </Text>
        <View className="mt-6 w-full gap-2">
          <Button
            label="Back to Buyer Home"
            onPress={() => router.replace("/buyer/home")}
            variant="primary"
          />
          <Button
            label="Go to Profile"
            onPress={() => router.replace("/profile")}
            variant="secondary"
          />
        </View>
      </View>
    );
  }

  // Rejected — allow petitioning again.
  if (state === "rejected") {
    return (
      <View className="flex-1 bg-surface-base px-3 justify-center items-center">
        <View
          style={{ backgroundColor: colors.errorTint }}
          className="mb-3 h-8 w-8 items-center justify-center rounded-full"
        >
          <AlertCircle size={40} color={colors.error} />
        </View>
        <Text className="text-center font-manrope-semibold text-h1 text-text-primary">
          Request Rejected
        </Text>
        <Text className="mt-1 text-center font-manrope text-body text-text-secondary">
          {rejectionReason
            ? rejectionReason
            : "We could not approve your request to become a campus seller."}
        </Text>
        <Text className="mt-3 text-center font-manrope text-small text-text-tertiary">
          You can petition again if you believe this is a mistake, or contact
          support for help.
        </Text>
        <View className="mt-6 w-full gap-2">
          <Button
            label="Petition Again"
            onPress={handlePetition}
            loading={submitting}
            variant="primary"
          />
          <Button
            label="Not Now"
            onPress={() => router.replace("/profile")}
            variant="secondary"
          />
        </View>
      </View>
    );
  }

  // Approved — heal a possibly stale BUYER token into seller mode.
  if (state === "approved") {
    return (
      <View className="flex-1 bg-surface-base px-3 justify-center items-center">
        <View className="mb-3 h-8 w-8 items-center justify-center rounded-full bg-accent-tint">
          <CheckCircle2 size={40} color={colors.accentHover} />
        </View>
        <Text className="text-center font-manrope-semibold text-h1 text-text-primary">
          You’re In
        </Text>
        <Text className="mt-1 text-center font-manrope text-body text-text-secondary">
          Your petition was approved. You can now start selling on campus.
        </Text>
        <View className="mt-6 w-full gap-2">
          <Button
            label="Enter Seller Mode"
            onPress={handleEnterSellerMode}
            loading={submitting}
            variant="primary"
          />
          <Button
            label="Back to Profile"
            onPress={() => router.replace("/profile")}
            variant="secondary"
          />
        </View>
      </View>
    );
  }

  // Ask — the Yes/No petition prompt.
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: Math.max(insets.top, 16),
        paddingBottom: Math.max(insets.bottom + 24, 32),
        paddingHorizontal: 12,
      }}
      className="flex-1 bg-surface-base"
    >
      <View className="px-1">
        <BackHeader onBack={() => goBackSafe(router, "/profile")} />
      </View>

      <View className="flex-1 justify-center pt-6">
        <View className="mb-4 items-center">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-accent-tint">
            <Store size={26} color={colors.accentHover} />
          </View>
        </View>

        <Text className="text-center font-manrope-semibold text-h2 text-text-primary">
          Become a Campus Seller?
        </Text>
        <Text className="mt-1 text-center font-manrope text-body text-text-secondary">
          You can sell on campus using your existing Soldbay account — no new
          signup needed. Once you petition, our team will review your request
          and you’ll keep browsing as a buyer in the meantime.
        </Text>

        {errorMessage ? (
          <View className="mt-3">
            <ToastBanner
              visible={Boolean(errorMessage)}
              message={errorMessage}
              type="error"
              onDismiss={() => setErrorMessage(null)}
            />
          </View>
        ) : null}

        <View className="mt-6 gap-2">
          <Button
            label="Yes, Petition to Sell"
            onPress={handlePetition}
            loading={submitting}
            variant="primary"
          />
          <Button
            label="Not Now"
            onPress={() => goBackSafe(router, "/profile")}
            variant="secondary"
          />
        </View>
      </View>
    </ScrollView>
  );
}