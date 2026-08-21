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

const { height: SCREEN_H } = Dimensions.get("window");

let hasPlayedSplash = false;

interface AuthLayoutWrapperProps {
  children: React.ReactNode;
  backRoute?: string;
  backTitle?: string;
  staggerAnimations?: Animated.CompositeAnimation[];
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

  // Layout states
  const splashOffsetY = (SCREEN_H / 2) - 162;
  const [splashActive, setSplashActive] = useState(!hasPlayedSplash);

  // Animated values
  const [logoOpacity] = useState(() => new Animated.Value(hasPlayedSplash ? 1 : 0));
  const [logoScale] = useState(() => new Animated.Value(hasPlayedSplash ? 1.0 : 1.15));
  const [logoTranslateY] = useState(() => new Animated.Value(hasPlayedSplash ? 0 : splashOffsetY));
  const [brandOpacity] = useState(() => new Animated.Value(hasPlayedSplash ? 1 : 0));

  const [cardOpacity] = useState(() => new Animated.Value(0));
  const [cardTranslateY] = useState(() => new Animated.Value(60));

  // Reactive logo size spring value
  const defaultSize = hasPlayedSplash ? 140 : 180;
  const [logoSizeAnim] = useState(() => new Animated.Value(defaultSize));

  // Compute available height for the logo dynamically
  const safeAreaTop = 50;
  const brandNameHeight = 35;
  const paddingBuffer = 45;
  const availableHeight = SCREEN_H - cardHeight - safeAreaTop - brandNameHeight - paddingBuffer;
  const targetLogoSize = Math.max(100, Math.min(185, cardHeight > 0 ? availableHeight : defaultSize));

  // Spring resize logo based on form layout height
  useEffect(() => {
    if (hasPlayedSplash && cardHeight > 0) {
      Animated.spring(logoSizeAnim, {
        toValue: targetLogoSize,
        useNativeDriver: false,
        tension: 40,
        friction: 8,
      }).start();
    }
  }, [targetLogoSize, cardHeight, logoSizeAnim]);

  // Focus transition replay logic (runs when screen is focused)
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (hasPlayedSplash) {
        // Reset card to animate entry
        cardOpacity.setValue(0);
        cardTranslateY.setValue(60);

        Animated.parallel([
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 650,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(cardTranslateY, {
            toValue: 0,
            duration: 650,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(100),
            Animated.parallel(staggerAnimations),
          ]),
        ]).start();
      }
    });

    return unsubscribe;
  }, [navigation, cardOpacity, cardTranslateY, staggerAnimations]);

  // Main / First mount splash animation sequence
  useEffect(() => {
    if (hasPlayedSplash) {
      // If already played, immediately reveal card with entry animation
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(100),
          Animated.parallel(staggerAnimations),
        ]),
      ]).start();
      return;
    }

    // Otherwise, run the splash screen pulse loop once
    hasPlayedSplash = true;

    // 1. Fade in the logo initially
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // 2. Play 4 fast pulse loops
    const singleCycle = Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1.21,
        duration: 150,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1.15,
        duration: 150,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1.09,
        duration: 150,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1.15,
        duration: 150,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    const pulseLoop = Animated.loop(singleCycle, { iterations: 4 });
    pulseLoop.start();

    // 3. Slide up logo, fade in card & brand name
    const timer = setTimeout(() => {
      pulseLoop.stop();

      Animated.parallel([
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 1100,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1.0,
          duration: 1100,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(brandOpacity, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: 1200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(180),
          Animated.parallel(staggerAnimations),
        ]),
      ]).start(() => {
        setSplashActive(false);
      });
    }, 2400);

    return () => {
      clearTimeout(timer);
      pulseLoop.stop();
    };
  }, [brandOpacity, cardOpacity, cardTranslateY, logoOpacity, logoScale, logoTranslateY, splashOffsetY, staggerAnimations]);

  return (
    <PageAtmosphere theme="green">
      <SafeAreaView style={styles.container} edges={["top"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header Area */}
            <View style={styles.headerContainer}>
              <Animated.Text style={[styles.brandName, { opacity: brandOpacity }]}>
                SoldBay
              </Animated.Text>
              <Animated.View
                style={[
                  styles.logoWrapper,
                  {
                    width: logoSizeAnim,
                    height: logoSizeAnim,
                    opacity: logoOpacity,
                    transform: [
                      { translateY: logoTranslateY },
                      { scale: logoScale },
                    ],
                  },
                ]}
              >
                <Image
                  source={require("../../assets/soldbay_logo.png")}
                  style={styles.logo}
                  contentFit="contain"
                />
              </Animated.View>
            </View>

            {/* White card container */}
            <Animated.View
              onLayout={(e) => {
                const h = e.nativeEvent.layout.height;
                if (h > 0 && h !== cardHeight) {
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
              pointerEvents={splashActive ? "none" : "auto"}
            >
              {backRoute && (
                <View style={styles.backRow}>
                  <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={22} color="#000000" />
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
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 35,
  },
  logoWrapper: {
    marginTop: 12,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  brandName: {
    fontFamily: "BricolageGrotesque-SemiBold",
    fontSize: 26,
    color: "#000000",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  backTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#000000",
  },
});
