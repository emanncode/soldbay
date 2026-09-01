import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  School,
  ShieldCheck,
  Package,
  LogOut,
  Store,
  Trash2,
} from "lucide-react-native";
import {
  Avatar,
  BackHeader,
  Divider,
  SettingsRow,
  VerifiedChip,
} from "@/components";
import { clearToken, deleteAccount, getMe, getSellerMe, type UserMeResponse } from "@/lib/api";
import { alertDialog, confirmDialog } from "@/lib/dialogs";
import { colors } from "@/theme/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [isSellerVerified, setIsSellerVerified] = useState(false);
  const [sellerVerificationStatus, setSellerVerificationStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const u = await getMe();
        setUser(u);
        if (u.role === "SELLER") {
          const s = await getSellerMe().catch(() => null);
          if (s?.verified) setIsSellerVerified(true);
          setSellerVerificationStatus(s?.verificationStatus ?? null);
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleLogout = async () => {
    const ok = await confirmDialog({
      title: "Sign Out",
      message: "Are you sure you want to sign out of Soldbay?",
      confirmText: "Sign Out",
      cancelText: "Cancel",
      destructive: true,
    });
    if (!ok) return;

    await clearToken();
    // Reset the whole navigation stack so no authenticated screens
    // remain in history after signing out.
    try {
      router.dismissAll();
    } catch {
      // dismissAll may not be available in every navigator.
    }
    router.replace("/login");
  };

  const handleDeleteAccount = async () => {
    const ok = await confirmDialog({
      title: "Delete Account",
      message:
        "This permanently deletes your Soldbay account and signs you out. Your order history is retained but anonymized, and this cannot be undone.",
      confirmText: "Delete Account",
      cancelText: "Cancel",
      destructive: true,
    });
    if (!ok) return;

    try {
      await deleteAccount();
      await clearToken();
      try {
        router.dismissAll();
      } catch {
        // dismissAll may not be available in every navigator.
      }
      router.replace("/login");
    } catch (err: any) {
      await alertDialog({
        title: "Delete failed",
        message: err?.message || "Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-base">
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface-base">
      <View style={{ paddingTop: Math.max(insets.top, 16) }} className="px-1 border-b border-border bg-surface-elevated">
        <BackHeader onBack={() => router.back()} title="Profile" />
      </View>

      <ScrollView className="flex-1">
        {/* User Card */}
        <View className="p-3 bg-surface-elevated flex-row items-center border-b border-border">
          <Avatar name={user?.name || "User"} size={64} />
          <View className="ml-2 flex-1">
            <View className="flex-row items-center">
              <Text className="font-manrope-semibold text-h2 text-text-primary mr-1">
                {user?.name}
              </Text>
              {isSellerVerified ? <VerifiedChip size="sm" /> : null}
            </View>
            <Text className="font-manrope text-small text-text-secondary mt-0.5">
              {user?.email}
            </Text>
            <Text className="font-manrope text-caption text-accent mt-0.5">
              {user?.role === "SELLER" ? "Campus Seller" : "Student Buyer"}
            </Text>
          </View>
        </View>

        {/* Account Section */}
        <View className="mt-3 bg-surface-elevated border-y border-border">
          <SettingsRow
            label="Orders & Escrow"
            icon={<Package size={20} color={colors.neutral600} />}
            onPress={() => router.push("/orders")}
          />
          <Divider />
          <SettingsRow
            label="Campus & University"
            icon={<School size={20} color={colors.neutral600} />}
            value={user?.level || undefined}
            onPress={() => router.push("/select-university")}
          />
          <Divider />
          <SettingsRow
            label="Seller Portal Verification"
            icon={<ShieldCheck size={20} color={colors.neutral600} />}
            badge={isSellerVerified ? <VerifiedChip size="sm" /> : undefined}
            onPress={() => router.push("/seller/verify")}
          />
        </View>

        {/* Switch Mode / Store */}
        <View className="mt-3 bg-surface-elevated border-y border-border">
          {user?.role === "SELLER" ? (
            sellerVerificationStatus === "APPROVED" ? (
              <SettingsRow
                label="Seller Dashboard"
                icon={<Store size={20} color={colors.accent} />}
                onPress={() => router.push("/seller/dashboard")}
              />
            ) : (
              <SettingsRow
                label="Seller Dashboard (Pending Approval)"
                icon={<Store size={20} color={colors.accent} />}
                onPress={() => router.push("/seller/verify")}
              />
            )
          ) : (
            <SettingsRow
              label="Switch to Campus Seller"
              icon={<Store size={20} color={colors.accent} />}
              onPress={() => router.push("/select-role")}
            />
          )}
        </View>

        {/* Sign Out */}
        <View className="mt-4 bg-surface-elevated border-y border-border">
          <SettingsRow
            label="Sign Out"
            icon={<LogOut size={20} color={colors.error} />}
            destructive
            showChevron={false}
            onPress={handleLogout}
          />
        </View>

        {/* Delete Account */}
        <View className="mt-3 bg-surface-elevated border-y border-border">
          <SettingsRow
            label="Delete Account"
            icon={<Trash2 size={20} color={colors.error} />}
            destructive
            showChevron={false}
            onPress={handleDeleteAccount}
          />
        </View>
      </ScrollView>
    </View>
  );
}
