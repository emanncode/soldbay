import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Package } from "lucide-react-native";
import {
  BackHeader,
  EmptyState,
  OrderCard,
} from "@/components";
import { getOrders, type OrderItem } from "@/lib/api";
import { colors } from "@/theme/colors";

export default function OrdersListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await getOrders();
      setOrders(res.orders);
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
    <View className="flex-1 bg-surface-base">
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="px-1 border-b border-border bg-surface-elevated">
        <BackHeader onBack={() => router.back()} title="Your Orders" />
      </View>

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
    </View>
  );
}
