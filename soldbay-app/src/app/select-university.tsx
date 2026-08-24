import { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Platform,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthLayoutWrapper } from "@/components/auth-layout-wrapper";
import { ErrorBanner } from "@/components/error-banner";
import { BASE_URL, updateUserProfile, getMe, ApiError } from "@/lib/api";
import type { University } from "@/components/university-picker";

export default function SelectUniversityScreen() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/universities`)
      .then((res) => res.json())
      .then((data) => setUniversities(data))
      .catch(() => setError("Failed to load universities. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return universities;
    const q = query.trim().toLowerCase();
    return universities.filter((u) => u.name.toLowerCase().includes(q));
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

        {loading ? (
          <View style={styles.stateBlock}>
            <ActivityIndicator color="#5A91C2" size="large" />
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
          <View style={styles.listContainer}>
            {filtered.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelect(item)}
                disabled={submitting}
                activeOpacity={0.7}
                style={[
                  styles.uniCard,
                  submitting && { opacity: 0.5 },
                ]}
              >
                <View style={styles.uniIconCircle}>
                  <Ionicons name="school" size={20} color="#4ade80" />
                </View>
                <Text style={styles.uniName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="rgba(255, 255, 255, 0.3)"
                />
              </TouchableOpacity>
            ))}
          </View>
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
  listContainer: {
    gap: 10,
    marginTop: 4,
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
