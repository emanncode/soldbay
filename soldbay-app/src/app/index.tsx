import { useEffect } from "react";
import { useRouter } from "expo-router";
import { getToken } from "@/lib/auth-storage";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      const token = await getToken();
      // Placeholder: once real destinations exist, route based on token
      // e.g. token ? "/seller/dashboard" : "/login"
      // For now, always route to /login
      if (!cancelled) {
        router.replace("/login");
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
