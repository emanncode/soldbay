import React from 'react';
import { View, Text, Image, TouchableOpacity, useColorScheme, StyleProp, ViewStyle } from 'react-native';
import { Clock, CheckCircle, WarningCircle} from 'phosphor-react-native';
import { colors } from '../../theme/tokens';

export type OrderStatus = 'pending_pickup' | 'awaiting_handoff' | 'completed' | 'disputed';

export interface OrderCardProps {
  title: string;
  price: number;
  personName?: string;
  imageUrl?: string;
  status: OrderStatus;
  countdownText?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function OrderCard({
  title,
  price,
  personName,
  imageUrl,
  status,
  countdownText,
  onPress,
  style,
}: OrderCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const textPrimary = isDark ? 'text-darkText' : 'text-primaryText';
  const textSecondary = isDark ? 'text-borderDark' : 'text-secondaryText';
  const borderClass = '';

  const formattedPrice = `₦${price.toLocaleString()}`;

  const statusConfig = {
    pending_pickup: {
      label: 'Pending pickup',
      color: isDark ? colors.dark: colors.info,
      Icon: Clock,
    },
    awaiting_handoff: {
      label: 'Awaiting handoff',
      color: isDark ? colors.darkWarning : colors.warning,
      Icon: Clock,
    },
    completed: {
      label: 'Completed',
      color: isDark ? colors.darkSuccess : colors.success,
      Icon: CheckCircle,
    },
    disputed: {
      label: 'Disputed',
      color: isDark ? colors.darkError : colors.error,
      Icon: WarningCircle,
    },
  };

  const currentStatus = statusConfig[status];
  const finalCountdownText = status === 'disputed' ? 'Auto-release paused' : countdownText;
  const StatusIcon = currentStatus.Icon;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.8}
      className={`flex-row p-3 rounded-sm ${borderClass} bg-bgBase dark:bg-darkBgStep shadow-elevation-2 dark:shadow-none items-center gap-3`}
      style={style}
    >
      <View className="w-[60px] h-[60px] bg-[#e0e0e0] dark:bg-borderDark rounded overflow-hidden justify-center items-center shrink-0">
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} className="w-full h-full object-cover" />
        ) : (
          <Text className="text-secondaryText/40 dark:text-bgBase text-[10px]">No Photo</Text>
        )}
      </View>

      <View className="flex-1 justify-center gap-1">
        <Text className={`font-sora-semibold text-[15px] ${textPrimary}`} numberOfLines={1}>
          {title}
        </Text>
        {personName && (
          <Text className={`font-sora text-[13px] ${textSecondary}`} numberOfLines={1}>
            {personName}
          </Text>
        )}
        {finalCountdownText && (
          <Text className={`font-sora text-[11px] ${status === 'disputed' ? 'text-error dark:text-darkError font-sora-semibold' : textSecondary}`} numberOfLines={1}>
            {finalCountdownText}
          </Text>
        )}
      </View>

      <View className="items-end justify-between self-stretch py-0.5 shrink-0 pl-2">
        <View 
          className="px-2 py-1 rounded-full mb-1 flex-row items-center gap-1"
          style={{ backgroundColor: currentStatus.color }}
        >
          <StatusIcon size={12} color={isDark ? colors.darkBg : colors.bgBase} weight="fill" />
          <Text className="text-white dark:text-darkBg font-sora-semibold text-[11px]">
            {currentStatus.label}
          </Text>
        </View>
        <Text className={`font-sora-bold text-[15px] ${textPrimary}`}>
          {formattedPrice}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
