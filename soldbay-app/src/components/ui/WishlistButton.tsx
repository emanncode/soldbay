import React, { useState } from "react";
import {
  TouchableOpacity,
  useColorScheme,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Heart } from "phosphor-react-native";
import { colors } from "../../theme/tokens";

export interface WishlistButtonProps {
  initialIsWishlisted?: boolean;
  onToggle?: (isWishlisted: boolean) => void;
  variant?: "card" | "glass";
  style?: StyleProp<ViewStyle>;
  isSold?: boolean;
}

export function WishlistButton({
  initialIsWishlisted = false,
  onToggle,
  variant = "card",
  style,
  isSold = false,
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const isDark = useColorScheme() === "dark";

  const handlePress = () => {
    const newState = !isWishlisted;
    setIsWishlisted(newState);
    onToggle?.(newState);
  };

  const getVariantStyles = () => {
    if (variant === "glass") {
      return {
        containerClass:
          "w-10 h-10 rounded-full items-center justify-center bg-bgBase dark:bg-darkBgStep shadow-elevation-1 dark:shadow-none dark:border dark:border-borderDark/24",
        iconSize: 24,
        unfilledColor: isDark ? colors.darkText : colors.primaryText,
        unfilledWeight: "bold" as const,
      };
    }
    return {
      containerClass: "bg-bgBase/90 dark:bg-bgCard/20 rounded-full p-1.5",
      iconSize: 16,
      unfilledColor: isDark ? colors.darkText : colors.primaryText,
      unfilledWeight: "regular" as const,
    };
  };

  const { containerClass, iconSize, unfilledColor, unfilledWeight } =
    getVariantStyles();

  const activeColor = isDark ? colors.error : colors.accentIcon;

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`${containerClass} ${isSold ? "opacity-50" : ""}`}
      style={style}
      activeOpacity={0.7}
      disabled={isSold}
    >
      <Heart
        size={iconSize}
        color={isWishlisted ? activeColor : unfilledColor}
        weight={isWishlisted ? "fill" : unfilledWeight}
      />
    </TouchableOpacity>
  );
}
