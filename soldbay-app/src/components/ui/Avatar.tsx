import React, { useState } from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';

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
  const [imageFailed, setImageFailed] = useState(false);

  if (imageUrl && !imageFailed) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[
          { width: size, height: size, borderRadius: size / 2 },
          style as any
        ]}
        contentFit="cover"
        transition={200}
        onError={() => setImageFailed(true)}
      />
    );
  }

  // Fallback to initials
  return (
    <View
      className="items-center justify-center bg-bgCard dark:bg-borderDark"
      style={[
        { width: size, height: size, borderRadius: size / 2, overflow: 'hidden' },
        style
      ]}
    >
      <Text 
        className="text-accent dark:text-darkBg font-sora-bold"
        style={{ fontSize: Math.round(size * 0.4) }}
      >
        {initials?.slice(0, 2).toUpperCase() || '?'}
      </Text>
    </View>
  );
}
