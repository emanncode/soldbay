import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { GlassPanel } from "@/components/glass-panel";
import { PrimaryButton } from "@/components/primary-button";
import { getListingById, type ListingDetail } from "@/lib/api";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_RADIUS = 16;
const IMAGE_PAD = 16;
const IMAGE_W = SCREEN_WIDTH - IMAGE_PAD * 2;

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [saved, setSaved] = useState(false);
  const scrollRef = useRef<FlatList<string>>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setListing(await getListingById(id));
      } catch {
        router.replace("/buyer/home");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const images = listing?.images?.length ? listing.images : [];

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => {
      setActiveIdx((p) => {
        const n = (p + 1) % images.length;
        scrollRef.current?.scrollToOffset({
          offset: n * IMAGE_W,
          animated: true,
        });
        return n;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [images.length]);

  const onScrollEnd = useCallback((e: any) => {
    setActiveIdx(Math.round(e.nativeEvent.contentOffset.x / IMAGE_W));
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (!listing) return null;

  const soldOut = listing.stock === 0;
  const uniCode = listing.seller.user?.university?.code;

  return (
    <PageAtmosphere>
      <View style={{ flex: 1 }}>
        {/* ── Floating buttons ── */}
        <SafeAreaView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
          pointerEvents="box-none"
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/buyer/home");
                }
              }}
              activeOpacity={0.7}
              hitSlop={10}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(0,0,0,0.5)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="chevron-back" size={20} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSaved((p) => !p)}
              activeOpacity={0.7}
              hitSlop={10}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(0,0,0,0.5)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={saved ? "heart" : "heart-outline"}
                size={18}
                color={saved ? "#e1261c" : "#ffffff"}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <ScrollView
          bounces={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Image carousel ── */}
          {images.length > 0 ? (
            <View style={{ paddingTop: 56, paddingHorizontal: IMAGE_PAD }}>
              <View
                style={{
                  borderRadius: IMAGE_RADIUS,
                  overflow: "hidden",
                  backgroundColor: "#1a1a2e",
                }}
              >
                <FlatList
                  ref={scrollRef}
                  data={images}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={onScrollEnd}
                  scrollEventThrottle={16}
                  snapToInterval={IMAGE_W}
                  decelerationRate="fast"
                  keyExtractor={(_, i) => String(i)}
                  renderItem={({ item }) => (
                    <View style={{ width: IMAGE_W, height: IMAGE_W }}>
                      <Image
                        source={{ uri: item }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      />
                    </View>
                  )}
                />

                {/* Condition pill (bottom-left overlay) */}
                <View
                  style={{
                    position: "absolute",
                    bottom: 10,
                    left: 10,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    borderRadius: 999,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: 11,
                      color: "#ffffff",
                    }}
                  >
                    New
                  </Text>
                </View>
              </View>

              {/* Dot indicators */}
              {images.length > 1 && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 6,
                    paddingTop: 12,
                  }}
                >
                  {images.map((_, i) => (
                    <View
                      key={i}
                      style={{
                        width: activeIdx === i ? 20 : 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor:
                          activeIdx === i ? "#e1261c" : "rgba(255,255,255,0.3)",
                      }}
                    />
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View
              style={{
                marginTop: 56,
                marginHorizontal: IMAGE_PAD,
                borderRadius: IMAGE_RADIUS,
                overflow: "hidden",
                height: IMAGE_W,
                backgroundColor: "#1a1a2e",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="image-outline" size={48} color="#ffffff1f" />
            </View>
          )}

          {/* ── Detail panel (lifts over photo) ── */}
          <View style={{ marginTop: -12, paddingHorizontal: IMAGE_PAD }}>
            <GlassPanel
              variant="panel"
              style={{
                padding: 20,
                gap: 14,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              {/* ── Tagged fields ── */}
              <View style={{ gap: 14 }}>
                <FieldTag label="Product name" value={listing.title} large />
                <FieldTag label="School" value={uniCode ?? "N/A"} />
                <FieldTag label="Tags" value={listing.category.name} pill />
                {listing.description ? (
                  <FieldTag label="Description" value={listing.description} multiline />
                ) : null}
                <FieldTag
                  label="Unit"
                  value={soldOut ? "Sold out" : `${listing.stock} available`}
                  pill
                  status={soldOut ? "error" : "success"}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingTop: 4,
                    borderTopWidth: 1,
                    borderTopColor: "rgba(255,255,255,0.08)",
                  }}
                >
                  <View style={{ gap: 2, flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Inter-Medium",
                        fontSize: 11,
                        color: "#ffffff50",
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      Price
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                    >
                      <Ionicons name="pricetag" size={16} color="#e1261c" />
                      <Text
                        style={{
                          fontFamily: "BricolageGrotesque-SemiBold",
                          fontSize: 22,
                          color: "#e1261c",
                        }}
                      >
                        {formatPrice(listing.price)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </GlassPanel>
          </View>
        </ScrollView>

        {/* ── Sticky bottom action bar ── */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: IMAGE_PAD,
            paddingBottom: Platform.OS === "ios" ? 34 : 16,
            paddingTop: 12,
            backgroundColor: "rgba(0,0,0,0.6)",
            borderTopWidth: 1,
            borderTopColor: "rgba(255,255,255,0.08)",
          }}
        >
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.2)",
                borderRadius: 999,
                paddingVertical: 14,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {}}
            >
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: 14,
                  color: "#ffffff",
                }}
              >
                Message seller
              </Text>
            </TouchableOpacity>
            <View style={{ flex: 1.5 }}>
              <PrimaryButton
                label={soldOut ? "Sold out" : "Buy now"}
                disabled={soldOut}
                onPress={() => {}}
              />
            </View>
          </View>
        </View>
      </View>
    </PageAtmosphere>
  );
}

/* ─── Sub-components ─────────────────────────────── */

function FieldTag({
  label,
  value,
  large,
  pill,
  multiline,
  status,
}: {
  label: string;
  value: string;
  large?: boolean;
  pill?: boolean;
  multiline?: boolean;
  status?: "success" | "error";
}) {
  return (
    <View style={{ gap: 2 }}>
      <Text
        style={{
          fontFamily: "Inter-Medium",
          fontSize: 11,
          color: "#ffffff50",
          textTransform: "uppercase",
          letterSpacing: 0.8,
        }}
      >
        {label}
      </Text>
      {pill ? (
        <View
          style={{
            alignSelf: "flex-start",
            backgroundColor: status
              ? status === "error"
                ? "#e1261c1a"
                : "#22c55e1a"
              : "rgba(255,255,255,0.06)",
            borderWidth: 1,
            borderColor: status
              ? status === "error"
                ? "#e1261c4d"
                : "#22c55e4d"
              : "rgba(255,255,255,0.12)",
            borderRadius: 999,
            paddingHorizontal: 12,
            paddingVertical: 5,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter-Medium",
              fontSize: 13,
              color: status === "error"
                ? "#e1261c"
                : status === "success"
                  ? "#22c55e"
                  : "#ffffffcc",
            }}
          >
            {value}
          </Text>
        </View>
      ) : (
        <Text
          style={{
            fontFamily: large ? "BricolageGrotesque-SemiBold" : "Inter-Medium",
            fontSize: large ? 22 : 14,
            color: status === "error"
              ? "#e1261c"
              : status === "success"
                ? "#22c55e"
                : "#ffffff",
            ...(multiline ? { lineHeight: 20 } : {}),
          }}
        >
          {value}
        </Text>
      )}
    </View>
  );
}

function formatPrice(price: string): string {
  const num = parseFloat(price) || 0;
  return "₦" + num.toLocaleString("en-NG");
}

/* ─── Loading skeleton ──────────────────────────── */

function LoadingSkeleton() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  const S = ({
    w,
    h,
    r = 8,
  }: {
    w: number | string;
    h: number;
    r?: number;
  }) => (
    <Animated.View
      style={{
        width: w as any,
        height: h,
        borderRadius: r,
        backgroundColor: "rgba(255,255,255,0.1)",
        opacity,
      }}
    />
  );

  return (
    <PageAtmosphere>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            position: "absolute",
            top: 10,
            left: 0,
            right: 0,
            zIndex: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 50,
          }}
        >
          <S w={36} h={36} r={18} />
          <S w={36} h={36} r={18} />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingTop: 56, paddingHorizontal: IMAGE_PAD }}>
            <S w="100%" h={IMAGE_W} r={IMAGE_RADIUS} />
          </View>

          <View
            style={{
              marginTop: -12,
              paddingHorizontal: IMAGE_PAD,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                gap: 14,
              }}
            >
              <S w="100%" h={24} />
              <S w={80} h={20} r={999} />
              <S w="55%" h={14} />
              <S w="100%" h={14} />
              <S w="100%" h={14} />
              <S w="100%" h={14} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </PageAtmosphere>
  );
}
