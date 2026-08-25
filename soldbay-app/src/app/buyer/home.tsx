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
import { SearchBar } from "@/components/search-bar";
import { IconButton } from "@/components/icon-button";
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

// ─── 8pt Grid System Constants ───────────────────────
const GRID = {
  gutter: 16,
  gapTight: 4,
  gapSmall: 8,
  gapMedium: 16,
  gapLarge: 24,
  gapXLarge: 32,
  cardRadius: 16,
  pillRadius: 999,
  dockRadius: 32,
  inputHeight: 48,
  iconBtnSize: 40,
  cardImgHeight: 144,
  dockHeight: 64,
};

interface PromoItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const PROMO_BANNERS: PromoItem[] = [
  {
    id: "1",
    badge: "30% OFF",
    title: "Campus Deals & Discounts",
    subtitle: "Save on textbooks, gadgets, and dorm essentials from verified peers.",
    cta: "Shop Now",
    icon: "pricetag-outline",
  },
  {
    id: "2",
    badge: "VERIFIED",
    title: "Student Portal Verified",
    subtitle: "Trade safely with matriculated students across all faculties.",
    cta: "Learn More",
    icon: "shield-checkmark-outline",
  },
  {
    id: "3",
    badge: "CAMPUS MEETUP",
    title: "Direct Hostel Delivery",
    subtitle: "Quick on-campus handoffs at your hall of residence or faculty park.",
    cta: "Explore",
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

  const promoScrollRef = useRef<ScrollView>(null);
  const storesScrollRef = useRef<ScrollView>(null);
  const activeBannerIndexRef = useRef(0);
  const activeStoreIndexRef = useRef(0);

  const initialLoad = useRef(true);
  const mounted = useRef(true);
  const loadSeq = useRef(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Auto-scroll Promo Banners (loops back to first when reaching end)
  useEffect(() => {
    if (debouncedSearch) return;
    const bannerSlideWidth = SCREEN_WIDTH - GRID.gutter * 2;
    const interval = setInterval(() => {
      if (!mounted.current) return;
      const nextIndex = (activeBannerIndexRef.current + 1) % PROMO_BANNERS.length;
      activeBannerIndexRef.current = nextIndex;
      setActiveBannerIndex(nextIndex);
      promoScrollRef.current?.scrollTo({
        x: nextIndex * bannerSlideWidth,
        animated: true,
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [debouncedSearch]);

  // Auto-scroll Places Nearby / Campus Stores (loops back to first when reaching end)
  useEffect(() => {
    if (debouncedSearch) return;
    const storeCardStep = 240 + GRID.gapMedium; // 240px card + 16px gap = 256px (32 * 8pt)
    const interval = setInterval(() => {
      if (!mounted.current) return;
      const nextIndex = (activeStoreIndexRef.current + 1) % NEARBY_STORES.length;
      activeStoreIndexRef.current = nextIndex;
      storesScrollRef.current?.scrollTo({
        x: nextIndex * storeCardStep,
        animated: true,
      });
    }, 4200);

    return () => clearInterval(interval);
  }, [debouncedSearch]);

  // Fetch current user profile
  useEffect(() => {
    (async () => {
      try {
        const u = await getMe();
        if (mounted.current) setUser(u);
      } catch {}
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
    } finally {
      if (mounted.current && seq === loadSeq.current) setLoadingMore(false);
    }
  }, [loading, loadingMore, hasMore, nextCursor, selectedCategory, debouncedSearch]);

  useEffect(() => {
    (async () => {
      try {
        const cats = await getCategories();
        if (mounted.current) setCategories(cats);
      } catch {}
    })();
    const timer = setTimeout(() => loadFirstPage(), 0);
    return () => clearTimeout(timer);
  }, [loadFirstPage]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchQuery]);

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
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleBannerScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = SCREEN_WIDTH - GRID.gutter * 2 + GRID.gapMedium;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / (slideSize > 0 ? slideSize : 1));
    const clamped = Math.max(0, Math.min(index, PROMO_BANNERS.length - 1));
    activeBannerIndexRef.current = clamped;
    setActiveBannerIndex(clamped);
  };

  const handleStoreScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const step = 240 + GRID.gapMedium;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / step);
    const clamped = Math.max(0, Math.min(index, NEARBY_STORES.length - 1));
    activeStoreIndexRef.current = clamped;
  };

  const displayName = user?.name ? user.name.split(" ")[0] : "Shopper";
  const userCampus = user?.universityId ? user.universityId.toUpperCase() : "All Campuses";

  const headerComponent = (
    <View style={{ gap: GRID.gapLarge, paddingBottom: GRID.gapSmall }}>
      {/* ── 1. Top Greeting & Notification Bar (Grid Aligned: 16px Gutter, 40px Icon Button) ── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: GRID.gutter,
          paddingTop: GRID.gapSmall,
        }}
      >
        <View style={{ gap: GRID.gapTight }}>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#9ca3af" }}>
            Hello,
          </Text>
          <Text style={{ fontFamily: "BricolageGrotesque-Bold", fontSize: 22, color: "#ffffff" }}>
            {displayName}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: GRID.gapSmall }}>
          {/* Campus Location Pill (Height: 36px) */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => router.push("/select-university")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              height: 36,
              backgroundColor: "rgba(59, 126, 104, 0.18)",
              borderWidth: 1,
              borderColor: "rgba(59, 126, 104, 0.35)",
              borderRadius: GRID.pillRadius,
              paddingHorizontal: 12,
            }}
          >
            <Ionicons name="location-sharp" size={14} color="#3b7e68" />
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#eaf4f0" }}>
              {userCampus}
            </Text>
            <Ionicons name="chevron-down" size={12} color="#9ca3af" />
          </TouchableOpacity>

          {/* Notification Button (Reusable IconButton with Badge Dot) */}
          <IconButton
            icon="notifications-outline"
            size="lg"
            variant="glass"
            hasBadgeDot={true}
            accessibilityLabel="Notifications"
          />
        </View>
      </View>

      {/* ── 2. Reusable Search & Filter Bar (Grid Aligned: 48px Height - 6 * 8pt) ── */}
      <View style={{ paddingHorizontal: GRID.gutter }}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search textbooks, gadgets..."
          onFilterPress={() => {}}
          onClear={() => setSearchQuery("")}
        />
      </View>

      {/* ── 3. Promo Banner Carousel (Strictly Contained within Grid Lines) ── */}
      {!debouncedSearch && (
        <View style={{ paddingHorizontal: GRID.gutter, gap: GRID.gapSmall }}>
          <View
            style={{
              width: "100%",
              borderRadius: GRID.cardRadius,
              overflow: "hidden",
            }}
          >
            <ScrollView
              ref={promoScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleBannerScrollEnd}
              scrollEventThrottle={16}
              decelerationRate="fast"
            >
              {PROMO_BANNERS.map((banner) => (
                <View
                  key={banner.id}
                  style={{
                    width: SCREEN_WIDTH - GRID.gutter * 2,
                    backgroundColor: "rgba(22, 25, 30, 0.95)",
                    borderWidth: 1,
                    borderColor: "rgba(59, 126, 104, 0.25)",
                    borderRadius: GRID.cardRadius,
                    padding: GRID.gapMedium,
                    gap: 12,
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View
                      style={{
                        backgroundColor: "rgba(223, 74, 50, 0.18)",
                        borderWidth: 1,
                        borderColor: "rgba(223, 74, 50, 0.35)",
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                      }}
                    >
                      <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 11, color: "#df4a32" }}>
                        {banner.badge}
                      </Text>
                    </View>
                    <Ionicons name={banner.icon} size={20} color="#3b7e68" />
                  </View>
                  <View style={{ gap: 4 }}>
                    <Text style={{ fontFamily: "BricolageGrotesque-Bold", fontSize: 16, color: "#ffffff" }}>
                      {banner.title}
                    </Text>
                    <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9ca3af", lineHeight: 16 }}>
                      {banner.subtitle}
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      alignSelf: "flex-start",
                      backgroundColor: "#3b7e68",
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: GRID.pillRadius,
                    }}
                  >
                    <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#ffffff" }}>
                      {banner.cta}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 2 }}>
            {PROMO_BANNERS.map((_, i) => (
              <View
                key={i}
                style={{
                  width: activeBannerIndex === i ? 16 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: activeBannerIndex === i ? "#3b7e68" : "rgba(255, 255, 255, 0.2)",
                }}
              />
            ))}
          </View>
        </View>
      )}

      {/* ── 4. Categories Section (Height: 40px - 5 * 8pt, Gap: 8px) ── */}
      <View style={{ gap: GRID.gapSmall, paddingHorizontal: GRID.gutter }}>
        <Text style={{ fontFamily: "BricolageGrotesque-Bold", fontSize: 18, color: "#ffffff" }}>
          Categories
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: GRID.gapSmall }}
        >
          <CategoryTextPill label="All" selected={selectedCategory === null} onPress={() => setSelectedCategory(null)} />
          {categories.map((cat) => (
            <CategoryTextPill
              key={cat.id}
              label={cat.name}
              selected={selectedCategory === cat.slug}
              onPress={() => setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)}
            />
          ))}
        </ScrollView>
      </View>

      {/* ── 5. Places Nearby / Campus Stores (Auto-scrolling, 240px Card Width - 30 * 8pt, 16px Gap) ── */}
      {!debouncedSearch && (
        <View style={{ gap: GRID.gapSmall, paddingHorizontal: GRID.gutter }}>
          <Text style={{ fontFamily: "BricolageGrotesque-Bold", fontSize: 18, color: "#ffffff" }}>
            Campus Stores Near You
          </Text>
          <ScrollView
            ref={storesScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleStoreScrollEnd}
            contentContainerStyle={{ gap: GRID.gapMedium }}
          >
            {NEARBY_STORES.map((store) => (
              <View
                key={store.id}
                style={{
                  width: 240, // 30 * 8pt
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.08)",
                  borderRadius: GRID.cardRadius,
                  padding: GRID.gapMedium,
                  gap: 10,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "rgba(59, 126, 104, 0.25)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontFamily: "BricolageGrotesque-Bold", fontSize: 14, color: "#3b7e68" }}>
                      {store.avatarText}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#ffffff" }} numberOfLines={1}>
                        {store.name}
                      </Text>
                      <Ionicons name="checkmark-circle" size={14} color="#3b7e68" />
                    </View>
                    <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9ca3af" }} numberOfLines={1}>
                      {store.faculty} · {store.campus}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Ionicons name="star" size={13} color="#f59e0b" />
                    <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#ffffff" }}>
                      {store.rating}
                    </Text>
                    <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#6b7280" }}>
                      ({store.reviewsCount})
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── 6. Section Title & Sub-filter pills (Height: 32px - 4 * 8pt, Gap: 8px) ── */}
      <View style={{ paddingHorizontal: GRID.gutter, gap: GRID.gapSmall, paddingTop: 4 }}>
        <Text style={{ fontFamily: "BricolageGrotesque-Bold", fontSize: 18, color: "#ffffff" }}>
          Most Popular
        </Text>
        {!debouncedSearch && !selectedCategory && (
          <View style={{ flexDirection: "row", gap: GRID.gapSmall }}>
            {[
              { id: "all", label: "All Items" },
              { id: "hot", label: "Trending" },
              { id: "deals", label: "Budget Deals" },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setPopularFilter(tab.id)}
                activeOpacity={0.7}
                style={{
                  height: 32,
                  justifyContent: "center",
                  backgroundColor: popularFilter === tab.id ? "rgba(59, 126, 104, 0.25)" : "rgba(255, 255, 255, 0.04)",
                  borderWidth: 1,
                  borderColor: popularFilter === tab.id ? "#3b7e68" : "rgba(255, 255, 255, 0.08)",
                  paddingHorizontal: 12,
                  borderRadius: GRID.pillRadius,
                }}
              >
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: popularFilter === tab.id ? "#ffffff" : "#9ca3af" }}>
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
    <PageAtmosphere theme="pure-dark">
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0d0e11" }} edges={["top", "left", "right"]}>
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
          columnWrapperStyle={{ gap: 12, paddingHorizontal: GRID.gutter }}
          contentContainerStyle={{ paddingBottom: 104, gap: 12, flexGrow: 1 }}
          ListHeaderComponent={headerComponent}
          ListEmptyComponent={
            loading ? (
              <View style={{ paddingHorizontal: GRID.gutter }}>
                <LoadingGrid />
              </View>
            ) : (
              <EmptyState category={selectedCategory} search={debouncedSearch} onBrowseAll={() => setSelectedCategory(null)} />
            )
          }
          ListFooterComponent={loadingMore ? <View style={{ paddingVertical: 16 }}><ActivityIndicator color="#3b7e68" size="small" /></View> : null}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
        <BottomNavDock currentTab="home" />
      </SafeAreaView>
    </PageAtmosphere>
  );
}

function CategoryTextPill({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        height: 38,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: selected ? "#3b7e68" : "rgba(255, 255, 255, 0.05)",
        borderWidth: 1,
        borderColor: selected ? "#3b7e68" : "rgba(255, 255, 255, 0.08)",
        borderRadius: GRID.pillRadius,
        paddingHorizontal: 16,
      }}
    >
      <Text style={{ fontFamily: selected ? "Inter-SemiBold" : "Inter-Medium", fontSize: 13, color: selected ? "#ffffff" : "#9ca3af" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const ListingCard = memo(function ListingCard({ listing, isFavorited, onToggleFavorite }: { listing: PublicListing; isFavorited: boolean; onToggleFavorite: () => void }) {
  const router = useRouter();
  const sellerName = listing.seller.businessName || `@${listing.seller.username}`;
  return (
    <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={() => router.push(`/buyer/listing-detail?id=${listing.id}`)}>
      <View
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.04)",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.08)",
          borderRadius: GRID.cardRadius,
          overflow: "hidden",
        }}
      >
        <View style={{ width: "100%", height: GRID.cardImgHeight, backgroundColor: "#16181c", justifyContent: "center", alignItems: "center" }}>
          {listing.images && listing.images[0] ? (
            <Image source={{ uri: listing.images[0] }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
          ) : (
            <Ionicons name="image-outline" size={28} color="rgba(255,255,255,0.15)" />
          )}
          <IconButton
            icon={isFavorited ? "heart" : "heart-outline"}
            size="sm"
            variant="dark"
            color={isFavorited ? "#df4a32" : "#ffffff"}
            onPress={onToggleFavorite}
            style={{ position: "absolute", top: 8, right: 8 }}
            accessibilityLabel={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
          />
        </View>
        <View style={{ padding: 12, gap: 4 }}>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#ffffff" }} numberOfLines={1}>{listing.title}</Text>
          <Text style={{ fontFamily: "BricolageGrotesque-Bold", fontSize: 14, color: "#3b7e68" }}>{formatPrice(listing.price)}</Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 10, color: "#9ca3af" }} numberOfLines={1}>{sellerName}</Text>
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
        bottom: 16,
        left: GRID.gutter,
        right: GRID.gutter,
        height: GRID.dockHeight,
        backgroundColor: "rgba(16, 18, 22, 0.95)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: GRID.dockRadius,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 12,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
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
          name={currentTab === "home" ? "home" : "home-outline"}
          size={21}
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
        <Ionicons name="compass-outline" size={21} color="#6b7280" />
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
          <Ionicons name="bag-handle-outline" size={21} color="#6b7280" />
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
        <Ionicons name="person-outline" size={21} color="#6b7280" />
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

function EmptyState({ category, search, onBrowseAll }: { category: string | null; search: string; onBrowseAll: () => void }) {
  return (
    <View style={{ height: 280, justifyContent: "center", alignItems: "center", gap: 12, paddingHorizontal: GRID.gutter }}>
      <Ionicons name="search-outline" size={48} color="rgba(255,255,255,0.15)" />
      <Text style={{ fontFamily: "BricolageGrotesque-Bold", fontSize: 17, color: "#ffffff", textAlign: "center" }}>
        {search ? "No matches found" : "No listings yet"}
      </Text>
    </View>
  );
}

function LoadingGrid() {
  return (
    <View style={{ gap: 12 }}>
      {[0, 1].map((row) => (
        <View key={row} style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1, gap: 8, height: 200, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: GRID.cardRadius }} />
          <View style={{ flex: 1, gap: 8, height: 200, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: GRID.cardRadius }} />
        </View>
      ))}
    </View>
  );
}

function formatPrice(price: string): string {
  const num = parseFloat(price) || 0;
  return "₦" + num.toLocaleString("en-NG");
}
