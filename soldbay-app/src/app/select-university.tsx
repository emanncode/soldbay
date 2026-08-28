import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, School } from "lucide-react-native";
import {
  BackHeader,
  Button,
  FilterChip,
  SearchBar,
  StickyActionBar,
  ToastBanner,
} from "@/components";
import { getMe, getUniversities, updateUserProfile, type University } from "@/lib/api";
import { colors } from "@/theme/colors";

const levels = ["100L", "200L", "300L", "400L", "500L", "Postgraduate"];

export default function SelectUniversityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [universities, setUniversities] = useState<University[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversityId, setSelectedUniversityId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("200L");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getUniversities();
        setUniversities(data);
      } catch (err: any) {
        setErrorMessage("Failed to load university list.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredUniversities = universities.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async () => {
    if (!selectedUniversityId) {
      setErrorMessage("Please select your university.");
      return;
    }

    try {
      setSaving(true);
      await updateUserProfile({
        universityId: selectedUniversityId,
        level: selectedLevel,
      });

      const user = await getMe();
      if (user.role === "SELLER") {
        router.replace("/seller/dashboard");
      } else {
        router.replace("/buyer/home");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-surface-base">
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="px-1">
        <BackHeader onBack={() => router.back()} />
      </View>

      <View className="px-3 pt-1">
        <Text className="font-manrope-semibold text-h1 text-text-primary">
          Select Your Campus
        </Text>
        <Text className="mt-0.5 font-manrope text-body text-text-secondary">
          We connect buyers and sellers within the same university.
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

        <View className="my-2">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search your university..."
          />
        </View>

        <View className="mb-2">
          <Text className="mb-1 font-manrope-medium text-small text-text-secondary">
            Current Level
          </Text>
          <View className="flex-row flex-wrap gap-1">
            {levels.map((lvl) => (
              <FilterChip
                key={lvl}
                label={lvl}
                active={selectedLevel === lvl}
                onPress={() => setSelectedLevel(lvl)}
              />
            ))}
          </View>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={filteredUniversities}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          renderItem={({ item }) => {
            const isSelected = selectedUniversityId === item.id;
            return (
              <Pressable
                onPress={() => setSelectedUniversityId(item.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                className={`mb-1 flex-row items-center justify-between rounded-md p-1.5 active:bg-neutral-100 ${
                  isSelected
                    ? "border border-accent bg-accent-tint/30"
                    : "border border-neutral-200 bg-surface-elevated"
                }`}
              >
                <View className="flex-1 flex-row items-center mr-1">
                  <View className="mr-1 h-5 w-5 items-center justify-center rounded-sm bg-neutral-100">
                    <School size={18} color={colors.neutral600} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-manrope-medium text-body-medium text-text-primary">
                      {item.name}
                    </Text>
                    <Text className="font-manrope text-caption text-text-tertiary">
                      {item.code}
                    </Text>
                  </View>
                </View>

                <View className="ml-1">
                  {isSelected ? (
                    <View className="h-3 w-3 items-center justify-center rounded-full bg-accent">
                      <Check size={14} color={colors.textInverse} strokeWidth={2.5} />
                    </View>
                  ) : (
                    <View className="h-3 w-3 rounded-full border border-neutral-300 bg-surface-elevated" />
                  )}
                </View>
              </Pressable>
            );
          }}
        />
      )}

      <StickyActionBar>
        <Button
          label="Get Started"
          onPress={handleSave}
          loading={saving}
          disabled={!selectedUniversityId}
          variant="primary"
        />
      </StickyActionBar>
    </View>
  );
}
