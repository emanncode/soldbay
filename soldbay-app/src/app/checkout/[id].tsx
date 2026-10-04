import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CaretLeft, MapPin, Clock, CreditCard } from 'phosphor-react-native';
import { Button } from '../../components/ui/Button';
import { FilterChip } from '../../components/ui/FilterChip';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/tokens';

// Dummy data fetching (reusing from product page)
const getProductById = (id: string) => {
  return {
    id,
    title: 'MacBook Pro M1 2020 - Excellent Condition',
    price: 450000,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    seller: {
      name: 'Amina Y.',
      campus: 'University of Lagos (UNILAG)'
    }
  };
};

const MOCK_TIME_WINDOWS = [
  'Today, 2:00 PM - 4:00 PM',
  'Tomorrow, 10:00 AM - 12:00 PM',
  'Tomorrow, 2:00 PM - 4:00 PM'
];

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const product = getProductById(id as string);

  const [selectedWindow, setSelectedWindow] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const platformFee = 500; // Fixed dummy platform fee
  const total = product.price + platformFee;

  const handlePayment = () => {
    if (!selectedWindow) {
      Alert.alert('Missing Info', 'Please select a pickup window before paying.');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment API call
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Payment Successful!',
        'Your order has been placed. You can view your pickup instructions in the Orders tab.',
        [
          { text: 'View Order', onPress: () => router.replace('/(tabs)/orders') }
        ]
      );
    }, 2000);
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
        <Text className="text-title-2 text-primaryText dark:text-darkText">Checkout</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View className="p-4 border-b border-borderLight dark:border-borderDark/24">
          <Text className="text-[15px] font-sora-bold text-primaryText dark:text-darkText mb-4">
            Order Summary
          </Text>
          <View className="flex-row gap-3">
            <Image 
              source={{ uri: product.imageUrl }}
              className="w-20 h-20 rounded-md bg-[#e0e0e0] dark:bg-darkBgStep"
            />
            <View className="flex-1 justify-center">
              <Text className="text-[14px] font-sora-semibold text-primaryText dark:text-darkText mb-1" numberOfLines={2}>
                {product.title}
              </Text>
              <Text className="text-[13px] font-sora text-secondaryText dark:text-borderDark mb-2">
                Seller: {product.seller.name}
              </Text>
              <Text className="text-[16px] font-sora-bold text-primaryText dark:text-darkText">
                ₦{product.price.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Pickup Details */}
        <View className="p-4 border-b border-borderLight dark:border-borderDark/24">
          <View className="flex-row items-center gap-2 mb-4">
            <MapPin size={20} color={colors.accent} weight="fill" />
            <Text className="text-[15px] font-sora-bold text-primaryText dark:text-darkText">
              Pickup Location
            </Text>
          </View>
          <View className="bg-primaryText/5 dark:bg-darkBgStep p-4 rounded-lg mb-6">
            <Text className="text-[14px] font-sora-semibold text-primaryText dark:text-darkText mb-1">
              {product.seller.campus}
            </Text>
            <Text className="text-[13px] font-sora text-secondaryText dark:text-borderDark leading-relaxed">
              Exact meeting point details (e.g. Student Union Building) will be revealed after payment is secured.
            </Text>
          </View>

          <View className="flex-row items-center gap-2 mb-4">
            <Clock size={20} color={colors.accent} weight="fill" />
            <Text className="text-[15px] font-sora-bold text-primaryText dark:text-darkText">
              Select Pickup Window
            </Text>
          </View>
          
          <View className="flex-row flex-wrap gap-3">
            {MOCK_TIME_WINDOWS.map((time, index) => (
              <FilterChip 
                key={index}
                label={time}
                selected={selectedWindow === time}
                onPress={() => setSelectedWindow(time)}
              />
            ))}
          </View>
        </View>

        {/* Payment & Cost Breakdown */}
        <View className="p-4 pb-8">
          <View className="flex-row items-center gap-2 mb-4">
            <CreditCard size={20} color={colors.accent} weight="fill" />
            <Text className="text-[15px] font-sora-bold text-primaryText dark:text-darkText">
              Payment Summary
            </Text>
          </View>

          <View className="bg-primaryText/5 dark:bg-darkBgStep p-4 rounded-lg">
            <View className="flex-row justify-between mb-3">
              <Text className="text-[14px] font-sora text-secondaryText dark:text-darkText">Subtotal</Text>
              <Text className="text-[14px] font-sora text-primaryText dark:text-white">₦{product.price.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-[14px] font-sora text-secondaryText dark:text-darkText">Platform Fee</Text>
              <Text className="text-[14px] font-sora text-primaryText dark:text-white">₦{platformFee.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between pb-3 border-b border-borderLight dark:border-borderDark/24">
              <Text className="text-[14px] font-sora text-secondaryText dark:text-darkText">Delivery</Text>
              <Text className="text-[14px] font-sora-semibold text-[#059669]">Free (Pickup)</Text>
            </View>
            
            <View className="flex-row justify-between mt-3">
              <Text className="text-[16px] font-sora-bold text-primaryText dark:text-white">Total</Text>
              <Text className="text-[18px] font-sora-bold text-primaryText dark:text-white">₦{total.toLocaleString()}</Text>
            </View>
          </View>
          
          <Text className="text-[12px] font-sora text-secondaryText dark:text-borderDark mt-4 text-center">
            Your money is held securely in escrow. The seller only gets paid after you confirm you've received the item.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View 
        className="px-4 pt-4 bg-bgBase dark:bg-darkBg border-t border-borderLight dark:border-borderDark/24 shadow-elevation-2 dark:shadow-none"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button 
          label={isProcessing ? "Processing..." : `Pay ₦${total.toLocaleString()}`}
          variant="primary"
          disabled={isProcessing}
          onPress={handlePayment} 
        />
      </View>
    </View>
  );
}
