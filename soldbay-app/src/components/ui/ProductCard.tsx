import React from 'react';
import { View, Text, Image, TouchableOpacity, useColorScheme, StyleProp, ViewStyle } from 'react-native';
import { SealCheck, Heart, Star } from 'phosphor-react-native';
import { colors } from '../../theme/tokens';

export interface ProductCardProps {
  title: string;
  price: number;
  sellerName?: string;
  originalPrice?: number;
  imageUrl?: string;
  isSold?: boolean;
  isVerifiedSeller?: boolean;
  rating?: number;
  reviewCount?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ProductCard({
  title,
  price,
  sellerName = '@seller',
  originalPrice,
  imageUrl,
  isSold = false,
  isVerifiedSeller = false,
  rating,
  reviewCount,
  onPress,
  style,
}: ProductCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // In HTML: product-card has no specific background, inherits from screen. We'll use transparent so it matches.
  const cardBg = 'bg-transparent';
  // HTML dark mode border is rgba(103, 184, 179, 0.1) -> borderDark/10
  const borderClass = 'border border-primaryText/10 dark:border-borderDark/10'; 
  
  const textPrimary = isDark ? 'text-darkText' : 'text-primaryText';
  const textSecondary = isDark ? 'text-borderDark' : 'text-secondaryText';
  
  const formattedPrice = `₦${price.toLocaleString()}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isSold || !onPress}
      activeOpacity={0.8}
      className={`rounded-lg overflow-hidden ${cardBg} ${borderClass} ${isSold ? 'opacity-60' : ''}`}
      style={[{ width: '100%' }, style]}
    >
      {/* Image Container */}
      <View className="w-full bg-[#e0e0e0] dark:bg-borderDark relative justify-center items-center" style={{ height: 140 }}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full object-cover"
          />
        ) : (
          <View className="w-full h-full justify-center items-center">
             {isSold ? (
               <Text className={`font-sora-bold text-[18px] text-primaryText/50 dark:text-darkText/50`}>
                 SOLD
               </Text>
             ) : (
               <Text className="text-secondaryText/40 dark:text-bgBase">No Photo</Text>
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
          ) : <View />}
          <TouchableOpacity className="bg-bgBase/90 dark:bg-bgCard/20 rounded-full p-1.5">
            <Heart size={16} color={isDark ? colors.darkText : colors.primaryText} weight="regular" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View className="p-3">
        {/* Seller Info Row */}
        <View className="flex-row items-center justify-between mb-[6px]">
          <View className="flex-row items-center gap-1 flex-1">
            <Text className={`font-sora-semibold text-[11px] ${textSecondary}`} numberOfLines={1} style={{ flexShrink: 1 }}>
              {sellerName}
            </Text>
            {isVerifiedSeller ? (
              <SealCheck size={12} color={colors.accent} weight="fill" />
            ) : (
              <View className="bg-primaryText/10 dark:bg-darkText/15 px-2 py-0.5 rounded-full">
                <Text className="text-[11px] font-sora-semibold text-secondaryText dark:text-darkText">Unverified</Text>
              </View>
            )}
          </View>
          {rating !== undefined && (
            <View className="flex-row items-center gap-[2px]">
              <Star size={10} color={colors.accent} weight="fill" />
              <Text className="font-sora-bold text-[10px] text-accent">
                {rating}{reviewCount !== undefined ? ` (${reviewCount})` : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text className={`text-[13px] font-sora ${textSecondary}`} numberOfLines={1}>
          {title}
        </Text>

        {/* Price Row */}
        <Text className={`text-[15px] font-sora-bold mt-1 ${textPrimary}`}>
          {formattedPrice}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
