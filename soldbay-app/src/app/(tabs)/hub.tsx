import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretRight, Plus, Tag } from 'phosphor-react-native';
import { useAppRouter as useRouter } from '@/hooks/useAppRouter';

import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { FilterChip } from '../../components/ui/FilterChip';
import { StatusPill } from '../../components/ui/Badge';
import { colors } from '../../theme/tokens';

interface SellerListing {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  status: 'active' | 'sold' | 'unlisted';
  views: number;
}

const MOCK_LISTINGS: SellerListing[] = [
  {
    id: '1',
    title: 'Fundamentals of Physics 10th Ed',
    price: 15000,
    imageUrl:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    status: 'active',
    views: 48,
  },
  {
    id: '2',
    title: 'Scientific Calculator fx-991EX',
    price: 12000,
    imageUrl:
      'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&q=80&w=400',
    status: 'active',
    views: 31,
  },
  {
    id: '3',
    title: 'Desk Lamp (Rechargeable)',
    price: 6500,
    imageUrl:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400',
    status: 'sold',
    views: 89,
  },
];

export default function SellerHubScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<'active' | 'sold' | 'unlisted'>('active');

  const filteredListings = MOCK_LISTINGS.filter(item => item.status === activeFilter);

  return (
    <View className="flex-1 bg-bgBase dark:bg-darkBg">
      {/* Global Screen Header */}
      <ScreenHeader
        title="Seller Hub"
        hasUnreadNotifications={true}
        onNotificationPress={() => router.push('/notifications')}
        onProfilePress={() => router.push('/profile')}
        userImageUrl="https://images.unsplash.com/photo-1531123897727-8f129e1b4dce?auto=format&fit=crop&q=80&w=200"
        userName="Amina Y."
      />

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom, 24) + 40,
        }}
      >
        {/* Balance Card (Screen 27 prototype) */}
        <View className="bg-bgCard dark:bg-darkBgStep rounded-lg p-4 mb-6">
          <Text className="text-[13px] font-sora-semibold text-secondaryText dark:text-borderDark mb-1">
            Total Balance
          </Text>
          <Text className="text-[28px] font-sora-bold text-primaryText dark:text-darkText mb-4">
            ₦12,500.00
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/profile')}
            activeOpacity={0.7}
            className="flex-row items-center justify-between pt-3 border-t border-primaryText/10 dark:border-borderDark/20"
          >
            <Text className="text-[13px] font-sora-semibold text-primaryText dark:text-darkText">
              View Wallet
            </Text>
            <CaretRight size={16} color={colors.accent} weight="bold" />
          </TouchableOpacity>
        </View>

        {/* Action Needed Section */}
        <Text className="text-headline font-sora-bold text-primaryText dark:text-darkText mb-3">
          Action Needed
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/order/1')}
          activeOpacity={0.8}
          className="p-3.5 rounded-md bg-bgBase dark:bg-darkBgStep border border-primaryText/15 dark:border-borderDark/24 mb-6"
        >
          <View className="flex-row items-center justify-between mb-2.5">
            <StatusPill
              status="warning"
              label="Awaiting Handoff"
            />
            <Text className="text-caption-1 font-sora text-secondaryText dark:text-borderDark">
              2h ago
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200',
              }}
              className="w-12 h-12 rounded-md bg-primaryText/5"
            />
            <View className="flex-1">
              <Text className="text-[15px] font-sora-semibold text-primaryText dark:text-darkText">
                Math Textbook (Stewart 8th)
              </Text>
              <Text className="text-[13px] font-sora text-secondaryText dark:text-borderDark mt-0.5">
                Buyer: @samuel_b • Ready for pickup
              </Text>
            </View>
            <CaretRight size={18} color={colors.secondaryText} />
          </View>
        </TouchableOpacity>

        {/* Listings Section Header & Chips */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-headline font-sora-bold text-primaryText dark:text-darkText">
            My Listings
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/listing/create')}
            className="flex-row items-center gap-1"
          >
            <Plus size={16} color={colors.accent} weight="bold" />
            <Text className="text-[13px] font-sora-semibold text-accent">
              New Listing
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status Filter Chips */}
        <View className="flex-row gap-2 mb-4">
          <FilterChip
            label="Active"
            selected={activeFilter === 'active'}
            onPress={() => setActiveFilter('active')}
          />
          <FilterChip
            label="Sold"
            selected={activeFilter === 'sold'}
            onPress={() => setActiveFilter('sold')}
          />
          <FilterChip
            label="Unlisted"
            selected={activeFilter === 'unlisted'}
            onPress={() => setActiveFilter('unlisted')}
          />
        </View>

        {/* Listings List */}
        {filteredListings.length === 0 ? (
          <View className="py-8 items-center justify-center">
            <Tag size={32} color={colors.secondaryText} weight="light" />
            <Text className="text-[15px] font-sora-semibold text-secondaryText dark:text-borderDark mt-2">
              No {activeFilter} listings
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {filteredListings.map(listing => (
              <TouchableOpacity
                key={listing.id}
                onPress={() => router.push(`/product/${listing.id}`)}
                activeOpacity={0.8}
                className="flex-row items-center p-3 rounded-md bg-bgBase dark:bg-darkBgStep border border-primaryText/10 dark:border-borderDark/20 gap-3"
              >
                <Image
                  source={{ uri: listing.imageUrl }}
                  className="w-14 h-14 rounded-md bg-primaryText/5"
                />
                <View className="flex-1 justify-center">
                  <Text
                    numberOfLines={1}
                    className="text-[15px] font-sora-semibold text-primaryText dark:text-darkText mb-0.5"
                  >
                    {listing.title}
                  </Text>
                  <Text className="text-[14px] font-sora-bold text-accent">
                    ₦{listing.price.toLocaleString()}
                  </Text>
                  <Text className="text-[11px] font-sora text-secondaryText dark:text-borderDark mt-0.5">
                    {listing.views} views
                  </Text>
                </View>
                <CaretRight size={18} color={colors.secondaryText} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
