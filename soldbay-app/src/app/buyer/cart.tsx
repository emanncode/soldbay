import { useState } from "react";
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
import { TabBar } from "@/components";
import { colors } from "@/theme/colors";

export default function BuyerCartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("cart");

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
        style={{ paddingTop: Math.max(insets.top + 8, 16) }}
        className="flex-1 items-center justify-center px-6"
      >
        <ShoppingCart size={48} color={colors.neutral400} />
        <Text className="mt-4 text-title-lg font-manrope-bold text-text-primary">
          Cart
        </Text>
        <Text className="mt-2 text-body-md font-manrope text-text-tertiary text-center">
          Coming soon — manage your campus purchases and track orders in one
          place.
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
