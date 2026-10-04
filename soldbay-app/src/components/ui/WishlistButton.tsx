import React, { useState } from 'react';
import { TouchableOpacity, useColorScheme, StyleProp, ViewStyle } from 'react-native';
import { Heart } from 'phosphor-react-native';
import { colors } from '../../theme/tokens';

export interface WishlistButtonProps {
  initialIsWishlisted?: boolean;
  onToggle?: (isWishlisted: boolean) => void;
  variant?: 'card' | 'glass';
  style?: StyleProp<ViewStyle>;
}

export function WishlistButton({
  initialIsWishlisted = false,
  onToggle,
  variant = 'card',
  style,
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const isDark = useColorScheme() === 'dark';

  const handlePress = () => {
    const newState = !isWishlisted;
    setIsWishlisted(newState);
    onToggle?.(newState);
  };

  const getVariantStyles = () => {
    if (variant === 'glass') {
      return {
        containerClass: 'w-10 h-10 rounded-full bg-black/40 justify-center items-center backdrop-blur-md',
        iconSize: 20,
        unfilledColor: '#FFF',
        unfilledWeight: 'bold' as const,
      };
    }
    return {
      containerClass: 'bg-bgBase/90 dark:bg-bgCard/20 rounded-full p-1.5',
      iconSize: 16,
      unfilledColor: isDark ? colors.darkText : colors.primaryText,
      unfilledWeight: 'regular' as const,
    };
  };

  const { containerClass, iconSize, unfilledColor, unfilledWeight } = getVariantStyles();

  const activeColor = isDark ? colors.accent : colors.accentIcon;

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={containerClass}
      style={style}
      activeOpacity={0.7}
    >
      <Heart
        size={iconSize}
        color={isWishlisted ? activeColor : unfilledColor}
        weight={isWishlisted ? 'fill' : unfilledWeight}
      />
    </TouchableOpacity>
  );
}
