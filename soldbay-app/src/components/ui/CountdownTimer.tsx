import React, { useState, useEffect } from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';

export interface CountdownTimerProps {
  targetDate: Date;
  variant?: 'focal' | 'compact';
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export function CountdownTimer({ targetDate, variant = 'focal', label, style }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const hStr = hours.toString().padStart(2, '0');
      const mStr = minutes.toString().padStart(2, '0');
      const sStr = seconds.toString().padStart(2, '0');

      setTimeLeft(`${hStr}:${mStr}:${sStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (variant === 'compact') {
    return (
      <View className="flex-row items-center gap-1" style={style}>
        {label && <Text className="font-sora text-[13px] text-secondaryText dark:text-borderDark">{label}</Text>}
        <Text className="font-sora-bold text-[13px] text-primaryText dark:text-darkText" style={{ fontVariant: ['tabular-nums'] }}>
          {timeLeft}
        </Text>
      </View>
    );
  }

  // Focal
  return (
    <View className="items-center justify-center" style={style}>
      {label && <Text className="font-sora text-[12px] text-secondaryText dark:text-borderDark mb-1">{label}</Text>}
      <Text className="font-sora-bold text-[32px] text-primaryText dark:text-darkText" style={{ fontVariant: ['tabular-nums'] }}>
        {timeLeft}
      </Text>
    </View>
  );
}
