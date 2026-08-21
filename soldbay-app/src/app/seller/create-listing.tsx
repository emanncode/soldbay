import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { GlassFormField } from "@/components/glass-form-field";
import { PrimaryButton } from "@/components/primary-button";
import { ErrorBanner } from "@/components/error-banner";
import {
  getSellerMe,
  createListing,
  uploadListingImages,
  ApiError,
} from "@/lib/api";

const IMAGE_MIN_DIMENSION = 400;
const IMAGE_MAX_DIMENSION = 4096;
const IMAGE_MAX_FILE_SIZE = 5 * 1024 * 1024;
const CATEGORIES: { slug: string; label: string }[] = [
  { slug: "textbooks", label: "Textbooks" },
  { slug: "electronics", label: "Electronics" },
  { slug: "fashion", label: "Fashion" },
  { slug: "food", label: "Food" },
  { slug: "services", label: "Services" },
];

type ImageSlot = { uri: string } | null;

function formatPriceInput(value: string): string {
  const clean = value.replace(/[^0-9.]/g, "");
  const parts = clean.split(".");
  if (parts.length > 2) return value;
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts[1] !== undefined ? `${intPart}.${parts[1]}` : intPart;
}

export default function CreateListingScreen() {
  const router = useRouter();

  const [sellerProfileId, setSellerProfileId] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [images, setImages] = useState<ImageSlot[]>([null, null, null, null]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const me = await getSellerMe();
      setSellerProfileId(me.sellerProfileId);
    } catch {
      // Will fail validation on submit
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProfile();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadProfile]);

  function clearError(field: string) {
    setErrors((e) => {
      const n = { ...e };
      delete n[field];
      return n;
    });
  }

  async function pickImage(slotIndex: number) {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];

    if (asset.fileSize && asset.fileSize > IMAGE_MAX_FILE_SIZE) {
      setFormError(`Image must be under 5 MB.`);
      return;
    }

    const shortest = Math.min(asset.width, asset.height);
    const longest = Math.max(asset.width, asset.height);

    if (shortest < IMAGE_MIN_DIMENSION) {
      setFormError(
        `Image is too small (${shortest}px). Minimum ${IMAGE_MIN_DIMENSION}px on the shortest side.`,
      );
      return;
    }

    if (longest > IMAGE_MAX_DIMENSION) {
      setFormError(
        `Image is too large (${longest}px). Maximum ${IMAGE_MAX_DIMENSION}px on the longest side.`,
      );
      return;
    }

    setImages((prev) => {
      const next = [...prev];
      next[slotIndex] = { uri: asset.uri };
      return next;
    });
    clearError("images");
  }

  function removeImage(slotIndex: number) {
    setImages((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    const filledImages = images.filter((s) => s !== null);

    if (filledImages.length === 0) e.images = "Add at least one photo";
    if (!title.trim()) e.title = "Title is required";
    if (!description.trim()) e.description = "Description is required";
    if (!selectedCategory) e.category = "Pick a category";
    const priceNum = parseFloat(price.replace(/,/g, ""));
    if (!price || isNaN(priceNum) || priceNum <= 0)
      e.price = "Price must be greater than 0";
    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 1) e.stock = "Stock must be at least 1";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate() || !sellerProfileId) return;
    setSubmitting(true);
    setFormError(null);

    try {
      // 1. Upload images
      const filledUris = images
        .filter((s): s is { uri: string } => s !== null)
        .map((s) => s.uri);
      const imageUrls =
        filledUris.length > 0 ? await uploadListingImages(filledUris) : [];

      // 2. Create listing
      await createListing({
        sellerId: sellerProfileId,
        categorySlug: selectedCategory!,
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price.replace(/,/g, "")),
        images: imageUrls,
        stock: parseInt(stock, 10) || 1,
      });

      router.replace("/seller/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
      } else if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
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
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Top bar */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingTop: 12,
                paddingHorizontal: 24,
                paddingBottom: 14,
              }}
            >
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.7}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#ffffff1a",
                  borderWidth: 1,
                  borderColor: "#ffffff1f",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="chevron-back" size={20} color="#ffffff" />
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: "BricolageGrotesque-SemiBold",
                  fontSize: 22,
                  color: "#ffffff",
                }}
              >
                List an item
              </Text>
            </View>

            <View style={{ paddingHorizontal: 24, gap: 24 }}>
              {/* ── Images ── */}
              <View>
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 14,
                    color: "#ffffffe6",
                    marginBottom: 10,
                  }}
                >
                  Photos
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    fontSize: 11,
                    color: "#ffffff50",
                    marginBottom: 10,
                  }}
                >
                  Min {IMAGE_MIN_DIMENSION}px · Max {IMAGE_MAX_DIMENSION}px · Under 5 MB
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 12 }}
                >
                  {images.map((slot, i) => (
                    <TouchableOpacity
                      key={i}
                      activeOpacity={0.8}
                      onPress={() => (slot ? pickImage(i) : pickImage(i))}
                      style={{
                        width: 88,
                        height: 88,
                        borderRadius: 12,
                        overflow: "hidden",
                      }}
                    >
                      {slot ? (
                        <View style={{ width: 88, height: 88 }}>
                          <Image
                            source={{ uri: slot.uri }}
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 12,
                            }}
                            contentFit="cover"
                          />
                          {/* Remove button */}
                          <TouchableOpacity
                            onPress={() => removeImage(i)}
                            activeOpacity={0.7}
                            hitSlop={4}
                            style={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              width: 22,
                              height: 22,
                              borderRadius: 11,
                              backgroundColor: "rgba(0,0,0,0.6)",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Ionicons
                              name="close"
                              size={12}
                              color="#ffffff"
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View
                          style={{
                            width: 88,
                            height: 88,
                            borderRadius: 12,
                            borderWidth: 1.5,
                            borderStyle: "dashed",
                            borderColor: "rgba(255,255,255,0.2)",
                            backgroundColor: "rgba(255,255,255,0.03)",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ionicons
                            name="add"
                            size={24}
                            color="rgba(255,255,255,0.4)"
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {errors.images && (
                  <Text
                    style={{
                      fontFamily: "Inter-Regular",
                      fontSize: 12,
                      color: "#dc2626",
                      marginTop: 6,
                    }}
                  >
                    {errors.images}
                  </Text>
                )}
              </View>

              {/* ── Title ── */}
              <GlassFormField
                label="Title"
                placeholder="What are you selling?"
                value={title}
                onChangeText={(t) => {
                  setTitle(t);
                  clearError("title");
                }}
                error={errors.title}
                autoCapitalize="sentences"
                disabled={submitting}
              />

              {/* ── Description ── */}
              <View style={{ gap: 6 }}>
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 14,
                    color: "#ffffffe6",
                  }}
                >
                  Description
                </Text>
                <View
                  style={{
                    backgroundColor: submitting
                      ? "#00000030"
                      : "#00000059",
                    borderWidth: 1,
                    borderColor: errors.description ? "#dc2626" : "#ffffff1f",
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingTop: 12,
                    paddingBottom: 12,
                    minHeight: 100,
                    opacity: submitting ? 0.5 : 1,
                  }}
                >
                  <TextInput
                    value={description}
                    onChangeText={(t) => {
                      setDescription(t);
                      clearError("description");
                    }}
                    placeholder="Describe your item — condition, edition, any details buyers should know"
                    placeholderTextColor="#ffffff66"
                    multiline
                    textAlignVertical="top"
                    editable={!submitting}
                    style={[
                      {
                        fontFamily: "Inter-Regular",
                        fontSize: 14,
                        color: "#ffffff",
                        padding: 0,
                        minHeight: 76,
                      },
                      Platform.OS === "web" && {
                        outlineStyle: "none" as any,
                        outlineWidth: 0 as any,
                        boxShadow: "none" as any,
                      },
                    ]}
                  />
                </View>
                {errors.description && (
                  <Text
                    style={{
                      fontFamily: "Inter-Regular",
                      fontSize: 12,
                      color: "#dc2626",
                    }}
                  >
                    {errors.description}
                  </Text>
                )}
              </View>

              {/* ── Category ── */}
              <View>
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 14,
                    color: "#ffffffe6",
                    marginBottom: 10,
                  }}
                >
                  Category
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8 }}
                >
                  {CATEGORIES.map((cat) => {
                    const active = selectedCategory === cat.slug;
                    return (
                      <TouchableOpacity
                        key={cat.slug}
                        activeOpacity={0.7}
                        disabled={submitting}
                        onPress={() => {
                          setSelectedCategory(
                            active ? null : cat.slug,
                          );
                          clearError("category");
                        }}
                        style={{
                          backgroundColor: active
                            ? "rgba(225,38,28,0.12)"
                            : "rgba(255,255,255,0.04)",
                          borderWidth: 1,
                          borderColor: active
                            ? "rgba(225,38,28,0.5)"
                            : "rgba(255,255,255,0.12)",
                          borderRadius: 999,
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          opacity: submitting ? 0.5 : 1,
                          ...(active
                            ? Platform.select({
                                ios: {
                                  shadowColor: "rgba(225,38,28,0.25)",
                                  shadowOffset: { width: 0, height: 4 },
                                  shadowOpacity: 1,
                                  shadowRadius: 16,
                                },
                                android: {
                                  elevation: 6,
                                },
                                web: {
                                  boxShadow: "0px 4px 16px rgba(225,38,28,0.25)",
                                },
                              })
                            : {}),
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Inter-Medium",
                            fontSize: 13,
                            color: active
                              ? "#ffffff"
                              : "rgba(255,255,255,0.6)",
                          }}
                        >
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                {errors.category && (
                  <Text
                    style={{
                      fontFamily: "Inter-Regular",
                      fontSize: 12,
                      color: "#dc2626",
                      marginTop: 6,
                    }}
                  >
                    {errors.category}
                  </Text>
                )}
              </View>

              {/* ── Price ── */}
              <View style={{ gap: 6 }}>
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 14,
                    color: "#ffffffe6",
                  }}
                >
                  Price
                </Text>
                <View
                  style={{
                    backgroundColor: submitting
                      ? "#00000030"
                      : "#00000059",
                    borderWidth: 1,
                    borderColor: errors.price ? "#dc2626" : "#ffffff1f",
                    borderRadius: 12,
                    height: 44,
                    paddingHorizontal: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    opacity: submitting ? 0.5 : 1,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: 14,
                      color: "rgba(255,255,255,0.4)",
                      marginRight: 6,
                    }}
                  >
                    ₦
                  </Text>
                  <TextInput
                    value={price}
                    onChangeText={(t) => {
                      setPrice(formatPriceInput(t));
                      clearError("price");
                    }}
                    placeholder="0.00"
                    placeholderTextColor="#ffffff66"
                    keyboardType="decimal-pad"
                    editable={!submitting}
                    style={[
                      {
                        fontFamily: "Inter-Regular",
                        fontSize: 14,
                        color: "#ffffff",
                        padding: 0,
                        flex: 1,
                      },
                      Platform.OS === "web" && {
                        outlineStyle: "none" as any,
                        outlineWidth: 0 as any,
                        boxShadow: "none" as any,
                      },
                    ]}
                  />
                </View>
                {errors.price && (
                  <Text
                    style={{
                      fontFamily: "Inter-Regular",
                      fontSize: 12,
                      color: "#dc2626",
                    }}
                  >
                    {errors.price}
                  </Text>
                )}
              </View>

              {/* ── Stock ── */}
              <GlassFormField
                label="Stock"
                placeholder="1"
                value={stock}
                onChangeText={(t) => {
                  setStock(t.replace(/[^0-9]/g, ""));
                  clearError("stock");
                }}
                error={errors.stock}
                keyboardType="number-pad"
                disabled={submitting}
              />

              {/* ── Error ── */}
              {formError && <ErrorBanner message={formError} />}

              {/* ── Submit ── */}
              <PrimaryButton
                label="Publish listing"
                onPress={handleSubmit}
                loading={submitting}
                disabled={loadingProfile || !sellerProfileId}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PageAtmosphere>
  );
}
