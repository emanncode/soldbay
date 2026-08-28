import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { CheckCircle2, Clock, Upload, AlertCircle } from "lucide-react-native";
import {
  BackHeader,
  Button,
  ChoiceCard,
  StickyActionBar,
  TextField,
  ToastBanner,
  VerifiedChip,
} from "@/components";
import { getSellerMe, uploadIdImage } from "@/lib/api";
import { colors } from "@/theme/colors";

type VerifyStep = "choice" | "capture" | "pending" | "approved" | "rejected";

export default function SellerVerifyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<VerifyStep>("choice");
  const [method, setMethod] = useState<"portal" | "id_card">("portal");
  const [matricNumber, setMatricNumber] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        setLoading(true);
        const seller = await getSellerMe();
        if (seller.verified) {
          setStep("approved");
        } else if (seller.idImageUrl) {
          setStep("pending");
        } else {
          setStep("choice");
        }
      } catch {
        setStep("choice");
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, []);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    if (!imageUri) {
      setErrorMessage("Please upload a screenshot of your portal or ID card.");
      return;
    }
    if (!matricNumber.trim()) {
      setErrorMessage("Please enter your matriculation number.");
      return;
    }

    try {
      setSubmitting(true);
      await uploadIdImage(imageUri);
      setStep("pending");
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to submit verification.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-base">
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  // Approved State
  if (step === "approved") {
    return (
      <View className="flex-1 bg-surface-base px-3 justify-center items-center">
        <View className="mb-3 h-8 w-8 items-center justify-center rounded-full bg-accent-tint">
          <CheckCircle2 size={40} color={colors.accentHover} />
        </View>
        <Text className="text-center font-manrope-semibold text-h1 text-text-primary">
          You're Verified
        </Text>
        <Text className="mt-1 text-center font-manrope text-body text-text-secondary">
          Your student status has been confirmed. You have the verified seller badge.
        </Text>
        <View className="mt-2">
          <VerifiedChip size="md" />
        </View>
        <View className="mt-6 w-full">
          <Button
            label="Go to Seller Dashboard"
            onPress={() => router.replace("/seller/dashboard")}
            variant="primary"
          />
        </View>
      </View>
    );
  }

  // Pending State
  if (step === "pending") {
    return (
      <View className="flex-1 bg-surface-base px-3 justify-center items-center">
        <View className="mb-3 h-8 w-8 items-center justify-center rounded-full bg-warning-tint">
          <Clock size={40} color={colors.warning} />
        </View>
        <Text className="text-center font-manrope-semibold text-h1 text-text-primary">
          Verification Pending
        </Text>
        <Text className="mt-1 text-center font-manrope text-body text-text-secondary">
          Our team is reviewing your student portal screenshot. This typically takes under 24 hours.
        </Text>
        <View className="mt-6 w-full">
          <Button
            label="Back to Dashboard"
            onPress={() => router.replace("/seller/dashboard")}
            variant="primary"
          />
        </View>
      </View>
    );
  }

  // Choice Step
  if (step === "choice") {
    return (
      <View className="flex-1 bg-surface-base">
        <View style={{ paddingTop: Math.max(insets.top, 16) }} className="px-1">
          <BackHeader onBack={() => router.back()} title="Get Verified" />
        </View>

        <ScrollView className="flex-1 px-3 pt-2">
          <Text className="font-manrope-semibold text-h1 text-text-primary">
            Student Verification
          </Text>
          <Text className="mt-0.5 font-manrope text-body text-text-secondary">
            Verified sellers build trust faster and sell up to 4x quicker on campus.
          </Text>

          <View className="mt-4 gap-2">
            <ChoiceCard
              title="Student Portal Screenshot"
              description="Upload a screenshot of your active university portal dashboard showing your name & matric number."
              selected={method === "portal"}
              onPress={() => setMethod("portal")}
            />
            <ChoiceCard
              title="Student ID Card"
              description="Upload a clear photo of your valid physical student identity card."
              selected={method === "id_card"}
              onPress={() => setMethod("id_card")}
            />
          </View>
        </ScrollView>

        <StickyActionBar>
          <Button
            label="Continue"
            onPress={() => setStep("capture")}
            variant="primary"
          />
        </StickyActionBar>
      </View>
    );
  }

  // Capture Step
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-surface-base"
    >
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="px-1">
        <BackHeader onBack={() => setStep("choice")} title="Upload Proof" />
      </View>

      <ScrollView className="flex-1 px-3 pt-2" keyboardShouldPersistTaps="handled">
        <Text className="font-manrope-semibold text-h1 text-text-primary">
          {method === "portal" ? "Portal Screenshot" : "Student ID Card"}
        </Text>
        <Text className="mt-0.5 font-manrope text-body text-text-secondary">
          Ensure your full name, faculty, and matric number are clearly visible.
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

        <View className="mt-3 gap-2">
          <TextField
            label="Matriculation Number"
            placeholder="e.g. OAU/2022/1049"
            value={matricNumber}
            onChangeText={setMatricNumber}
            autoCapitalize="characters"
          />

          <View className="mt-1">
            <Text className="mb-1 font-manrope-medium text-body-medium text-text-primary">
              Proof Image
            </Text>
            {imageUri ? (
              <View className="relative h-24 w-full overflow-hidden rounded-md border border-neutral-300 bg-neutral-100">
                <Image source={{ uri: imageUri }} className="h-full w-full" resizeMode="cover" />
                <Pressable
                  onPress={handlePickImage}
                  className="absolute bottom-2 right-2 rounded-sm bg-neutral-900/80 px-1.5 py-1"
                >
                  <Text className="font-manrope-medium text-caption text-text-inverse">
                    Change photo
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={handlePickImage}
                className="h-24 w-full items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 active:bg-neutral-100"
              >
                <Upload size={28} color={colors.neutral500} />
                <Text className="mt-1 font-manrope-medium text-small text-text-primary">
                  Tap to upload image
                </Text>
                <Text className="font-manrope text-caption text-text-tertiary">
                  JPEG or PNG up to 5MB
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>

      <StickyActionBar>
        <Button
          label="Submit Verification"
          onPress={handleSubmit}
          loading={submitting}
          disabled={!imageUri || !matricNumber.trim()}
          variant="primary"
        />
      </StickyActionBar>
    </KeyboardAvoidingView>
  );
}
