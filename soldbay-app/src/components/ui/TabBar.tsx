import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { House, MagnifyingGlass, Package, Storefront, PlusCircle } from 'phosphor-react-native';
import { colors } from '../../theme/tokens';

export type TabItem = 'Browse' | 'Search' | 'Orders' | 'Hub' | 'Post';

interface TabBarProps {
  activeTab: TabItem;
  onTabPress: (tab: TabItem) => void;
  variant?: 'buyer' | 'seller'; // buyer: Browse/Search/Orders, seller: Hub/Orders/Post
  hasUnreadOrders?: boolean;
}

export function TabBar({ activeTab, onTabPress, variant = 'buyer', hasUnreadOrders = false }: TabBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const tabs = variant === 'buyer' 
    ? [
        { name: 'Browse', icon: House },
        { name: 'Search', icon: MagnifyingGlass },
        { name: 'Orders', icon: Package, hasBadge: hasUnreadOrders },
      ]
    : [
        { name: 'Hub', icon: Storefront },
        { name: 'Orders', icon: Package, hasBadge: hasUnreadOrders },
        { name: 'Post', icon: PlusCircle },
      ];

  return (
    <View className="flex-row">
      {tabs.map((tab) => {
        const isFocused = activeTab === tab.name;
        const Icon = tab.icon;
        
        const iconColor = isFocused 
          ? colors.accent
          : (isDark ? colors.borderDark : colors.secondaryText);

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => onTabPress(tab.name as TabItem)}
            className="flex-1 items-center justify-center gap-1"
          >
            <View className="relative items-center">
              <Icon 
                size={24} 
                weight={isFocused ? "fill" : "regular"}
                color={iconColor} 
              />
              {tab.hasBadge && (
                <View 
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-discountFill" 
                />
              )}
            </View>
            <Text className={`text-caption-1 ${isFocused ? 'text-accent' : 'text-secondaryText dark:text-borderDark'}`}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
