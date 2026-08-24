import { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  ActivityIndicator,
  Keyboard,
  Platform,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthLayoutWrapper } from "@/components/auth-layout-wrapper";
import { ErrorBanner } from "@/components/error-banner";
import { BASE_URL, updateUserProfile, getMe, ApiError } from "@/lib/api";
import type { University } from "@/components/university-picker";

const FALLBACK_UNIVERSITIES: University[] = [
  { id: "unilag", name: "University of Lagos", code: "UNILAG" },
  { id: "cu", name: "Covenant University", code: "CU" },
  { id: "ui", name: "University of Ibadan", code: "UI" },
  { id: "oau", name: "Obafemi Awolowo University", code: "OAU" },
  { id: "unn", name: "University of Nigeria, Nsukka", code: "UNN" },
  { id: "abu", name: "Ahmadu Bello University", code: "ABU" },
  { id: "futa", name: "Federal University of Technology, Akure", code: "FUTA" },
  { id: "uniben", name: "University of Benin", code: "UNIBEN" },
  { id: "bu", name: "Babcock University", code: "BU" },
  { id: "lmu", name: "Landmark University", code: "LMU" },
  { id: "pau", name: "Pan-Atlantic University", code: "PAU" },
  { id: "bowen", name: "Bowen University", code: "BOWEN" },
  { id: "unilorin", name: "University of Ilorin", code: "UNILORIN" },
  { id: "lasu", name: "Lagos State University", code: "LASU" },
  { id: "futminna", name: "Federal University of Technology, Minna", code: "FUTMINNA" },
  { id: "uniport", name: "University of Port Harcourt", code: "UNIPORT" },
  { id: "ug", name: "University of Ghana", code: "UG" },
  { id: "knust", name: "Kwame Nkrumah University of Science and Technology", code: "KNUST" },
];

function UniCardItem({
  item,
  onSelect,
  disabled,
}: {
  item: University;
  onSelect: () => void;
  disabled: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onSelect}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.uniCard,
          disabled && { opacity: 0.5 },
          { transform: [{ scale }] },
        ]}
      >
        <View style={styles.uniIconCircle}>
          <Ionicons name="school" size={18} color="#4ade80" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.uniName} numberOfLines={1}>
            {item.name}
          </Text>
          {item.code ? (
            <Text style={styles.uniCode}>{item.code}</Text>
          ) : null}
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color="rgba(255, 255, 255, 0.3)"
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

export default function SelectUniversityScreen() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>(FALLBACK_UNIVERSITIES);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${BASE_URL}/api/universities`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          if (Array.isArray(data) && data.length > 0) {
            setUniversities(data);
          } else {
            setUniversities(FALLBACK_UNIVERSITIES);
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUniversities(FALLBACK_UNIVERSITIES);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return universities;
    const q = query.trim().toLowerCase();
    return universities.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.code && u.code.toLowerCase().includes(q)),
    );
  }, [universities, query]);

  async function handleSelect(university: University) {
    Keyboard.dismiss();
    setSubmitting(true);
    setError(null);
    try {
      await updateUserProfile({ universityId: university.id });
      const me = await getMe();
      router.replace(me.role === "SELLER" ? "/seller/verify" : "/buyer/home");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setSubmitting(false);
    }
  }

  return (
    <AuthLayoutWrapper backRoute="/buyer/home" backTitle="Back">
      <View style={styles.container}>
        <Text style={styles.cardTitle}>Choose your University</Text>
        <Text style={styles.cardSubtitle}>
          Connect with verified students and discover items on your campus.
        </Text>

        {/* Search Input Bar */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={18}
            color="rgba(255, 255, 255, 0.6)"
            style={{ marginRight: 10 }}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search your campus or university"
            placeholderTextColor="rgba(255, 255, 255, 0.45)"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!submitting}
            style={[
              styles.searchInput,
              submitting && { opacity: 0.6 },
              Platform.OS === "web" && {
                outlineStyle: "none" as any,
                outlineWidth: 0 as any,
                boxShadow: "none" as any,
              },
            ]}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              disabled={submitting}
              hitSlop={8}
              style={{ padding: 4 }}
            >
              <Ionicons name="close-circle" size={18} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity>
          )}
        </View>

        {error && (
          <View style={{ marginBottom: 12 }}>
            <ErrorBanner message={error} />
          </View>
        )}

        {loading && universities.length === 0 ? (
          <View style={styles.stateBlock}>
            <ActivityIndicator color="#22c55e" size="large" />
            <Text style={styles.stateText}>Loading universities...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.stateBlock}>
            <Ionicons name="school-outline" size={40} color="rgba(255, 255, 255, 0.3)" />
            <Text style={styles.stateText}>
              No universities found — try a different search term
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.listScroll}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {filtered.map((item) => (
              <UniCardItem
                key={item.id}
                item={item}
                onSelect={() => handleSelect(item)}
                disabled={submitting}
              />
            ))}
          </ScrollView>
        )}

        {submitting && (
          <View style={styles.submittingOverlay}>
            <View style={styles.submittingPill}>
              <ActivityIndicator color="#ffffff" size="small" />
              <Text style={styles.submittingText}>Updating your campus...</Text>
            </View>
          </View>
        )}
      </View>
    </AuthLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  searchBar: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    color: "#ffffff",
    flex: 1,
    padding: 0,
  },
  listScroll: {
    maxHeight: 260,
  },
  listContainer: {
    gap: 10,
    marginTop: 4,
    paddingBottom: 8,
  },
  uniCard: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  uniCode: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#4ade80",
    marginTop: 2,
  },
  uniIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  uniName: {
    fontFamily: "Inter-Medium",
    fontSize: 15,
    color: "#ffffff",
    flex: 1,
  },
  stateBlock: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
    gap: 12,
  },
  stateText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
  submittingOverlay: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  submittingPill: {
    backgroundColor: "#1f1f23",
    borderWidth: 1,
    borderColor: "#27272a",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
      },
    }),
  },
  submittingText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#ffffff",
  },
});
