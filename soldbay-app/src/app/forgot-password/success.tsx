import { useEffect } from "react";
import { View, Text, Animated } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageAtmosphere } from "@/components/page-atmosphere";
import { Ionicons } from "@expo/vector-icons";

export default function SuccessScreen() {
  const router = useRouter();
  const progress = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      router.replace("/login");
    });
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 286],
  });

  return (
    <PageAtmosphere>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <View
          style={{
            width: 342,
            backgroundColor: "#ffffff0f",
            borderRadius: 24,
            borderWidth: 1,
            borderColor: "rgba(22,163,74,0.3)",
            padding: 40,
            gap: 20,
            alignItems: "center",
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
              color: "#ffffff80",
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
              backgroundColor: "#ffffff0d",
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
