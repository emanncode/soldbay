import { useEffect, useState } from "react";
import { View, Text, Animated } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { Ionicons } from "@expo/vector-icons";

export default function SuccessScreen() {
  const router = useRouter();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      router.replace("/login");
    });
  }, [progress, router]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 286],
  });

  return (
    <PageAtmosphere theme="green">
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 342,
            backgroundColor: "#ffffff",
            borderRadius: 24,
            padding: 40,
            gap: 20,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: "rgba(22,163,74,0.1)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="checkmark-circle" size={36} color="#16a34a" />
          </View>

          <Text
            style={{
              fontFamily: "BricolageGrotesque-SemiBold",
              fontSize: 24,
              color: "#000000",
              textAlign: "center",
            }}
          >
            Password updated
          </Text>

          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 14,
              color: "#64748b",
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
              backgroundColor: "#f1f5f9",
              overflow: "hidden",
            }}
          >
            <Animated.View
              style={{
                height: 4,
                borderRadius: 2,
                backgroundColor: "#16a34a",
                width: progressWidth,
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </PageAtmosphere>
  );
}
