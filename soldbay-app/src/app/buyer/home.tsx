import { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search as SearchIcon } from "lucide-react-native";
import {
  EmptyState,
  FilterChip,
  ListingCard,
  LogoWordmark,
  SearchBar,
  TabScreenShell,
  VerifiedChip,
} from "@/components";
import { getCategories, getListings, type Category, type PublicListing } from "@/lib/api";
import { useModeTabs } from "@/lib/tabs";
import { colors } from "@/theme/colors";

export default function BuyerHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tabs, handleTabPress } = useModeTabs("buyer");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [cats, listingPage] = await Promise.all([
        getCategories().catch(() => []),
        getListings({
          categorySlug: selectedCategory || undefined,
          search: searchQuery.trim() || undefined,
        }).catch(() => ({ items: [], nextCursor: null, hasMore: false })),
      ]);

      setCategories(cats);
      setListings(listingPage.items);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <TabScreenShell
      mode="buyer"
      activeTab="home"
      tabs={tabs}
      onTabPress={handleTabPress}
      header={
        <View
          style={{ paddingTop: Math.max(insets.top + 8, 16) }}
          className="px-3 pb-1 border-b border-border bg-surface-elevated"
        >
          <View className="flex-row items-center justify-between mb-2">
            <LogoWordmark size="md" />
            <VerifiedChip size="sm" />
          </View>

          <View className="mb-2">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search items on your campus..."
            />
          </View>

          {/* Category Pills */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[{ id: "all", name: "All", slug: "" }, ...categories]}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 8, gap: 6 }}
            renderItem={({ item }) => {
              const isActive =
                (item.id === "all" && !selectedCategory) ||
                item.slug === selectedCategory;
              return (
                <FilterChip
                  label={item.name}
                  active={isActive}
                  onPress={() => setSelectedCategory(item.slug || null)}
                />
              );
            }}
          />
        </View>
      }
    >
      {/* Product Grid */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : listings.length === 0 ? (
        <View className="flex-1 items-center justify-center px-3">
          <EmptyState
            icon={<SearchIcon size={28} color={colors.neutral500} />}
            title="No listings found"
            description="Be the first to list an item or try searching for something else."
          />
        </View>
      ) : (
        <FlatList
          data={listings}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadData(true)}
              tintColor={colors.accent}
            />
          }
          renderItem={({ item }) => (
            <View className="flex-1 mb-3">
              <ListingCard
                id={item.id}
                title={item.title}
                price={Number(item.price)}
                imageUrl={item.images[0] || null}
                category={item.category?.name}
                onPress={() => router.push(`/buyer/listing-detail?id=${item.id}`)}
              />
            </View>
          )}
        />
      )}
    </TabScreenShell>
  );
}