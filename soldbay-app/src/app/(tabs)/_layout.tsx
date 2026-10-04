import { Tabs } from "expo-router";
import { TabBar, TabItem } from "../../components/ui/TabBar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => {
        const activeRouteName = state.routes[state.index].name;
        
        let activeTab: TabItem = 'Browse';
        if (activeRouteName === 'search') activeTab = 'Search';
        if (activeRouteName === 'orders') activeTab = 'Orders';
        if (activeRouteName === 'profile') activeTab = 'Profile';
        
        const onTabPress = (tab: TabItem) => {
          let route = '/(tabs)';
          if (tab === 'Search') route = '/(tabs)/search';
          if (tab === 'Orders') route = '/(tabs)/orders';
          if (tab === 'Profile') route = '/(tabs)/profile';
          
          navigation.navigate(route.replace('/(tabs)/', '').replace('/(tabs)', 'index') || 'index');
        };

        return (
          <TabBar 
            activeTab={activeTab} 
            onTabPress={onTabPress} 
            variant="buyer" 
            hasUnreadOrders={false} 
          />
        );
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
