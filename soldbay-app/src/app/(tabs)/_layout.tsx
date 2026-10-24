import { Redirect, Tabs } from "expo-router";
import { TabBar, TabItem } from "../../components/ui/TabBar";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRole } from "../../context/RoleContext";
import { useAppRouter as useRouter } from "@/hooks/useAppRouter";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/tokens";

export default function TabsLayout() {
  const { isLoading, user } = useAuth();
  const insets = useSafeAreaInsets();
  const { role } = useRole();
  const router = useRouter();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-bgBase dark:bg-darkBg">
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }
  if (!user) return <Redirect href="/(auth)" />;

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => {
        const activeRouteName = state.routes[state.index].name;

        let activeTab: TabItem = role === 'seller' ? "Hub" : "Browse";
        if (activeRouteName === "search") activeTab = "Search";
        if (activeRouteName === "orders") activeTab = "Orders";
        if (activeRouteName === "hub") activeTab = "Hub";

        const onTabPress = (tab: TabItem) => {
          if (tab === "Post") {
            router.push("/listing/create");
            return;
          }

          let route = "/(tabs)";
          if (tab === "Search") route = "/(tabs)/search";
          if (tab === "Orders") route = "/(tabs)/orders";
          if (tab === "Hub") route = "/(tabs)/hub";

          const targetScreen =
            route.replace("/(tabs)/", "").replace("/(tabs)", "index") || "index";
          navigation.navigate(targetScreen);
        };

        return (
          <View 
            className="bg-bgBase dark:bg-darkBg pt-3.5"
            style={{ paddingBottom: Math.max(insets.bottom, 14) }}
          >
            <TabBar
              activeTab={activeTab}
              onTabPress={onTabPress}
              variant={role === 'seller' ? "seller" : "buyer"}
              hasUnreadOrders={false}
            />
          </View>
        );
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="hub" />
    </Tabs>
  );
}

