import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, useColorScheme, TouchableOpacity } from 'react-native';
import { Eye, EyeClosed } from 'phosphor-react-native';
import { colors } from '../../theme/tokens';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  isPassword,
  multiline,
  style,
  ...props
}: InputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const baseContainerStyle = `w-full flex-row items-center ${multiline ? 'rounded-2xl' : 'rounded-full'} `;
  
  // Background color (fill) instead of border
  let bgColor = 'bg-primaryText/5 dark:bg-darkBgStep';
  if (error) {
    bgColor = 'bg-error/10 dark:bg-darkError/10';
  }

  const containerClass = `${baseContainerStyle} ${bgColor}`;

  const renderRightIcon = () => {
    if (isPassword) {
      return (
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)} 
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="pr-4 justify-center"
        >
          {isPasswordVisible ? (
            <Eye size={20} color={isDark ? colors.borderDark : colors.secondaryText} />
          ) : (
            <EyeClosed size={20} color={isDark ? colors.borderDark : colors.secondaryText} />
          )}
        </TouchableOpacity>
      );
    }
    if (rightIcon) {
      return (
        <View className="pr-4 justify-center">
          {rightIcon}
        </View>
      );
    }
    return null;
  };

  return (
    <View className="w-full">
      {label && (
        <Text className="text-[13px] font-sora-semibold text-primaryText dark:text-darkText mb-2">
          {label}
        </Text>
      )}
      
      <View className={containerClass} style={multiline ? { alignItems: 'flex-start' } : undefined}>
        {leftIcon && (
          <View className="pl-4 justify-center">
            {leftIcon}
          </View>
        )}
        <TextInput
          className={`flex-1 text-[15px] font-sora text-primaryText dark:text-darkText ${leftIcon ? 'pl-2' : 'pl-4'} ${isPassword || rightIcon ? 'pr-2' : 'pr-4'} py-3 ${multiline ? 'h-[100px]' : ''}`}
          placeholderTextColor={isDark ? colors.borderDark : colors.secondaryText}
          multiline={multiline}
          secureTextEntry={isPassword ? !isPasswordVisible : props.secureTextEntry}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={style}
          {...props}
        />
        {renderRightIcon()}
      </View>
      
      {error && typeof error === 'string' && (
        <Text className="text-[12px] font-sora text-error dark:text-darkError mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
