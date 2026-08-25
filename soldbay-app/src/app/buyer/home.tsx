import { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Animated,
  ActivityIndicator,
  Platform,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PageAtmosphere } from "@/components/page-atmosphere";
import {
  getListings,
  getCategories,
  getMe,
  type PublicListing,
  type Category,
  type UserMeResponse,
} from "@/lib/api";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 350;

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  textbooks: "book-outline",
  electronics: "phone-portrait-outline",
  fashion: "shirt-outline",
  food: "restaurant-outline",
  services: "construct-outline",
  living: "home-outline",
  accessories: "watch-outline",
};

interface PromoItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  gradientColors: [string, string];
  icon: keyof typeof Ionicons.glyphMap;
}

const PROMO_BANNERS: PromoItem[] = [
  {
    id: "1",
    badge: "30% OFF",
    title: "Campus Deals & Discounts",
    subtitle: "Save big on textbooks, gadgets, and dorm essentials from verified peers.",
    cta: "Shop Now",
    gradientColors: ["#1e4d3e", "#0f2b22"],
    icon: "flash-outline",
  },
  {
    id: "2",
    badge: "VERIFIED",
    title: "Student Portal Verified",
    subtitle: "Trade safely with matriculated students across all faculties.",
    cta: "Learn More",
    gradientColors: ["#2d3b59", "#151e30"],
    icon: "shield-checkmark-outline",
  },
  {
    id: "3",
    badge: "FAST MEETUP",
    title: "Direct Hostel Delivery",
    subtitle: "Quick on-campus handoffs at your hall of residence or faculty park.",
    cta: "Explore",
    gradientColors: ["#4a2e1d", "#26150b"],
    icon: "location-outline",
  },
];

interface CampusStore {
  id: string;
  name: string;
  campus: string;
  faculty: string;
  rating: number;
  reviewsCount: number;
  avatarText: string;
}

const NEARBY_STORES: CampusStore[] = [
  {
    id: "s1",
    name: "TechHub UNILAG",
    campus: "UNILAG",
    faculty: "New Hall Block B",
    rating: 4.9,
    reviewsCount: 52,
    avatarText: "TH",
  },
  {
    id: "s2",
    name: "Dorm Elegance",
    campus: "OAU",
    faculty: "Moremi Hall",
    rating: 4.8,
    reviewsCount: 38,
    avatarText: "DE",
  },
  {
    id: "s3",
    name: "Campus Books & Stationery",
    campus: "UI",
    faculty: "Faculty of Arts",
    rating: 4.9,
    reviewsCount: 64,
    avatarText: "CB",
  },
];

