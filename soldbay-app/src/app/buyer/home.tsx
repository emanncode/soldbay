import { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  SearchBar,
  NotificationBell,
  FilterChip,
  ListingCard,
  SkeletonCard,
  EmptyState,
  BuyerBottomNav,
} from "@/components";
import {
  Faders,
  SquaresFour,
  BookOpen,
  DeviceMobile,
  TShirt,
  Lamp,
} from "phosphor-react-native";
import { getListings, PublicListing } from "@/lib/api";
import { colors } from "@/theme/colors";

export default function BuyerHomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<
    "browse" | "search" | "orders" | "profile"
  >("browse");

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [listings, setListings] = useState<PublicListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchInitialListings = async () => {
      // Defer state update to avoid synchronous setState in effect body
      await Promise.resolve();
      if (!isActive) return;

      setLoading(true);
      try {
        const res = await getListings({
          categorySlug: activeCategory,
          search: searchQuery,
        });
        if (isActive) setListings(res.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (isActive) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    fetchInitialListings();

    return () => {
      isActive = false;
    };
  }, [activeCategory, searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await getListings({
        categorySlug: activeCategory,
        search: searchQuery,
      });
      setListings(res.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, [activeCategory, searchQuery]);

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "textbooks":
        return BookOpen;
      case "tech":
        return DeviceMobile;
      case "fashion":
        return TShirt;
      case "dorm":
        return Lamp;
      default:
        return SquaresFour;
    }
  };

  const renderHeader = () => (
    <View className="bg-background pt-2 pb-4">
      <View className="flex-row items-center mb-4 gap-3">
        <SearchBar
          className="flex-1"
          placeholder="Search textbooks, tech, dorm..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <NotificationBell hasUnread onPress={() => {}} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        <FilterChip
          label="Filters"
          badgeCount={0}
          icon={Faders}
          variant="secondary"
          onPress={() => {}}
        />
        <FilterChip
          label="All"
          isActive={activeCategory === "all"}
          variant="secondary"
          icon={SquaresFour}
          onPress={() => setActiveCategory("all")}
        />
        {["textbooks", "tech", "fashion", "dorm"].map((slug) => (
          <FilterChip
            key={slug}
            label={slug.charAt(0).toUpperCase() + slug.slice(1)}
            icon={getCategoryIcon(slug)}
            isActive={activeCategory === slug}
            variant="accent"
            onPress={() => setActiveCategory(slug)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderEmpty = () => {
    if (loading) return null;
    const isFiltered = activeCategory !== "all" || searchQuery.length > 0;
    return (
      <EmptyState
        variant={isFiltered ? "filtered" : "empty"}
        onClearFilters={() => {
          setActiveCategory("all");
          setSearchQuery("");
        }}
      />
    );
  };

  const renderSkeleton = () => (
    <View className="px-4 flex-row flex-wrap justify-between">
      {[1, 2, 3, 4].map((key) => (
        <SkeletonCard key={key} />
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-background relative">
      {/* Fixed Header */}
      <View
        className="absolute top-0 w-full z-10 bg-background/95"
        style={{ paddingTop: Platform.OS === "android" ? insets.top : 0 }}
      >
        {renderHeader()}
      </View>

      <ScrollView className="flex-1 px-1" contentContainerStyle={{ paddingTop: 130 + (Platform.OS === "android" ? insets.top : 0), paddingBottom: 90 + insets.bottom }}>
        <FlatList
          data={loading && !refreshing ? [] : listings}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 24 }}
          columnWrapperStyle={{ gap: 16 }}
          ListEmptyComponent={
            loading && !refreshing ? renderSkeleton() : renderEmpty()
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <ListingCard
              title={item.title}
              price={Number(item.price)}
              sellerName={
                item.seller?.businessName ||
                item.seller?.username ||
                "Unknown Seller"
              }
              imageUrl={item.images?.[0]}
              isSold={item.status === "sold"}
            />
          )}
        />
      </ScrollView>

      {/* Fixed Bottom Nav */}
      <View
        className="absolute bottom-0 w-full z-10"
        style={{ paddingBottom: insets.bottom, backgroundColor: colors.surface }}
      >
        <BuyerBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </View>
    </View>
  );
}
