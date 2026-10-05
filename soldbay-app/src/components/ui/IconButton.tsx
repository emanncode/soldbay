import React from 'react';
import { TouchableOpacity, useColorScheme, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../../theme/tokens';

export interface IconButtonProps {
  icon: React.ElementType; // Phosphor icon component
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  iconColor?: string; // Optional override for icon color
}

export function IconButton({ icon: Icon, onPress, style, iconColor }: IconButtonProps) {
  const isDark = useColorScheme() === 'dark';
  const defaultIconColor = isDark ? colors.darkText : colors.primaryText;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="w-10 h-10 rounded-full items-center justify-center bg-bgBase dark:bg-darkBgStep shadow-elevation-1 dark:shadow-none"
      style={style}
    >
      <Icon size={24} color={iconColor || defaultIconColor} weight="bold" />
    </TouchableOpacity>
  );
}
