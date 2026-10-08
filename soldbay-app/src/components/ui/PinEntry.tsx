import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { Button } from './Button';
import { LockKey, LockKeyOpen } from 'phosphor-react-native';
import { colors } from '../../theme/tokens';

export interface PinEntryDigitProps {
  value: string;
  isActive?: boolean;
}

export function PinDigit({ value, isActive }: PinEntryDigitProps) {
  // Borderless adaptation: 
  // inactive/empty: primaryText/5 
  // active: accent/10 with maybe a bottom border? We'll just use accent/10.
  // filled: primaryText/5 but with text.
  const bgClass = isActive ? 'bg-accent/10' : 'bg-primaryText/5 dark:bg-darkBgStep';
  
  return (
    <View className={`w-12 h-14 rounded-sm items-center justify-center ${bgClass}`}>
      <Text className="font-sora-bold text-[24px] text-primaryText dark:text-darkText">
        {value}
      </Text>
    </View>
  );
}

export interface PinEntryProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function PinEntry({ length = 4, value, onChange, style }: PinEntryProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={style}>
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={handlePress}
        className="flex-row justify-center gap-3 py-4"
      >
        {Array.from({ length }).map((_, index) => {
          const char = value[index] || '';
          const isActive = isFocused && value.length === index;
          return <PinDigit key={index} value={char} isActive={isActive} />;
        })}
      </TouchableOpacity>
      
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          if (text.length <= length) {
            onChange(text.replace(/[^0-9]/g, ''));
          }
        }}
        keyboardType="number-pad"
        className="absolute w-0 h-0 opacity-0"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        maxLength={length}
      />
    </View>
  );
}

export interface PinRevealProps {
  state: 'inactive' | 'active' | 'revealed';
  pin?: string;
  onReveal?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function PinReveal({ state, pin, onReveal, style }: PinRevealProps) {
  if (state === 'revealed') {
    return (
      <View className="bg-accent/10 p-6 rounded-md items-center" style={style}>
        <Text className="text-[12px] font-sora text-accent mb-2">Your One-Time Handoff PIN</Text>
        <Text className="font-sora-bold text-[48px] text-primaryText dark:text-darkText tracking-[8px]">
          {pin}
        </Text>
      </View>
    );
  }

  if (state === 'active') {
    return (
      <View className="bg-primaryText/5 dark:bg-darkBgStep p-6 rounded-md items-center" style={style}>
        <Button 
          label="Tap to Reveal Handoff PIN" 
          onPress={onReveal} 
          icon={<LockKeyOpen size={20} color={colors.primaryText} weight="fill" />} 
          fullWidth
        />
      </View>
    );
  }

  // inactive
  return (
    <View className="bg-primaryText/5 dark:bg-darkBgStep p-6 rounded-md items-center" style={style}>
      <Button 
        label="Reveal Handoff PIN (Locked)" 
        variant="secondary"
        disabled
        icon={<LockKey size={20} color={colors.secondaryText} weight="fill" />} 
        fullWidth
      />
      <Text className="font-sora text-[12px] text-secondaryText dark:text-borderDark mt-3 text-center">
        PIN remains locked until the buyer confirms they are at the pickup point.
      </Text>
    </View>
  );
}
