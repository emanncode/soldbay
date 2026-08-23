import { useEffect, useState } from "react";
import { View, Text, Animated, Easing, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SuccessScreen() {
  const router = useRouter();
  const [progress] = useState(() => new Animated.Value(0));
  const [cardOpacity] = useState(() => new Animated.Value(0));
  const [cardTranslateY] = useState(() => new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }),
    ]).start(() => {
      router.replace("/login");
    });
  }, [cardOpacity, cardTranslateY, progress, router]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 260],
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#0d0d0f" }}>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}
      >
        <Animated.View
          style={{
            width: "100%",
            maxWidth: 342,
            backgroundColor: "#18181b",
            borderWidth: 1,
            borderColor: "#27272a",
            borderRadius: 24,
            padding: 40,
            gap: 20,
            alignItems: "center",
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35,
                shadowRadius: 16,
              },
              android: {
                elevation: 8,
              },
              web: {
                boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.35)",
              },
            }),
            opacity: cardOpacity,
            transform: [{ translateY: cardTranslateY }],
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="checkmark-circle" size={40} color="#22c55e" />
          </View>

          <Text
            style={{
              fontFamily: "Inter-Bold",
              fontSize: 24,
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            Password updated
          </Text>

          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              textAlign: "center",
            }}
          >
            Redirecting you to login...
          </Text>

          <View
            style={{
              width: "100%",
              height: 4,
              borderRadius: 2,
              backgroundColor: "#27272a",
              overflow: "hidden",
            }}
          >
            <Animated.View
              style={{
                height: 4,
                borderRadius: 2,
                backgroundColor: "#22c55e",
                width: progressWidth,
              }}
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
