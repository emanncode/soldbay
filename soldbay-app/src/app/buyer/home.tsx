import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  SearchBar,
  NotificationBell,
  ListingCard,
  SkeletonCard,
  EmptyState,
  BuyerBottomNav,
  UserAvatar,
  type TabValue,
} from "@/components";
import { CaretRight, ArrowClockwise } from "phosphor-react-native";
import { getListings, type PublicListing } from "@/lib/api";
import { colors } from "@/theme/colors";

const PULL_THRESHOLD = 55;

export default function BuyerHomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabValue>("browse");

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [listings, setListings] = useState<PublicListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Custom Pull-To-Refresh Animated values (using useState for React 19 compiler compatibility)
  const [pullAnim] = useState(() => new Animated.Value(0));
  const [spinAnim] = useState(() => new Animated.Value(0));
  const scrollYRef = useRef(0);
  const startYRef = useRef(0);
  const currentPullRef = useRef(0);
  const isMouseDownRef = useRef(false);
  const [isPulling, setIsPulling] = useState(false);

  // Track current pull distance value
  useEffect(() => {
    const id = pullAnim.addListener(({ value }) => {
      currentPullRef.current = value;
    });
    return () => {
      pullAnim.removeListener(id);
    };
  }, [pullAnim]);

  // Handle continuous spin while refreshing
  useEffect(() => {
    if (refreshing) {
      Animated.timing(pullAnim, {
        toValue: 60,
        duration: 200,
        useNativeDriver: true,
      }).start();

      spinAnim.setValue(0);
      const loop = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 750,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      loop.start();
      return () => {
        loop.stop();
      };
    } else {
      Animated.timing(pullAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setIsPulling(false);
        spinAnim.setValue(0);
      });
    }
  }, [refreshing, pullAnim, spinAnim]);

  // Fetch listings whenever category or search query changes
  useEffect(() => {
    let isActive = true;

    const fetchInitialListings = async () => {
      await Promise.resolve();
      if (!isActive) return;

      setLoading(true);
      try {
        const res = await getListings({
          categorySlug: activeCategory === "all" ? undefined : activeCategory,
          search: searchQuery.trim() || undefined,
        });
        if (isActive) {
          setListings(res.items || []);
        }
      } catch (e) {
        console.error("Failed to load listings:", e);
      } finally {
        if (isActive) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    fetchInitialListings();

    return () => {
      isActive = false;
    };
  }, [activeCategory, searchQuery]);

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const [res] = await Promise.all([
        getListings({
          categorySlug: activeCategory === "all" ? undefined : activeCategory,
          search: searchQuery.trim() || undefined,
        }),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
      setListings(res.items || []);
    } catch (e) {
      console.error("Failed to refresh listings:", e);
    } finally {
      setRefreshing(false);
    }
  }, [activeCategory, searchQuery]);

  // Gesture release handler (only refreshes if released past threshold)
  const handleRelease = useCallback(() => {
    if (refreshing) return;
    if (currentPullRef.current >= PULL_THRESHOLD) {
      onRefresh();
    } else {
      Animated.spring(pullAnim, {
        toValue: 0,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }).start(() => {
        setIsPulling(false);
      });
    }
  }, [refreshing, onRefresh, pullAnim]);

  // Touch handlers for pull gesture (works on Mobile Web, iOS, and Android)
  const handleTouchStart = (e: any) => {
    if (scrollYRef.current <= 2 && !refreshing) {
      startYRef.current = e.nativeEvent.pageY;
    }
  };

  const handleTouchMove = (e: any) => {
    if (scrollYRef.current <= 2 && !refreshing) {
      const dy = e.nativeEvent.pageY - startYRef.current;
      if (dy > 0) {
        const pull = Math.min(85, dy * 0.45);
        pullAnim.setValue(pull);
        setIsPulling(true);
      } else {
        pullAnim.setValue(0);
        setIsPulling(false);
      }
    }
  };

  // Web mouse drag handlers (supports click-and-drag testing on web)
  const webMouseHandlers =
    Platform.OS === "web"
      ? {
          onMouseDown: (e: any) => {
            if (scrollYRef.current <= 2 && !refreshing) {
              isMouseDownRef.current = true;
              startYRef.current = e.clientY ?? e.pageY ?? 0;
            }
          },
          onMouseMove: (e: any) => {
            if (
              isMouseDownRef.current &&
              scrollYRef.current <= 2 &&
              !refreshing
            ) {
              const clientY = e.clientY ?? e.pageY ?? 0;
              const dy = clientY - startYRef.current;
              if (dy > 0) {
                const pull = Math.min(85, dy * 0.45);
                pullAnim.setValue(pull);
                setIsPulling(true);
              } else {
                pullAnim.setValue(0);
                setIsPulling(false);
              }
            }
          },
          onMouseUp: () => {
            if (isMouseDownRef.current) {
              isMouseDownRef.current = false;
              handleRelease();
            }
          },
        }
      : {};

  // Interpolations for Pull-To-Refresh Medallion and Content
  const indicatorTranslateY = useMemo(
    () =>
      pullAnim.interpolate({
        inputRange: [0, PULL_THRESHOLD, 85],
        outputRange: [-50, 16, 26],
        extrapolate: "clamp",
      }),
    [pullAnim]
  );

  const indicatorOpacity = useMemo(
    () =>
      pullAnim.interpolate({
        inputRange: [0, 8, PULL_THRESHOLD],
        outputRange: [0, 0.6, 1],
        extrapolate: "clamp",
      }),
    [pullAnim]
  );

  const arrowDragRotation = useMemo(
    () =>
      pullAnim.interpolate({
        inputRange: [0, PULL_THRESHOLD],
        outputRange: ["0deg", "270deg"],
        extrapolate: "clamp",
      }),
    [pullAnim]
  );

  const spinLoopRotation = useMemo(
    () =>
      spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
      }),
    [spinAnim]
  );

  const feedTranslateY = useMemo(
    () =>
      pullAnim.interpolate({
        inputRange: [0, 85],
        outputRange: [0, 32],
        extrapolate: "clamp",
      }),
    [pullAnim]
  );

  // Listings for display
  const sortedListings = useMemo(() => {
    return [...listings];
  }, [listings]);

  // Header Component (Brand Row + Search Bar)
  const renderHeader = () => (
    <View style={styles.brandRow} className="mt-2 ">
      <SearchBar
        containerStyle={{ flex: 1 }}
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.headerActions}>
        <NotificationBell unreadCount={6} onPress={() => { }} />
        <UserAvatar
          size={40}
          name="Chidi Okafor"
          imageUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80"
          onPress={() => setActiveTab("profile")}
        />
      </View>
    </View>
  );

  // Feed Section Header (Section Title + See All Button)
  const renderFeedHeader = () => {
    const isSearching = searchQuery.trim().length > 0;
    const titleText = isSearching
      ? `${sortedListings.length} results for “${searchQuery.trim()}”`
      : "Fresh on Campus";

    return (
      <View style={styles.feedHeaderContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle} className="font-sora-semibold">
            {titleText}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab("store")}
            style={styles.seeAllButton}
            accessibilityRole="button"
            accessibilityLabel="See all items in store"
          >
            <Text
              style={styles.seeAllLabel}
              className="font-sora-medium text-[13px] text-text-secondary"
            >
              See all
            </Text>
            <CaretRight size={13} color={colors.textSecondary} weight="bold" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Skeleton Loading Grid (Frame sc8fe49)
  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonTitleBar} />
        <View style={styles.skeletonSortPill} />
      </View>
      <View style={styles.skeletonGrid}>
        <View style={styles.skeletonRow}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
        <View style={styles.skeletonRow}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </View>
    </View>
  );

  // Empty State (Filtered vs. Zero Listings)
  const renderEmpty = () => {
    if (loading) return null;
    const isFiltered =
      activeCategory !== "all" || searchQuery.trim().length > 0;
    return (
      <EmptyState
        variant={isFiltered ? "filtered" : "empty"}
        onClearFilters={() => {
          setActiveCategory("all");
          setSearchQuery("");
        }}
      />
    );
  };

  return (
    <View
      style={styles.screen}
      className="flex-1 relative"
      {...webMouseHandlers}
    >
      {/* Fixed Simplified Header */}
      <View
        style={[styles.headerWrapper, { paddingTop: insets.top }]}
        className="absolute top-0 left-0 right-0 z-20"
      >
        {renderHeader()}
      </View>

      {/* Floating Pull-to-Refresh Circular Medallion */}
      {(isPulling || refreshing) && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.ptrFloatingContainer,
            {
              top: insets.top + 62,
              opacity: indicatorOpacity,
              transform: [{ translateY: indicatorTranslateY }],
            },
          ]}
        >
          <View style={styles.ptrMedallion}>
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: refreshing ? spinLoopRotation : arrowDragRotation,
                  },
                ],
              }}
            >
              <ArrowClockwise
                size={20}
                color={colors.soldbayPrimary}
                weight="bold"
              />
            </Animated.View>
          </View>
          {refreshing && (
            <View style={styles.ptrTextBadge}>
              <Text style={styles.ptrText}>Updating fresh drops…</Text>
            </View>
          )}
        </Animated.View>
      )}

      {/* Main Content Grid with Elastic Drag Translation */}
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateY: feedTranslateY }],
        }}
      >
        {loading && !refreshing ? (
          <ScrollView
            contentContainerStyle={{
              paddingTop: insets.top + 80,
              paddingBottom: 96 + insets.bottom,
              paddingHorizontal: 16,
            }}
          >
            {renderSkeleton()}
          </ScrollView>
        ) : (
          <FlatList
            data={sortedListings}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={{
              paddingTop: insets.top + 80,
              paddingBottom: 96 + insets.bottom,
              paddingHorizontal: 16,
            }}
            columnWrapperStyle={styles.columnWrapper}
            ListHeaderComponent={renderFeedHeader}
            ListEmptyComponent={renderEmpty}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleRelease}
            onTouchCancel={handleRelease}
            onScroll={(e) => {
              const y = e.nativeEvent.contentOffset.y;
              scrollYRef.current = y;
              if (y < 0 && !refreshing) {
                const pull = Math.min(85, -y * 0.7);
                pullAnim.setValue(pull);
                setIsPulling(true);
              }
            }}
            onScrollEndDrag={(e) => {
              const y = e.nativeEvent.contentOffset.y;
              if (y < -PULL_THRESHOLD && !refreshing) {
                onRefresh();
              } else if (y < 0 && !refreshing) {
                Animated.spring(pullAnim, {
                  toValue: 0,
                  tension: 40,
                  friction: 7,
                  useNativeDriver: true,
                }).start(() => setIsPulling(false));
              }
            }}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => (
              <ListingCard
                title={item.title}
                price={Number(item.price)}
                sellerName={
                  item.seller?.businessName ||
                  item.seller?.username ||
                  "Unknown Seller"
                }
                imageUrl={item.images?.[0]}
                isSold={item.status?.toLowerCase() === "sold"}
                isVerified={index % 2 === 0}
                rating={4.8}
                reviewsCount={235}
                onPress={() => { }}
              />
            )}
          />
        )}
      </Animated.View>

      {/* Floating Frosted Glass Buyer Nav Bar */}
      <View
        pointerEvents="box-none"
        style={[
          styles.navWrapper,
          { bottom: Math.max(12, insets.bottom > 0 ? insets.bottom : 12) },
        ]}
      >
        <BuyerBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerWrapper: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandRow: {
    height: 48,
    paddingHorizontal: 16,
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ptrFloatingContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 19,
    gap: 6,
  },
  ptrMedallion: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: {
        boxShadow: "0px 2px 8px rgba(45, 58, 31, 0.12)",
      },
      default: {
        shadowColor: "#2D3A1F",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
      },
    }),
  },
  ptrTextBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(216, 215, 204, 0.6)",
  },
  ptrText: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
    fontFamily: "Sora-Medium",
  },
  feedHeaderContainer: {
    paddingBottom: 14,
    gap: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 20,
    flex: 1,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingVertical: 4,
    paddingLeft: 8,
  },
  seeAllLabel: {
    fontSize: 13,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  columnWrapper: {
    gap: 16,
  },
  skeletonContainer: {
    gap: 14,
  },
  skeletonHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  skeletonTitleBar: {
    width: 128,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.border,
    opacity: 0.85,
  },
  skeletonSortPill: {
    width: 64,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.border,
    opacity: 0.85,
  },
  skeletonGrid: {
    gap: 16,
  },
  skeletonRow: {
    flexDirection: "row",
    gap: 16,
  },
  navWrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 30,
    alignItems: "center",
  },
});
