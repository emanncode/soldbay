import React, { useState } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MagnifyingGlass } from "phosphor-react-native";
import { useRouter } from "expo-router";
import { SearchBar } from "../../components/ui/SearchBar";
import { FilterChip } from "../../components/ui/FilterChip";
import { ProductCard } from "../../components/ui/ProductCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { colors } from "../../theme/tokens";

const MOCK_PRODUCTS = [
  {
    id: "1",
    title: "Fundamentals of Physics 10th Ed",
    price: 15000,
    sellerName: "Chidi E.",
    isVerifiedSeller: true,
    condition: "Used",
    imageUrl:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "2",
    title: "MacBook Pro M1 2020",
    price: 450000,
    sellerName: "Amina Y.",
    isVerifiedSeller: false,
    condition: "Refurbished",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    title: "Chemistry Lab Coat",
    price: 5000,
    sellerName: "Tunde B.",
    isVerifiedSeller: true,
    condition: "New",
    imageUrl:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=800",
  },
];

const CONDITIONS = ["All", "New", "Used", "Refurbished"];

export default function SearchTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState("All");

  const windowWidth = Dimensions.get("window").width;
  const numColumns = 2;
  const padding = 16;
  const gap = 12;
  const cardWidth =
    (windowWidth - padding * 2 - gap * (numColumns - 1)) / numColumns;

  // Filter Logic
  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    if (
      searchQuery &&
      !p.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (verifiedOnly && !p.isVerifiedSeller) return false;
    if (selectedCondition !== "All" && p.condition !== selectedCondition)
      return false;
    return true;
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-bgBase dark:bg-darkBg"
    >
      <View className="px-4 pt-12 pb-2">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery("")}
          placeholder="Search products, brands, etc..."
          autoFocus={true}
        />
      </View>

      <View className="mb-2 border-b border-borderLight dark:border-borderDark/24 pb-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          <FilterChip
            label="Verified Only"
            selected={verifiedOnly}
            onPress={() => setVerifiedOnly(!verifiedOnly)}
          />
          {CONDITIONS.map((condition) => (
            <FilterChip
              key={condition}
              label={condition}
              selected={selectedCondition === condition}
              onPress={() => setSelectedCondition(condition)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {filteredProducts.length > 0 ? (
          <View className="flex-row flex-wrap justify-between pb-24">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                style={{ width: cardWidth, marginBottom: gap }}
                onPress={() => router.push(`/product/${product.id}`)}
              />
            ))}
          </View>
        ) : (
          <View className="flex-1 mt-10">
            <EmptyState
              icon={
                <MagnifyingGlass
                  size={48}
                  color={colors.secondaryText}
                  weight="light"
                />
              }
              title="No results found"
              description={`We couldn't find anything matching "${searchQuery}". Try adjusting your filters.`}
              action={
                <FilterChip
                  label="Clear Filters"
                  onPress={() => {
                    setSearchQuery("");
                    setVerifiedOnly(false);
                    setSelectedCondition("All");
                  }}
                />
              }
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
