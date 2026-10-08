import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { UploadSimple, Laptop, ArrowsClockwise } from 'phosphor-react-native';
import { Image } from 'expo-image';
import { colors } from '../../theme/tokens';

export interface UploadBoxProps {
  type: 'id' | 'portal';
  state: 'empty' | 'filled';
  imageUrl?: string;
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function UploadBox({ type, state, imageUrl, label, onPress, style }: UploadBoxProps) {
  const isId = type === 'id';

  // ID aspect ratio: ~1.586:1 (ID card)
  // Portal: min-height 200px or aspect ratio 1:1 if needed, let's use min-h-[200px]
  const layoutClass = isId ? 'aspect-[1.586/1]' : 'min-h-[200px]';

  if (state === 'filled') {
    return (
      <View style={style}>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-sora-semibold text-[15px] text-primaryText dark:text-darkText">
            {label} (Filled)
          </Text>
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={onPress}
            className="flex-row items-center bg-primaryText/5 dark:bg-darkBgStep px-2 py-1 rounded-full"
          >
            <ArrowsClockwise size={13} color={colors.primaryText} weight="bold" />
            <Text className="font-sora-bold text-[13px] text-primaryText dark:text-darkText ml-1">
              Change
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
          <Image
            source={{ uri: imageUrl }}
            className={`w-full rounded-md bg-bgCard dark:bg-darkBgStep ${layoutClass}`}
            contentFit={isId ? "cover" : "contain"}
          />
        </TouchableOpacity>
      </View>
    );
  }

  // empty state
  return (
    <View style={style}>
      <Text className="font-sora-semibold text-[15px] text-primaryText dark:text-darkText mb-2">
        {label} (Empty)
      </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        className={`w-full rounded-md border-2 border-dashed border-primaryText/20 dark:border-borderDark/24 items-center justify-center p-5 ${layoutClass}`}
      >
        {isId ? (
          <UploadSimple size={24} color={colors.secondaryText} weight="regular" />
        ) : (
          <Laptop size={32} color={colors.secondaryText} weight="regular" />
        )}
        <Text className="font-sora-semibold text-[13px] text-secondaryText dark:text-borderDark mt-2 text-center">
          Tap to upload {isId ? 'front' : 'phone or laptop screenshot'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
