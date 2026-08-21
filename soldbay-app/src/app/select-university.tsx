import { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PageAtmosphere } from "@/components/page-atmosphere";
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
    <PageAtmosphere>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 52,
          }}
        >
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontFamily: "BricolageGrotesque-SemiBold",
                fontSize: 28,
                color: "#ffffff",
                lineHeight: 34,
              }}
            >
              Which university are you at?
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 15,
                color: "#ffffff80",
                lineHeight: 22,
                marginTop: 8,
              }}
            >
              {"This helps us show you what's happening on your campus"}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#00000059",
              borderWidth: 1,
              borderColor: "#ffffff1f",
              borderRadius: 12,
              height: 44,
              paddingHorizontal: 14,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons
              name="search"
              size={18}
              color="#ffffff66"
              style={{ marginRight: 10 }}
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search universities"
              placeholderTextColor="#ffffff66"
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                {
                  fontFamily: "Inter-Regular",
                  fontSize: 14,
                  color: "#ffffff",
                  flex: 1,
                  padding: 0,
                },
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
                hitSlop={8}
                style={{ padding: 4 }}
              >
                <Ionicons name="close-circle" size={18} color="#ffffff66" />
              </TouchableOpacity>
            )}
          </View>

          {error && (
            <View style={{ marginBottom: 12 }}>
              <ErrorBanner message={error} />
            </View>
          )}

          {loading ? (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <ActivityIndicator color="#e1261c" />
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 14,
                  color: "#ffffff66",
                  marginTop: 12,
                }}
              >
                Loading universities...
              </Text>
            </View>
          ) : filtered.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                paddingVertical: 40,
                gap: 8,
              }}
            >
              <Ionicons
                name="school-outline"
                size={36}
                color="#ffffff33"
              />
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 15,
                  color: "#ffffff66",
                  textAlign: "center",
                }}
              >
                No universities found — try a different search
              </Text>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 24 }}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: 1,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    marginLeft: 4,
                  }}
                />
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  disabled={submitting}
                  activeOpacity={0.6}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 4,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    opacity: submitting ? 0.5 : 1,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: 16,
                      color: "#ffffffcc",
                    }}
                  >
                    {item.name}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#ffffff33"
                  />
                </TouchableOpacity>
              )}
            />
          )}

          {submitting && (
            <View
              style={{
                position: "absolute",
                bottom: 40,
                left: 0,
                right: 0,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.7)",
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 999,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <ActivityIndicator color="#e1261c" size="small" />
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 14,
                    color: "#ffffffcc",
                  }}
                >
                  Saving...
                </Text>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </PageAtmosphere>
  );
}
