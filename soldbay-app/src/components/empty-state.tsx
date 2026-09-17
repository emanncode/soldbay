import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowClockwise } from "phosphor-react-native";
import { EmptyCrateIllustration } from "./icons/empty-crate-illustration";
import { colors } from "../theme/colors";

export interface EmptyStateProps {
  variant: "filtered" | "empty";
  onClearFilters?: () => void;
}

export function EmptyState({ variant, onClearFilters }: EmptyStateProps) {
  const isFiltered = variant === "filtered";

  const title = isFiltered ? "No listings found" : "No listings yet";
  const body = isFiltered
    ? "No items match your active filters on campus right now."
    : "Check back soon for new listings";

  return (
    <View style={styles.container} className="w-full items-center justify-center">
      {/* 96x96 Illustration Medallion */}
      <View
        style={styles.medallion}
        className="w-[96px] h-[96px] rounded-full bg-surface border border-border items-center justify-center"
      >
        <EmptyCrateIllustration
          size={64}
          crateColor={colors.textPrimary}
          sparkleColor={colors.accent}
        />
      </View>

      {/* Copy Block (gap: 6) */}
      <View style={styles.copyBlock} className="items-center">
        <Text
          style={styles.title}
          className="font-sora-semibold text-[18px] text-text-primary text-center"
        >
          {title}
        </Text>
        <Text
          style={styles.body}
          className="font-sora text-[13px] text-text-secondary text-center max-w-[260px]"
        >
          {body}
        </Text>
      </View>

      {/* Action Button: Only present for Filtered Empty State (Clear Filters CTA) */}
      {isFiltered && onClearFilters && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onClearFilters}
          style={styles.ctaButton}
          className="flex-row items-center justify-center rounded-[10px]"
        >
          <ArrowClockwise size={16} color="#F1EEE4" weight="bold" />
          <Text
            style={styles.ctaLabel}
            className="font-sora-semibold text-[14px] text-[#F1EEE4] ml-2"
          >
            Clear filters
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 18,
    alignItems: "center",
  },
  medallion: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  copyBlock: {
    gap: 6,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 260,
  },
  ctaButton: {
    backgroundColor: colors.soldbayPrimary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaLabel: {
    fontSize: 14,
    lineHeight: 18,
    color: "#F1EEE4",
  },
});
