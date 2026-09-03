import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Package,
  ShoppingBag,
  Store,
  Plus,
  User,
  Wallet,
} from "lucide-react-native";
import {
  ListingCard,
  SectionHeader,
  StatCard,
  TabBar,
} from "@/components";
import { useProtectedRoute } from "@/lib/auth";
import {
  getSellerMe,
  saveLastActiveMode,
  type SellerMeResponse,
} from "@/lib/api";
import { colors } from "@/theme/colors";

export default function SellerDashboardScreen() {
  useProtectedRoute();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [data, setData] = useState<SellerMeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Persist last active mode for app resume.
  useEffect(() => {
    saveLastActiveMode("seller");
  }, []);

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const me = await getSellerMe();

      // A seller whose profile hasn't been approved cannot use the seller
      // dashboard. Route them to the verify flow, which shows the pending /
      // under-review state or the proof-upload form.
      if (!me.verified && me.verificationStatus !== "APPROVED") {
        router.replace("/seller/verify");
        return;
      }

      setData(me);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Fetch dashboard once on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard();
  }, []);

  const walletFormatted = data?.walletBalance
    ? `$${Number(data.walletBalance).toFixed(2)}`
    : "$0.00";
  const activeCount =
    data?.listings.filter((l) => l.status === "active").length ?? 0;
  const activeListings = data?.listings.slice(0, 3) ?? [];

  const tabs = [
    { key: "dashboard", label: "Dashboard", icon: ({ color, size }: any) => <Store color={color} size={size} /> },
    { key: "orders", label: "Orders", icon: ({ color, size }: any) => <Package color={color} size={size} /> },
    { key: "post", label: "Post", icon: ({ color, size }: any) => <Plus color={color} size={size} />, isAction: true },
    { key: "products", label: "Products", icon: ({ color, size }: any) => <ShoppingBag color={color} size={size} /> },
    { key: "wallet", label: "Wallet", icon: ({ color, size }: any) => <Wallet color={color} size={size} /> },
    { key: "profile", label: "Profile", icon: ({ color, size }: any) => <User color={color} size={size} /> },
  ];

  const handleTabPress = (key: string) => {
    if (key === "orders") router.replace("/orders");
    else if (key === "post") router.push("/seller/create-listing");
    else if (key === "products") router.replace("/seller/products");
    else if (key === "wallet") router.replace("/seller/wallet");
    else if (key === "profile") router.replace("/profile");
    else setActiveTab(key);
  };

  return (
    <View className="flex-1 bg-surface-base">
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="flex-row items-center justify-center px-3 pb-3 border-b border-border bg-surface-elevated"
      >
        <Store size={16} color={colors.accent} />
        <Text className="ml-2 text-body font-manrope-medium text-text-primary">
          Seller Dashboard
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchDashboard(true)}
              tintColor={colors.accent}
            />
          }
        >
          <View className="gap-5 px-3 pt-4">
            {/* At-a-glance stats */}
            <StatCard
              label="Wallet Balance"
              value={walletFormatted}
              subtext="Available for payout"
            />
            <StatCard
              label="Active Listings"
              value={activeCount}
              subtext="Live on campus"
            />

            {/* Recent active listings (lightweight, moves full mgmt to Products) */}
            <View>
              <SectionHeader
                title="Your Listings"
                actionText="See All"
                onActionPress={() => router.replace("/seller/products")}
              />
              {activeListings.length === 0 ? (
                <Pressable
                  onPress={() => router.push("/seller/create-listing")}
                  className="mt-2 items-center rounded-xl border border-dashed border-border bg-surface-elevated p-4"
                >
                  <Text className="font-manrope-medium text-body text-accent">
                    Post your first item
                  </Text>
                </Pressable>
              ) : (
                <View className="mt-2">
                  {activeListings.map((listing) => (
                    <View key={listing.id} className="mb-3">
                      <ListingCard
                        id={listing.id}
                        title={listing.title}
                        price={Number(listing.price)}
                        imageUrl={listing.images[0] || null}
                        category={listing.category?.name}
                        onPress={() => router.push(`/buyer/listing-detail?id=${listing.id}`)}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      )}

      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
}
