import { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TabBar, TabItem } from '../components/ui/TabBar';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SearchBar } from '../components/ui/SearchBar';
import { ProductCard } from '../components/ui/ProductCard';

export default function Index() {
  const [activeBuyerTab, setActiveBuyerTab] = useState<TabItem>('Browse');
  const [activeSellerTab, setActiveSellerTab] = useState<TabItem>('Hub');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ScrollView 
      className="flex-1 bg-bgBase dark:bg-darkBg"
      contentContainerClassName="flex-grow justify-center py-12"
    >
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-title-2 text-primaryText dark:text-darkText mb-2 text-center">Component Library Preview</Text>
        <Text className="text-body text-secondaryText dark:text-borderDark mb-8 text-center">
          Pure UI components preview.
        </Text>
      </View>

      <View className="w-full bg-bgBase dark:bg-darkBg gap-8 pb-8">
        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">Screen Header</Text>
          <ScreenHeader title="Home" hasUnreadNotifications={true} />
        </View>

        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">Search Bar</Text>
          <View className="px-4 py-4">
            <SearchBar 
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />
          </View>
        </View>

        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">Product Cards</Text>
          <View className="px-4 py-4 flex-row gap-4 flex-wrap">
            <View className="w-[47%]">
              <ProductCard 
                title="MacBook Pro M1 2020"
                price={650000}
                originalPrice={700000}
                sellerName="@emmanuel_d"
                isVerifiedSeller={true}
              />
            </View>
            <View className="w-[47%]">
              <ProductCard 
                title="Engineering Drawing Kit"
                price={15000}
                sellerName="@sarah_j"
                isVerifiedSeller={false}
              />
            </View>
            <View className="w-[47%]">
              <ProductCard 
                title="Nike Air Force 1"
                price={25000}
                sellerName="@michael_c"
                isVerifiedSeller={true}
                isSold={true}
              />
            </View>
          </View>
        </View>

        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">Buyer Tab Bar</Text>
          <TabBar 
            activeTab={activeBuyerTab} 
            onTabPress={setActiveBuyerTab} 
            variant="buyer" 
            hasUnreadOrders={true} 
          />
        </View>
        <View>
          <Text className="text-body text-primaryText dark:text-darkText px-4 py-2 bg-borderLight/10 dark:bg-darkBgStep">Seller Tab Bar</Text>
          <TabBar 
            activeTab={activeSellerTab} 
            onTabPress={setActiveSellerTab} 
            variant="seller" 
            hasUnreadOrders={false} 
          />
        </View>
      </View>
    </ScrollView>
  );
}
