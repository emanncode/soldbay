import React from 'react';
import { View, Text, Image, useColorScheme, StyleProp, ViewStyle } from 'react-native';

export interface AvatarProps {
  imageUrl?: string;
  initials?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function Avatar({
  imageUrl,
  initials,
  size = 44,
  style,
}: AvatarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[
          { width: size, height: size, borderRadius: size / 2 },
          style
        ]}
      />
    );
  }

  // Fallback to initials
  return (
    <View
      className="items-center justify-center bg-bgCard dark:bg-borderDark"
      style={[
        { width: size, height: size, borderRadius: size / 2 },
        style
      ]}
    >
      <Text 
        className="text-accent dark:text-darkBg font-fraunces-semibold"
        style={{ fontSize: Math.round(size * 0.38) }}
      >
        {initials?.slice(0, 2).toUpperCase() || '?'}
      </Text>
    </View>
  );
}
