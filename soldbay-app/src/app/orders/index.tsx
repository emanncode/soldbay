import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Package,
  ShoppingBag,
  Search as SearchIcon,
  ShoppingCart,
  Store,
  Plus,
  User,
  Wallet,
} from "lucide-react-native";
import {
  EmptyState,
  OrderCard,
  TabBar,
} from "@/components";
import { getOrders, getMe, type OrderItem } from "@/lib/api";
import { colors } from "@/theme/colors";

export default function OrdersListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

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

  const sellerTabs = [
    { key: "dashboard", label: "Dashboard", icon: ({ color, size }: any) => <Store color={color} size={size} /> },
    { key: "orders", label: "Orders", icon: ({ color, size }: any) => <Package color={color} size={size} /> },
    { key: "post", label: "Post", icon: ({ color, size }: any) => <Plus color={color} size={size} />, isAction: true },
    { key: "products", label: "Products", icon: ({ color, size }: any) => <ShoppingBag color={color} size={size} /> },
    { key: "wallet", label: "Wallet", icon: ({ color, size }: any) => <Wallet color={color} size={size} /> },
    { key: "profile", label: "Profile", icon: ({ color, size }: any) => <User color={color} size={size} /> },
  ];

  const buyerTabs = [
    { key: "home", label: "Feed", icon: ({ color, size }: any) => <ShoppingBag color={color} size={size} /> },
    { key: "search", label: "Search", icon: ({ color, size }: any) => <SearchIcon color={color} size={size} /> },
    { key: "cart", label: "Cart", icon: ({ color, size }: any) => <ShoppingCart color={color} size={size} /> },
    { key: "wallet", label: "Wallet", icon: ({ color, size }: any) => <Wallet color={color} size={size} /> },
    { key: "profile", label: "Profile", icon: ({ color, size }: any) => <User color={color} size={size} /> },
  ];

  const tabs = isSeller ? sellerTabs : buyerTabs;

  const handleTabPress = (key: string) => {
    if (isSeller) {
      if (key === "dashboard") router.replace("/seller/dashboard");
      else if (key === "post") router.push("/seller/create-listing");
      else if (key === "products") router.replace("/seller/products");
      else if (key === "wallet") router.replace("/seller/wallet");
      else if (key === "profile") router.replace("/profile");
      else setActiveTab(key);
    } else {
      if (key === "home") router.replace("/buyer/home");
      else if (key === "search") router.replace("/buyer/search");
      else if (key === "cart") router.replace("/buyer/cart");
      else if (key === "wallet") router.replace("/buyer/wallet");
      else if (key === "profile") router.replace("/profile");
    }
  };

  return (
    <View className="flex-1 bg-surface-base">
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="flex-row items-center justify-center px-3 pb-3 border-b border-border bg-surface-elevated"
      >
        <Package size={16} color={colors.accent} />
        <Text className="ml-2 text-body font-manrope-medium text-text-primary">
          Your Orders
        </Text>
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

      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
}
