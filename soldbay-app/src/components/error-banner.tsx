import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "rgba(220,38,38,0.1)",
        borderWidth: 1,
        borderColor: "rgba(220,38,38,0.3)",
        borderRadius: 12,
        padding: 14,
      }}
    >
      <Ionicons name="alert-circle" size={16} color="#dc2626" />
      <Text
        style={{
          fontFamily: "Inter-Regular",
          fontSize: 13,
          color: "#dc2626",
          flex: 1,
        }}
      >
        {message}
      </Text>
    </View>
  );
}
