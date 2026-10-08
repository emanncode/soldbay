import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, useColorScheme } from 'react-native';
import { CaretDown, CaretUp } from 'phosphor-react-native';
import { colors } from '../../theme/tokens';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  value?: string;
  placeholder?: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  error?: string;
}

export function Select({
  label,
  value,
  placeholder = 'Select an option',
  options,
  onSelect,
  error,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const selectedOption = options.find((opt) => opt.value === value);

  // Background color (fill) instead of border
  let bgColor = 'bg-primaryText/5 dark:bg-darkBgStep';
  if (error) {
    bgColor = 'bg-error/10 dark:bg-darkError/10';
  }

  const containerClass = `w-full flex-row items-center justify-between rounded-sm px-3 py-3 ${bgColor}`;

  return (
    <View className="w-full">
      {label && (
        <Text className="text-[13px] font-sora-semibold text-primaryText dark:text-darkText mb-2">
          {label}
        </Text>
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        className={containerClass}
        onPress={() => setIsOpen(true)}
      >
        <Text
          className={`flex-1 text-[15px] font-sora ${
            selectedOption ? 'text-primaryText dark:text-darkText' : 'text-secondaryText dark:text-borderDark'
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        {isOpen ? (
          <CaretUp size={20} color={colors.accent} weight="regular" />
        ) : (
          <CaretDown size={20} color={isDark ? colors.borderDark : colors.secondaryText} weight="regular" />
        )}
      </TouchableOpacity>

      {error && typeof error === 'string' && (
        <Text className="text-[12px] font-sora text-error dark:text-darkError mt-1">
          {error}
        </Text>
      )}

      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-black/20"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View className="w-[90%] max-h-[60%] bg-bgBase dark:bg-darkBgStep rounded-sm overflow-hidden shadow-md">
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    className={`px-4 py-3 ${isSelected ? 'bg-accent/10' : ''}`}
                    onPress={() => {
                      onSelect(item.value);
                      setIsOpen(false);
                    }}
                  >
                    <Text
                      className={`text-[15px] font-sora ${
                        isSelected
                          ? 'text-accent font-sora-semibold'
                          : 'text-primaryText dark:text-darkText'
                      }`}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
