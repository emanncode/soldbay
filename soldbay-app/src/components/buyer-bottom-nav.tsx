import { View, Text, TouchableOpacity } from "react-native";
import { House, MagnifyingGlass, Package, User } from "phosphor-react-native";
import { colors } from "../theme/colors";

type TabValue = "browse" | "search" | "orders" | "profile";

interface BuyerBottomNavProps {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}

export function BuyerBottomNav({ activeTab, onTabChange }: BuyerBottomNavProps) {
  const activeColor = colors.primary;
  const inactiveColor = colors.textSecondary;

  const tabs = [
    { id: "browse" as const, label: "Browse", icon: House },
    { id: "search" as const, label: "Search", icon: MagnifyingGlass },
    { id: "orders" as const, label: "Orders", icon: Package },
    { id: "profile" as const, label: "Profile", icon: User },
  ];

  return (
    <View className="h-[62px] w-full flex-row justify-around items-center bg-surface border-t border-border px-4 pb-[10px] pt-[6px]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        const color = isActive ? activeColor : inactiveColor;
        
        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.7}
            onPress={() => onTabChange(tab.id)}
            className="items-center justify-center min-w-[64px]"
          >
            <Icon size={22} weight={isActive ? "fill" : "regular"} color={color} />
            <Text
              className={`text-[11px] mt-1 ${
                isActive ? "font-sora-semibold text-primary" : "font-sora text-text-secondary"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
