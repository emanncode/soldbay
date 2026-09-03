import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Package,
  Store,
  Plus,
  ShoppingBag,
  Wallet,
  User,
} from "lucide-react-native";
import { TabBar } from "@/components";
import { useProtectedRoute, useSellerVerificationGate } from "@/lib/auth";
import { colors } from "@/theme/colors";

export default function SellerProductsScreen() {
  useProtectedRoute();
  const { approved, loading } = useSellerVerificationGate();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("products");

  const tabs = [
    { key: "dashboard", label: "Dashboard", icon: ({ color, size }: any) => <Store color={color} size={size} /> },
    { key: "orders", label: "Orders", icon: ({ color, size }: any) => <Package color={color} size={size} /> },
    { key: "post", label: "Post", icon: ({ color, size }: any) => <Plus color={color} size={size} />, isAction: true },
    { key: "products", label: "Products", icon: ({ color, size }: any) => <ShoppingBag color={color} size={size} /> },
    { key: "wallet", label: "Wallet", icon: ({ color, size }: any) => <Wallet color={color} size={size} /> },
    { key: "profile", label: "Profile", icon: ({ color, size }: any) => <User color={color} size={size} /> },
  ];

  const handleTabPress = (key: string) => {
    if (key === "dashboard") router.replace("/seller/dashboard");
    else if (key === "orders") router.replace("/orders");
    else if (key === "post") router.push("/seller/create-listing");
    else if (key === "products") router.replace("/seller/products");
    else if (key === "wallet") router.replace("/seller/wallet");
    else if (key === "profile") router.replace("/profile");
    else setActiveTab(key);
  };

  if (loading || !approved) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-base">
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface-base">
      <View
        style={{ paddingTop: Math.max(insets.top + 8, 16) }}
        className="flex-1 items-center justify-center px-6"
      >
        <Package size={48} color={colors.neutral400} />
        <Text className="mt-4 text-heading-3 font-manrope-semibold text-text-primary">
          My Products
        </Text>
        <Text className="mt-2 text-body font-manrope text-text-secondary text-center">
          Manage your listings, drafts, and inventory.
        </Text>
      </View>

      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
}
