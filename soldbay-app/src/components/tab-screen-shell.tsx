import { type ReactNode } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBar, type TabItem } from "./tab-bar";

export interface TabScreenShellProps {
  /** Which mode's tab set to render ("buyer" | "seller"). */
  mode: "buyer" | "seller";
  /** Key of the tab currently on-screen. */
  activeTab: string;
  tabs: TabItem[];
  onTabPress: (key: string) => void;
  /** Small icon rendered left of the centered header title. */
  headerIcon?: ReactNode;
  /** Centered header title (when no custom `header` is provided). */
  title?: string;
  /** Custom header node (safe-area padded) that replaces the default one. */
  header?: ReactNode;
  children: ReactNode;
}

/**
 * SOLDBAY TAB SCREEN SHELL
 *
 * Shared chrome for the five (buyer) / six (seller) tab screens: a bordered,
 * compact header and the bottom TabBar. Screens provide their own scrollable
 * body as children; screens with a bespoke header (e.g. buyer home/search with
 * search bar + category chips) pass one via `header`, which is used verbatim.
 */
export function TabScreenShell({
  mode,
  activeTab,
  tabs,
  onTabPress,
  headerIcon,
  title,
  header,
  children,
}: TabScreenShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-surface-base">
      {header ?? (
        <View
          style={{ paddingTop: Math.max(insets.top, 16) }}
          className="flex-row items-center justify-center border-b border-border bg-surface-elevated px-3 pb-3"
        >
          {headerIcon}
          {title ? (
            <Text className="ml-2 text-body font-manrope-medium text-text-primary">
              {title}
            </Text>
          ) : null}
        </View>
      )}

      <View className="flex-1">{children}</View>

      <TabBar tabs={tabs} activeTab={activeTab} onTabPress={onTabPress} />
    </View>
  );
}