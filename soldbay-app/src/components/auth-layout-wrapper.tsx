import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Easing,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { PageAtmosphere } from "./page-atmosphere";

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get("window");

let hasPlayedSplash = false;

interface AuthLayoutWrapperProps {
  children: React.ReactNode;
  backRoute?: string;
  backTitle?: string;
  staggerAnimations?: Animated.CompositeAnimation[];
}

/**
 * Dot Matrix Grid (top-left & mid-right patterns)
 */
function DotMatrix({ rows, cols, style }: { rows: number; cols: number; style?: any }) {
  return (
    <View style={[styles.dotGrid, style]} pointerEvents="none">
      {Array.from({ length: rows }).map((_, r) => (
        <View key={r} style={styles.dotRow}>
          {Array.from({ length: cols }).map((_, c) => (
            <View key={c} style={styles.dot} />
          ))}
        </View>
      ))}
    </View>
  );
}

/**
 * Subtle Campus Line-Art Illustration Background
 * Features university hall, clock tower, dormers, windows, clouds, trees, and rolling green hills
 */
function CampusHeroArtwork() {
  return (
    <View style={artStyles.container} pointerEvents="none">
      {/* Top Left Dot Grid */}
      <DotMatrix rows={6} cols={5} style={artStyles.dotGridTopLeft} />

      {/* Middle Right Dot Grid */}
      <DotMatrix rows={5} cols={4} style={artStyles.dotGridMidRight} />

      {/* Clouds in the sky */}
      <View style={artStyles.cloudLeft}>
        <View style={artStyles.cloudPuff1} />
        <View style={artStyles.cloudPuff2} />
        <View style={artStyles.cloudBase} />
      </View>
      <View style={artStyles.cloudRight}>
        <View style={artStyles.cloudPuff1} />
        <View style={artStyles.cloudPuff2} />
        <View style={artStyles.cloudBase} />
      </View>

      {/* Campus Line-Art Architectural Skyline */}
      <View style={artStyles.skylineWrapper}>
        {/* Left Tree */}
        <View style={artStyles.treeLeft}>
          <View style={artStyles.treeFoliageTop} />
          <View style={artStyles.treeFoliageBottom} />
          <View style={artStyles.treeStem} />
        </View>

        {/* Left University Building (Main Academic Hall) */}
        <View style={artStyles.academicHall}>
          {/* Triangular Gable Roof with Dormer */}
          <View style={artStyles.gableRoof}>
            <View style={artStyles.dormerWindow}>
              <View style={artStyles.dormerInner} />
            </View>
          </View>
          {/* Main Facade with Windows Grid */}
          <View style={artStyles.hallFacade}>
            <View style={artStyles.windowGridRow}>
              <View style={artStyles.paneWindow} />
              <View style={artStyles.paneWindow} />
              <View style={artStyles.paneWindow} />
              <View style={artStyles.paneWindow} />
            </View>
            <View style={artStyles.windowGridRow}>
              <View style={artStyles.paneWindow} />
              <View style={artStyles.paneWindow} />
              <View style={artStyles.paneWindow} />
              <View style={artStyles.paneWindow} />
            </View>
          </View>
        </View>

        {/* Center Clock Tower */}
        <View style={artStyles.clockTower}>
          {/* Spire */}
          <View style={artStyles.towerSpire} />
          {/* Belfry with Arched Openings */}
          <View style={artStyles.towerBelfry}>
            <View style={artStyles.clockFace}>
              <View style={artStyles.clockHands} />
            </View>
          </View>
          {/* Tower Shaft */}
          <View style={artStyles.towerShaft}>
            <View style={artStyles.narrowWindow} />
            <View style={artStyles.narrowWindow} />
          </View>
        </View>

        {/* Right Building Wing (Library / Lecture Complex) */}
        <View style={artStyles.rightHall}>
          <View style={artStyles.rightHallRoof} />
          <View style={artStyles.rightHallFacade}>
            <View style={artStyles.windowGridRow}>
              <View style={artStyles.paneWindow} />
              <View style={artStyles.paneWindow} />
              <View style={artStyles.paneWindow} />
            </View>
            <View style={artStyles.windowGridRow}>
              <View style={artStyles.paneWindow} />
              <View style={artStyles.paneWindow} />
              <View style={artStyles.paneWindow} />
            </View>
          </View>
        </View>

        {/* Right Trees */}
        <View style={artStyles.treeRight}>
          <View style={artStyles.treeFoliageTop} />
          <View style={artStyles.treeFoliageBottom} />
          <View style={artStyles.treeStem} />
        </View>
      </View>

      {/* Layered Organic Rolling Green Waves */}
      <View style={artStyles.waveLayerBack} />
      <View style={artStyles.waveLayerFront} />
    </View>
  );
}

