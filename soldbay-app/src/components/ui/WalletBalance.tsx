import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, useColorScheme } from 'react-native';
import { CaretRight, LockKey } from 'phosphor-react-native';
import { Button } from './Button';
import { colors } from '../../theme/tokens';

export interface WalletBalanceProps {
  variant?: 'compact' | 'full';
  totalBalance: string;
  withdrawable?: string;
  held?: string;
  onViewWallet?: () => void;
  onWithdraw?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function WalletBalance({
  variant = 'compact',
  totalBalance,
  withdrawable,
  held,
  onViewWallet,
  onWithdraw,
  style,
}: WalletBalanceProps) {
  const isDark = useColorScheme() === 'dark';

  if (variant === 'compact') {
    return (
      <View className="bg-bgCard dark:bg-darkBgStep rounded-lg p-4" style={style}>
        <Text className="font-sora text-[13px] text-secondaryText dark:text-borderDark mb-1">
          Total Balance (Compact)
        </Text>
        <Text className="font-sora-bold text-[28px] text-primaryText dark:text-darkText">
          {totalBalance}
        </Text>
        <TouchableOpacity 
          activeOpacity={0.7} 
          onPress={onViewWallet}
          className="flex-row justify-between items-center mt-4 pt-4 border-t border-primaryText/15 dark:border-borderDark/24"
        >
          <Text className="font-sora-semibold text-[13px] text-primaryText dark:text-darkText">
            View Wallet
          </Text>
          <CaretRight size={16} color={isDark ? colors.darkText : colors.primaryText} weight="bold" />
        </TouchableOpacity>
      </View>
    );
  }

  // Full variant
  return (
    <View className="bg-bgCard dark:bg-darkBgStep rounded-lg p-4" style={style}>
      <View className="items-center border-b border-primaryText/15 dark:border-borderDark/24 pb-4 mb-4">
        <Text className="font-sora text-[13px] text-secondaryText dark:text-borderDark mb-2">
          Total Balance (Full)
        </Text>
        <Text className="font-sora-bold text-[36px] text-primaryText dark:text-darkText">
          {totalBalance}
        </Text>
      </View>
      
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="font-sora text-[13px] text-secondaryText dark:text-borderDark mb-1">
            Withdrawable
          </Text>
          <Text className="font-sora-bold text-[22px] text-primaryText dark:text-darkText">
            {withdrawable}
          </Text>
        </View>
        <Button size="sm" label="Withdraw" onPress={onWithdraw} fullWidth={false} />
      </View>
      
      <View className="flex-row items-center gap-1 opacity-60">
        <LockKey size={14} color={colors.secondaryText} weight="fill" />
        <Text className="font-sora text-[13px] text-secondaryText dark:text-borderDark">
          Held in escrow: {held}
        </Text>
      </View>
    </View>
  );
}
