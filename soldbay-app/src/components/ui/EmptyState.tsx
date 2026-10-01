import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  style,
}: EmptyStateProps) {
  return (
    <View className="items-center justify-center p-6" style={style}>
      {icon && (
        <View className="mb-4 opacity-50 bg-bgBase dark:bg-darkBg rounded-full p-4 items-center justify-center">
          {icon}
        </View>
      )}
      <Text className="text-[17px] font-sora-bold text-primaryText dark:text-darkText text-center mb-2">
        {title}
      </Text>
      {description && (
        <Text className="text-[15px] font-sora text-secondaryText dark:text-borderDark text-center mb-6">
          {description}
        </Text>
      )}
      {action && (
        <View className="w-full max-w-[200px]">
          {action}
        </View>
      )}
    </View>
  );
}
