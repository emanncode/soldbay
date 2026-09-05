import { Text, View } from "react-native";
import { ShoppingCart } from "lucide-react-native";
import { TabScreenShell } from "@/components";
import { useModeTabs } from "@/lib/tabs";
import { colors } from "@/theme/colors";

export default function BuyerCartScreen() {
  const { tabs, handleTabPress } = useModeTabs("buyer");

  return (
    <TabScreenShell
      mode="buyer"
      activeTab="cart"
      tabs={tabs}
      onTabPress={handleTabPress}
      title="Cart"
      headerIcon={<ShoppingCart size={16} color={colors.accent} />}
    >
      <View className="flex-1 items-center justify-center px-6">
        <ShoppingCart size={48} color={colors.neutral400} />
        <Text className="mt-4 text-title-lg font-manrope-bold text-text-primary">
          Cart
        </Text>
        <Text className="mt-2 text-body-md font-manrope text-text-tertiary text-center">
          Coming soon — manage your campus purchases and track orders in one
          place.
        </Text>
      </View>
    </TabScreenShell>
  );
}