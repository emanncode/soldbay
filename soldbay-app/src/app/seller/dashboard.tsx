import { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus, Package, Store, User, ShoppingBag, ShieldCheck } from "lucide-react-native";
import {
  Avatar,
  Button,
  DraftRow,
  EmptyState,
  ListingCard,
  SectionHeader,
  StatCard,
  TabBar,
  ToastBanner,
  VerifiedChip,
} from "@/components";
import { getDrafts, deleteDraft, getSellerMe, type DraftListing, type SellerMeResponse } from "@/lib/api";
import { alertDialog, confirmDialog } from "@/lib/dialogs";
import { colors } from "@/theme/colors";

export default function SellerDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [seller, setSeller] = useState<SellerMeResponse | null>(null);
  const [drafts, setDrafts] = useState<DraftListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await getSellerMe();
      setSeller(data);
      const draftsRes = await getDrafts().catch(() => null);
      setDrafts(draftsRes?.drafts ?? []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Fetch seller data once on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const tabs = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: ({ color, size }: any) => <Store color={color} size={size} />,
    },
    {
      key: "orders",
      label: "Orders",
      icon: ({ color, size }: any) => <Package color={color} size={size} />,
    },
    {
      key: "buyer_mode",
      label: "Buyer Mode",
      icon: ({ color, size }: any) => <ShoppingBag color={color} size={size} />,
    },
    {
      key: "profile",
      label: "Profile",
      icon: ({ color, size }: any) => <User color={color} size={size} />,
    },
  ];

  const handleTabPress = (key: string) => {
    if (key === "orders") router.push("/orders");
    else if (key === "buyer_mode") router.push("/buyer/home");
    else if (key === "profile") router.push("/profile");
    else setActiveTab(key);
  };

  const handleResumeDraft = (id: string) => {
    router.push(`/seller/create-listing?draftId=${id}`);
  };

  const handleDeleteDraft = async (id: string) => {
    const ok = await confirmDialog({
      title: "Delete Draft",
      message: "This will permanently delete this draft and any saved details.",
      confirmText: "Delete",
      cancelText: "Cancel",
      destructive: true,
    });
    if (!ok) return;

    try {
      await deleteDraft(id);
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      await alertDialog({
        title: "Delete failed",
        message: err?.message || "Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-base">
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  const walletFormatted = `₦${(Number(seller?.walletBalance) || 0).toLocaleString()}`;
  const activeCount = seller?.listings?.length || 0;

  return (
    <View className="flex-1 bg-surface-base">
      {/* Header */}
      <View
        style={{ paddingTop: Math.max(insets.top + 8, 16) }}
        className="px-3 pb-2 border-b border-border bg-surface-elevated flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <Avatar name={seller?.name || "Seller"} size={40} />
          <View className="ml-1.5">
            <Text className="font-manrope-semibold text-body-medium text-text-primary">
              {seller?.name}
            </Text>
            <Text className="font-manrope text-caption text-text-tertiary">
              @{seller?.username}
            </Text>
          </View>
        </View>

        {seller?.verified ? (
          <VerifiedChip size="sm" />
        ) : (
          <Button
            label="Get Verified"
            onPress={() => router.push("/seller/verify")}
            variant="ghost"
            className="h-4.5 px-1.5"
          />
        )}
      </View>

      <FlatList
        data={seller?.listings || []}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(true)}
            tintColor={colors.accent}
          />
        }
        ListHeaderComponent={
          <View className="mb-3 px-1">
            {/* Stat Cards */}
            <View className="flex-row gap-2 mb-3">
              <StatCard label="Wallet Balance" value={walletFormatted} subtext="Available for payout" />
              <StatCard label="Active Listings" value={activeCount} subtext="Live on campus" />
            </View>

            {/* Post Listing CTA */}
            <View className="mb-4">
              <Button
                label="Post a Listing"
                onPress={() => router.push("/seller/create-listing")}
                variant="primary"
                icon={<Plus size={20} color={colors.textInverse} />}
              />
            </View>

            <SectionHeader title="Your Listings" />

            {drafts.length > 0 ? (
              <View className="mb-3">
                <SectionHeader title="Drafts" />
                <View className="gap-2">
                  {drafts.map((draft) => (
                    <DraftRow
                      key={draft.id}
                      id={draft.id}
                      title={draft.title}
                      draftStep={draft.draftStep}
                      thumbnailUrl={draft.images[0] || null}
                      onPress={() => handleResumeDraft(draft.id)}
                      onDelete={() => handleDeleteDraft(draft.id)}
                    />
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View className="items-center justify-center p-4">
            <EmptyState
              icon={<Package size={28} color={colors.neutral500} />}
              title="No active listings"
              description="Post your first textbook, calculator, or gadget to start selling."
            />
          </View>
        }
        renderItem={({ item }) => (
          <View className="flex-1 mb-3">
            <ListingCard
              id={item.id}
              title={item.title}
              price={Number(item.price)}
              imageUrl={item.images[0] || null}
              category={item.category?.name}
              onPress={() => router.push(`/buyer/listing-detail?id=${item.id}`)}
            />
          </View>
        )}
      />

      <TabBar tabs={tabs} activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}
