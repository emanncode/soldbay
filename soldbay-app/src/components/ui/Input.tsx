import React from 'react';
import { View, Text, TextInput, TextInputProps, useColorScheme } from 'react-native';
import { colors } from '../../theme/tokens';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  rightIcon,
  multiline,
  style,
  ...props
}: InputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const baseContainerStyle = 'w-full flex-row items-center rounded-sm ';
  
  // Background color (fill) instead of border
  let bgColor = 'bg-primaryText/5 dark:bg-darkBgStep';
  if (error) {
    bgColor = 'bg-error/10 dark:bg-darkError/10';
  }

  const containerClass = `${baseContainerStyle} ${bgColor}`;

  return (
    <View className="w-full">
      {label && (
        <Text className="text-[13px] font-sora-semibold text-primaryText dark:text-darkText mb-2">
          {label}
        </Text>
      )}
      
      <View className={containerClass} style={multiline ? { alignItems: 'flex-start' } : undefined}>
        <TextInput
          className={`flex-1 text-[15px] font-sora text-primaryText dark:text-darkText px-3 py-3 ${multiline ? 'h-[100px]' : ''}`}
          placeholderTextColor={isDark ? colors.borderDark : 'rgba(3, 31, 33, 0.4)'}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={style}
          {...props}
        />
        {rightIcon && (
          <View className="pr-3 justify-center">
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && typeof error === 'string' && (
        <Text className="text-[12px] font-sora text-error dark:text-darkError mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
