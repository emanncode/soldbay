import { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Tag, Heart, Star } from "phosphor-react-native";
import { VerifiedShieldIcon } from "./icons/verified-shield-icon";
import { SoldStamp } from "./icons/sold-stamp";
import { colors } from "../theme/colors";

export interface ListingCardProps {
  title: string;
  price: number;
  sellerName: string;
  imageUrl?: string;
  isSold?: boolean;
  isVerified?: boolean;
  rating?: number;
  reviewsCount?: number;
  isWishlisted?: boolean;
  onToggleWishlist?: (wishlisted: boolean) => void;
  onPress?: () => void;
}

export function ListingCard({
  title,
  price,
  sellerName,
  imageUrl,
  isSold = false,
  isVerified = false,
  rating = 4.8,
  reviewsCount = 235,
  isWishlisted = false,
  onToggleWishlist,
  onPress,
}: ListingCardProps) {
  const [wishlisted, setWishlisted] = useState(isWishlisted);

  const handleWishlistPress = () => {
    const next = !wishlisted;
    setWishlisted(next);
    onToggleWishlist?.(next);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={[styles.cardContainer, isSold && styles.soldOpacity]}
      className="flex-1 w-full mb-4"
    >
      <View style={styles.innerContainer}>
        {/* Product Image / Placeholder */}
        <View style={styles.imageWrapper}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noPhotoPlaceholder}>
              <Tag size={36} color={colors.border} weight="regular" />
            </View>
          )}

          {/* Wishlist Heart Button (Top Right over image) */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleWishlistPress}
            style={styles.wishlistButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Heart
              size={18}
              weight={wishlisted ? "fill" : "bold"}
              color={colors.error}
            />
          </TouchableOpacity>

          {/* Sold Stamp Overlay */}
          {isSold && (
            <View style={styles.soldStampWrapper}>
              <SoldStamp />
            </View>
          )}
        </View>

        {/* Content Block */}
        <View style={styles.contentBlock}>
          {/* Line 1: Name / Title */}
          <Text
            style={styles.title}
            className="font-sora-medium text-[13px] text-text-primary"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>

          {/* Line 2: Rating (left) + Price in bold (right) */}
          <View style={styles.ratingPriceRow}>
            <View style={styles.ratingWrapper}>
              <Star size={13} weight="fill" color="#F59E0B" />
              <Text
                style={styles.ratingText}
                className="font-sora-semibold text-[12px] text-text-secondary"
              >
                {rating.toFixed(1)}
                {reviewsCount !== undefined ? ` (${reviewsCount})` : ""}
              </Text>
            </View>

            <Text
              style={styles.boldPrice}
              className="font-sora-bold text-[15px] text-text-primary"
            >
              ₦{price.toLocaleString()}
            </Text>
          </View>

          {/* Line 3: Verification (if verified) + Store Name */}
          <View style={styles.storeRow}>
            {isVerified && (
              <View style={styles.shieldWrapper}>
                <VerifiedShieldIcon size={14} color={colors.accent} />
              </View>
            )}
            <Text
              style={styles.storeName}
              className="font-sora text-[12px] text-text-secondary flex-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {sellerName}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(216, 215, 204, 0.45)",
    // Heavy and prominent elevation
    ...Platform.select({
      web: {
        boxShadow:
          "0px 10px 24px -3px rgba(45, 58, 31, 0.18), 0px 4px 10px -2px rgba(45, 58, 31, 0.10)",
      },
      default: {
        shadowColor: "#2D3A1F",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.20,
        shadowRadius: 16,
        elevation: 10,
      },
    }),
  },
  innerContainer: {
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  soldOpacity: {
    opacity: 0.75,
  },
  imageWrapper: {
    height: 168,
    width: "100%",
    position: "relative",
    backgroundColor: colors.surface,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  noPhotoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  wishlistButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 15,
    ...Platform.select({
      web: {
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.12)",
      },
      default: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  soldStampWrapper: {
    position: "absolute",
    top: 12,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  contentBlock: {
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 6,
  },
  title: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  ratingPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  boldPrice: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  storeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  shieldWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  storeName: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
});
