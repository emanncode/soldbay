import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  CaretLeft,
  Clock,
  MapPin,
  WarningCircle,
  CheckCircle,
  Eye,
  EyeClosed,
} from "phosphor-react-native";
import { Button } from "../../components/ui/Button";
import { IconButton } from "../../components/ui/IconButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/tokens";
import { OrderCard, OrderStatus } from "../../components/ui/OrderCard";

// Dummy fetch
const getOrderById = (id: string) => {
  return {
    id,
    title: "MacBook Pro M1 2020",
    price: 450000,
    sellerName: "Amina Y.",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
    status: "awaiting_handoff" as OrderStatus,
    pickupLocation: "University of Lagos (UNILAG) - Main Gate",
    pickupTime: "Today, 2:00 PM - 4:00 PM",
    pin: "8492",
  };
};

export default function OrderStatusScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const order = getOrderById(id as string);

  // Mocking roles for testing
  const [isSellerView, setIsSellerView] = useState(false);
  const [pinRevealed, setPinRevealed] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");

  const renderStatusBanner = () => {
    switch (order.status) {
      case "awaiting_handoff":
        return (
          <View className="bg-warning/10 dark:bg-darkWarning/20 p-4 border-b border-warning/20">
            <View className="flex-row items-center gap-2 mb-1">
              <Clock size={20} color={colors.warning} weight="fill" />
              <Text className="text-[16px] font-sora-bold text-warning dark:text-darkWarning">
                Awaiting Handoff
              </Text>
            </View>
            <Text className="text-[14px] font-sora text-primaryText dark:text-darkText">
              Meet the {isSellerView ? "buyer" : "seller"} at the agreed
              location to complete the transaction.
            </Text>
          </View>
        );
      case "completed":
        return (
          <View className="bg-success/10 dark:bg-darkSuccess/20 p-4 border-b border-success/20">
            <View className="flex-row items-center gap-2 mb-1">
              <CheckCircle size={20} color={colors.success} weight="fill" />
              <Text className="text-[16px] font-sora-bold text-success dark:text-darkSuccess">
                Completed
              </Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-bgBase dark:bg-darkBg">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-4 border-b border-borderLight dark:border-borderDark/24 bg-bgBase dark:bg-darkBg z-10"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <View className="flex-row items-center">
          <IconButton icon={CaretLeft} onPress={() => router.back()} style={{ marginRight: 12, marginLeft: -4 }} />
          <Text className="text-title-2 text-primaryText dark:text-darkText">
            Order Details
          </Text>
        </View>

        {/* MOCK TOGGLE FOR TESTING */}
        <View className="flex-row items-center gap-2 bg-primaryText/5 dark:bg-darkBgStep px-2 py-1 rounded-full">
          <Text className="text-[10px] font-sora-semibold text-secondaryText dark:text-borderDark">
            BUYER
          </Text>
          <Switch
            value={isSellerView}
            onValueChange={setIsSellerView}
            trackColor={{ false: colors.borderLight, true: colors.accent }}
            thumbColor="#FFF"
            style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
          />
          <Text className="text-[10px] font-sora-semibold text-secondaryText dark:text-borderDark">
            SELLER
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {renderStatusBanner()}

        <View className="p-4 border-b border-borderLight dark:border-borderDark/24">
          <OrderCard
            title={order.title}
            price={order.price}
            personName={
              isSellerView ? "Buyer: John D." : `Seller: ${order.sellerName}`
            }
            imageUrl={order.imageUrl}
            status={order.status}
          />
        </View>

        {/* Auto-Release / Escrow Card */}
        {order.status === "awaiting_handoff" && (
          <View className="p-4 border-b border-borderLight dark:border-borderDark/24">
            <View className="bg-primaryText/5 dark:bg-darkBgStep p-4 rounded-lg">
              <Text className="text-[14px] font-sora-bold text-primaryText dark:text-darkText mb-2">
                Funds Held Securely
              </Text>
              <Text className="text-[13px] font-sora text-secondaryText dark:text-borderDark leading-relaxed mb-3">
                {isSellerView
                  ? "The buyer's funds are held by Soldbay. Do not hand over the item until you have entered their 4-digit PIN below."
                  : "Your funds are held securely. Do not give the seller your PIN until you have inspected and received the item."}
              </Text>
              <View className="bg-bgBase dark:bg-darkBg p-3 rounded-md flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Clock size={16} color={colors.accent} />
                  <Text className="text-[13px] font-sora-semibold text-primaryText dark:text-darkText">
                    Auto-Release Window
                  </Text>
                </View>
                <Text className="text-[13px] font-sora-bold text-accent">
                  47h 12m
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Handoff Zone (PIN UI) */}
        {order.status === "awaiting_handoff" && (
          <View className="p-4 border-b border-borderLight dark:border-borderDark/24">
            <Text className="text-[16px] font-sora-bold text-primaryText dark:text-darkText mb-4">
              {isSellerView ? "Confirm Handoff" : "Your Handoff PIN"}
            </Text>

            {isSellerView ? (
              <View>
                <Text className="text-[13px] font-sora text-secondaryText dark:text-borderDark mb-3">
                  Ask the buyer for their 4-digit PIN and enter it here to claim
                  your funds.
                </Text>
                <TextInput
                  className="bg-bgBase dark:bg-darkBg border border-borderLight dark:border-borderDark/24 rounded-lg p-4 text-[24px] font-sora-bold text-center tracking-[10px] text-primaryText dark:text-darkText mb-4"
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholder="----"
                  placeholderTextColor={colors.borderLight}
                  value={enteredPin}
                  onChangeText={setEnteredPin}
                />
                <Button
                  label="Confirm Handoff"
                  variant="primary"
                  disabled={enteredPin.length !== 4}
                  onPress={() => router.push(`/review/${order.id}`)}
                />
              </View>
            ) : (
              <View>
                <Text className="text-[13px] font-sora text-secondaryText dark:text-borderDark mb-3">
                  Show this PIN to the seller when you receive the item.
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setPinRevealed(!pinRevealed)}
                  className="bg-primaryText/5 dark:bg-darkBgStep rounded-lg p-6 items-center justify-center border border-borderLight dark:border-borderDark/24 mb-4"
                >
                  {pinRevealed ? (
                    <View className="items-center">
                      <Text className="text-[32px] font-sora-bold tracking-[8px] text-primaryText dark:text-darkText mb-2">
                        {order.pin}
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <EyeClosed size={16} color={colors.secondaryText} />
                        <Text className="text-[12px] font-sora text-secondaryText dark:text-borderDark">
                          Tap to hide
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View className="items-center">
                      <Text className="text-[32px] font-sora-bold tracking-[8px] text-secondaryText/30 dark:text-borderDark/30 mb-2">
                        ••••
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <Eye size={16} color={colors.secondaryText} />
                        <Text className="text-[12px] font-sora-semibold text-accent">
                          Tap to reveal PIN
                        </Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Pickup Details */}
        <View className="p-4 pb-8">
          <Text className="text-[16px] font-sora-bold text-primaryText dark:text-darkText mb-4">
            Pickup Details
          </Text>
          <View className="flex-row items-start gap-3 mb-4">
            <MapPin
              size={20}
              color={colors.accent}
              weight="fill"
              className="mt-0.5"
            />
            <View className="flex-1">
              <Text className="text-[14px] font-sora-semibold text-primaryText dark:text-darkText mb-1">
                {order.pickupLocation}
              </Text>
              <Text className="text-[13px] font-sora text-secondaryText dark:text-borderDark">
                Message the {isSellerView ? "buyer" : "seller"} if you need help
                finding them.
              </Text>
            </View>
          </View>
          <View className="flex-row items-start gap-3 mb-8">
            <Clock
              size={20}
              color={colors.accent}
              weight="fill"
              className="mt-0.5"
            />
            <View className="flex-1">
              <Text className="text-[14px] font-sora-semibold text-primaryText dark:text-darkText mb-1">
                {order.pickupTime}
              </Text>
            </View>
          </View>

          {/* Bottom Actions */}
          <View className="gap-3">
            <Button
              label={`Message ${isSellerView ? "Buyer" : "Seller"}`}
              variant="outline"
              onPress={() => router.push(`/chat/${order.id}`)}
            />
            <TouchableOpacity className="flex-row items-center justify-center gap-2 py-3 mt-4">
              <WarningCircle size={16} color={colors.error} weight="bold" />
              <Text className="text-[13px] font-sora-bold text-error">
                Report Issue / Dispute
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
