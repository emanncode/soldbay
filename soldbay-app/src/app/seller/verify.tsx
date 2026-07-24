import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { GlassPanel } from "@/components/glass-panel";
import { LogoWordmark } from "@/components/logo-wordmark";
import { PrimaryButton } from "@/components/primary-button";
import { getSellerMe, uploadIdImage, ApiError } from "@/lib/api";

type ScreenState = "loading" | "pick" | "preview" | "submitting" | "pending" | "verified";

export default function VerifySellerScreen() {
  const router = useRouter();
  const [screenState, setScreenState] = useState<ScreenState>("loading");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    checkStatus();
  }, []);

  async function checkStatus() {
    try {
      const me = await getSellerMe();
      if (me.verified) {
        setScreenState("verified");
      } else if (me.idImageUrl) {
        setScreenState("pending");
      } else {
        setScreenState("pick");
      }
    } catch {
      setScreenState("pick");
    }
  }

  async function pickImage(useCamera: boolean) {
    const method = useCamera
      ? ImagePicker.launchCameraAsync
      : ImagePicker.launchImageLibraryAsync;

    const result = await method({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setScreenState("preview");
      setFormError(null);
    }
  }

  function handleChoose() {
    Alert.alert("Upload Student ID", "Take a photo or choose from your library", [
      { text: "Cancel", style: "cancel" },
      { text: "Take Photo", onPress: () => pickImage(true) },
      { text: "Choose from Library", onPress: () => pickImage(false) },
    ]);
  }

  async function handleSubmit() {
    if (!imageUri) return;
    setScreenState("submitting");
    setFormError(null);

    try {
      await uploadIdImage(imageUri);
      setScreenState("pending");
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError("Upload failed. Please try again.");
      }
      setScreenState("preview");
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
                {/* Loading state */}
                {screenState === "loading" && (
                  <View style={{ alignItems: "center", paddingVertical: 20 }}>
                    <Text
                      style={{
                        fontFamily: "Inter-Regular",
                        fontSize: 15,
                        color: "#ffffff99",
                      }}
                    >
                      Checking your status...
                    </Text>
                  </View>
                )}

                {/* Pick state — explain + choose */}
                {screenState === "pick" && (
                  <>
                    <Text
                      style={{
                        fontFamily: "BricolageGrotesque-SemiBold",
                        fontSize: 28,
                        color: "#ffffff",
                      }}
                    >
                      Verify your seller account
                    </Text>

                    <Text
                      style={{
                        fontFamily: "Inter-Regular",
                        fontSize: 15,
                        color: "#ffffffb3",
                        lineHeight: 22,
                      }}
                    >
                      Upload a photo of your student ID to get verified. This
                      helps us confirm you&apos;re part of your university
                      community.
                    </Text>

                    <TouchableOpacity
                      onPress={handleChoose}
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: "#00000059",
                        borderWidth: 1,
                        borderStyle: "dashed",
                        borderColor: "#ffffff33",
                        borderRadius: 16,
                        paddingVertical: 40,
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <Ionicons
                        name="camera-outline"
                        size={40}
                        color="#ffffff66"
                      />
                      <Text
                        style={{
                          fontFamily: "Inter-Medium",
                          fontSize: 15,
                          color: "#ffffff99",
                        }}
                      >
                        Tap to upload your student ID
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Inter-Regular",
                          fontSize: 12,
                          color: "#ffffff66",
                        }}
                      >
                        JPEG, PNG, or WebP — max 5 MB
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* Preview state */}
                {screenState === "preview" && (
                  <>
                    <Text
                      style={{
                        fontFamily: "BricolageGrotesque-SemiBold",
                        fontSize: 28,
                        color: "#ffffff",
                      }}
                    >
                      Review your photo
                    </Text>

                    <Text
                      style={{
                        fontFamily: "Inter-Regular",
                        fontSize: 15,
                        color: "#ffffffb3",
                        lineHeight: 22,
                      }}
                    >
                      Make sure your student ID is clearly visible and the text
                      is readable.
                    </Text>

                    {imageUri && (
                      <View
                        style={{
                          borderRadius: 16,
                          overflow: "hidden",
                          borderWidth: 1,
                          borderColor: "#ffffff1f",
                        }}
                      >
                        <Image
                          source={{ uri: imageUri }}
                          style={{
                            width: "100%",
                            height: 220,
                            borderRadius: 16,
                          }}
                          resizeMode="cover"
                        />
                      </View>
                    )}

                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <TouchableOpacity
                        onPress={() => {
                          setImageUri(null);
                          setScreenState("pick");
                        }}
                        activeOpacity={0.8}
                        style={{
                          flex: 1,
                          backgroundColor: "#ffffff12",
                          borderWidth: 1,
                          borderColor: "#ffffff1f",
                          borderRadius: 999,
                          paddingVertical: 14,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Inter-SemiBold",
                            fontSize: 15,
                            color: "#ffffffcc",
                          }}
                        >
                          Retake
                        </Text>
                      </TouchableOpacity>

                      <View style={{ flex: 1.5 }}>
                        <PrimaryButton
                          label="Submit for review"
                          onPress={handleSubmit}
                        />
                      </View>
                    </View>

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
                  </>
                )}

                {/* Submitting state */}
                {screenState === "submitting" && (
                  <View style={{ alignItems: "center", paddingVertical: 20 }}>
                    <PrimaryButton label="Uploading" loading />
                  </View>
                )}

                {/* Pending review state */}
                {screenState === "pending" && (
                  <>
                    <View style={{ alignItems: "center", gap: 16 }}>
                      <View
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 28,
                          backgroundColor: "#f59e0b22",
                          borderWidth: 1,
                          borderColor: "#f59e0b55",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons
                          name="time-outline"
                          size={28}
                          color="#f59e0b"
                        />
                      </View>

                      <Text
                        style={{
                          fontFamily: "BricolageGrotesque-SemiBold",
                          fontSize: 24,
                          color: "#ffffff",
                          textAlign: "center",
                        }}
                      >
                        Pending review
                      </Text>

                      <Text
                        style={{
                          fontFamily: "Inter-Regular",
                          fontSize: 15,
                          color: "#ffffffb3",
                          textAlign: "center",
                          lineHeight: 22,
                        }}
                      >
                        We&apos;re reviewing your ID — this usually takes a
                        day. We&apos;ll notify you once you&apos;re approved.
                      </Text>
                    </View>
                  </>
                )}

                {/* Already verified state */}
                {screenState === "verified" && (
                  <>
                    <View style={{ alignItems: "center", gap: 16 }}>
                      <View
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 28,
                          backgroundColor: "#22c55e22",
                          borderWidth: 1,
                          borderColor: "#22c55e55",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={28}
                          color="#22c55e"
                        />
                      </View>

                      <Text
                        style={{
                          fontFamily: "BricolageGrotesque-SemiBold",
                          fontSize: 24,
                          color: "#ffffff",
                          textAlign: "center",
                        }}
                      >
                        You&apos;re verified!
                      </Text>

                      <Text
                        style={{
                          fontFamily: "Inter-Regular",
                          fontSize: 15,
                          color: "#ffffffb3",
                          textAlign: "center",
                          lineHeight: 22,
                        }}
                      >
                        Your seller account is approved. You can start creating
                        listings now.
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </GlassPanel>

            {screenState !== "loading" && screenState !== "submitting" && (
              <View
                style={{
                  paddingVertical: 24,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={() => router.back()}>
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: 14,
                      color: "#ffffff80",
                    }}
                  >
                    Go back
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PageAtmosphere>
  );
}
