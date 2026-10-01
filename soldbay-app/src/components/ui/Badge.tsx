import React from 'react';
import { View, Text, useColorScheme, StyleProp, ViewStyle } from 'react-native';
import { SealCheck, ShieldWarning } from 'phosphor-react-native';
import { colors } from '../../theme/tokens';

export function DiscountBadge({ discountPercent, style }: { discountPercent: number, style?: StyleProp<ViewStyle> }) {
  return (
    <View 
      className="bg-discountFill border-[1.5px] border-discountStroke rounded-full px-1.5 py-0.5 self-start" 
      style={style}
    >
      <Text className="text-[11px] font-sora-bold text-primaryText">
        -{discountPercent}%
      </Text>
    </View>
  );
}

export function VerifiedBadge({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={style} className="self-start">
      <SealCheck size={12} color={colors.accent} weight="fill" />
    </View>
  );
}

export function UnverifiedBadge({ style }: { style?: StyleProp<ViewStyle> }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View 
      className="flex-row items-center gap-1 bg-primaryText/10 dark:bg-darkText/15 px-2 py-0.5 rounded-full self-start"
      style={style}
    >
      <ShieldWarning size={10} color={isDark ? colors.darkText : colors.secondaryText} weight="fill" />
      <Text className="text-[10px] font-sora-semibold text-secondaryText dark:text-darkText">Unverified</Text>
    </View>
  );
}

export type StatusType = 'success' | 'warning' | 'error' | 'info';

export function StatusPill({ status, label, style }: { status: StatusType, label: string, style?: StyleProp<ViewStyle> }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const statusConfig = {
    info: { color: isDark ? colors.darkInfo : colors.info },
    warning: { color: isDark ? colors.darkWarning : colors.warning },
    success: { color: isDark ? colors.darkSuccess : colors.success },
    error: { color: isDark ? colors.darkError : colors.error },
  };

  const currentStatus = statusConfig[status];

  return (
    <View 
      className="px-2 py-1 rounded-full self-start"
      style={[{ backgroundColor: currentStatus.color }, style]}
    >
      <Text className="text-white dark:text-darkBg font-sora-semibold text-[11px]">
        {label}
      </Text>
    </View>
  );
}
