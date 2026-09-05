import { useCallback, useEffect, useState } from "react";
import { Wallet } from "lucide-react-native";
import { TabScreenShell, WalletView } from "@/components";
import { useProtectedRoute } from "@/lib/auth";
import { useModeTabs } from "@/lib/tabs";
import { getWallet, type WalletResponse } from "@/lib/api";
import { colors } from "@/theme/colors";

export default function SellerWalletScreen() {
  useProtectedRoute();
  const { tabs, handleTabPress } = useModeTabs("seller");

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

  return (
    <TabScreenShell
      mode="seller"
      activeTab="wallet"
      tabs={tabs}
      onTabPress={handleTabPress}
      title="Wallet"
      headerIcon={<Wallet size={16} color={colors.accent} />}
    >
      <WalletView
        data={data}
        loading={loading}
        refreshing={refreshing}
        onRefresh={() => fetchWallet(true)}
        intro="Earned from completed orders"
      />
    </TabScreenShell>
  );
}