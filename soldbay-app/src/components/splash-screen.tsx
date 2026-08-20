import React, { useEffect, useState } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { Image } from "expo-image";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [containerOp] = useState(() => new Animated.Value(1));
  const [logoOpacity] = useState(() => new Animated.Value(0));
  const [logoScale] = useState(() => new Animated.Value(1.0));

  useEffect(() => {
    // 1. Fade in the logo over 300ms
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // 2. Define the Grow -> Return -> Shrink -> Return cycle (800ms total)
    const singleCycle = Animated.sequence([
      // Grow from 1.0 to 1.06
      Animated.timing(logoScale, {
        toValue: 1.06,
        duration: 200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      // Return to 1.0
      Animated.timing(logoScale, {
        toValue: 1.0,
        duration: 200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      // Shrink from 1.0 to 0.94
      Animated.timing(logoScale, {
        toValue: 0.94,
        duration: 200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      // Return to 1.0
      Animated.timing(logoScale, {
        toValue: 1.0,
        duration: 200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    // Loop the cycle exactly 4 times
    const pulseLoop = Animated.loop(singleCycle, { iterations: 4 });
    pulseLoop.start();

    // 3. Fade out splash screen container after 4 iterations (3.2s)
    const timer = setTimeout(() => {
      Animated.timing(containerOp, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        pulseLoop.stop();
        onFinish();
      });
    }, 3200);

    return () => clearTimeout(timer);
  }, [containerOp, logoOpacity, logoScale, onFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: containerOp }]}>
      <PageAtmosphere theme="green">
        <View style={styles.centerWrapper}>
          <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity }}>
            <Image
              source={require("../../assets/soldbay_logo.png")}
              style={styles.logo}
              contentFit="contain"
              transition={0}
            />
          </Animated.View>
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