import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleProp, ViewStyle, useColorScheme } from 'react-native';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [fadeAnim]);

  // rgba(3, 31, 33, 0.05) in light mode, rgba(103, 184, 179, 0.1) in dark mode
  const backgroundColor = isDark ? 'rgba(103, 184, 179, 0.1)' : 'rgba(3, 31, 33, 0.05)';

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height: height as any,
          borderRadius,
          backgroundColor,
          opacity: fadeAnim,
        },
        style,
      ]}
    />
  );
}
