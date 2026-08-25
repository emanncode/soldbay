import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type BuyerTab = "home" | "search" | "cart" | "favorites" | "profile";

interface BuyerBottomNavProps {
  currentTab?: BuyerTab;
  onTabChange?: (tab: BuyerTab) => void;
  cartCount?: number;
  wishlistCount?: number;
  userAvatarUrl?: string | null;
  accentColor?: string;
}

const DEFAULT_ACCENT = "#5b93c7";
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80";

export function BuyerBottomNav({
  currentTab = "home",
  onTabChange,
  cartCount = 0,
  wishlistCount = 0,
  userAvatarUrl,
  accentColor = DEFAULT_ACCENT,
}: BuyerBottomNavProps) {
  const insets = useSafeAreaInsets();

  const handlePress = (tab: BuyerTab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.dock}>
        {/* 1. Home Tab */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handlePress("home")}
          style={styles.tabButton}
          accessibilityLabel="Home"
          accessibilityRole="tab"
          accessibilityState={{ selected: currentTab === "home" }}
        >
          <Ionicons
            name={currentTab === "home" ? "home" : "home-outline"}
            size={24}
            color={currentTab === "home" ? accentColor : "#9ca3af"}
          />
        </TouchableOpacity>

        {/* 2. Search Tab */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handlePress("search")}
          style={styles.tabButton}
          accessibilityLabel="Search"
          accessibilityRole="tab"
          accessibilityState={{ selected: currentTab === "search" }}
        >
          <Ionicons
            name={currentTab === "search" ? "search" : "search-outline"}
            size={23}
            color={currentTab === "search" ? accentColor : "#d1d5db"}
          />
        </TouchableOpacity>

        {/* 3. Center Raised Floating Cart Button */}
        <View style={styles.centerButtonWrapper} pointerEvents="box-none">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handlePress("cart")}
            style={[
              styles.centerCircle,
              {
                backgroundColor: accentColor,
              },
            ]}
            accessibilityLabel="Cart"
            accessibilityRole="tab"
            accessibilityState={{ selected: currentTab === "cart" }}
          >
            <Ionicons name="cart" size={24} color="#15171d" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartCount > 99 ? "99+" : cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* 4. Wishlist / Favorites Tab */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handlePress("favorites")}
          style={styles.tabButton}
          accessibilityLabel="Favorites"
          accessibilityRole="tab"
          accessibilityState={{ selected: currentTab === "favorites" }}
        >
          <Ionicons
            name={
              currentTab === "favorites"
                ? "heart"
                : wishlistCount > 0
                ? "heart"
                : "heart-outline"
            }
            size={24}
            color={
              currentTab === "favorites"
                ? accentColor
                : wishlistCount > 0
                ? "#df4a32"
                : "#d1d5db"
            }
          />
        </TouchableOpacity>

        {/* 5. Profile Tab (User Avatar Circle) */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handlePress("profile")}
          style={styles.tabButton}
          accessibilityLabel="Profile"
          accessibilityRole="tab"
          accessibilityState={{ selected: currentTab === "profile" }}
        >
          <View
            style={[
              styles.avatarContainer,
              currentTab === "profile" && {
                borderColor: accentColor,
                borderWidth: 2,
              },
            ]}
          >
            <Image
              source={{ uri: userAvatarUrl || DEFAULT_AVATAR }}
              style={styles.avatarImage}
              contentFit="cover"
              transition={200}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 99,
  },
  dock: {
    height: 64,
    backgroundColor: "#16181f",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      default: {
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
      },
    }),
  },
  tabButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  centerButtonWrapper: {
    width: 68,
    alignItems: "center",
    justifyContent: "center",
  },
  centerCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -24,
    borderWidth: 4,
    borderColor: "#16181f",
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
      default: {
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.35)",
      },
    }),
  },
  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#df4a32",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#16181f",
  },
  cartBadgeText: {
    fontFamily: "Inter-Bold",
    fontSize: 9,
    color: "#ffffff",
    textAlign: "center",
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
    overflow: "hidden",
    backgroundColor: "#2a2e39",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
});
