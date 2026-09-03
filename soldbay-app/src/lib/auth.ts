import { useEffect } from "react";
import { useRouter } from "expo-router";
import { getToken } from "./auth-storage";

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
