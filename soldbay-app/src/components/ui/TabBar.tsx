import { View, Text, TouchableOpacity } from 'react-native';
import { House, MagnifyingGlass, Receipt, User, Storefront, PlusCircle } from 'phosphor-react-native';

export type TabItem = 'Browse' | 'Search' | 'Orders' | 'Profile' | 'Hub' | 'Post';

interface TabBarProps {
  activeTab: TabItem;
  onTabPress: (tab: TabItem) => void;
  variant?: 'buyer' | 'seller'; // buyer: Browse/Search/Orders/Profile, seller: Hub/Orders/Post/Profile
  hasUnreadOrders?: boolean;
}

export function TabBar({ activeTab, onTabPress, variant = 'buyer', hasUnreadOrders = false }: TabBarProps) {
  const tabs = variant === 'buyer' 
    ? [
        { name: 'Browse', icon: House },
        { name: 'Search', icon: MagnifyingGlass },
        { name: 'Orders', icon: Receipt, hasBadge: hasUnreadOrders },
        { name: 'Profile', icon: User }
      ]
    : [
        { name: 'Hub', icon: Storefront },
        { name: 'Orders', icon: Receipt, hasBadge: hasUnreadOrders },
        { name: 'Post', icon: PlusCircle },
        { name: 'Profile', icon: User }
      ];

  return (
    <View className="flex-row bg-surface-base border-t border-border pt-2 pb-6 px-4">
      {tabs.map((tab) => {
        const isFocused = activeTab === tab.name;
        const Icon = tab.icon;

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => onTabPress(tab.name as TabItem)}
            className="flex-1 items-center justify-center gap-1"
          >
            <View className="relative">
              <Icon 
                size={24} 
                weight={isFocused ? "fill" : "regular"}
                color={isFocused ? "#2D3A1F" : "#8A8070"} 
              />
              {tab.hasBadge && (
                <View 
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" 
                  style={{ backgroundColor: '#FFB980' }} 
                />
              )}
            </View>
            <Text className={`text-caption ${isFocused ? 'text-primary' : 'text-neutral-500'}`}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
