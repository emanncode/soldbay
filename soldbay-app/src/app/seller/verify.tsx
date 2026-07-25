import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { PrimaryButton } from "@/components/primary-button";
import { ErrorBanner } from "@/components/error-banner";
import { getSellerMe, uploadIdImage, ApiError } from "@/lib/api";

type ScreenState = "loading" | "upload" | "preview" | "submitting" | "pending" | "verified";

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
        setScreenState("upload");
      }
    } catch {
      setScreenState("upload");
    }
  }

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setScreenState("preview");
      setFormError(null);
    }
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

  function renderContent() {
    switch (screenState) {
      case "loading":
        return (
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
        );

      case "upload":
        return (
          <>
            <Text
              style={{
                fontFamily: "BricolageGrotesque-SemiBold",
                fontSize: 28,
                color: "#ffffff",
              }}
            >
              Verify your student status
            </Text>

            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 15,
                color: "#ffffff80",
                lineHeight: 22,
              }}
            >
              Upload a photo of your student ID to get verified as a seller
            </Text>

            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.8}
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.2)",
                borderRadius: 16,
                height: 200,
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: "rgba(255,255,255,0.05)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="image-outline" size={28} color="#ffffff66" />
              </View>
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: 15,
                  color: "#ffffff80",
                }}
              >
                Tap to upload
              </Text>
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 12,
                  color: "#ffffff4d",
                }}
              >
                JPG, PNG or HEIC — max 10 MB
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 13,
                color: "#ffffff4d",
                textAlign: "center",
                lineHeight: 18,
              }}
            >
              Your ID is only used for verification and isn't shared with
              buyers.
            </Text>

            <View style={{ opacity: 0.4 }}>
              <PrimaryButton
                label="Submit for review"
                onPress={() => {}}
                disabled
              />
            </View>
          </>
        );

      case "preview":
        return (
          <>
            <Text
              style={{
                fontFamily: "BricolageGrotesque-SemiBold",
                fontSize: 28,
                color: "#ffffff",
              }}
            >
              Verify your student status
            </Text>

            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 15,
                color: "#ffffff80",
                lineHeight: 22,
              }}
            >
              Upload a photo of your student ID to get verified as a seller
            </Text>

            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.8}
              style={{
                backgroundColor: "rgba(0,0,0,0.2)",
                borderWidth: 1,
                borderColor: "rgba(22,163,74,0.3)",
                borderRadius: 16,
                height: 200,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {imageUri && (
                <View style={{ alignItems: "center", gap: 8 }}>
                  <View
                    style={{
                      width: 160,
                      height: 110,
                      borderRadius: 12,
                      backgroundColor: "rgba(255,255,255,0.06)",
                      borderWidth: 1,
                      borderColor: "#ffffff1f",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: 16,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 6,
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                    />
                    <View
                      style={{
                        width: 100,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#ffffff1f",
                      }}
                    />
                    <View
                      style={{
                        width: 80,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "#ffffff14",
                      }}
                    />
                    <View
                      style={{
                        width: 60,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "#ffffff14",
                      }}
                    />
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 22,
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: "#16a34a",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                  </View>
                </View>
              )}

              <TouchableOpacity
                onPress={pickImage}
                style={{ marginTop: 8 }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    fontSize: 13,
                    color: "#ffffff66",
                  }}
                >
                  Tap to change photo
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>

            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 13,
                color: "#ffffff4d",
                textAlign: "center",
                lineHeight: 18,
              }}
            >
              Your ID is only used for verification and isn't shared with
              buyers.
            </Text>

            {formError && <ErrorBanner message={formError} />}

            <PrimaryButton
              label="Submit for review"
              onPress={handleSubmit}
            />
          </>
        );

      case "submitting":
        return (
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <PrimaryButton label="Submitting" loading />
          </View>
        );

      case "pending":
        return (
          <View
            style={{
              alignItems: "center",
              gap: 20,
              paddingTop: 60,
            }}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: "rgba(245,158,11,0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="time-outline" size={36} color="#f59e0b" />
            </View>

            <Text
              style={{
                fontFamily: "BricolageGrotesque-SemiBold",
                fontSize: 24,
                color: "#ffffff",
                textAlign: "center",
              }}
            >
              We're reviewing your ID
            </Text>

            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 14,
                color: "#ffffff80",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              This usually takes about a day. We'll notify you once you're
              approved.
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 4,
                paddingTop: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 13,
                  color: "#ffffff66",
                }}
              >
                In the meantime,{" "}
              </Text>
              <TouchableOpacity onPress={() => router.replace("/")}>
                <Text
                  style={{
                    fontFamily: "Inter-SemiBold",
                    fontSize: 13,
                    color: "#e1261c",
                  }}
                >
                  browse as a buyer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case "verified":
        return (
          <View
            style={{
              alignItems: "center",
              gap: 20,
              paddingTop: 60,
            }}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: "rgba(34,197,94,0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={36}
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
              You're verified!
            </Text>

            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 14,
                color: "#ffffff80",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Your seller account is approved. You can start creating listings
              now.
            </Text>
          </View>
        );
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
                Seller verification
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 24,
                paddingBottom: 24,
                gap: 24,
              }}
            >
              {renderContent()}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PageAtmosphere>
  );
}
