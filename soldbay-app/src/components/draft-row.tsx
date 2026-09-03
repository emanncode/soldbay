import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { ArrowRight, Trash2 } from "lucide-react-native";
import { colors } from "../theme/colors";
import { elevation } from "../theme/elevation";

export interface DraftRowProps {
  id: string;
  title?: string | null;
  draftStep?: number | null;
  thumbnailUrl?: string | null;
  onPress?: () => void;
  onDelete?: () => void;
  className?: string;
}

/**
 * SOLDBAY DRAFT ROW (Pen Component GKd8z)
 *
 * Appears in the "Drafts" section of the Seller Dashboard:
 * - Thumbnail, title or "Untitled listing".
 * - "Saved · Step X of 4" status caption.
 * - Resume arrow or delete action.
 */
export function DraftRow({
  title,
  draftStep = 1,
  thumbnailUrl,
  onPress,
  onDelete,
  className = "",
}: DraftRowProps) {
  const displayTitle = title?.trim() || "Untitled listing";
  const stepNumber = draftStep || 1;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Resume draft: ${displayTitle}`}
      style={elevation.card}
      className={`w-full flex-row items-center rounded-md bg-surface-elevated p-1.5 active:opacity-90 ${className}`}
    >
      <View className="h-6 w-6 overflow-hidden rounded-sm bg-neutral-100">
        {thumbnailUrl ? (
          <Image
            source={{ uri: thumbnailUrl }}
            className="h-full w-full"
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-neutral-100">
            <Text className="text-caption text-text-tertiary">Draft</Text>
          </View>
        )}
      </View>

      <View className="ml-1.5 flex-1 justify-center">
        <Text
          numberOfLines={1}
          className="font-manrope-medium text-body-medium text-text-primary"
        >
          {displayTitle}
        </Text>

        <Text className="mt-0.5 font-manrope text-caption text-text-secondary">
          Saved · Step {stepNumber} of 4
        </Text>
      </View>

      <View className="flex-row items-center gap-1">
        {onDelete ? (
          <Pressable
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete draft"
            className="h-6 w-6 items-center justify-center rounded-sm active:bg-neutral-100"
            hitSlop={8}
          >
            <Trash2 size={18} color={colors.neutral400} />
          </Pressable>
        ) : null}

        <View className="h-6 w-6 items-center justify-center">
          <ArrowRight size={20} color={colors.accent} />
        </View>
      </View>
    </Pressable>
  );
}
