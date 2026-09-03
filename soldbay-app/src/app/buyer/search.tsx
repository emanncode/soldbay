import { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Search as SearchIcon,
  ShoppingBag,
  ShoppingCart,
  User,
  Wallet,
} from "lucide-react-native";
import {
  EmptyState,
  FilterChip,
  ListingCard,
  SearchBar,
  TabBar,
} from "@/components";
import { getCategories, getListings, type Category, type PublicListing } from "@/lib/api";
import { colors } from "@/theme/colors";

export default function BuyerSearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState("search");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) return;
      setLoading(true);

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
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTabPress = (key: string) => {
    if (key === "feed") router.replace("/buyer/home");
    else if (key === "cart") router.replace("/buyer/cart");
    else if (key === "wallet") router.replace("/buyer/wallet");
    else if (key === "profile") router.replace("/profile");
    else setActiveTab(key);
  };

  const tabs = [
    { key: "feed", label: "Feed", icon: ({ color, size }: any) => <ShoppingBag color={color} size={size} /> },
    { key: "search", label: "Search", icon: ({ color, size }: any) => <SearchIcon color={color} size={size} /> },
    { key: "cart", label: "Cart", icon: ({ color, size }: any) => <ShoppingCart color={color} size={size} /> },
    { key: "wallet", label: "Wallet", icon: ({ color, size }: any) => <Wallet color={color} size={size} /> },
    { key: "profile", label: "Profile", icon: ({ color, size }: any) => <User color={color} size={size} /> },
  ];

  return (
    <View className="flex-1 bg-surface-base">
      <View
        style={{ paddingTop: Math.max(insets.top + 8, 16) }}
        className="px-3 pb-1 border-b border-border bg-surface-elevated"
      >
        <View className="mb-2">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search items on your campus..."
          />
        </View>

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

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : listings.length === 0 ? (
        <View className="flex-1 items-center justify-center px-3">
          <EmptyState
            icon={<SearchIcon size={28} color={colors.neutral500} />}
            title="No results"
            description="Try searching for something else or browse the feed."
          />
        </View>
      ) : (
        <FlatList
          data={listings}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 32 }}
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

      <TabBar tabs={tabs} activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}
