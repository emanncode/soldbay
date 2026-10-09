import React, { useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { useAppRouter as useRouter } from "@/hooks/useAppRouter";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { SearchBar } from "../../components/ui/SearchBar";
import { ProductCard } from "../../components/ui/ProductCard";
import { CaretRight } from "phosphor-react-native";
import { colors } from "../../theme/tokens";

const CATEGORIES = [
  "Cheapest Items",
  "Textbooks",
  "Most Searched",
  "Electronics",
  "Dorm Essentials",
  "Clothing"
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
    condition: "Used - Good",
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
    condition: "Used - Excellent",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    title: "Mini Fridge",
    price: 35000,
    originalPrice: 45000,
    sellerName: "Tunde B.",
    isVerifiedSeller: true,
    isSold: true,
    condition: "Perfect Condition",
    imageUrl:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "4",
    title: "Nike Air Force 1 Size 42",
    price: 25000,
    sellerName: "David O.",
    isVerifiedSeller: false,
    condition: "Like New",
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
    condition: "Used - Good",
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
    condition: "Used - Excellent",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "7",
    title: "Mini Fridge",
    price: 35000,
    originalPrice: 45000,
    sellerName: "Tunde B.",
    isVerifiedSeller: true,
    isSold: true,
    condition: "Perfect Condition",
    imageUrl:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "8",
    title: "Nike Air Force 1 Size 42",
    price: 25000,
    sellerName: "David O.",
    isVerifiedSeller: false,
    condition: "Like New",
  },
];

export default function FeedScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
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
      {/* Sticky Header */}
      <View className="px-4 pt-16 bg-bgBase dark:bg-darkBg z-10">
        <ScreenHeader
          title="Browse"
          hasUnreadNotifications={true}
          onNotificationPress={() => router.push("/notifications")}
          userName="John Doe"
          onProfilePress={() => router.push("/profile")}
        />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Scrollable Search Bar */}
        <View className="px-4 mb-6">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Search Soldbay..."
          />
        </View>

        {/* Category Sections */}
        {CATEGORIES.map((category, sectionIndex) => {
          const isRowLayout = sectionIndex % 2 === 0;

          return (
            <View key={category} className="mb-8">
              {/* Section Header */}
              <View className="flex-row items-center justify-between px-4 mb-4">
                <Text className="text-title-3 text-primaryText dark:text-darkText">
                  {category}
                </Text>
                <TouchableOpacity className="flex-row items-center gap-1 active:opacity-70">
                  <Text className="text-[14px] font-sora-semibold text-accent">
                    See all
                  </Text>
                  <CaretRight size={14} color={colors.accent} weight="bold" />
                </TouchableOpacity>
              </View>

              {isRowLayout ? (
                /* Horizontal List */
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: gap }}
                  className="px-4"
                >
                  {/* Using the same MOCK_PRODUCTS for every section for now */}
                  {MOCK_PRODUCTS.slice(0, 4).map((product, index) => (
                    <ProductCard
                      key={`${category}-${product.id}-${index}`}
                      {...product}
                      style={{ width: 170 }}
                      onPress={() => router.push(`/product/${product.id}`)}
                    />
                  ))}
                </ScrollView>
              ) : (
                /* 2x2 Grid */
                <View className="flex-row flex-wrap justify-between px-4">
                  {/* Using the same MOCK_PRODUCTS for every section for now */}
                  {MOCK_PRODUCTS.slice(0, 4).map((product, index) => (
                    <ProductCard
                      key={`${category}-${product.id}-${index}`}
                      {...product}
                      style={{ width: cardWidth, marginBottom: gap }}
                      onPress={() => router.push(`/product/${product.id}`)}
                    />
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
