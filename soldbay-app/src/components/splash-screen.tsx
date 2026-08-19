import { useEffect, useState } from "react";
import { View, Animated, Dimensions, Easing, StyleSheet } from "react-native";
import { PageAtmosphere } from "@/components/page-atmosphere";

const { width: SCREEN_W } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [scale] = useState(() => new Animated.Value(0.4));
  const [opacity] = useState(() => new Animated.Value(0));
  const [containerOp] = useState(() => new Animated.Value(1));

  useEffect(() => {
    Animated.sequence([
      // Fade in and scale up the black leaf logo
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
      // Stay on screen briefly
      Animated.delay(1200),
      // Fade out the entire splash container
      Animated.timing(containerOp, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => onFinish());
  }, [opacity, scale, containerOp, onFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: containerOp }]}>
      <PageAtmosphere theme="green">
        <View style={styles.centerWrapper}>
          <Animated.Image
            source={require("../../assets/soldbay_logo.png")}
            style={[
              styles.logo,
              {
                opacity,
                transform: [{ scale }],
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
    width: SCREEN_W * 0.6,
    height: SCREEN_W * 0.6,
  },
});