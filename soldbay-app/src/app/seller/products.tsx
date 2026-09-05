import { Text, View } from "react-native";
import { Package } from "lucide-react-native";
import { TabScreenShell } from "@/components";
import { useProtectedRoute } from "@/lib/auth";
import { useModeTabs } from "@/lib/tabs";
import { colors } from "@/theme/colors";

export default function SellerProductsScreen() {
  useProtectedRoute();
  const { tabs, handleTabPress } = useModeTabs("seller");

  return (
    <TabScreenShell
      mode="seller"
      activeTab="products"
      tabs={tabs}
      onTabPress={handleTabPress}
      title="My Products"
      headerIcon={<Package size={16} color={colors.accent} />}
    >
      <View className="flex-1 items-center justify-center px-6">
        <Package size={48} color={colors.neutral400} />
        <Text className="mt-4 text-heading-3 font-manrope-semibold text-text-primary">
          My Products
        </Text>
        <Text className="mt-2 text-body font-manrope text-text-secondary text-center">
          Manage your listings, drafts, and inventory.
        </Text>
      </View>
    </TabScreenShell>
  );
}