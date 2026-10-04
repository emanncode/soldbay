import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
  StyleProp,
  ViewStyle,
} from "react-native";
import { SealCheck, Star, ShieldWarning } from "phosphor-react-native";
import { colors } from "../../theme/tokens";
import { WishlistButton } from "./WishlistButton";

export interface ProductCardProps {
  title: string;
  price: number;
  sellerName?: string;
  originalPrice?: number;
  imageUrl?: string;
  isSold?: boolean;
  isVerifiedSeller?: boolean;
  isWishlisted?: boolean;
  rating?: number;
  reviewCount?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ProductCard({
  title,
  price,
  sellerName = "@seller",
  originalPrice,
  imageUrl,
  isSold = false,
  isVerifiedSeller = false,
  isWishlisted = false,
  rating,
  reviewCount,
  onPress,
  style,
}: ProductCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // In HTML: product-card has no specific background, inherits from screen. We'll use transparent so it matches.
  const cardBg = "bg-transparent";
  // HTML dark mode border is rgba(103, 184, 179, 0.1) -> borderDark/10
  const borderClass = "border border-primaryText/10 dark:border-borderDark/24";

  const textPrimary = isDark ? "text-darkText" : "text-primaryText";
  const textSecondary = isDark ? "text-borderDark" : "text-secondaryText";
  const accentIconColor = isDark ? colors.accent : colors.accentIcon;

  const formattedPrice = `₦${price.toLocaleString()}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isSold || !onPress}
      activeOpacity={0.8}
      className={`rounded-lg overflow-hidden ${cardBg} ${borderClass} ${isSold ? "opacity-60" : ""}`}
      style={[{ width: "100%" }, style]}
    >
      {/* Image Container */}
      <View
        className="w-full bg-[#e0e0e0] dark:bg-borderDark relative justify-center items-center"
        style={{ height: 140 }}
      >
        {imageUrl ? (
          <>
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full object-cover"
            />
            {isSold && (
              <View className="absolute inset-0 bg-primaryText/20 dark:bg-darkBg/40 justify-center items-center">
                <Text className="font-sora-bold text-[18px] text-white tracking-widest drop-shadow-md">
                  SOLD
                </Text>
              </View>
            )}
          </>
        ) : (
          <View className="w-full h-full justify-center items-center">
            {isSold ? (
              <Text
                className={`font-sora-bold text-[18px] text-primaryText/50 dark:text-darkText/50 tracking-widest`}
              >
                SOLD
              </Text>
            ) : (
              <Text className="text-secondaryText/40 dark:text-bgBase font-sora-semibold">
                No Photo
              </Text>
            )}
          </View>
        )}

        {/* Overlay Header */}
        <View className="absolute top-2 left-2 right-2 flex-row justify-between items-start">
          {originalPrice ? (
            <View className="bg-discountFill border-[1.5px] border-discountStroke rounded-full px-1.5 py-0.5">
              <Text className="text-[11px] font-sora-bold text-primaryText">
                -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
              </Text>
            </View>
          ) : (
            <View />
          )}
          <WishlistButton variant="card" initialIsWishlisted={isWishlisted} />
        </View>
      </View>

      {/* Content */}
      <View className="p-3">
        {/* Seller Info Row */}
        <View className="flex-row items-center justify-between mb-[6px]">
          <View className="flex-row items-center gap-1 flex-1">
            <Text
              className={`font-sora-semibold text-[11px] ${textSecondary}`}
              numberOfLines={1}
              style={{ flexShrink: 1 }}
            >
              {sellerName}
            </Text>
            {isVerifiedSeller ? (
              <SealCheck size={12} color={accentIconColor} weight="fill" />
            ) : (
              <ShieldWarning
                size={12}
                color={isDark ? colors.darkText : colors.secondaryText}
                weight="fill"
              />
            )}
          </View>
          {rating !== undefined && (
            <View className="flex-row items-center gap-[2px]">
              <Star size={10} color={accentIconColor} weight="fill" />
              <Text className="font-sora-bold text-[10px] text-accent">
                {rating}
                {reviewCount !== undefined ? ` (${reviewCount})` : ""}
              </Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text
          className={`text-[13px] font-sora-semibold ${textSecondary}`}
          numberOfLines={1}
        >
          {title}
        </Text>

        {/* Price Row */}
        <View className="flex-row items-center gap-2 mt-1">
          <Text className={`text-[15px] font-sora-bold ${textPrimary}`}>
            {formattedPrice}
          </Text>
          {originalPrice && (
            <Text
              className={`text-[12px] font-sora line-through ${textSecondary}`}
            >
              ₦{originalPrice.toLocaleString()}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
