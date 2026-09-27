import { useState } from 'react';
import { View, Text } from 'react-native';
import { TabBar, TabItem } from '../components/ui/TabBar';

export default function Index() {
  const [activeBuyerTab, setActiveBuyerTab] = useState<TabItem>('Browse');
  const [activeSellerTab, setActiveSellerTab] = useState<TabItem>('Hub');

  return (
    <View className="flex-1 bg-surface-base justify-center">
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-h2 text-text-primary mb-2 text-center">TabBar Preview</Text>
        <Text className="text-body text-text-secondary mb-8 text-center">
          Pure UI component preview for both variants.
        </Text>
      </View>

      <View className="w-full bg-white pt-4 gap-8">
        <View>
          <Text className="text-body-semibold text-text-primary px-4 mb-2">Buyer Variant</Text>
          <TabBar 
            activeTab={activeBuyerTab} 
            onTabPress={setActiveBuyerTab} 
            variant="buyer" 
            hasUnreadOrders={true} 
          />
        </View>
        <View>
          <Text className="text-body-semibold text-text-primary px-4 mb-2">Seller Variant</Text>
          <TabBar 
            activeTab={activeSellerTab} 
            onTabPress={setActiveSellerTab} 
            variant="seller" 
            hasUnreadOrders={false} 
          />
        </View>
      </View>
    </View>
  );
}
