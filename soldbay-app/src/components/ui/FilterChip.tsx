import React from 'react';
import { TouchableOpacity, Text, ViewStyle, StyleProp } from 'react-native';
import { Check } from 'phosphor-react-native';

export interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function FilterChip({ label, selected = false, onPress, style }: FilterChipProps) {
  // Unselected: outline (border-subtle) + text (primaryText)
  // Selected: fill (#FFD0A6 bgCard) + text (#031F21 primaryText) + checkmark
  
  const containerStyle = selected 
    ? 'bg-[#FFD0A6] border-[#FFD0A6]' // #ffd0a6 light, accent dark (wait, does dark mode use accent or something else? Let's assume bgCard/accent logic)
    : 'bg-transparent border-primaryText/15 dark:border-borderDark/24';

  const textStyle = selected
    ? 'text-primaryText font-sora-bold' // #031F21 in both modes when selected
    : 'text-primaryText dark:text-darkText font-sora-semibold';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={`flex-row items-center justify-center px-4 py-2 border rounded-full ${containerStyle}`}
      style={style}
    >
      {selected && <Check size={14} color="#031F21" weight="bold" className="mr-1.5" />}
      <Text className={`text-[13px] ${textStyle}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
