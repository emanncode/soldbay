import { useRouter } from "expo-router";
import {
  Package,
  Plus,
  Search as SearchIcon,
  ShoppingBag,
  ShoppingCart,
  Store,
  User,
  Wallet,
} from "lucide-react-native";
import { type TabItem } from "@/components";

export type Mode = "buyer" | "seller";

function tabIcon(Icon: any) {
  const TabIcon = ({ color, size }: { color: string; size: number }) => (
    <Icon color={color} size={size} />
  );
  TabIcon.displayName = "TabIcon";
  return TabIcon;
}

export const BUYER_TABS: TabItem[] = [
  { key: "home", label: "Feed", icon: tabIcon(ShoppingBag) },
  { key: "search", label: "Search", icon: tabIcon(SearchIcon) },
  { key: "cart", label: "Cart", icon: tabIcon(ShoppingCart) },
  { key: "wallet", label: "Wallet", icon: tabIcon(Wallet) },
  { key: "profile", label: "Profile", icon: tabIcon(User) },
];

export const SELLER_TABS: TabItem[] = [
  { key: "dashboard", label: "Dashboard", icon: tabIcon(Store) },
  { key: "orders", label: "Orders", icon: tabIcon(Package) },
  { key: "post", label: "Post", icon: tabIcon(Plus), isAction: true },
  { key: "products", label: "Products", icon: tabIcon(ShoppingBag) },
  { key: "wallet", label: "Wallet", icon: tabIcon(Wallet) },
  { key: "profile", label: "Profile", icon: tabIcon(User) },
];

export function tabsForMode(mode: Mode): TabItem[] {
  return mode === "seller" ? SELLER_TABS : BUYER_TABS;
}

/**
 * Single source of truth for the bottom tab bar. Screens render the same tab
 * set via <TabScreenShell mode=... /> instead of vendoring their own copies,
 * so tab order, icons, labels, and navigation behavior can't drift between
 * screens.
 */
export function useModeTabs(mode: Mode): {
  tabs: TabItem[];
  handleTabPress: (key: string) => void;
} {
  const router = useRouter();

  const handleTabPress = (key: string) => {
    if (mode === "seller") {
      if (key === "dashboard") router.replace("/seller/dashboard");
      else if (key === "orders") router.replace("/orders");
      else if (key === "post") router.push("/seller/create-listing");
      else if (key === "products") router.replace("/seller/products");
      else if (key === "wallet") router.replace("/seller/wallet");
      else if (key === "profile") router.replace("/profile");
    } else {
      if (key === "home") router.replace("/buyer/home");
      else if (key === "search") router.replace("/buyer/search");
      else if (key === "cart") router.replace("/buyer/cart");
      else if (key === "wallet") router.replace("/buyer/wallet");
      else if (key === "profile") router.replace("/profile");
    }
  };

  return { tabs: tabsForMode(mode), handleTabPress };
}