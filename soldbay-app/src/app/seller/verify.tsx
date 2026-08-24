import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { AuthLayoutWrapper } from "@/components/auth-layout-wrapper";
import { PrimaryButton } from "@/components/primary-button";
import { ErrorBanner } from "@/components/error-banner";
import { getSellerMe, uploadIdImage, ApiError } from "@/lib/api";

type ScreenState = "loading" | "upload" | "preview" | "submitting" | "pending" | "verified";

export default function VerifySellerScreen() {
  const router = useRouter();
  const [screenState, setScreenState] = useState<ScreenState>("loading");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const stateAnim = useRef(new Animated.Value(1)).current;
  const stateTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    stateAnim.setValue(0);
    stateTranslateY.setValue(12);
    Animated.parallel([
      Animated.timing(stateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(stateTranslateY, {
        toValue: 0,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [screenState, stateAnim, stateTranslateY]);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      checkStatus();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
      } else if (err instanceof TypeError) {
        setFormError(`Network error: ${err.message}`);
      } else if (err instanceof Error) {
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
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Checking your status...</Text>
          </View>
        );

      case "upload":
        return (
          <View style={styles.stateContainer}>
            <Text style={styles.cardTitle}>Verify Student ID</Text>
            <Text style={styles.cardSubtitle}>
              Upload a clear photo of your student ID to start selling to verified students on campus.
            </Text>

            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.8}
              style={styles.uploadZone}
            >
              <View style={styles.uploadIconCircle}>
                <Ionicons name="cloud-upload-outline" size={30} color="#4ade80" />
              </View>
              <Text style={styles.uploadTitle}>Tap to select student ID</Text>
              <Text style={styles.uploadFormat}>JPG, PNG or HEIC (max 10 MB)</Text>
            </TouchableOpacity>

            <View style={styles.securityNoteRow}>
              <Ionicons name="shield-checkmark-outline" size={16} color="rgba(255,255,255,0.6)" />
              <Text style={styles.securityNote}>
                {"Your ID is stored securely and never shared with buyers."}
              </Text>
            </View>

            <PrimaryButton
              label="Choose Photo"
              onPress={pickImage}
            />
          </View>
        );

      case "preview":
        return (
          <View style={styles.stateContainer}>
            <Text style={styles.cardTitle}>Review ID Photo</Text>
            <Text style={styles.cardSubtitle}>
              Make sure your name and university details are legible.
            </Text>

            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.85}
              style={styles.previewContainer}
            >
              {imageUri && (
                <Image
                  source={{ uri: imageUri }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
              )}

              <View style={styles.previewBadge}>
                <Ionicons name="checkmark" size={16} color="#ffffff" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={pickImage} style={styles.changePhotoBtn}>
              <Ionicons name="camera-reverse-outline" size={16} color="#4ade80" />
              <Text style={styles.changePhotoText}>Tap to change photo</Text>
            </TouchableOpacity>

            {formError && <ErrorBanner message={formError} />}

            <PrimaryButton
              label="Submit for review"
              onPress={handleSubmit}
            />
          </View>
        );

      case "submitting":
        return (
          <View style={styles.stateContainer}>
            <Text style={styles.cardTitle}>Uploading ID</Text>
            <Text style={styles.cardSubtitle}>
              Please wait while we encrypt and send your document.
            </Text>
            <View style={{ marginTop: 24 }}>
              <PrimaryButton label="Submitting..." loading />
            </View>
          </View>
        );

      case "pending":
        return (
          <View style={styles.statusStateContainer}>
            <View style={styles.pendingIconCircle}>
              <Ionicons name="time-outline" size={40} color="#f59e0b" />
            </View>

            <Text style={styles.statusTitle}>{"We're reviewing your ID"}</Text>

            <Text style={styles.statusSubtitle}>
              {"Verification typically takes a few hours. We will notify you once approved."}
            </Text>

            <View style={styles.actionBlock}>
              <PrimaryButton
                label="Browse as Buyer"
                onPress={() => router.replace("/buyer/home")}
              />
            </View>
          </View>
        );

      case "verified":
        return (
          <View style={styles.statusStateContainer}>
            <View style={styles.verifiedIconCircle}>
              <Ionicons
                name="checkmark-circle-outline"
                size={42}
                color="#22c55e"
              />
            </View>

            <Text style={styles.statusTitle}>{"You're Verified!"}</Text>

            <Text style={styles.statusSubtitle}>
              Your seller account is approved. You can now publish listings and sell items on campus.
            </Text>

            <View style={styles.actionBlock}>
              <PrimaryButton
                label="Go to Seller Dashboard"
                onPress={() => router.replace("/seller/dashboard")}
              />
            </View>
          </View>
        );
    }
  }

  return (
    <AuthLayoutWrapper backRoute="/buyer/home" backTitle="Back">
      <Animated.View
        style={{
          opacity: stateAnim,
          transform: [{ translateY: stateTranslateY }],
        }}
      >
        {renderContent()}
      </Animated.View>
    </AuthLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  stateContainer: {
    gap: 16,
  },
  cardTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 26,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  uploadZone: {
    backgroundColor: "#18181b",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(34, 197, 94, 0.4)",
    borderRadius: 20,
    height: 190,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
  },
  uploadIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 15,
    color: "#ffffff",
  },
  uploadFormat: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },
  securityNoteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  securityNote: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
  previewContainer: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  previewBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
  changePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 6,
  },
  changePhotoText: {
    fontFamily: "Inter-Medium",
    fontSize: 13,
    color: "#4ade80",
  },
  statusStateContainer: {
    alignItems: "center",
    gap: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  pendingIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  verifiedIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statusTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#ffffff",
    textAlign: "center",
  },
  statusSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  actionBlock: {
    width: "100%",
    marginTop: 20,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 36,
  },
  loadingText: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
  },
});
