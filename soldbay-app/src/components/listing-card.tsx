import { Image, Pressable, Text, View } from "react-native";
import { elevation } from "../theme/elevation";

export interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl?: string | null;
  category?: string;
  university?: string;
  onPress?: () => void;
  className?: string;
}

/**
 * SOLDBAY LISTING CARD
 *
 * Rules from DESIGN.md:
 * - 2-column feed card.
 * - 1:1 aspect ratio cover image.
 * - 10px radius (`rounded-md`).
 * - Level 1 elevation (subtle shadow).
 * - Cards NEVER get a border. Elevation only.
 * - Price (Semibold) heavier than title (Medium).
 */
export function ListingCard({
  title,
  price,
  imageUrl,
  category,
  university,
  onPress,
  className = "",
}: ListingCardProps) {
  const formattedPrice = `₦${price.toLocaleString()}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${formattedPrice}`}
      style={elevation.card}
      className={`overflow-hidden rounded-md bg-surface-elevated active:opacity-90 ${className}`}
    >
      <View className="aspect-square w-full bg-neutral-100">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-neutral-100">
            <Text className="text-caption text-text-tertiary">No photo</Text>
          </View>
        )}
      </View>

      <View className="p-1.5">
        <Text
          numberOfLines={2}
          className="font-manrope-medium text-body-medium text-text-primary"
        >
          {title}
        </Text>

        <Text className="mt-0.5 font-manrope-semibold text-body-semibold text-text-primary">
          {formattedPrice}
        </Text>

        {university || category ? (
          <Text
            numberOfLines={1}
            className="mt-0.5 text-caption text-text-tertiary"
          >
            {[university, category].filter(Boolean).join(" · ")}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
