import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PageAtmosphere } from "@/components/page-atmosphere";
import {
  getListings,
  getCategories,
  type PublicListing,
  type Category,
} from "@/lib/api";

const logo2 = require("../../../assets/logo2.png");

export default function BuyerHomeScreen() {
  const router = useRouter();
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadInitial();
  }, []);

  useEffect(() => {
    loadListings();
  }, [selectedCategory]);

  async function loadInitial() {
    try {
      const [cats, list] = await Promise.all([
        getCategories(),
        getListings(),
      ]);
      setCategories(cats);
      setListings(list);
    } catch {
      // silently fail — empty state will show
    } finally {
      setLoading(false);
    }
  }

  async function loadListings() {
    try {
      const list = await getListings(selectedCategory ?? undefined);
      setListings(list);
    } catch {
      setListings([]);
    }
  }

  const filteredListings = searchQuery.trim()
    ? listings.filter((l) =>
        l.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
    : listings;

  function formatPrice(price: string): string {
    const num = parseFloat(price) || 0;
    return "₦" + num.toLocaleString("en-NG");
  }

  return (
    <PageAtmosphere>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 12,
              paddingHorizontal: 24,
              paddingBottom: 14,
            }}
          >
            <Image
              source={logo2}
              style={{ width: 32, height: 32, borderRadius: 8 }}
              resizeMode="contain"
            />
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
              <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
                <Ionicons name="search" size={22} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
                <Ionicons name="notifications-outline" size={22} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ paddingHorizontal: 24, gap: 20 }}>
            {/* Search input */}
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
                gap: 10,
              }}
            >
              <Ionicons name="search" size={18} color="#ffffff66" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search for anything on campus"
                placeholderTextColor="#ffffff66"
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 14,
                  color: "#ffffff",
                  flex: 1,
                  padding: 0,
                  outline: "none",
                }}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  hitSlop={8}
                  style={{ padding: 4 }}
                >
                  <Ionicons name="close-circle" size={18} color="#ffffff66" />
                </TouchableOpacity>
              )}
            </View>

            {/* Category chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              <TouchableOpacity
                onPress={() => setSelectedCategory(null)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: selectedCategory === null ? "#e1261c1a" : "transparent",
                  borderWidth: 1,
                  borderColor: selectedCategory === null ? "#e1261c4d" : "#ffffff1f",
                  borderRadius: 999,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 13,
                    color: selectedCategory === null ? "#ffffff" : "#ffffff80",
                  }}
                >
                  All
                </Text>
              </TouchableOpacity>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() =>
                    setSelectedCategory(
                      selectedCategory === cat.slug ? null : cat.slug,
                    )
                  }
                  activeOpacity={0.7}
                  style={{
                    backgroundColor:
                      selectedCategory === cat.slug ? "#e1261c1a" : "transparent",
                    borderWidth: 1,
                    borderColor:
                      selectedCategory === cat.slug ? "#e1261c4d" : "#ffffff1f",
                    borderRadius: 999,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: 13,
                      color:
                        selectedCategory === cat.slug ? "#ffffff" : "#ffffff80",
                    }}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Section header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "BricolageGrotesque-SemiBold",
                  fontSize: 22,
                  color: "#ffffff",
                }}
              >
                {selectedCategory
                  ? categories.find((c) => c.slug === selectedCategory)?.name ??
                    "Results"
                  : "Trending near you"}
              </Text>
              {selectedCategory && (
                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    fontSize: 13,
                    color: "#ffffff66",
                  }}
                >
                  {filteredListings.length} result{filteredListings.length !== 1 ? "s" : ""}
                </Text>
              )}
            </View>

            {/* Listing grid or empty state */}
            {loading ? (
              <View style={{ alignItems: "center", paddingVertical: 40 }}>
                <ActivityIndicator color="#e1261c" />
              </View>
            ) : filteredListings.length === 0 ? (
              <EmptyState
                category={selectedCategory}
                onBrowseAll={() => setSelectedCategory(null)}
              />
            ) : (
              <View style={{ gap: 12 }}>
                {chunk(filteredListings, 2).map((row, rowIdx) => (
                  <View key={rowIdx} style={{ flexDirection: "row", gap: 12 }}>
                    {row.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                    {row.length < 2 && <View style={{ flex: 1 }} />}
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </PageAtmosphere>
  );
}

/* ─── Helpers ─────────────────────────────────────────── */

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/* ─── Sub-components ─────────────────────────────────── */

function ListingCard({ listing }: { listing: PublicListing }) {
  const sellerName = listing.seller.businessName || `@${listing.seller.username}`;

  return (
    <TouchableOpacity activeOpacity={0.7} style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "#ffffff0f",
          borderWidth: 1,
          borderColor: "#ffffff1f",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {/* Thumbnail */}
        <View
          style={{
            width: "100%",
            height: 100,
            backgroundColor: "#1a1a2e",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {listing.images[0] ? (
            <Image
              source={{ uri: listing.images[0] }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="image-outline" size={20} color="#ffffff1f" />
          )}
        </View>

        {/* Info */}
        <View style={{ padding: 10, gap: 3 }}>
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontSize: 12,
              color: "#ffffff",
            }}
            numberOfLines={1}
          >
            {listing.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <Ionicons name="pricetag" size={10} color="#e1261c" />
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: 12,
                color: "#e1261c",
              }}
            >
              {formatPrice(listing.price)}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 10,
              color: "#ffffff66",
            }}
            numberOfLines={1}
          >
            {sellerName} · {listing.category.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function formatPrice(price: string): string {
  const num = parseFloat(price) || 0;
  return "₦" + num.toLocaleString("en-NG");
}

function EmptyState({
  category,
  onBrowseAll,
}: {
  category: string | null;
  onBrowseAll: () => void;
}) {
  const catName = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : null;

  return (
    <View
      style={{
        height: 360,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Ionicons name="cube-outline" size={64} color="#ffffff1f" />
      <Text
        style={{
          fontFamily: "BricolageGrotesque-SemiBold",
          fontSize: 20,
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        No listings here yet
      </Text>
      <Text
        style={{
          fontFamily: "Inter-Regular",
          fontSize: 14,
          color: "#ffffff66",
          textAlign: "center",
          lineHeight: 20,
        }}
      >
        {catName
          ? `No one has listed any ${catName} yet.\nCheck back soon or browse other categories.`
          : "No one in your university has listed\nanything yet. Check back soon."}
      </Text>
      {category && (
        <TouchableOpacity
          onPress={onBrowseAll}
          activeOpacity={0.8}
          style={{
            backgroundColor: "#e1261c1a",
            borderWidth: 1,
            borderColor: "#e1261c4d",
            borderRadius: 999,
            paddingHorizontal: 24,
            paddingVertical: 10,
            marginTop: 4,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter-Medium",
              fontSize: 13,
              color: "#e1261c",
            }}
          >
            Browse all
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
