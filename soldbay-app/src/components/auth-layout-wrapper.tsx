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
import { LinearGradient } from "expo-linear-gradient";

const { height: SCREEN_H } = Dimensions.get("window");

// Hero height proportion from Figma UI kit: ~42-45% of screen height
const HERO_HEIGHT = Math.max(340, Math.min(Math.round(SCREEN_H * 0.44), 420));

let hasPlayedSplash = false;

interface AuthLayoutWrapperProps {
  children: React.ReactNode;
  backRoute?: string;
  backTitle?: string;
  heroImage?: any;
  staggerAnimations?: Animated.CompositeAnimation[];
}

export function AuthLayoutWrapper({
  children,
  backRoute,
  backTitle = "Back",
  heroImage,
  staggerAnimations = [],
}: AuthLayoutWrapperProps) {
  const router = useRouter();
  const navigation = useNavigation();

  // Animated values
  const [heroOpacity] = useState(
    () => new Animated.Value(hasPlayedSplash ? 1 : 0),
  );
  const [cardOpacity] = useState(() => new Animated.Value(0));
  const [cardTranslateY] = useState(() => new Animated.Value(25));

  // Focus transition replay logic
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      cardOpacity.setValue(0);
      cardTranslateY.setValue(20);

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
  }, [cardOpacity, cardTranslateY, heroOpacity, staggerAnimations]);

  const defaultHero = require("../../assets/images/soldbay_campus_hero.jpg");

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.root}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={styles.container}>
          {/* SoldBay Campus Hero Header Image & Gradient Overlay */}
          <View style={styles.heroSection}>
            <Image
              source={heroImage || defaultHero}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              pointerEvents="none"
            />

            {/* Gradient shade for contrast */}
            <LinearGradient
              colors={[
                "rgba(0, 0, 0, 0.7)",
                "rgba(0, 0, 0, 0.15)",
                "rgba(0, 0, 0, 0.65)",
              ]}
              locations={[0, 0.45, 1]}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />

            {/* Header / Top-Left Brand Logo + Back Button */}
            <SafeAreaView edges={["top"]} style={styles.safeHeader}>
              <View style={styles.topBarRow}>
                {backRoute && (
                  <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Ionicons name="chevron-back" size={24} color="#ffffff" />
                  </TouchableOpacity>
                )}

                {/* Top-Left Logo + SoldBay Name */}
                <View style={styles.brandLockup}>
                  <View style={styles.arBrandLogo}>
                    <Image
                      source={require("../../assets/soldbay_logo_white.png")}
                      style={styles.brandLogo}
                      contentFit="contain"
                    />
                  </View>
                  <Text style={styles.brandTitle}>SoldBay</Text>
                </View>
              </View>
            </SafeAreaView>
          </View>

          {/* Dark Sheet Card */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: cardOpacity,
                transform: [{ translateY: cardTranslateY }],
              },
            ]}
          >
            {/* Top Drag Pill Indicator */}
            <View style={styles.topHandleBar} />

            {children}
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: "100%",
    backgroundColor: "#0d0d0f",
    overflow: "hidden",
  },
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#0d0d0f",
    justifyContent: "space-between",
  },
  heroSection: {
    flex: 1,
    minHeight: 140,
    position: "relative",
    overflow: "hidden",
  },
  safeHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  topBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  brandLockup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingRight: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  arBrandLogo: {
    borderRadius: 24,
    padding: 6,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderWidth: 1,
  },
  brandLogo: {
    width: 24,
    height: 24,
  },
  brandTitle: {
    fontFamily: "BricolageGrotesque-Bold",
    fontSize: 17,
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#111114",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -24,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: Platform.OS === "ios" ? 32 : 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderBottomWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: "0px -6px 20px rgba(0, 0, 0, 0.4)",
      },
    }),
  },
  topHandleBar: {
    width: 50,
    height: 4,
    borderRadius: 100,
    backgroundColor: "#3f3f46",
    alignSelf: "center",
    marginBottom: 16,
  },
});
