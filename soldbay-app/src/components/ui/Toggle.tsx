import React, { useEffect } from 'react';
import { View, TouchableOpacity, useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { colors } from '../../theme/tokens';

export interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function Toggle({ value, onValueChange }: ToggleProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 250 });
  }, [value]);

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: progress.value * 20 }],
    };
  });

  const trackAnimatedStyle = useAnimatedStyle(() => {
    // Inactive track: borderLight/24 for light, borderDark/24 for dark.
    // Active track: accent color.
    // But we need hex values for interpolateColor.
    // We will use colors directly.
    const inactiveColor = isDark ? '#67B8B33D' : '#0080803D'; // 3D is hex for ~24%
    const activeColor = colors.accent;
    
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [inactiveColor, activeColor]
      ),
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
      accessible
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Animated.View
        className="w-[44px] h-[24px] rounded-full justify-center px-[2px]"
        style={[trackAnimatedStyle]}
      >
        <Animated.View
          className="w-[20px] h-[20px] rounded-full bg-white shadow-sm"
          style={[thumbAnimatedStyle]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}
