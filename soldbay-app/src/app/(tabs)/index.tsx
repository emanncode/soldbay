import React, { useState } from "react";
import { View, ScrollView, RefreshControl, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { SearchBar } from "../../components/ui/SearchBar";
import { FilterChip } from "../../components/ui/FilterChip";
import { ProductCard } from "../../components/ui/ProductCard";

const CATEGORIES = [
  "All",
  "Textbooks",
  "Electronics",
  "Dorm Essentials",
  "Clothing",
];

const MOCK_PRODUCTS = [
  {
    id: "1",
    title: "Fundamentals of Physics 10th Ed",
    price: 15000,
    originalPrice: 20000,
    sellerName: "Chidi E.",
    isVerifiedSeller: true,
    rating: 4.8,
    reviewCount: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "2",
    title: "MacBook Pro M1 2020",
    price: 450000,
    sellerName: "Amina Y.",
    isVerifiedSeller: false,
    rating: 4.5,
    reviewCount: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    title: "Mini Fridge - Perfect Condition",
    price: 35000,
    originalPrice: 45000,
    sellerName: "Tunde B.",
    isVerifiedSeller: true,
    isSold: true,
    imageUrl:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "4",
    title: "Nike Air Force 1 Size 42",
    price: 25000,
    sellerName: "David O.",
    isVerifiedSeller: false,
  },
  {
    id: "5",
    title: "Fundamentals of Physics 10th Ed",
    price: 15000,
    originalPrice: 20000,
    sellerName: "Chidi E.",
    isVerifiedSeller: true,
    rating: 4.8,
    reviewCount: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "6",
    title: "MacBook Pro M1 2020",
    price: 450000,
    sellerName: "Amina Y.",
    isVerifiedSeller: false,
    rating: 4.5,
    reviewCount: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "7",
    title: "Mini Fridge - Perfect Condition",
    price: 35000,
    originalPrice: 45000,
    sellerName: "Tunde B.",
    isVerifiedSeller: true,
    isSold: true,
    imageUrl:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "8",
    title: "Nike Air Force 1 Size 42",
    price: 25000,
    sellerName: "David O.",
    isVerifiedSeller: false,
  },
];

export default function FeedScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const windowWidth = Dimensions.get("window").width;
  const numColumns = 2;
  const padding = 16;
  const gap = 12;
  const cardWidth =
    (windowWidth - padding * 2 - gap * (numColumns - 1)) / numColumns;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <View className="flex-1 bg-bgBase dark:bg-darkBg">
      <View className="px-4 pt-16 mb-6">
        <ScreenHeader
          title="Browse"
          hasUnreadNotifications={true}
          onNotificationPress={() => router.push("/notifications")}
        />

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery("")}
          placeholder="Search Soldbay..."
        />
      </View>

      <View className="mb-6">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {CATEGORIES.map((category) => (
            <FilterChip
              key={category}
              label={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-row flex-wrap justify-between pb-24">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              style={{ width: cardWidth, marginBottom: gap }}
              onPress={() => router.push(`/product/${product.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
