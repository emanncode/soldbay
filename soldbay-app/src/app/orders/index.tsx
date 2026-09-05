import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Package } from "lucide-react-native";
import {
  EmptyState,
  OrderCard,
  TabScreenShell,
} from "@/components";
import { getOrders, getMe, type OrderItem } from "@/lib/api";
import { useModeTabs } from "@/lib/tabs";
import { colors } from "@/theme/colors";

export default function OrdersListScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  const tabMode = isSeller ? "seller" : "buyer";
  const { tabs, handleTabPress } = useModeTabs(tabMode);

  const fetchOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [res, user] = await Promise.all([
        getOrders(),
        isRefresh ? Promise.resolve(null) : getMe().catch(() => null),
      ]);
      setOrders(res.orders);
      if (user) setIsSeller(user.role === "SELLER");
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Fetch orders once on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, []);

  return (
    <TabScreenShell
      mode={tabMode}
      activeTab="orders"
      tabs={tabs}
      onTabPress={handleTabPress}
      title="Your Orders"
      headerIcon={<Package size={16} color={colors.accent} />}
    >
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 items-center justify-center px-3">
          <EmptyState
            icon={<Package size={32} color={colors.neutral500} />}
            title="No orders yet"
            description="When you buy or sell items on campus, your escrow orders will appear here."
            actionLabel="Browse Marketplace"
            onActionPress={() => router.replace("/buyer/home")}
          />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchOrders(true)}
              tintColor={colors.accent}
            />
          }
          renderItem={({ item }) => (
            <OrderCard
              id={item.id}
              orderNumber={item.orderNumber}
              title={item.title}
              amount={item.amount}
              status={item.status}
              thumbnailUrl={item.thumbnail}
              onPress={() => router.push(`/orders/detail?id=${item.id}`)}
            />
          )}
        />
      )}
    </TabScreenShell>
  );
}