export default function BuyerHomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [popularFilter, setPopularFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const initialLoad = useRef(true);
  const mounted = useRef(true);
  const loadSeq = useRef(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Fetch current user details
  useEffect(() => {
    (async () => {
      try {
        const u = await getMe();
        if (mounted.current) setUser(u);
      } catch {
        // user might be guest or token expired
      }
    })();
  }, []);

  const loadFirstPage = useCallback(
    async (opts?: { refreshing?: boolean }) => {
      const seq = ++loadSeq.current;
      if (!opts?.refreshing) setLoading(true);
      setLoadingMore(false);
      try {
        const page = await getListings({
          categorySlug: selectedCategory ?? undefined,
          search: debouncedSearch || undefined,
          limit: PAGE_SIZE,
        });
        if (!mounted.current || seq !== loadSeq.current) return;
        setListings(page.items);
        setNextCursor(page.nextCursor);
        setHasMore(page.hasMore);
      } catch {
        if (!mounted.current || seq !== loadSeq.current) return;
        setListings([]);
        setNextCursor(null);
        setHasMore(false);
      } finally {
        if (mounted.current && seq === loadSeq.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [selectedCategory, debouncedSearch],
  );

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore || !nextCursor) return;
    const seq = ++loadSeq.current;
    setLoadingMore(true);
    try {
      const page = await getListings({
        categorySlug: selectedCategory ?? undefined,
        search: debouncedSearch || undefined,
        cursor: nextCursor,
        limit: PAGE_SIZE,
      });
      if (!mounted.current || seq !== loadSeq.current) return;
      setListings((prev) => [...prev, ...page.items]);
      setNextCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch {
      // keep current list
    } finally {
      if (mounted.current && seq === loadSeq.current) setLoadingMore(false);
    }
  }, [
    loading,
    loadingMore,
    hasMore,
    nextCursor,
    selectedCategory,
    debouncedSearch,
  ]);

  // Initial load: categories + first listings page
  useEffect(() => {
    (async () => {
      try {
        const cats = await getCategories();
        if (mounted.current) setCategories(cats);
      } catch {
        // silently fail
      }
    })();
    const timer = setTimeout(() => {
      loadFirstPage();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadFirstPage]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedSearch(searchQuery.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reload when category or debounced search changes
  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    loadFirstPage();
  }, [selectedCategory, debouncedSearch, loadFirstPage]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFirstPage({ refreshing: true });
  }, [loadFirstPage]);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleBannerScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / (slideSize > 0 ? slideSize : 1));
    setActiveBannerIndex(index);
  };

  const displayName = user?.name ? user.name.split(" ")[0] : "Shopper";
  const userCampus = user?.universityId ? user.universityId.toUpperCase() : "All Campuses";

  const headerComponent = (
    <View style={{ gap: 20, paddingBottom: 16 }}>
      {/* ── 1. Top Greeting & Notification Bar ── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: 8,
        }}
      >
        <View style={{ gap: 2 }}>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 13,
              color: "#9ca3af",
            }}
          >
            Hello,
          </Text>
          <Text
            style={{
              fontFamily: "BricolageGrotesque-Bold",
              fontSize: 22,
              color: "#ffffff",
            }}
          >
            {displayName} 👋
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {/* Campus Location Pill */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => router.push("/select-university")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "rgba(59, 126, 104, 0.2)",
              borderWidth: 1,
              borderColor: "rgba(59, 126, 104, 0.4)",
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 7,
            }}
          >
            <Ionicons name="location" size={13} color="#3b7e68" />
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: 12,
                color: "#eaf4f0",
              }}
            >
              {userCampus}
            </Text>
            <Ionicons name="chevron-down" size={12} color="#9ca3af" />
          </TouchableOpacity>

          {/* Notification Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.12)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="notifications-outline" size={18} color="#ffffff" />
            <View
              style={{
                position: "absolute",
                top: 8,
                right: 9,
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: "#df4a32",
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── 2. Search & Filter Bar ── */}
      <View style={{ paddingHorizontal: 20 }}>
        <View
          style={{
            backgroundColor: "rgba(20, 20, 24, 0.8)",
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.14)",
            borderRadius: 999,
            height: 48,
            paddingLeft: 16,
            paddingRight: 6,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search textbooks, electronics, shoes..."
            placeholderTextColor="#6b7280"
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
          {searchQuery.length > 0 ? (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              hitSlop={8}
              style={{ padding: 6 }}
            >
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#3b7e68",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="options-outline" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── 3. Promo Banner Carousel ── */}
      {!debouncedSearch && (
        <View style={{ gap: 10 }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleBannerScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
          >
            {PROMO_BANNERS.map((banner) => (
              <View
                key={banner.id}
                style={{
                  width: SCREEN_WIDTH - 40,
                  backgroundColor: "rgba(30, 40, 36, 0.85)",
                  borderWidth: 1,
                  borderColor: "rgba(59, 126, 104, 0.3)",
                  borderRadius: 20,
                  padding: 18,
                  gap: 12,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "rgba(223, 74, 50, 0.2)",
                      borderWidth: 1,
                      borderColor: "rgba(223, 74, 50, 0.4)",
                      borderRadius: 6,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter-SemiBold",
                        fontSize: 11,
                        color: "#df4a32",
                        letterSpacing: 0.5,
                      }}
                    >
                      {banner.badge}
                    </Text>
                  </View>
                  <Ionicons name={banner.icon} size={20} color="#3b7e68" />
                </View>

                <View style={{ gap: 4 }}>
                  <Text
                    style={{
                      fontFamily: "BricolageGrotesque-Bold",
                      fontSize: 17,
                      color: "#ffffff",
                    }}
                  >
                    {banner.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter-Regular",
                      fontSize: 12,
                      color: "#9ca3af",
                      lineHeight: 17,
                    }}
                  >
                    {banner.subtitle}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSelectedCategory(null)}
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: "#3b7e68",
                    paddingHorizontal: 16,
                    paddingVertical: 7,
                    borderRadius: 999,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-SemiBold",
                      fontSize: 12,
                      color: "#ffffff",
                    }}
                  >
                    {banner.cta}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Dots Indicator */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
            }}
          >
            {PROMO_BANNERS.map((_, i) => (
              <View
                key={i}
                style={{
                  width: activeBannerIndex === i ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor:
                    activeBannerIndex === i ? "#3b7e68" : "rgba(255, 255, 255, 0.2)",
                }}
              />
            ))}
          </View>
        </View>
      )}

      {/* ── 4. Categories Section ── */}
      <View style={{ gap: 12, paddingHorizontal: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "BricolageGrotesque-Bold",
              fontSize: 18,
              color: "#ffffff",
            }}
          >
            Categories
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontSize: 13,
                color: "#3b7e68",
              }}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
        >
          <CategoryTile
            label="All"
            icon="apps-outline"
            selected={selectedCategory === null}
            onPress={() => setSelectedCategory(null)}
          />
          {categories.map((cat) => (
            <CategoryTile
              key={cat.id}
              label={cat.name}
              icon={CATEGORY_ICONS[cat.slug] ?? "pricetag-outline"}
              selected={selectedCategory === cat.slug}
              onPress={() =>
                setSelectedCategory(
                  selectedCategory === cat.slug ? null : cat.slug,
                )
              }
            />
          ))}
        </ScrollView>
      </View>

      {/* ── 5. Places Nearby / Top Campus Stores (Figma Feature) ── */}
      {!debouncedSearch && (
        <View style={{ gap: 12, paddingHorizontal: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "BricolageGrotesque-Bold",
                  fontSize: 18,
                  color: "#ffffff",
                }}
              >
                Campus Stores Near You
              </Text>
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 12,
                  color: "#9ca3af",
                }}
              >
                Verified student shops delivering to hostels
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {NEARBY_STORES.map((store) => (
              <View
                key={store.id}
                style={{
                  width: 220,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 16,
                  padding: 14,
                  gap: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "rgba(59, 126, 104, 0.3)",
                      borderWidth: 1,
                      borderColor: "#3b7e68",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "BricolageGrotesque-Bold",
                        fontSize: 14,
                        color: "#3b7e68",
                      }}
                    >
                      {store.avatarText}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <Text
                        style={{
                          fontFamily: "Inter-SemiBold",
                          fontSize: 13,
                          color: "#ffffff",
                        }}
                        numberOfLines={1}
                      >
                        {store.name}
                      </Text>
                      <Ionicons name="checkmark-circle" size={14} color="#3b7e68" />
                    </View>
                    <Text
                      style={{
                        fontFamily: "Inter-Regular",
                        fontSize: 11,
                        color: "#9ca3af",
                      }}
                      numberOfLines={1}
                    >
                      {store.faculty} · {store.campus}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Ionicons name="star" size={13} color="#f59e0b" />
                    <Text
                      style={{
                        fontFamily: "Inter-SemiBold",
                        fontSize: 12,
                        color: "#ffffff",
                      }}
                    >
                      {store.rating}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter-Regular",
                        fontSize: 11,
                        color: "#6b7280",
                      }}
                    >
                      ({store.reviewsCount})
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: 11,
                      color: "#3b7e68",
                    }}
                  >
                    Fast Meetup ›
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── 6. Section Title & Sub-filter pills ── */}
      <View style={{ paddingHorizontal: 20, gap: 10, paddingTop: 4 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "BricolageGrotesque-Bold",
              fontSize: 18,
              color: "#ffffff",
            }}
          >
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.name ??
                "Results"
              : debouncedSearch
                ? `Results for "${debouncedSearch}"`
                : "Most Popular"}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            {listings.length} items
          </Text>
        </View>

        {/* Sub filter tabs */}
        {!debouncedSearch && !selectedCategory && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            {[
              { id: "all", label: "All Items" },
              { id: "hot", label: "Trending 🔥" },
              { id: "deals", label: "Budget Deals" },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setPopularFilter(tab.id)}
                activeOpacity={0.7}
                style={{
                  backgroundColor:
                    popularFilter === tab.id
                      ? "rgba(59, 126, 104, 0.25)"
                      : "rgba(255, 255, 255, 0.05)",
                  borderWidth: 1,
                  borderColor:
                    popularFilter === tab.id
                      ? "#3b7e68"
                      : "rgba(255, 255, 255, 0.1)",
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  borderRadius: 999,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 12,
                    color: popularFilter === tab.id ? "#ffffff" : "#9ca3af",
                  }}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <PageAtmosphere>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <FlatList
          data={listings}
          numColumns={2}
          key="buyer-home-grid"
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              isFavorited={wishlist.has(item.id)}
              onToggleFavorite={() => toggleWishlist(item.id)}
            />
          )}
          columnWrapperStyle={{
            gap: 12,
            paddingHorizontal: 20,
          }}
          contentContainerStyle={{
            paddingBottom: 100, // Space for bottom dock
            gap: 12,
            flexGrow: 1,
          }}
          ListHeaderComponent={headerComponent}
          ListEmptyComponent={
            loading ? (
              <View style={{ paddingHorizontal: 20 }}>
                <LoadingGrid />
              </View>
            ) : (
              <EmptyState
                category={selectedCategory}
                search={debouncedSearch}
                onBrowseAll={() => setSelectedCategory(null)}
              />
            )
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 16 }}>
                <ActivityIndicator color="#3b7e68" size="small" />
              </View>
            ) : null
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={Platform.OS === "android"}
        />

        {/* ── 7. Floating Bottom Navigation Dock ── */}
        <BottomNavDock currentTab="home" />
      </SafeAreaView>
    </PageAtmosphere>
  );
}

