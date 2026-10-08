import React from "react";
import { View, Text, Pressable } from "react-native";
import { CheckCircle, Circle } from "phosphor-react-native";
import { colors } from "../../theme/tokens";
import { useColorScheme } from "nativewind";

export interface PaymentMethod {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export interface PaymentMethodSelectorProps {
  options: PaymentMethod[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  options,
  selectedId,
  onSelect,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-col gap-4">
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => onSelect(option.id)}
            className={`flex-row items-center justify-between p-4 rounded-lg bg-bgBase dark:bg-darkBgStep ${
              isSelected
                ? "border-2 border-accent"
                : "border-2 border-transparent"
            }`}
            style={
              !isDark
                ? {
                    shadowColor: colors.primaryText,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    elevation: 2,
                  }
                : undefined
            }
          >
            <View className="flex-row items-center gap-4 flex-1">
              {option.icon && <View>{option.icon}</View>}
              <View className="flex-1">
                <Text className="text-headline text-primaryText dark:text-darkText">
                  {option.title}
                </Text>
                {option.subtitle && (
                  <Text className="text-subheadline text-secondaryText dark:text-borderDark mt-1">
                    {option.subtitle}
                  </Text>
                )}
              </View>
            </View>
            <View className="ml-4">
              {isSelected ? (
                <CheckCircle
                  size={24}
                  color={colors.accent}
                  weight="fill"
                />
              ) : (
                <Circle
                  size={24}
                  color={isDark ? colors.borderDark : colors.borderLight}
                  weight="regular"
                />
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};
