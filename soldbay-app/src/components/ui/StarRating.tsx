import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, useColorScheme } from 'react-native';
import { Star, StarHalf } from 'phosphor-react-native';
import { colors } from '../../theme/tokens';

export interface StarRatingProps {
  rating: number; // 0 to 5
  maxStars?: number;
  readOnly?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: number;
  showAggregate?: boolean;
  reviewCount?: number;
  style?: StyleProp<ViewStyle>;
}

export function StarRating({
  rating,
  maxStars = 5,
  readOnly = true,
  onRatingChange,
  size = 24,
  showAggregate = false,
  reviewCount,
  style,
}: StarRatingProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <View className="flex-row items-center gap-2" style={style}>
      <View className="flex-row items-center gap-1">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = rating >= starValue;
          const isHalf = !isFilled && rating >= starValue - 0.5;

          const StarIcon = isHalf ? StarHalf : Star;
          const inactiveColor = isDark ? colors.borderDark : colors.secondaryText;
          
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={readOnly ? 1 : 0.7}
              onPress={() => {
                if (!readOnly && onRatingChange) {
                  onRatingChange(starValue);
                }
              }}
              disabled={readOnly}
            >
              <StarIcon 
                size={size} 
                color={isFilled || isHalf ? colors.accent : inactiveColor} 
                weight={isFilled || isHalf ? "fill" : "regular"} 
                style={(!isFilled && !isHalf) ? { opacity: 0.3 } : undefined}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      
      {showAggregate && (
        <View className="flex-row items-center ml-1">
          <Text className="font-sora-bold text-[15px] text-primaryText dark:text-darkText mr-1">
            {rating.toFixed(1)}
          </Text>
          {reviewCount !== undefined && (
            <Text className="font-sora text-[13px] text-secondaryText dark:text-borderDark">
              ({reviewCount})
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