/* ─── Sub-components ─────────────────────────────── */

function CategoryTile({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        backgroundColor: selected ? "#3b7e68" : "rgba(255, 255, 255, 0.06)",
        borderWidth: 1,
        borderColor: selected ? "#3b7e68" : "rgba(255, 255, 255, 0.12)",
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 9,
      }}
    >
      <Ionicons
        name={icon}
        size={15}
        color={selected ? "#ffffff" : "#9ca3af"}
      />
      <Text
        style={{
          fontFamily: "Inter-Medium",
          fontSize: 13,
          color: selected ? "#ffffff" : "#d1d5db",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const ListingCard = memo(function ListingCard({
  listing,
  isFavorited,
  onToggleFavorite,
}: {
  listing: PublicListing;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}) {
  const router = useRouter();
  const sellerName = listing.seller.businessName || `@${listing.seller.username}`;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ flex: 1 }}
      onPress={() => router.push(`/buyer/listing-detail?id=${listing.id}`)}
    >
      <View
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: 18,
          overflow: "hidden",
        }}
      >
        {/* Product Image Box */}
        <View
          style={{
            width: "100%",
            height: 135,
            backgroundColor: "#16181d",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {listing.images && listing.images[0] ? (
            <Image
              source={{ uri: listing.images[0] }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={150}
              cachePolicy="memory-disk"
              recyclingKey={listing.images[0]}
              allowDownscaling
            />
          ) : (
            <Ionicons name="image-outline" size={28} color="rgba(255,255,255,0.15)" />
          )}

          {/* Heart Wishlist Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: "rgba(0, 0, 0, 0.55)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={15}
              color={isFavorited ? "#df4a32" : "#ffffff"}
            />
          </TouchableOpacity>

          {/* Category Chip */}
          <View
            style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              borderRadius: 6,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontSize: 10,
                color: "#eaf4f0",
              }}
            >
              {listing.category.name}
            </Text>
          </View>
        </View>

        {/* Product Metadata & Price */}
        <View style={{ padding: 10, gap: 4 }}>
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontSize: 13,
              color: "#ffffff",
            }}
            numberOfLines={1}
          >
            {listing.title}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "BricolageGrotesque-Bold",
                fontSize: 14,
                color: "#3b7e68",
              }}
            >
              {formatPrice(listing.price)}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
              <Ionicons name="star" size={11} color="#f59e0b" />
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  fontSize: 10,
                  color: "#9ca3af",
                }}
              >
                4.8
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginTop: 2,
            }}
          >
            <Ionicons name="shield-checkmark" size={11} color="#3b7e68" />
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 10,
                color: "#9ca3af",
                flex: 1,
              }}
              numberOfLines={1}
            >
              {sellerName}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

