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
} from "react-native";
import { Image } from "expo-image";
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

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 350;

const logo2 = require("../../../assets/logo2.png");

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  textbooks: "book-outline",
  electronics: "phone-portrait-outline",
  fashion: "shirt-outline",
  food: "restaurant-outline",
  services: "construct-outline",
};

export default function BuyerHomeScreen() {
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const initialLoad = useRef(true);
  const mounted = useRef(true);
  const loadSeq = useRef(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
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
      // keep current list; user can scroll again to retry
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

  // Reload when category or debounced search changes (skip initial run)
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

  const header = (
    <View style={{ paddingHorizontal: 20, gap: 20, paddingBottom: 20 }}>
      {/* ── Search row ── */}
      <View
        style={{
          backgroundColor: "#00000059",
          borderWidth: 1,
          borderColor: "#ffffff1f",
          borderRadius: 999,
          height: 44,
          paddingLeft: 16,
          paddingRight: 6,
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
            style={{ padding: 8 }}
          >
            <Ionicons name="close-circle" size={18} color="#ffffff66" />
          </TouchableOpacity>
        ) : null}
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: "rgba(255,255,255,0.08)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="options-outline" size={16} color="#ffffff99" />
        </View>
      </View>

      {/* ── Category pills with icons ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
      >
        <CategoryPill
          label="All"
          icon="apps-outline"
          selected={selectedCategory === null}
          onPress={() => setSelectedCategory(null)}
        />
        {categories.map((cat) => (
          <CategoryPill
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

      {/* ── Section header ── */}
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
            fontSize: 20,
            color: "#ffffff",
          }}
        >
          {selectedCategory
            ? categories.find((c) => c.slug === selectedCategory)?.name ??
              "Results"
            : debouncedSearch
              ? `Results for "${debouncedSearch}"`
              : "Trending near you"}
        </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
          <Text
            style={{
              fontFamily: "Inter-Medium",
              fontSize: 13,
              color: "#ffffff50",
            }}
          >
            See all
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <PageAtmosphere>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 12,
            paddingHorizontal: 20,
            paddingBottom: 14,
          }}
        >
          <Image
            source={logo2}
            style={{ width: 32, height: 32, borderRadius: 8 }}
            tintColor="#ffffff"
            contentFit="contain"
          />
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.7}
            hitSlop={8}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.15)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="heart-outline" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={listings}
          numColumns={2}
          key="buyer-home-grid"
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListingCard listing={item} />}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{
            paddingBottom: 40,
            paddingHorizontal: 20,
            gap: 12,
            flexGrow: 1,
          }}
          ListHeaderComponent={header}
          ListEmptyComponent={
            loading ? (
              <LoadingGrid />
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
                <ActivityIndicator color="#e1261c" size="small" />
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
      </SafeAreaView>
    </PageAtmosphere>
  );
}

/* ─── Sub-components ─────────────────────────────── */

function CategoryPill({
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
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: selected ? "#e1261c" : "transparent",
        borderWidth: 1,
        borderColor: selected ? "#e1261c" : "rgba(255,255,255,0.15)",
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8,
      }}
    >
      <Ionicons
        name={icon}
        size={15}
        color={selected ? "#ffffff" : "#ffffff80"}
      />
      <Text
        style={{
          fontFamily: "Inter-Medium",
          fontSize: 13,
          color: selected ? "#ffffff" : "#ffffffcc",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const ListingCard = memo(function ListingCard({
  listing,
}: {
  listing: PublicListing;
}) {
  const router = useRouter();
  const sellerName = listing.seller.businessName || `@${listing.seller.username}`;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{ flex: 1 }}
      onPress={() => router.push(`/buyer/listing-detail?id=${listing.id}`)}
    >
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.06)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {/* Image */}
        <View
          style={{
            width: "100%",
            height: 120,
            backgroundColor: "#1a1a2e",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {listing.images[0] ? (
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
            <Ionicons name="image-outline" size={24} color="#ffffff1f" />
          )}

          {/* Heart icon (glass circle, top-right) */}
          <View
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: "rgba(0,0,0,0.45)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="heart-outline" size={13} color="#ffffff" />
          </View>
        </View>

        {/* Info */}
        <View style={{ padding: 10, gap: 4 }}>
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
                fontSize: 13,
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
});

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
        height: 320,
        justifyContent: "center",
        alignItems: "center",
        gap: 14,
      }}
    >
      <Ionicons name="pricetag-outline" size={56} color="#ffffff1f" />
      <Text
        style={{
          fontFamily: "BricolageGrotesque-SemiBold",
          fontSize: 18,
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        {search ? "No results found" : "Nothing here yet"}
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
        {search
          ? `We couldn't find any listings for "${search}".\nTry a different search term.`
          : catName
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
        backgroundColor: "rgba(255,255,255,0.1)",
        opacity,
      }}
    />
  );

  return (
    <View style={{ gap: 12 }}>
      {[0, 1].map((row) => (
        <View key={row} style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1, gap: 8 }}>
            {renderSkeleton("100%", 120, 16)}
            {renderSkeleton("80%", 12)}
            {renderSkeleton("50%", 12)}
            {renderSkeleton("60%", 10)}
          </View>
          <View style={{ flex: 1, gap: 8 }}>
            {renderSkeleton("100%", 120, 16)}
            {renderSkeleton("80%", 12)}
            {renderSkeleton("50%", 12)}
            {renderSkeleton("60%", 10)}
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
