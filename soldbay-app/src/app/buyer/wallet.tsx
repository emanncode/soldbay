import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ShoppingBag,
  Search as SearchIcon,
  ShoppingCart,
  User,
  Wallet,
} from "lucide-react-native";
import { TabBar, WalletView } from "@/components";
import { useProtectedRoute } from "@/lib/auth";
import { getWallet, type WalletResponse } from "@/lib/api";
import { colors } from "@/theme/colors";

export default function BuyerWalletScreen() {
  useProtectedRoute();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState("wallet");
  const [data, setData] = useState<WalletResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWallet = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const res = await getWallet();
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Fetch wallet once on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWallet();
  }, [fetchWallet]);

  const tabs = [
    {
      key: "home",
      label: "Feed",
      icon: ({ color, size }: any) => <ShoppingBag color={color} size={size} />,
    },
    {
      key: "search",
      label: "Search",
      icon: ({ color, size }: any) => <SearchIcon color={color} size={size} />,
    },
    {
      key: "cart",
      label: "Cart",
      icon: ({ color, size }: any) => (
        <ShoppingCart color={color} size={size} />
      ),
    },
    {
      key: "wallet",
      label: "Wallet",
      icon: ({ color, size }: any) => <Wallet color={color} size={size} />,
    },
    {
      key: "profile",
      label: "Profile",
      icon: ({ color, size }: any) => <User color={color} size={size} />,
    },
  ];

  const handleTabPress = (key: string) => {
    if (key === "home") router.replace("/buyer/home");
    else if (key === "search") router.replace("/buyer/search");
    else if (key === "cart") router.replace("/buyer/cart");
    else if (key === "wallet") router.replace("/buyer/wallet");
    else if (key === "profile") router.replace("/profile");
    else setActiveTab(key);
  };

  return (
    <View className="flex-1 bg-surface-base">
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="flex-row items-center justify-center px-3 pb-3 border-b border-border bg-surface-elevated"
      >
        <Wallet size={16} color={colors.accent} />
        <Text className="ml-2 text-body font-manrope-medium text-text-primary">
          Wallet
        </Text>
      </View>

      <WalletView
        data={data}
        loading={loading}
        refreshing={refreshing}
        onRefresh={() => fetchWallet(true)}
        intro="Escrow activity on your campus purchases"
      />

      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
}
