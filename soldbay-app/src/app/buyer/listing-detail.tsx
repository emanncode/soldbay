import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ShieldCheck, MapPin } from "lucide-react-native";
import {
  Avatar,
  BackHeader,
  Button,
  Divider,
  StickyActionBar,
  VerifiedChip,
} from "@/components";
import { getListingById, type ListingDetail } from "@/lib/api";
import { goBackSafe } from "@/lib/navigation";
import { colors } from "@/theme/colors";

const { width } = Dimensions.get("window");

export default function ListingDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    async function fetchListing() {
      if (!params.id) return;
      try {
        setLoading(true);
        const data = await getListingById(params.id);
        setListing(data);
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-base">
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  if (!listing) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-base px-3">
        <Text className="font-manrope-semibold text-h2 text-text-primary">
          Listing not found
        </Text>
        <Button
          label="Go Back"
          onPress={() => goBackSafe(router, "/buyer/home")}
          variant="secondary"
          className="mt-3"
        />
      </View>
    );
  }

  const formattedPrice = `₦${Number(listing.price).toLocaleString()}`;

  return (
    <View className="flex-1 bg-surface-base">
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="px-1 z-10">
        <BackHeader onBack={() => goBackSafe(router, "/buyer/home")} />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Full-bleed Photo Carousel */}
        <View className="relative bg-neutral-100" style={{ width, height: width }}>
          {listing.images.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setActiveImageIndex(index);
              }}
              scrollEventThrottle={16}
            >
              {listing.images.map((img, i) => (
                <Image
                  key={i}
                  source={{ uri: img }}
                  style={{ width, height: width }}
                  contentFit="cover"
                  transition={200}
                />
              ))}
            </ScrollView>
          ) : (
            <View className="h-full w-full items-center justify-center">
              <Text className="text-body text-text-tertiary">No photo available</Text>
            </View>
          )}

          {listing.images.length > 1 ? (
            <View className="absolute bottom-2 right-2 rounded-full bg-neutral-900/70 px-1.5 py-0.5">
              <Text className="font-manrope-medium text-caption text-text-inverse">
                {activeImageIndex + 1}/{listing.images.length}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Content Section */}
        <View className="p-3 bg-surface-elevated">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-2">
              <Text className="font-manrope-semibold text-h1 text-text-primary">
                {formattedPrice}
              </Text>
              <Text className="mt-1 font-manrope-medium text-body-medium text-text-primary">
                {listing.title}
              </Text>
            </View>
            <VerifiedChip size="sm" />
          </View>

          {listing.category ? (
            <Text className="mt-1 text-small text-text-tertiary">
              {listing.category.name}
            </Text>
          ) : null}

          <Divider className="my-3" />

          {/* Description */}
          <Text className="font-manrope-medium text-body-medium text-text-primary mb-1">
            Description
          </Text>
          <Text className="font-manrope text-body text-text-secondary leading-6">
            {listing.description || "No additional description provided."}
          </Text>

          <Divider className="my-3" />

          {/* Seller Card */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Avatar name={listing.seller.user.name} size={40} />
              <View className="ml-1.5">
                <Text className="font-manrope-medium text-body-medium text-text-primary">
                  {listing.seller.businessName || listing.seller.user.name}
                </Text>
                <Text className="font-manrope text-caption text-text-tertiary">
                  @{listing.seller.username}
                </Text>
              </View>
            </View>

            {listing.seller.user.university ? (
              <View className="flex-row items-center">
                <MapPin size={14} color={colors.neutral500} />
                <Text className="ml-0.5 text-caption text-text-secondary">
                  {listing.seller.user.university.code}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Escrow Guarantee Card */}
          <View className="mt-4 rounded-md border border-accent-tint bg-accent-tint/30 p-2 flex-row items-center">
            <ShieldCheck size={24} color={colors.accent} />
            <View className="ml-2 flex-1">
              <Text className="font-manrope-medium text-small text-accent-hover">
                Soldbay Escrow Protection
              </Text>
              <Text className="font-manrope text-caption text-text-secondary">
                Payment is held safely until you meet on campus and verify the item.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Buy Button */}
      <StickyActionBar>
        <Button
          label={`Buy Now · ${formattedPrice}`}
          onPress={() =>
            router.push({
              pathname: "/buyer/checkout",
              params: {
                listingId: listing.id,
                title: listing.title,
                price: listing.price,
                universityName: listing.seller.user.university?.name || "Campus",
              },
            })
          }
          variant="primary"
        />
      </StickyActionBar>
    </View>
  );
}
