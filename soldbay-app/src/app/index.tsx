import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import {
  getMe,
  getSellerMe,
  getToken,
  getLastActiveMode,
  saveLastActiveMode,
  NetworkError,
  TimeoutError,
} from "@/lib/api";
import { LogoWordmark } from "@/components";
import { colors } from "@/theme/colors";

const AUTH_CHECK_RETRIES = 3;
const AUTH_CHECK_RETRY_DELAY_MS = 1000;

export default function SplashScreen() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth(attempt = 0): Promise<void> {
      try {
        const token = await getToken();
        if (!token) {
          if (!cancelled) router.replace("/login");
          return;
        }

        let user;
        try {
          user = await getMe();
        } catch (err: any) {
          // A transient network failure (the request never reached the server)
          // while a valid token exists should not log the user out. Retry a
          // few times before falling back to login so a momentary blip during
          // cold start doesn't dump someone with a valid session to the login
          // screen.
          if (
            (err instanceof NetworkError || err instanceof TimeoutError) &&
            attempt < AUTH_CHECK_RETRIES &&
            !cancelled
          ) {
            setTimeout(() => checkAuth(attempt + 1), AUTH_CHECK_RETRY_DELAY_MS);
            return;
          }
          throw err;
        }

        if (!user.universityId) {
          if (!cancelled) router.replace("/select-university");
          return;
        }

        if (user.role === "SELLER") {
          // A seller can only enter seller mode after admin approval. While
          // pending (or rejected), they continue in buyer mode.
          const seller = await getSellerMe().catch(() => null);
          if (seller?.verificationStatus === "APPROVED") {
            // Resume the seller where they left off. If they were last in
            // buyer mode (or have never set one), land on buyer home. Respect
            // the verification gate above: unapproved sellers always fall
            // through to buyer home.
            const lastMode = await getLastActiveMode();
            if (lastMode === "seller") {
              await saveLastActiveMode("seller");
              if (!cancelled) router.replace("/seller/dashboard");
            } else {
              await saveLastActiveMode("buyer");
              if (!cancelled) router.replace("/buyer/home");
            }
          } else {
            await saveLastActiveMode("buyer");
            if (!cancelled) router.replace("/buyer/home");
          }
        } else {
          await saveLastActiveMode("buyer");
          if (!cancelled) router.replace("/buyer/home");
        }
      } catch {
        if (!cancelled) router.replace("/login");
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    checkAuth();
    return () => {
      cancelled = true;
    };
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
