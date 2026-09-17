import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import { BlurView } from "expo-blur";
import {
  House,
  StorefrontIcon,
  Package,
  User,
  Heart,
} from "phosphor-react-native";
import { colors } from "../theme/colors";

export type TabValue = "browse" | "store" | "wishlist" | "orders" | "profile";

interface BuyerBottomNavProps {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
  style?: StyleProp<ViewStyle>;
}

export function BuyerBottomNav({
  activeTab,
  onTabChange,
  style,
}: BuyerBottomNavProps) {
  const tabs = [
    { id: "browse" as const, label: "Browse", icon: House },
    { id: "store" as const, label: "Store", icon: StorefrontIcon },
    { id: "wishlist" as const, label: "Wishlist", icon: Heart },
    { id: "orders" as const, label: "Orders", icon: Package },
    { id: "profile" as const, label: "Profile", icon: User },
  ];

  return (
    <View style={[styles.outerWrapper, style]}>
      {/* Back Layer: Border frame plate & drop shadow positioned behind */}
      <View style={styles.backBorderPlate} />

      {/* Middle Layer: Frosted Glass Container with Backdrop Blur */}
      <View style={styles.glassContainer}>
        {/* Real-time backdrop blur of scrolling items underneath */}
        <BlurView
          intensity={85}
          tint="light"
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        />

        {/* Semi-transparent frosted tint layer */}
        <View style={styles.frostOverlay} />

        {/* Subtle top edge specular highlight rim */}
        <View style={styles.glassHighlightEdge} pointerEvents="none" />

        {/* Front Layer: Navigation Tabs Content */}
        <View style={styles.tabsRow}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            const color = isActive
              ? colors.soldbayPrimary
              : colors.textSecondary;
            const weight = isActive ? "fill" : "regular";

            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.7}
                onPress={() => onTabChange(tab.id)}
                style={styles.tabItem}
                className="items-center justify-center flex-1"
              >
                <Icon size={26} weight={weight} color={color} />
                <Text
                  style={[styles.tabLabel, { color }]}
                  className={
                    isActive ? "font-sora-semibold" : "font-sora-medium"
                  }
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    position: "relative",
  },
  backBorderPlate: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: "rgba(15, 23, 42, 0.10)",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    zIndex: 0,
  },
  glassContainer: {
    borderRadius: 34,
    overflow: "hidden",
    zIndex: 1,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.85)",
  },
  frostOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
  },
  glassHighlightEdge: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  tabsRow: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    lineHeight: 14,
  },
});
