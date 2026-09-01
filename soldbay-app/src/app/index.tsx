import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { getMe, getSellerMe, getToken } from "@/lib/api";
import { LogoWordmark } from "@/components";
import { colors } from "@/theme/colors";

export default function SplashScreen() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await getToken();
        if (!token) {
          router.replace("/login");
          return;
        }

        const user = await getMe();
        if (!user.universityId) {
          router.replace("/select-university");
          return;
        }

        if (user.role === "SELLER") {
          // A seller can only enter seller mode after admin approval. While
          // pending (or rejected), they continue in buyer mode.
          const seller = await getSellerMe().catch(() => null);
          if (seller?.verificationStatus === "APPROVED") {
            router.replace("/seller/dashboard");
          } else {
            router.replace("/buyer/home");
          }
        } else {
          router.replace("/buyer/home");
        }
      } catch {
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    }

    checkAuth();
  }, [router]);

  return (
    <View className="flex-1 items-center justify-center bg-surface-base px-3">
      <LogoWordmark size="lg" />
      {checking ? (
        <View className="mt-3">
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : null}
    </View>
  );
}
