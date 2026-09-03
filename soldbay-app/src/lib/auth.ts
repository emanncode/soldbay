import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getToken } from "./auth-storage";
import { getSellerMe } from "./api";

/**
 * Redirects unauthenticated users to /login.
 * Call this at the top of any protected screen.
 */
export function useProtectedRoute() {
  const router = useRouter();

  useEffect(() => {
    getToken().then((token) => {
      if (!token) {
        router.replace("/login");
      }
    });
  }, [router]);
}

/**
 * Redirects sellers whose seller profile has not been approved to /seller/verify,
 * which shows either the "under review" (pending) state or the proof-upload form.
 * Returns true once the seller is confirmed approved (loaded), so screens can
 * avoid rendering seller-only UI before the check completes.
 */
export function useSellerVerificationGate() {
  const router = useRouter();
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getSellerMe()
      .then((seller) => {
        if (!active) return;
        if (seller.verified || seller.verificationStatus === "APPROVED") {
          setApproved(true);
        } else {
          router.replace("/seller/verify");
        }
      })
      .catch(() => {
        if (active) router.replace("/seller/verify");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  return { approved, loading };
}
