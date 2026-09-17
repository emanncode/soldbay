import { View, StyleSheet, Platform } from "react-native";
import { colors } from "../theme/colors";

export function SkeletonCard() {
  return (
    <View
      style={styles.cardContainer}
      className="flex-1 w-full bg-surface rounded-[16px] overflow-hidden mb-4"
    >
      {/* Skeleton Image Block (Height 176, fill: $border, opacity 0.65, cornerRadius [16, 16, 0, 0]) */}
      <View style={styles.imageBlock} className="w-full bg-border" />

      {/* Skeleton Content Block (Padding [12, 12, 14, 12], gap: 10) */}
      <View style={styles.contentBlock}>
        {/* Title Skeleton Line 1 (118x12, radius 4, opacity 0.8) */}
        <View style={styles.titleLine1} className="bg-border" />

        {/* Title Skeleton Line 2 (74x12, radius 4, opacity 0.8) */}
        <View style={styles.titleLine2} className="bg-border" />

        {/* Price Skeleton Line (56x15, radius 4, opacity 0.8) */}
        <View style={styles.priceLine} className="bg-border" />

        {/* Badge Skeleton Row (gap 5, dot 13x13 rounded-full, seller line 42x10) */}
        <View style={styles.badgeRow}>
          <View style={styles.badgeDot} className="bg-border rounded-full" />
          <View style={styles.sellerLine} className="bg-border" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    backgroundColor: colors.surface,
    overflow: "hidden",
    ...Platform.select({
      web: {
        boxShadow: "0 1px 2px rgba(45, 58, 31, 0.06)",
      },
      default: {
        shadowColor: "#2D3A1F",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 1,
      },
    }),
  },
  imageBlock: {
    width: "100%",
    height: 176,
    backgroundColor: colors.border,
    opacity: 0.65,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  contentBlock: {
    paddingTop: 12,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 14,
    gap: 10,
  },
  titleLine1: {
    width: 118,
    height: 12,
    borderRadius: 4,
    backgroundColor: colors.border,
    opacity: 0.8,
  },
  titleLine2: {
    width: 74,
    height: 12,
    borderRadius: 4,
    backgroundColor: colors.border,
    opacity: 0.8,
  },
  priceLine: {
    width: 56,
    height: 15,
    borderRadius: 4,
    backgroundColor: colors.border,
    opacity: 0.8,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  badgeDot: {
    width: 13,
    height: 13,
    borderRadius: 999,
    backgroundColor: colors.border,
    opacity: 0.8,
  },
  sellerLine: {
    width: 42,
    height: 10,
    borderRadius: 4,
    backgroundColor: colors.border,
    opacity: 0.8,
  },
});
