import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Avatar } from './Avatar';
import { VerifiedBadge } from './Badge';

export interface SellerInfoRowProps {
  name: string;
  avatarUrl?: string;
  isVerified?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SellerInfoRow({
  name,
  avatarUrl,
  isVerified = false,
  onPress,
  style,
}: SellerInfoRowProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container 
      activeOpacity={0.7}
      className="flex-row items-center gap-3 py-2"
      style={style}
      onPress={onPress}
    >
      <Avatar imageUrl={avatarUrl} initials={name} size={44} />
      
      <View className="flex-row items-center gap-1 flex-1">
        <Text 
          className="font-sora-semibold text-[17px] text-primaryText dark:text-darkText" 
          numberOfLines={1}
        >
          {name}
        </Text>
        {isVerified && <VerifiedBadge />}
      </View>
    </Container>
  );
}
