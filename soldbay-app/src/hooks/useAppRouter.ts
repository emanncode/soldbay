import { useRouter as useExpoRouter } from "expo-router";
import { useCallback } from "react";

// Global navigation timestamp to block rapid multi-taps globally across any component
let lastNavTime = 0;
const THROTTLE_MS = 400;

export function useAppRouter() {
  const router = useExpoRouter();

  const push: typeof router.push = useCallback(
    (...args) => {
      const now = Date.now();
      if (now - lastNavTime < THROTTLE_MS) return;
      lastNavTime = now;
      router.push(...args);
    },
    [router]
  );

  const replace: typeof router.replace = useCallback(
    (...args) => {
      const now = Date.now();
      if (now - lastNavTime < THROTTLE_MS) return;
      lastNavTime = now;
      router.replace(...args);
    },
    [router]
  );

  const back: typeof router.back = useCallback(() => {
    const now = Date.now();
    if (now - lastNavTime < THROTTLE_MS) return;
    lastNavTime = now;
    router.back();
  }, [router]);

  return {
    ...router,
    push,
    replace,
    back,
  };
}
