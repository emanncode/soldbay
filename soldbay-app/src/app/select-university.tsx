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
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthLayoutWrapper } from "@/components/auth-layout-wrapper";
import { ErrorBanner } from "@/components/error-banner";
import { updateUserProfile, getMe, getUniversities, type University, ApiError } from "@/lib/api";

const FALLBACK_UNIVERSITIES: University[] = [
  { id: "aaua", name: "Adekunle Ajasin University, Akungba-Akoko", code: "AAUA" },
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
  { id: "uniabuja", name: "University of Abuja", code: "UNIABUJA" },
  { id: "funaab", name: "Federal University of Agriculture, Abeokuta", code: "FUNAAB" },
  { id: "futo", name: "Federal University of Technology, Owerri", code: "FUTO" },
  { id: "unizik", name: "Nnamdi Azikiwe University", code: "UNIZIK" },
  { id: "buk", name: "Bayero University Kano", code: "BUK" },
  { id: "delsu", name: "Delta State University, Abraka", code: "DELSU" },
  { id: "eksu", name: "Ekiti State University", code: "EKSU" },
  { id: "oou", name: "Olabisi Onabanjo University", code: "OOU" },
  { id: "uniosun", name: "Osun State University", code: "UNIOSUN" },
  { id: "rsu", name: "Rivers State University", code: "RSU" },
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
  const { role: paramRole } = useLocalSearchParams<{ role?: string }>();
  const [universities, setUniversities] = useState<University[]>(FALLBACK_UNIVERSITIES);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"BUYER" | "SELLER" | null>(() => {
    if (paramRole && typeof paramRole === "string") {
      return paramRole.toUpperCase() === "SELLER" ? "SELLER" : "BUYER";
    }
    return "BUYER";
  });

  useEffect(() => {
    let cancelled = false;

    // Fetch user profile to confirm role
    getMe()
      .then((me) => {
        if (!cancelled && me?.role) {
          setUserRole(me.role);
        }
      })
      .catch(() => {
        // Keep initial role state
      });

    getUniversities()
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

  const isSeller = userRole === "SELLER";

  const filtered = useMemo(() => {
    if (!query.trim()) return universities;
    const q = query.trim().toLowerCase();
    return universities.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.code && u.code.toLowerCase().includes(q)),
    );
  }, [universities, query]);

  function handleSkip() {
    Keyboard.dismiss();
    router.replace("/buyer/home");
  }

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

  const rightAction = !isSeller ? (
    <TouchableOpacity
      onPress={handleSkip}
      disabled={submitting}
      style={styles.skipHeaderBtn}
      activeOpacity={0.7}
    >
      <Text style={styles.skipHeaderBtnText}>Skip</Text>
      <Ionicons name="chevron-forward" size={14} color="#22c55e" />
    </TouchableOpacity>
  ) : null;

  return (
    <AuthLayoutWrapper
      backRoute="/buyer/home"
      backTitle="Back"
      rightAction={rightAction}
    >
      <View style={styles.container}>
        <Text style={styles.cardTitle}>Choose your University</Text>
        <Text style={styles.cardSubtitle}>
          {isSeller
            ? "Required for Sellers — Choose your campus to proceed to student portal verification."
            : "Connect with verified students on campus, or skip to start shopping right away."}
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

        {/* Skip action for buyers */}
        {!isSeller && (
          <TouchableOpacity
            onPress={handleSkip}
            disabled={submitting}
            style={styles.skipBottomBtn}
            activeOpacity={0.75}
          >
            <Text style={styles.skipBottomBtnText}>Skip for now (Go to Buyer Home)</Text>
            <Ionicons name="arrow-forward" size={16} color="#22c55e" />
          </TouchableOpacity>
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
  skipHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(34, 197, 94, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  skipHeaderBtnText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 13,
    color: "#22c55e",
  },
  skipBottomBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 6,
  },
  skipBottomBtnText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#ffffff",
  },
});
