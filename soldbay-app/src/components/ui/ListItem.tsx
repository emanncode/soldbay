import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

export interface ListItemProps {
  leftElement?: React.ReactNode;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  hideBorder?: boolean;
}

export function ListItem({
  leftElement,
  title,
  subtitle,
  rightElement,
  onPress,
  style,
  hideBorder = false,
}: ListItemProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      activeOpacity={0.7}
      className={`flex-row items-center py-3 gap-3 ${!hideBorder ? 'border-b border-primaryText/10 dark:border-borderDark/24' : ''}`}
      style={style}
      onPress={onPress}
    >
      {leftElement && (
        <View className="flex-shrink-0">
          {leftElement}
        </View>
      )}
      
      <View className="flex-1 justify-center">
        <Text className="font-sora-semibold text-[15px] text-primaryText dark:text-darkText" numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text className="font-sora text-[13px] text-secondaryText dark:text-borderDark mt-[2px]" numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightElement && (
        <View className="flex-shrink-0 ml-2">
          {rightElement}
        </View>
      )}
    </Container>
  );
}
