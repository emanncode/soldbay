import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {
  BackHeader,
  Button,
  FilterChip,
  PhotoSlot,
  ProgressIndicator,
  StickyActionBar,
  TextArea,
  TextField,
  ToastBanner,
} from "@/components";
import {
  createDraft,
  getCategories,
  getDraft,
  patchDraft,
  publishDraft,
  uploadListingImages,
  type Category,
} from "@/lib/api";
import { colors } from "@/theme/colors";

export default function CreateListingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ draftId?: string }>();

  const [currentStep, setCurrentStep] = useState(1);
  const [draftId, setDraftId] = useState<string | null>(params.draftId || null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize draft and load categories
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const [cats, draftRes] = await Promise.all([
          getCategories().catch(() => []),
          params.draftId
            ? getDraft(params.draftId)
            : createDraft().then((res) => ({
                id: res.id,
                title: "",
                description: "",
                price: null,
                category: null,
                images: [],
                draftStep: 1,
              })),
        ]);

        setCategories(cats);
        setDraftId(draftRes.id);
        setTitle(draftRes.title || "");
        setDescription(draftRes.description || "");
        setPrice(draftRes.price ? String(draftRes.price) : "");
        setPhotos(draftRes.images || []);
        setSelectedCategorySlug(draftRes.category?.slug || null);
        setCurrentStep(draftRes.draftStep || 1);
      } catch (err: any) {
        setErrorMessage("Failed to start listing draft.");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [params.draftId]);

  const handlePickPhoto = async () => {
    if (photos.length >= 4) {
      setErrorMessage("Maximum 4 photos allowed per listing.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      const localUri = result.assets[0].uri;
      try {
        setUploadingIndex(photos.length);
        const [remoteUrl] = await uploadListingImages([localUri]);
        const updated = [...photos, remoteUrl];
        setPhotos(updated);

        // Auto-save photos to draft
        if (draftId) {
          await patchDraft(draftId, { images: updated, draftStep: 1 });
        }
      } catch {
        setErrorMessage("Failed to upload photo. Please try again.");
      } finally {
        setUploadingIndex(null);
      }
    }
  };

  const handleRemovePhoto = async (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    if (draftId) {
      await patchDraft(draftId, { images: updated });
    }
  };

  const handleNext = async () => {
    setErrorMessage(null);

    if (currentStep === 1) {
      if (photos.length === 0) {
        setErrorMessage("Please upload at least one photo of your item.");
        return;
      }
      setCurrentStep(2);
      if (draftId) await patchDraft(draftId, { draftStep: 2 });
      return;
    }

    if (currentStep === 2) {
      if (!title.trim()) {
        setErrorMessage("Please enter an item title.");
        return;
      }
      if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
        setErrorMessage("Please enter a valid price in Naira.");
        return;
      }
      setCurrentStep(3);
      if (draftId) {
        await patchDraft(draftId, {
          title: title.trim(),
          description: description.trim(),
          price: Number(price),
          draftStep: 3,
        });
      }
      return;
    }

    if (currentStep === 3) {
      if (!selectedCategorySlug) {
        setErrorMessage("Please select a category.");
        return;
      }
      setCurrentStep(4);
      if (draftId) {
        await patchDraft(draftId, {
          categorySlug: selectedCategorySlug,
          draftStep: 4,
        });
      }
      return;
    }

    // Step 4: Publish
    if (currentStep === 4 && draftId) {
      try {
        setSaving(true);
        await publishDraft(draftId);

        Alert.alert(
          "Listing Published! 🎉",
          "Your item is now live and visible to buyers across your campus.",
          [{ text: "Go to Dashboard", onPress: () => router.replace("/seller/dashboard") }]
        );
      } catch (err: any) {
        setErrorMessage(err?.message || "Failed to publish listing.");
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-base">
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-surface-base"
    >
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="px-1">
        <BackHeader
          onBack={() => {
            if (currentStep > 1) setCurrentStep(currentStep - 1);
            else router.back();
          }}
          title="Post a Listing"
        />
      </View>

      <View className="px-3 py-1">
        <ProgressIndicator currentStep={currentStep} totalSteps={4} />
      </View>

      <ScrollView className="flex-1 px-3 pt-2" keyboardShouldPersistTaps="handled">
        {errorMessage ? (
          <View className="mb-2">
            <ToastBanner
              visible={Boolean(errorMessage)}
              message={errorMessage}
              type="error"
              onDismiss={() => setErrorMessage(null)}
            />
          </View>
        ) : null}

        {/* STEP 1: Photos */}
        {currentStep === 1 ? (
          <View>
            <Text className="font-manrope-semibold text-h1 text-text-primary">
              Upload Photos
            </Text>
            <Text className="mt-0.5 font-manrope text-body text-text-secondary">
              Add up to 4 clear photos. The first image will be your listing cover.
            </Text>

            <View className="mt-4 flex-row flex-wrap gap-2">
              {[0, 1, 2, 3].map((slotIdx) => (
                <View key={slotIdx} className="w-[48%]">
                  <PhotoSlot
                    imageUrl={photos[slotIdx] || null}
                    isPrimary={slotIdx === 0}
                    uploading={uploadingIndex === slotIdx}
                    onPress={handlePickPhoto}
                    onRemove={() => handleRemovePhoto(slotIdx)}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* STEP 2: Details */}
        {currentStep === 2 ? (
          <View className="gap-2">
            <Text className="font-manrope-semibold text-h1 text-text-primary">
              Item Details
            </Text>

            <TextField
              label="Title"
              placeholder="e.g. Engineering Mathematics Vol. 2"
              value={title}
              onChangeText={setTitle}
            />

            <TextField
              label="Price (₦)"
              placeholder="e.g. 4500"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />

            <TextArea
              label="Description (Optional)"
              placeholder="Condition, edition, markings, or included accessories..."
              value={description}
              onChangeText={setDescription}
            />
          </View>
        ) : null}

        {/* STEP 3: Category */}
        {currentStep === 3 ? (
          <View>
            <Text className="font-manrope-semibold text-h1 text-text-primary">
              Select Category
            </Text>
            <Text className="mt-0.5 font-manrope text-body text-text-secondary">
              Choose the category that best describes your item.
            </Text>

            <View className="mt-3 flex-row flex-wrap gap-1.5">
              {categories.map((cat) => (
                <FilterChip
                  key={cat.id}
                  label={cat.name}
                  active={selectedCategorySlug === cat.slug}
                  onPress={() => setSelectedCategorySlug(cat.slug)}
                />
              ))}
            </View>
          </View>
        ) : null}

        {/* STEP 4: Review & Publish */}
        {currentStep === 4 ? (
          <View>
            <Text className="font-manrope-semibold text-h1 text-text-primary">
              Review Listing
            </Text>
            <Text className="mt-0.5 font-manrope text-body text-text-secondary">
              Review your listing details before publishing to your campus.
            </Text>

            <View className="mt-3 rounded-md border border-neutral-200 bg-surface-elevated p-2">
              <Text className="font-manrope-semibold text-h2 text-text-primary">
                ₦{Number(price).toLocaleString()}
              </Text>
              <Text className="mt-1 font-manrope-medium text-body text-text-primary">
                {title}
              </Text>
              <Text className="mt-0.5 text-caption text-text-tertiary">
                {categories.find((c) => c.slug === selectedCategorySlug)?.name} · {photos.length} photos
              </Text>
              {description ? (
                <Text className="mt-2 font-manrope text-body text-text-secondary">
                  {description}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}
      </ScrollView>

      <StickyActionBar>
        <Button
          label={currentStep === 4 ? "Publish Listing" : "Continue"}
          onPress={handleNext}
          loading={saving}
          variant="primary"
        />
      </StickyActionBar>
    </KeyboardAvoidingView>
  );
}
