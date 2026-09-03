import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { Camera, X, Plus } from "lucide-react-native";
import { colors } from "../theme/colors";

export interface PhotoSlotProps {
  imageUrl?: string | null;
  onPress?: () => void;
  onRemove?: () => void;
  uploading?: boolean;
  isPrimary?: boolean;
  className?: string;
}

/**
 * SOLDBAY PHOTO SLOT
 *
 * 1:1 image slot for listing creation:
 * - Empty: border border-neutral-300 with Camera/Plus icon.
 * - Filled: 1:1 image preview with top-right remove X button.
 * - Uploading: overlay with activity indicator.
 */
export function PhotoSlot({
  imageUrl,
  onPress,
  onRemove,
  uploading = false,
  isPrimary = false,
  className = "",
}: PhotoSlotProps) {
  if (imageUrl) {
    return (
      <View
        className={`relative aspect-square w-full overflow-hidden rounded-md bg-neutral-100 ${className}`}
      >
        <Image source={{ uri: imageUrl }} className="h-full w-full" contentFit="cover" transition={200} />

        {isPrimary ? (
          <View className="absolute bottom-1 left-1 rounded-sm bg-neutral-900/80 px-1 py-0.5">
            <Text className="font-manrope-medium text-caption text-text-inverse">
              Cover
            </Text>
          </View>
        ) : null}

        {onRemove ? (
          <Pressable
            onPress={onRemove}
            accessibilityRole="button"
            accessibilityLabel="Remove photo"
            className="absolute right-1 top-1 h-3 w-3 items-center justify-center rounded-full bg-neutral-900/70 active:bg-neutral-900"
            hitSlop={8}
          >
            <X size={14} color={colors.textInverse} />
          </Pressable>
        ) : null}

        {uploading ? (
          <View className="absolute inset-0 items-center justify-center bg-neutral-900/40">
            <ActivityIndicator size="small" color={colors.textInverse} />
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={uploading}
      accessibilityRole="button"
      accessibilityLabel={isPrimary ? "Add cover photo" : "Add photo"}
      className={`aspect-square w-full items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 active:bg-neutral-100 ${className}`}
    >
      {uploading ? (
        <View className="items-center justify-center">
          <ActivityIndicator size="small" color={colors.accent} />
          <Text className="mt-1 font-manrope text-caption text-text-secondary">
            Uploading...
          </Text>
        </View>
      ) : (
        <View className="items-center justify-center p-1">
          {isPrimary ? (
            <Camera size={24} color={colors.neutral500} />
          ) : (
            <Plus size={24} color={colors.neutral500} />
          )}
          <Text className="mt-1 font-manrope text-caption text-text-secondary">
            {isPrimary ? "Add cover" : "Add photo"}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
