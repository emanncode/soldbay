import { type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

export interface TabItem {
  key: string;
  label: string;
  icon: (props: { color: string; size: number }) => ReactNode;
  badgeCount?: number;
  /** When true, renders a raised center action button instead of a regular tab. */
  isAction?: boolean;
}

export interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
  className?: string;
}

/**
 * SOLDBAY TAB BAR
 *
 * Rules from DESIGN.md:
 * - 48px min touch targets for tab items.
 * - Active state is accent teal (#0D9488).
 * - Inactive state is neutral-500 (#737373).
 * - Lucide outline icons only.
 *
 * Supports a center "action" tab (raised, accent background) for primary
 * CTAs like "Post a listing".
 */
export function TabBar({
  tabs,
  activeTab,
  onTabPress,
  className = "",
}: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
      className={`w-full flex-row items-center border-t border-border bg-surface-elevated pt-1 ${className}`}
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.key === activeTab;
        const color = isActive ? colors.accent : colors.neutral500;

        // Centre action button: raised circle with accent background
        if (tab.isAction) {
          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabPress(tab.key)}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
              className="h-6 flex-1 items-center justify-center"
            >
              <View
                className="h-10 w-10 items-center justify-center rounded-full bg-accent"
                style={{ marginBottom: 14 }}
              >
                {tab.icon({ color: colors.textInverse, size: 22 })}
              </View>
              <Text
                className={`text-caption ${
                  isActive
                    ? "font-manrope-medium text-accent"
                    : "font-manrope text-text-tertiary"
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
            className="h-6 flex-1 items-center justify-center"
          >
            <View className="relative items-center">
              {tab.icon({ color, size: 22 })}

              {tab.badgeCount ? (
                <View className="absolute -right-1 -top-0.5 h-2 w-2 items-center justify-center rounded-full bg-accent">
                  <Text className="text-[10px] font-manrope-semibold text-text-inverse">
                    {tab.badgeCount > 9 ? "9+" : tab.badgeCount}
                  </Text>
                </View>
              ) : null}

              <Text
                className={`mt-0.5 text-caption ${
                  isActive
                    ? "font-manrope-medium text-accent"
                    : "font-manrope text-text-tertiary"
                }`}
              >
                {tab.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
