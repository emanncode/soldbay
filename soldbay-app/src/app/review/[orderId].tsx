import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, Star } from "phosphor-react-native";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/tokens";

// Dummy fetch
const getOrderTarget = (id: string) => {
  return {
    name: "Amina Y.",
    role: "Seller",
    avatarUrl:
      "https://images.unsplash.com/photo-1531123897727-8f129e1b4dce?auto=format&fit=crop&q=80&w=200",
  };
};

export default function RateReviewScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const target = getOrderTarget(orderId as string);

  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");

  const handleFinish = () => {
    // Navigate back to the home feed
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-bgBase dark:bg-darkBg"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{
            paddingTop: Math.max(insets.top, 40),
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Success Hero */}
          <View className="items-center mb-10">
            <View className="w-20 h-20 bg-success/10 dark:bg-darkSuccess/20 rounded-full items-center justify-center mb-4">
              <CheckCircle size={48} color={colors.success} weight="fill" />
            </View>
            <Text className="text-[24px] font-sora-bold text-primaryText dark:text-darkText text-center mb-2">
              Transaction Complete!
            </Text>
            <Text className="text-[14px] font-sora text-secondaryText dark:text-borderDark text-center px-4">
              The funds have been successfully released. How was your
              experience?
            </Text>
          </View>

          {/* User Being Reviewed */}
          <View className="items-center mb-8">
            <Avatar
              imageUrl={target.avatarUrl}
              initials={target.name.charAt(0)}
              size={64}
            />
            <Text className="text-[16px] font-sora-bold text-primaryText dark:text-darkText mt-3 mb-1">
              {target.name}
            </Text>
            <Text className="text-[12px] font-sora-semibold text-accent uppercase tracking-wider">
              {target.role}
            </Text>
          </View>

          {/* Interactive Stars */}
          <View className="flex-row justify-center gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
                className="p-2 -m-2"
              >
                <Star
                  size={40}
                  color={rating >= star ? colors.accent : colors.borderLight}
                  weight={rating >= star ? "fill" : "bold"}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Written Review Input */}
          <View className="mb-8">
            <Text className="text-[14px] font-sora-bold text-primaryText dark:text-darkText mb-2">
              Leave a comment (Optional)
            </Text>
            <TextInput
              className="bg-primaryText/5 dark:bg-darkBgStep rounded-lg px-4 pt-4 pb-4 min-h-[120px] text-[15px] font-sora text-primaryText dark:text-darkText text-left"
              style={{ textAlignVertical: "top" }}
              placeholder="What went well? What could be better?"
              placeholderTextColor={colors.secondaryText}
              multiline
              value={reviewText}
              onChangeText={setReviewText}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Bottom Actions */}
      <View
        className="px-4 pt-4 bg-bgBase dark:bg-darkBg gap-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button
          label="Submit Review"
          variant="primary"
          disabled={rating === 0}
          onPress={handleFinish}
        />
        <Button label="Skip for now" variant="outline" onPress={handleFinish} />
      </View>
    </KeyboardAvoidingView>
  );
}
