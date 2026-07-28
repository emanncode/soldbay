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

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const dropY = useRef(new Animated.Value(-SCREEN_H * 0.4)).current;
  const scale = useRef(new Animated.Value(0.3)).current;
  const shiftX = useRef(new Animated.Value(0)).current;
  const letterProgress = useRef(new Animated.Value(0)).current;
  const iconOp = useRef(new Animated.Value(1)).current;
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
      Animated.delay(150),
      Animated.parallel([
        Animated.timing(shiftX, {
          toValue: -SHIFT,
          duration: 600,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(letterProgress, {
          toValue: LETTER_COUNT,
          duration: 600,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.delay(300),
          Animated.timing(iconOp, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.delay(500),
      Animated.timing(containerOp, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => onFinish());
  }, []);

  const letterAnimations = TEXT.split("").map((_, i) => {
    const inputRange = [i, i + 1];
    return letterProgress.interpolate({
      inputRange,
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
  });

  return (
    <Animated.View style={[styles.container, { opacity: containerOp }]}>
      <PageAtmosphere>
        <View style={styles.centerWrapper}>
          <View style={styles.logoArea}>
            <Animated.Image
              source={require("../../assets/logo2.png")}
              style={[
                styles.icon,
                {
                  left: SHIFT,
                  opacity: iconOp,
                  transform: [
                    { translateY: dropY },
                    { scale },
                    { translateX: shiftX },
                  ],
                },
              ]}
              resizeMode="contain"
            />

            <View style={styles.textContainer}>
              {TEXT.split("").map((char, i) => (
                <Animated.Text
                  key={i}
                  style={[
                    styles.letter,
                    {
                      opacity: letterAnimations[i],
                      transform: [
                        { translateY: letterAnimations[i].interpolate({
                            inputRange: [0, 0.3, 1],
                            outputRange: [20, 0, 0],
                          }) },
                      ],
                    },
                  ]}
                >
                  {char}
                </Animated.Text>
              ))}
            </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    position: "absolute",
    height: FULL_H,
    width: ICON_W,
  },
  textContainer: {
    flexDirection: "row",
    marginLeft: ICON_W + 8,
  },
  letter: {
    fontFamily: "BricolageGrotesque-ExtraBold",
    fontSize: 32,
    color: "#ffffff",
    lineHeight: FULL_H,
  },
});