import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  CaretLeft,
  ShareNetwork,
  SealCheck,
  ShieldWarning,
  Star,
  Flag,
} from "phosphor-react-native";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";
import { WishlistButton } from "../../components/ui/WishlistButton";
import { IconButton } from "../../components/ui/IconButton";
import { colors } from "../../theme/tokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Dummy data fetching
const getProductById = (id: string) => {
  return {
    id,
    title: "MacBook Pro M1 2020 - Excellent Condition",
    price: 450000,
    originalPrice: 500000,
    description:
      "Selling my MacBook Pro M1 2020. Barely used, battery cycle is under 50. Comes with the original charger and box. Perfect for computer science students! Price is slightly negotiable.",
    condition: "Used",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1531297172867-628c68412035?auto=format&fit=crop&q=80&w=800",
    ],
    isSold: false,
    seller: {
      id: "seller123",
      name: "Amina Y.",
      avatarUrl:
        "https://images.unsplash.com/photo-1531123897727-8f129e1b4dce?auto=format&fit=crop&q=80&w=200",
      isVerified: true,
      rating: 4.8,
      reviewCount: 15,
      joinDate: "Joined Oct 2023",
    },
  };
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const windowWidth = Dimensions.get("window").width;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = getProductById(id as string);

  // Dummy check for self-purchase
  const currentUserId = "buyer456";
  const isSelfPurchase = currentUserId === product.seller.id;

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / windowWidth);
    setActiveImageIndex(index);
  };

  return (
    <View className="flex-1 bg-bgBase dark:bg-darkBg">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Image Gallery */}
        <View
          className="relative bg-[#e0e0e0] dark:bg-darkBgStep"
          style={{ height: windowWidth }}
        >
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
          >
            {product.images.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={{ width: windowWidth, height: windowWidth }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Absolute Header (Over image) */}
          <View
            className="absolute top-0 left-0 right-0 flex-row justify-between items-center px-4"
            style={{ paddingTop: Math.max(insets.top, 16) }}
          >
            <IconButton icon={CaretLeft} onPress={() => router.back()} />

            <View className="flex-row gap-3">
              <IconButton icon={ShareNetwork} onPress={() => {}} />
              <WishlistButton variant="glass" initialIsWishlisted={false} />
            </View>
          </View>

          {/* Pagination Dots */}
          {product.images.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
              {product.images.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 rounded-full ${index === activeImageIndex ? "w-4 bg-white" : "w-2 bg-white/50"}`}
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Info */}
        <View className="px-4 pt-5 pb-6 border-b border-borderLight dark:border-borderDark/24">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 pr-4">
              <Text className="text-title-2 text-primaryText dark:text-darkText leading-snug">
                {product.title}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3 mb-4">
            <Text className="text-[24px] font-sora-bold text-primaryText dark:text-darkText">
              ₦{product.price.toLocaleString()}
            </Text>
            {product.originalPrice && (
              <Text className="text-[14px] font-sora line-through text-secondaryText dark:text-borderDark">
                ₦{product.originalPrice.toLocaleString()}
              </Text>
            )}
          </View>

          <View className="flex-row items-center">
            <View className="bg-primaryText/5 dark:bg-darkBgStep px-3 py-1.5 rounded-sm">
              <Text className="text-[13px] font-sora-semibold text-secondaryText dark:text-darkText">
                Condition:{" "}
                <Text className="text-primaryText dark:text-white">
                  {product.condition}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Seller Info */}
        <View className="px-4 py-5 border-b border-borderLight dark:border-borderDark/24">
          <Text className="text-[15px] font-sora-bold text-primaryText dark:text-darkText mb-4">
            About the Seller
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Avatar
                imageUrl={product.seller.avatarUrl}
                initials={product.seller.name.charAt(0)}
                size={48}
              />
              <View>
                <View className="flex-row items-center gap-1">
                  <Text className="text-[15px] font-sora-semibold text-primaryText dark:text-darkText">
                    {product.seller.name}
                  </Text>
                  {product.seller.isVerified ? (
                    <SealCheck size={14} color={colors.accent} weight="fill" />
                  ) : (
                    <ShieldWarning
                      size={14}
                      color={isDark ? colors.darkText : colors.secondaryText}
                      weight="fill"
                    />
                  )}
                </View>
                <Text className="text-[12px] font-sora text-secondaryText dark:text-borderDark mt-0.5">
                  {product.seller.joinDate}
                </Text>
              </View>
            </View>

            <View className="items-end">
              <View className="flex-row items-center gap-1 mb-0.5">
                <Star size={14} color={colors.accent} weight="fill" />
                <Text className="text-[14px] font-sora-bold text-primaryText dark:text-darkText">
                  {product.seller.rating}
                </Text>
              </View>
              <Text className="text-[11px] font-sora text-secondaryText dark:text-borderDark">
                {product.seller.reviewCount} reviews
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="px-4 py-5 pb-8">
          <Text className="text-[15px] font-sora-bold text-primaryText dark:text-darkText mb-3">
            Description
          </Text>
          <Text className="text-[15px] font-sora text-secondaryText dark:text-borderDark leading-[24px]">
            {product.description}
          </Text>

          {/* Report Listing */}
          <TouchableOpacity className="flex-row items-center gap-2 mt-8 py-3">
            <Flag size={16} color={isDark ? colors.darkError : colors.error} weight="bold" />
            <Text className="text-[13px] font-sora-bold text-error  dark:text-darkError">
              Report this listing
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View
        className="px-4 pt-4 bg-bgBase dark:bg-darkBg border-t border-borderLight dark:border-borderDark/24 shadow-elevation-2 dark:shadow-none"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        {isSelfPurchase ? (
          <Button label="This is your listing" variant="outline" disabled />
        ) : (
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <Text className="text-[12px] font-sora text-secondaryText dark:text-borderDark mb-1">
                Total Price
              </Text>
              <Text className="text-[20px] font-sora-bold text-primaryText dark:text-darkText">
                ₦{product.price.toLocaleString()}
              </Text>
            </View>
            <View className="w-1/2">
              <Button
                label="Buy Now"
                variant="primary"
                onPress={() => router.push(`/checkout/${product.id}`)}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
