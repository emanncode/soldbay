import React from 'react';
import { View, Text, useColorScheme, StyleProp, ViewStyle } from 'react-native';
import { CheckCircle, WarningCircle, LockKey } from 'phosphor-react-native';
import { colors } from '../../theme/tokens';

export interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  style?: StyleProp<ViewStyle>;
}

export function Toast({ type = 'success', message, style }: ToastProps) {
  const isDark = useColorScheme() === 'dark';
  
  // Full-strength fill + white text (or darkBg text for dark mode if following pill logic, 
  // but inventory says "full-strength fill + white text for ephemeral toasts")
  // Let's use darkBg base like HTML: `background: #031f21; color: #ffffff;` 
  // Wait, HTML toast uses standard dark background. Let's look at `.toast`.
  
  return (
    <View 
      className="flex-row items-center gap-2 bg-primaryText dark:bg-darkText px-4 py-3 rounded-md self-center shadow-md"
      style={style}
    >
      {type === 'success' && <CheckCircle size={20} color={isDark ? colors.darkSuccess : colors.success} weight="fill" />}
      {type === 'warning' && <WarningCircle size={20} color={isDark ? colors.darkWarning : colors.warning} weight="fill" />}
      {type === 'error' && <WarningCircle size={20} color={isDark ? colors.darkError : colors.error} weight="fill" />}
      
      <Text className="text-[13px] font-sora-semibold text-bgBase dark:text-darkBg">
        {message}
      </Text>
    </View>
  );
}

export interface InlineContextProps {
  message: string | React.ReactNode;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function InlineContext({ message, icon, style }: InlineContextProps) {
  // lighter inline-context-box treatment, 12% tint + colored text
  // e.g. "Buyer is at Hall B" or "Payment is held safely"
  
  return (
    <View 
      className="flex-row items-center gap-2 bg-primaryText/10 dark:bg-borderDark/24 p-3 rounded-md"
      style={style}
    >
      <View className="opacity-80">
        {icon || <LockKey size={16} color={colors.accent} weight="fill" />}
      </View>
      <Text className="text-[13px] font-sora text-primaryText dark:text-darkText flex-1">
        {message}
      </Text>
    </View>
  );
}
