import { useEffect, useRef } from "react";
import { View, Animated, Dimensions, Easing, Image, Text, StyleSheet } from "react-native";
import { PageAtmosphere } from "@/components/page-atmosphere";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const FULL_H = 78;
const FULL_W = FULL_H * (810 / 258);
const ICON_W = FULL_H * (191 / 258);
const SHIFT = (FULL_W - ICON_W) / 2;

const TEXT = "soldbay";
const LETTER_COUNT = TEXT.length;

const PURPLE = "#5b3df0";
const WHITE = "#ffffff";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const dropY = useRef(new Animated.Value(-SCREEN_H * 0.4)).current;
  const scale = useRef(new Animated.Value(0.3)).current;
  const shiftX = useRef(new Animated.Value(0)).current;
  const revealProgress = useRef(new Animated.Value(0)).current;
  const containerOp = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(dropY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(shiftX, {
          toValue: -SHIFT,
          duration: 600,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(revealProgress, {
          toValue: 1,
          duration: 600,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]),
      Animated.delay(500),
      Animated.timing(containerOp, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => onFinish());
  }, []);

  const textRevealWidth = revealProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FULL_W - ICON_W - 6],
  });

  return (
    <Animated.View style={[styles.container, { opacity: containerOp }]}>
      <PageAtmosphere>
        <View style={styles.centerWrapper}>
          <View style={styles.logoArea}>
            {/* Text layer - behind logo, vertically centered, revealed by mask */}
            <Animated.View style={[
              styles.textMask,
              { width: textRevealWidth },
            ]}>
              <View style={styles.textContainer}>
                {TEXT.split("").map((char, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.letter,
                      { color: i >= 4 ? PURPLE : WHITE },
                    ]}
                  >
                    {char}
                  </Text>
                ))}
              </View>
            </Animated.View>

            {/* Logo layer - on top, drops, scales, shifts left */}
            <Animated.Image
              source={require("../../assets/logo2.png")}
              style={[
                styles.icon,
                {
                  left: SHIFT,
                  transform: [
                    { translateY: dropY },
                    { scale },
                    { translateX: shiftX },
                  ],
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
  },
  logoArea: {
    position: "relative",
    width: FULL_W,
    height: FULL_H,
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    height: FULL_H,
    width: ICON_W,
    zIndex: 10,
  },
  textMask: {
    position: "absolute",
    left: ICON_W + 6,
    top: 0,
    height: FULL_H,
    overflow: "hidden",
    justifyContent: "center",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  letter: {
    fontFamily: "BricolageGrotesque-ExtraBold",
    fontSize: 42,
    color: WHITE,
    lineHeight: 48,
  },
});