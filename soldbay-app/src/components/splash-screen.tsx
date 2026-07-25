import { useEffect, useRef } from "react";
import { View, Animated, Dimensions } from "react-native";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { LogoWordmark } from "@/components/logo-wordmark";

const { width: SCREEN_W } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.delay(1400),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => onFinish());
  }, []);

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <PageAtmosphere>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 60,
          }}
        >
          <LogoWordmark height={78} />Design the login screen for Soldbay's mobile app, matching the established dark glassmorphic system (PageAtmosphere background, GlassPanel card, GlassFormField inputs, PrimaryButton) — same visual language as the splash screen, so the transition between them feels continuous.

Layout:

PageAtmosphere background, full screen
Logo (white/light variant) centered above the card
GlassPanel card, centered, containing the form
Heading "Welcome back" (heading-l, white)
Email field (GlassFormField)
Password field (GlassFormField) with an eye-icon toggle for visibility
"Forgot password?" link, right-aligned beneath the password field, muted white/secondary tone
"Log in" button (PrimaryButton, full-width, red, loading state on submit)
Below the card: "Don't have an account? Sign up" — plain text + red link

States to show as separate small variants:

Password field with visibility toggled on (plain text visible)
An inline error banner above the form: "Invalid email or password" (using the destructive token, legible against the glass/dark background)
The "Log in" button in a loading state

Keep this screen calm and functional — no scroll animation or decorative motion, consistent with how the splash and prior auth screens were kept simple.

          <View
            style={{
              flexDirection: "row",
              gap: 6,
              marginTop: 32,
              alignItems: "center",
            }}
          >
            {[0, 1, 2].map((i) => (
              <PulsingDot key={i} delay={i * 200} />
            ))}
          </View>
        </View>
      </PageAtmosphere>
    </Animated.View>
  );
}

function PulsingDot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={{
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: "#ffffff",
        opacity,
      }}
    />
  );
}
