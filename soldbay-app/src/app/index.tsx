import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/tokens";

export default function Index() {
  const { isLoading, user } = useAuth();
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-bgBase dark:bg-darkBg">
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }
  return <Redirect href={user ? "/(tabs)" : "/(auth)"} />;
}