export function AuthLayoutWrapper({
  children,
  backRoute,
  backTitle = "Reset password",
  staggerAnimations = [],
}: AuthLayoutWrapperProps) {
  const router = useRouter();
  const navigation = useNavigation();

  // Card measurement for reactive logo resizing
  const [cardHeight, setCardHeight] = useState(0);

  // Animated values
  const [heroOpacity] = useState(() => new Animated.Value(hasPlayedSplash ? 1 : 0));
  const [heroTranslateY] = useState(() => new Animated.Value(hasPlayedSplash ? 0 : -10));
  const [cardOpacity] = useState(() => new Animated.Value(0));
  const [cardTranslateY] = useState(() => new Animated.Value(30));

  // Reactive logo size spring value
  const defaultSize = hasPlayedSplash ? 150 : 175;
  const [logoSizeAnim] = useState(() => new Animated.Value(defaultSize));

  // Compute available height for the logo dynamically based on measured card height
  const safeAreaTop = 50;
  const brandHeaderHeight = 70;
  const paddingBuffer = 40;
  const availableLogoHeight = SCREEN_H - cardHeight - safeAreaTop - brandHeaderHeight - paddingBuffer;
  const targetLogoSize = Math.max(105, Math.min(185, cardHeight > 0 ? availableLogoHeight : defaultSize));

  // Spring resize logo smoothly based on screen/form layout height
  useEffect(() => {
    if (cardHeight > 0) {
      Animated.spring(logoSizeAnim, {
        toValue: targetLogoSize,
        useNativeDriver: false,
        tension: 45,
        friction: 8,
      }).start();
    }
  }, [targetLogoSize, cardHeight, logoSizeAnim]);

  // Focus transition replay logic
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      cardOpacity.setValue(0);
      cardTranslateY.setValue(25);

      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(50),
          Animated.parallel(staggerAnimations),
        ]),
      ]).start();
    });

    return unsubscribe;
  }, [navigation, cardOpacity, cardTranslateY, staggerAnimations]);

  // Initial mount animation
  useEffect(() => {
    if (hasPlayedSplash) {
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(50),
          Animated.parallel(staggerAnimations),
        ]),
      ]).start();
      return;
    }

    hasPlayedSplash = true;

    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(heroTranslateY, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(60),
        Animated.parallel(staggerAnimations),
      ]),
    ]).start();
  }, [cardOpacity, cardTranslateY, heroOpacity, heroTranslateY, staggerAnimations]);

  return (
    <PageAtmosphere theme="green">
      <SafeAreaView style={styles.container} edges={["top"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Branded Green Hero Header */}
            <View style={styles.heroSection}>
              {/* Campus Artwork + Dot Grids + Organic Waves */}
              <CampusHeroArtwork />

              {/* Branding Group: Brand Name -> Tagline -> Big Reactive Logo */}
              <Animated.View
                style={[
                  styles.brandingGroup,
                  {
                    opacity: heroOpacity,
                    transform: [{ translateY: heroTranslateY }],
                  },
                ]}
              >
                <Text style={styles.brandName}>SoldBay</Text>
                <Text style={styles.tagline}>Buy. Sell. Campus Life.</Text>

                <Animated.View
                  style={[
                    styles.logoWrapper,
                    {
                      width: logoSizeAnim,
                      height: logoSizeAnim,
                    },
                  ]}
                >
                  <Image
                    source={require("../../assets/logo.png")}
                    style={styles.logo}
                    contentFit="contain"
                  />
                </Animated.View>
              </Animated.View>
            </View>

            {/* White Form Card (Retains natural content-driven height and measures for reactive sizing) */}
            <Animated.View
              onLayout={(e) => {
                const h = e.nativeEvent.layout.height;
                if (h > 0 && Math.abs(h - cardHeight) > 5) {
                  setCardHeight(h);
                }
              }}
              style={[
                styles.card,
                {
                  opacity: cardOpacity,
                  transform: [{ translateY: cardTranslateY }],
                },
              ]}
            >
              {backRoute && (
                <View style={styles.backRow}>
                  <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="arrow-back" size={20} color="#111827" />
                  </TouchableOpacity>
                  <Text style={styles.backTitle}>{backTitle}</Text>
                </View>
              )}
              {children}
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PageAtmosphere>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  heroSection: {
    flexGrow: 1,
    flexShrink: 0,
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    paddingTop: 16,
    paddingBottom: 20,
  },
  brandingGroup: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  brandName: {
    fontFamily: "BricolageGrotesque-Bold",
    fontSize: 28,
    color: "#051508",
    letterSpacing: 0.2,
  },
  tagline: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#0a2210",
    letterSpacing: 0.2,
    marginTop: 4,
    marginBottom: 12,
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  card: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: Platform.OS === "ios" ? 40 : 34,
    // Natural height dictated by the form components inside
    flexShrink: 0,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: "0px -4px 16px rgba(0, 0, 0, 0.08)",
      },
    }),
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  backTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 15,
    color: "#111827",
  },
  dotGrid: {
    position: "absolute",
    gap: 5,
  },
  dotRow: {
    flexDirection: "row",
    gap: 5,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#ffffff",
    opacity: 0.28,
  },
});

/**
 * Campus Illustration & Artwork Styles
 */
const artStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  dotGridTopLeft: {
    top: 20,
    left: 18,
  },
  dotGridMidRight: {
    top: 130,
    right: 18,
  },
  // Clouds
  cloudLeft: {
    position: "absolute",
    top: 80,
    left: 36,
    width: 36,
    height: 14,
    opacity: 0.35,
  },
  cloudRight: {
    position: "absolute",
    top: 75,
    right: 48,
    width: 36,
    height: 14,
    opacity: 0.35,
  },
  cloudPuff1: {
    position: "absolute",
    top: 0,
    left: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.2,
    borderColor: "#0f3e17",
    borderBottomWidth: 0,
  },
  cloudPuff2: {
    position: "absolute",
    top: 2,
    left: 16,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.2,
    borderColor: "#0f3e17",
    borderBottomWidth: 0,
  },
  cloudBase: {
    position: "absolute",
    bottom: 0,
    left: 2,
    right: 2,
    height: 1.2,
    backgroundColor: "#0f3e17",
  },
  // Skyline Container
  skylineWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 38,
    height: 100,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    opacity: 0.32,
  },
  academicHall: {
    width: 90,
    alignItems: "center",
  },
  gableRoof: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 45,
    borderRightWidth: 45,
    borderBottomWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#0b3112",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  dormerWindow: {
    position: "absolute",
    bottom: -18,
    width: 14,
    height: 10,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderWidth: 1,
    borderColor: "#a6e568",
    backgroundColor: "#0b3112",
    alignItems: "center",
    justifyContent: "center",
  },
  dormerInner: {
    width: 6,
    height: 5,
    backgroundColor: "#a6e568",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  hallFacade: {
    width: 86,
    height: 48,
    borderWidth: 1.2,
    borderColor: "#0b3112",
    borderTopWidth: 0,
    backgroundColor: "rgba(11, 49, 18, 0.08)",
    paddingTop: 4,
    paddingHorizontal: 4,
    gap: 4,
  },
  windowGridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paneWindow: {
    width: 14,
    height: 16,
    borderWidth: 1,
    borderColor: "#0b3112",
    backgroundColor: "rgba(166, 229, 104, 0.2)",
  },
  // Clock Tower
  clockTower: {
    width: 32,
    alignItems: "center",
    marginLeft: -4,
  },
  towerSpire: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 24,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#0b3112",
  },
  towerBelfry: {
    width: 26,
    height: 24,
    borderWidth: 1.2,
    borderColor: "#0b3112",
    backgroundColor: "rgba(11, 49, 18, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  clockFace: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#0b3112",
    backgroundColor: "#a6e568",
    alignItems: "center",
    justifyContent: "center",
  },
  clockHands: {
    width: 2,
    height: 4,
    backgroundColor: "#0b3112",
  },
  towerShaft: {
    width: 24,
    height: 40,
    borderWidth: 1.2,
    borderColor: "#0b3112",
    borderTopWidth: 0,
    backgroundColor: "rgba(11, 49, 18, 0.08)",
    alignItems: "center",
    paddingTop: 4,
    gap: 4,
  },
  narrowWindow: {
    width: 6,
    height: 10,
    borderRadius: 3,
    borderWidth: 0.8,
    borderColor: "#0b3112",
    backgroundColor: "rgba(166, 229, 104, 0.2)",
  },
  // Right Building Wing
  rightHall: {
    width: 72,
    alignItems: "center",
    marginLeft: -2,
  },
  rightHallRoof: {
    width: 70,
    height: 8,
    backgroundColor: "#0b3112",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  rightHallFacade: {
    width: 68,
    height: 44,
    borderWidth: 1.2,
    borderColor: "#0b3112",
    borderTopWidth: 0,
    backgroundColor: "rgba(11, 49, 18, 0.08)",
    paddingTop: 4,
    paddingHorizontal: 4,
    gap: 4,
  },
  // Trees
  treeLeft: {
    alignItems: "center",
    marginRight: 4,
    marginBottom: 2,
  },
  treeRight: {
    alignItems: "center",
    marginLeft: 4,
    marginBottom: 2,
  },
  treeFoliageTop: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0b3112",
    backgroundColor: "rgba(166, 229, 104, 0.3)",
  },
  treeFoliageBottom: {
    width: 28,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#0b3112",
    backgroundColor: "rgba(166, 229, 104, 0.3)",
    marginTop: -8,
  },
  treeStem: {
    width: 3,
    height: 12,
    backgroundColor: "#0b3112",
  },
  // Layered Organic Waves
  waveLayerBack: {
    position: "absolute",
    bottom: -15,
    left: -SCREEN_W * 0.2,
    width: SCREEN_W * 1.4,
    height: 85,
    borderTopLeftRadius: SCREEN_W * 0.7,
    borderTopRightRadius: SCREEN_W * 0.8,
    backgroundColor: "rgba(43, 135, 33, 0.28)",
    transform: [{ rotate: "-4deg" }],
  },
  waveLayerFront: {
    position: "absolute",
    bottom: -20,
    left: -SCREEN_W * 0.1,
    width: SCREEN_W * 1.3,
    height: 70,
    borderTopLeftRadius: SCREEN_W * 0.9,
    borderTopRightRadius: SCREEN_W * 0.6,
    backgroundColor: "rgba(33, 110, 24, 0.35)",
    transform: [{ rotate: "3deg" }],
  },
});
