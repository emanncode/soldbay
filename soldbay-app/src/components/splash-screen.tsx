import { useEffect, useRef } from "react";
import { View, Animated, Dimensions, Easing, Image, StyleSheet } from "react-native";
import { PageAtmosphere } from "@/components/page-atmosphere";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const FULL_H = 78;
const FULL_W = FULL_H * (810 / 258);
const ICON_W = FULL_H * (191 / 258);
const SHIFT = (FULL_W - ICON_W) / 2;

const ICON_START_X = (FULL_W - ICON_W) / 2;
const ICON_END_X = 0;

const CENTER_Y = (SCREEN_H - FULL_H) / 2;

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const dropY = useRef(new Animated.Value(-SCREEN_H * 0.4)).current;
  const scale = useRef(new Animated.Value(0.3)).current;
  const shiftX = useRef(new Animated.Value(0)).current;
  const revealW = useRef(new Animated.Value(ICON_W)).current;
  const iconOp = useRef(new Animated.Value(1)).current;
  const containerOp = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(dropY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(shiftX, {
          toValue: -SHIFT,
          duration: 500,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(revealW, {
          toValue: FULL_W,
          duration: 500,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.delay(150),
          Animated.timing(iconOp, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.delay(400),
      Animated.timing(containerOp, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => onFinish());
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerOp }]}>
      <PageAtmosphere>
        <View style={styles.centerWrapper}>
          <View style={styles.logoArea}>
            <Animated.View style={[
              styles.revealWrapper,
              { width: revealW },
            ]}>
              <Image
                source={require("../../assets/logo.png")}
                style={styles.fullLogo}
                resizeMode="contain"
              />
            </Animated.View>

            <Animated.Image
              source={require("../../assets/logo2.png")}
              style={[
                styles.icon,
                {
                  left: ICON_START_X,
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
  },
  revealWrapper: {
    position: "absolute",
    left: 0,
    top: 0,
    height: FULL_H,
    overflow: "hidden",
  },
  fullLogo: {
    height: FULL_H,
    width: FULL_W,
  },
  icon: {
    position: "absolute",
    top: 0,
    height: FULL_H,
    width: ICON_W,
  },
});