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
import { Store } from "lucide-react-native";
import {
  ListingCard,
  SectionHeader,
  StatCard,
  TabScreenShell,
} from "@/components";
import { useProtectedRoute } from "@/lib/auth";
import { useModeTabs } from "@/lib/tabs";
import {
  getSellerMe,
  saveLastActiveMode,
  type SellerMeResponse,
} from "@/lib/api";
import { colors } from "@/theme/colors";

export default function SellerDashboardScreen() {
  useProtectedRoute();
  const router = useRouter();
  const { tabs, handleTabPress } = useModeTabs("seller");

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

  return (
    <TabScreenShell
      mode="seller"
      activeTab="dashboard"
      tabs={tabs}
      onTabPress={handleTabPress}
      title="Seller Dashboard"
      headerIcon={<Store size={16} color={colors.accent} />}
    >
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
    </TabScreenShell>
  );
}