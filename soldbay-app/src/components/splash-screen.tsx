import React, { useEffect, useState } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import { PageAtmosphere } from "@/components/page-atmosphere";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [containerOp] = useState(() => new Animated.Value(1));
  const [logoOpacity] = useState(() => new Animated.Value(0));
  const [logoScale] = useState(() => new Animated.Value(0.95));

  useEffect(() => {
    // 1. Fade in the logo over 500ms
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // 2. Start a continuous, gentle pulse animation loop
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.05,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 0.95,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    
    pulseLoop.start();

    // 3. Keep the splash screen active for 2.6 seconds, then fade out the container
    const timer = setTimeout(() => {
      Animated.timing(containerOp, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        pulseLoop.stop();
        onFinish();
      });
    }, 2600);

    return () => clearTimeout(timer);
  }, [containerOp, logoOpacity, logoScale, onFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: containerOp }]}>
      <PageAtmosphere theme="green">
        <View style={styles.centerWrapper}>
          <Animated.Image
            source={require("../../assets/soldbay_logo.png")}
            style={[
              styles.logo,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
            resizeMode="contain"
          />
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
  },
  logo: {
    width: 220,
    height: 220,
  },
});