function BottomNavDock({ currentTab = "home" }: { currentTab?: string }) {
  const router = useRouter();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        height: 64,
        backgroundColor: "rgba(18, 20, 24, 0.92)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.12)",
        borderRadius: 32,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 12,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          width: 54,
        }}
      >
        <Ionicons
          name="home"
          size={22}
          color={currentTab === "home" ? "#3b7e68" : "#6b7280"}
        />
        <Text
          style={{
            fontFamily: "Inter-SemiBold",
            fontSize: 10,
            color: currentTab === "home" ? "#3b7e68" : "#6b7280",
          }}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push("/buyer/home")}
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          width: 54,
        }}
      >
        <Ionicons name="compass-outline" size={22} color="#6b7280" />
        <Text
          style={{
            fontFamily: "Inter-Regular",
            fontSize: 10,
            color: "#6b7280",
          }}
        >
          Explore
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {}}
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          width: 54,
        }}
      >
        <View>
          <Ionicons name="cart-outline" size={22} color="#6b7280" />
          <View
            style={{
              position: "absolute",
              top: -3,
              right: -5,
              backgroundColor: "#df4a32",
              borderRadius: 6,
              paddingHorizontal: 4,
              paddingVertical: 1,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: 8,
                color: "#ffffff",
              }}
            >
              2
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontFamily: "Inter-Regular",
            fontSize: 10,
            color: "#6b7280",
          }}
        >
          Cart
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push("/select-role")}
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          width: 54,
        }}
      >
        <Ionicons name="person-outline" size={22} color="#6b7280" />
        <Text
          style={{
            fontFamily: "Inter-Regular",
            fontSize: 10,
            color: "#6b7280",
          }}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function EmptyState({
  category,
  search,
  onBrowseAll,
}: {
  category: string | null;
  search: string;
  onBrowseAll: () => void;
}) {
  const catName = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : null;

  return (
    <View
      style={{
        height: 280,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 20,
      }}
    >
      <Ionicons name="search-outline" size={48} color="rgba(255,255,255,0.15)" />
      <Text
        style={{
          fontFamily: "BricolageGrotesque-Bold",
          fontSize: 17,
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        {search ? "No matches found" : "No listings yet"}
      </Text>
      <Text
        style={{
          fontFamily: "Inter-Regular",
          fontSize: 13,
          color: "#9ca3af",
          textAlign: "center",
          lineHeight: 18,
        }}
      >
        {search
          ? `We couldn't find items for "${search}".\nTry searching for something else.`
          : catName
            ? `No ${catName} items listed on campus yet.`
            : "No items listed yet on campus."}
      </Text>
      {category && (
        <TouchableOpacity
          onPress={onBrowseAll}
          activeOpacity={0.8}
          style={{
            backgroundColor: "rgba(59, 126, 104, 0.2)",
            borderWidth: 1,
            borderColor: "#3b7e68",
            borderRadius: 999,
            paddingHorizontal: 20,
            paddingVertical: 8,
            marginTop: 4,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter-Medium",
              fontSize: 12,
              color: "#3b7e68",
            }}
          >
            Browse all categories
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ─── Loading skeleton grid ─────────────────────── */

function LoadingGrid() {
  const [pulse] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  const renderSkeleton = (w: number | string, h: number, r = 8) => (
    <Animated.View
      style={{
        width: w as any,
        height: h,
        borderRadius: r,
        backgroundColor: "rgba(255,255,255,0.08)",
        opacity,
      }}
    />
  );

  return (
    <View style={{ gap: 12 }}>
      {[0, 1].map((row) => (
        <View key={row} style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1, gap: 8 }}>
            {renderSkeleton("100%", 135, 18)}
            {renderSkeleton("80%", 14)}
            {renderSkeleton("50%", 14)}
            {renderSkeleton("60%", 12)}
          </View>
          <View style={{ flex: 1, gap: 8 }}>
            {renderSkeleton("100%", 135, 18)}
            {renderSkeleton("80%", 14)}
            {renderSkeleton("50%", 14)}
            {renderSkeleton("60%", 12)}
          </View>
        </View>
      ))}
    </View>
  );
}

/* ─── Helpers ────────────────────────────────────── */

function formatPrice(price: string): string {
  const num = parseFloat(price) || 0;
  return "₦" + num.toLocaleString("en-NG");
}
