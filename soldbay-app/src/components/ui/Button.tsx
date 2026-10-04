import React from 'react';
import { TouchableOpacity, Text, View, StyleProp, ViewStyle, TextStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'icon';

export interface ButtonProps {
  variant?: ButtonVariant;
  label?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export function Button({
  variant = 'primary',
  label,
  icon,
  onPress,
  disabled = false,
  style,
  labelStyle,
}: ButtonProps) {
  
  const getContainerStyles = () => {
    let base = 'flex-row items-center justify-center rounded-sm overflow-hidden ';
    
    // Shared button sizing
    if (variant !== 'icon') {
      base += 'w-full py-4 px-4 ';
    } else {
      base += 'w-[44px] h-[44px] rounded-full border border-primaryText/10 dark:border-borderDark/24 bg-bgBase dark:bg-darkBg ';
    }

    switch (variant) {
      case 'primary':
        base += 'bg-accent ';
        break;
      case 'secondary':
        base += 'bg-primaryText/5 dark:bg-borderDark/24 ';
        break;
      case 'outline':
        base += 'bg-transparent border-2 border-accent ';
        break;
    }
    
    if (disabled) {
      base += 'opacity-50 ';
    }
    
    return base;
  };

  const getLabelStyles = () => {
    let base = 'font-sora-bold text-[15px] ';
    
    switch (variant) {
      case 'primary':
        base += 'text-primaryText '; // always dark text on accent background
        break;
      case 'secondary':
        base += 'text-primaryText dark:text-darkText ';
        break;
      case 'outline':
        base += 'text-accent ';
        break;
      case 'icon':
        base += 'text-primaryText dark:text-darkText ';
        break;
    }
    
    return base;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || !onPress}
      onPress={onPress}
      className={getContainerStyles()}
      style={style}
    >
      {icon && (
        <View className={label ? 'mr-2' : ''}>
          {icon}
        </View>
      )}
      {label && (
        <Text className={getLabelStyles()} style={labelStyle}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
