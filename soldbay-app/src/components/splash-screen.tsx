import React, { useEffect, useState } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import { PageAtmosphere } from "@/components/page-atmosphere";
interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [containerOp] = useState(() => new Animated.Value(1));
  
  // Bag animation states
  const [bagOpacity] = useState(() => new Animated.Value(0));
  const [bagScale] = useState(() => new Animated.Value(0));

  // Cap animation states
  const [capOpacity] = useState(() => new Animated.Value(0));
  const [capTranslateY] = useState(() => new Animated.Value(-200)); // drops down 200px

  useEffect(() => {
    Animated.sequence([
      // 1. Initial 0.5s delay when app starts
      Animated.delay(500),
      
      // 2. Fade-in and scale-up the SoldBay bag (600ms)
      Animated.parallel([
        Animated.timing(bagOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bagScale, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.3)),
          useNativeDriver: true,
        }),
      ]),
      
      // 3. 0.3s delay after bag is shown
      Animated.delay(300),
      
      // 4. "Crown" the bag with the graduation cap (700ms)
      Animated.parallel([
        Animated.timing(capOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(capTranslateY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.back(1.4)), // dynamic bounce upon landing on the bag
          useNativeDriver: true,
        }),
      ]),
      
      // 5. Briefly hold the completed logo on screen (1200ms)
      Animated.delay(1200),
      
      // 6. Smoothly fade out the entire splash screen container (500ms)
      Animated.timing(containerOp, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => onFinish());
  }, [bagOpacity, bagScale, capOpacity, capTranslateY, containerOp, onFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: containerOp }]}>
      <PageAtmosphere theme="green">
        <View style={styles.centerWrapper}>
          <View style={styles.logoContainer}>
            {/* The SoldBay Bag (scales up first) */}
            <Animated.Image
              source={require("../../assets/soldbay_logo_bag.png")}
              style={[
                styles.logoBag,
                {
                  opacity: bagOpacity,
                  transform: [{ scale: bagScale }],
                },
              ]}
              resizeMode="contain"
            />
            {/* The Graduation Cap (drops down after 0.3s delay) */}
            <Animated.Image
              source={require("../../assets/soldbay_logo_cap.png")}
              style={[
                styles.logoCap,
                {
                  opacity: capOpacity,
                  transform: [{ translateY: capTranslateY }],
                },
              ]}
              resizeMode="contain"
            />
          </View>
        </View>
      </PageAtmosphere>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  logoContainer: {
    width: 240,
    height: 240,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  logoBag: {
    width: 140,
    height: 150,
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
  },
  logoCap: {
    width: 250,
    height: 62.5,
    position: "absolute",
    top: 25,
    alignSelf: "center",
  },
});