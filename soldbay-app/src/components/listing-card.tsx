import { elevation } from "../theme/elevation";
import { View, Text, Image } from "react-native";
import { Tag } from "phosphor-react-native";
import { VerifiedShieldIcon } from "./icons/verified-shield-icon";
import { SoldStamp } from "./icons/sold-stamp";
import { colors } from "../theme/colors";

export interface ListingCardProps {
  title: string;
  price: number;
  discountPrice?: number;
  sellerName: string;
  imageUrl?: string;
  isSold?: boolean;
}

export function ListingCard({
  title,
  price,
  discountPrice,
  sellerName,
  imageUrl,
  isSold,
}: ListingCardProps) {
  const displayPrice = discountPrice ?? price;
  const hasDiscount = discountPrice !== undefined && discountPrice < price;

  return (
    <View
      style={elevation.raised}
      className={`flex-1 w-full bg-surface rounded-2xl mb-4 ${isSold ? "opacity-75" : ""}`}
    >
      <View className="rounded-2xl overflow-hidden w-full">
        {/* Image Block */}
        <View className="w-full h-44 bg-surface items-center justify-center relative">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-surface items-center justify-center border-b border-border">
              <Tag size={24} color={colors.border} weight="regular" />
            </View>
          )}

          {/* Sold Stamp Overlay */}
          {isSold && (
            <View className="absolute inset-0 items-center justify-center z-10 bg-black/5">
              <SoldStamp />
            </View>
          )}
        </View>

        {/* Content Block */}
        <View className="p-3">
          <Text
            className="font-sora text-sm text-foreground mb-1.5 leading-tight"
            numberOfLines={2}
          >
            {title}
          </Text>

          {/* Price Row */}
          <View className="flex-row items-center mb-2">
            {hasDiscount ? (
              <>
                <Text className="font-sora-bold text-base text-accent-400 mr-2">
                  ₦{displayPrice.toLocaleString()}
                </Text>
                <Text className="font-sora text-xs text-border line-through">
                  ₦{price.toLocaleString()}
                </Text>
              </>
            ) : (
              <Text className="font-sora-bold text-base text-foreground">
                ₦{displayPrice.toLocaleString()}
              </Text>
            )}
          </View>

          {/* Badge Row */}
          <View className="flex-row items-center w-full">
            <VerifiedShieldIcon size={14} />
            <Text
              className="font-sora text-xs text-foreground ml-1 flex-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {sellerName}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
