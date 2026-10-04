import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CaretLeft, ChatCircle, Package, WarningCircle } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/tokens';

type NotificationType = 'chat' | 'order' | 'system';

interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  targetRoute: string; // e.g., '/chat/ord_1' or '/order/ord_2'
}

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'chat',
    title: 'New message from Amina',
    message: 'Okay, see you then!',
    timeAgo: '2m ago',
    isRead: false,
    targetRoute: '/chat/ord_1'
  },
  {
    id: 'notif_2',
    type: 'order',
    title: 'Order Status Updated',
    message: 'Your MacBook Pro order is now Awaiting Handoff.',
    timeAgo: '1h ago',
    isRead: false,
    targetRoute: '/order/ord_1'
  },
  {
    id: 'notif_3',
    type: 'system',
    title: 'Welcome to Soldbay!',
    message: 'We recommend verifying your student email to get a verified badge.',
    timeAgo: '1d ago',
    isRead: true,
    targetRoute: '/(tabs)/profile'
  }
];

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'chat':
        return <ChatCircle size={24} color={colors.accent} weight="fill" />;
      case 'order':
        return <Package size={24} color={colors.info} weight="fill" />;
      case 'system':
        return <WarningCircle size={24} color={colors.warning} weight="fill" />;
    }
  };

  return (
    <View className="flex-1 bg-bgBase dark:bg-darkBg">
      {/* Header */}
      <View 
        className="flex-row items-center px-4 pb-4 border-b border-borderLight dark:border-borderDark/24 bg-bgBase dark:bg-darkBg z-10"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-3 p-1 -ml-1"
        >
          <CaretLeft size={24} color={colors.primaryText} weight="bold" />
        </TouchableOpacity>
        <Text className="text-title-2 text-primaryText dark:text-darkText">Notifications</Text>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {MOCK_NOTIFICATIONS.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            activeOpacity={0.7}
            onPress={() => router.push(notif.targetRoute as any)}
            className={`flex-row p-4 border-b border-borderLight dark:border-borderDark/24 ${
              !notif.isRead ? 'bg-accent/5 dark:bg-accent/10' : 'bg-transparent'
            }`}
          >
            <View className="w-12 h-12 rounded-full bg-primaryText/5 dark:bg-darkBgStep items-center justify-center mr-3 shrink-0">
              {getIconForType(notif.type)}
            </View>
            <View className="flex-1 justify-center">
              <View className="flex-row justify-between items-start mb-1">
                <Text className="flex-1 text-[15px] font-sora-bold text-primaryText dark:text-darkText mr-2" numberOfLines={1}>
                  {notif.title}
                </Text>
                <Text className="text-[12px] font-sora text-secondaryText dark:text-borderDark shrink-0">
                  {notif.timeAgo}
                </Text>
              </View>
              <Text className="text-[13px] font-sora text-secondaryText dark:text-borderDark leading-relaxed" numberOfLines={2}>
                {notif.message}
              </Text>
            </View>
            {!notif.isRead && (
              <View className="w-2 h-2 rounded-full bg-accent absolute top-5 right-4" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
