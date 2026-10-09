import React, { useState } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { ListItem } from '../components/ui/ListItem';
import { Toggle } from '../components/ui/Toggle';
import { WalletBalance } from '../components/ui/WalletBalance';
import { StarRating } from '../components/ui/StarRating';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/tokens';
import { useColorScheme } from 'nativewind';
import { useAppRouter as useRouter } from '@/hooks/useAppRouter';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const [isSellerView, setIsSellerView] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <View className="flex-1 bg-bgBase dark:bg-darkBg">
      {/* Header */}
      <View 
        className="flex-row items-center justify-between px-4 pb-4 border-b border-primaryText/10 dark:border-borderDark/24"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <Text className="text-title-2 text-primaryText dark:text-darkText">Profile</Text>
        <View className="flex-row items-center gap-2 bg-primaryText/5 dark:bg-darkBgStep px-2 py-1 rounded-full">
          <Text className="text-[10px] font-sora-semibold text-secondaryText dark:text-borderDark">BUYER</Text>
          <Switch
            value={isSellerView}
            onValueChange={setIsSellerView}
            trackColor={{ false: colors.borderLight, true: colors.accent }}
            thumbColor="#FFF"
            style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
          />
          <Text className="text-[10px] font-sora-semibold text-secondaryText dark:text-borderDark">SELLER</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View className="p-4 items-center">
          <Avatar imageUrl="https://images.unsplash.com/photo-1531123897727-8f129e1b4dce?auto=format&fit=crop&q=80&w=200" initials="A" size={80} />
          <Text className="text-[20px] font-sora-bold text-primaryText dark:text-darkText mt-4 mb-1">
            {isSellerView ? "Amina's Thrift Store" : "Amina Y."}
          </Text>
          {isSellerView ? (
            <StarRating rating={4.8} readOnly showAggregate reviewCount={42} size={16} />
          ) : (
            <Text className="text-[14px] font-sora text-secondaryText dark:text-borderDark">Buyer Account</Text>
          )}
        </View>

        {isSellerView && (
          <View className="px-4 mb-6">
            <WalletBalance variant="full" totalBalance="₦125,000" withdrawable="₦100,000" held="₦25,000" />
          </View>
        )}

        {/* Settings List */}
        <View className="px-4 pb-8">
          <Text className="text-[14px] font-sora-bold text-primaryText dark:text-darkText mb-2 mt-4 ml-1">Account</Text>
          <View className="bg-primaryText/5 dark:bg-darkBgStep rounded-xl overflow-hidden">
            {!isSellerView && (
              <ListItem title="Order History" onPress={() => router.push('/(tabs)/orders')} />
            )}
            {!isSellerView && (
              <ListItem title="Wishlist" onPress={() => {}} />
            )}
            <ListItem 
              title="Push Notifications" 
              rightElement={
                <Toggle value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
              }
            />
            <ListItem 
              title="Two-Factor Auth (2FA)" 
              rightElement={
                <Toggle value={twoFactorEnabled} onValueChange={setTwoFactorEnabled} />
              }
            />
          </View>

          <Text className="text-[14px] font-sora-bold text-primaryText dark:text-darkText mb-2 mt-6 ml-1">Support & More</Text>
          <View className="bg-primaryText/5 dark:bg-darkBgStep rounded-xl overflow-hidden mb-6">
            <ListItem title="Help & FAQ" onPress={() => {}} />
            <ListItem title="Campus Change Petition" onPress={() => {}} />
            <ListItem title="About Soldbay" onPress={() => {}} />
          </View>

          {!isSellerView && (
            <Button 
              label="Switch to Seller" 
              variant="secondary" 
              onPress={() => router.push('/seller/verify')} 
              style={{ marginBottom: 16 }}
            />
          )}

          <Button 
            label="Log Out" 
            variant="primary" 
            onPress={() => router.replace('/(auth)')} 
            style={{ backgroundColor: isDark ? colors.darkError : colors.error }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
