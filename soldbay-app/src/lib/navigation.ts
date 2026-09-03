import { type ImperativeRouter } from "expo-router";

/**
 * Safely go back. On screens reached via `router.replace(...)` (or a deep
 * link / direct load) there is no previous screen in the stack, so a raw
 * `router.back()` dispatches an unhandled POP_TO_TOP and React Navigation logs
 * "The action 'POP_TO_TOP' was not handled by any navigator."
 *
 * This guards with `canGoBack()` and, when there is nowhere to go back to,
 * falls back to `fallback` (a role-appropriate home) so the user is never left
 * stranded on a dead-end screen with a broken back button.
 */
export function goBackSafe(
  router: ImperativeRouter,
  fallback?: Parameters<ImperativeRouter["replace"]>[0],
) {
  if (router.canGoBack()) {
    router.back();
  } else if (fallback) {
    router.replace(fallback);
  }
}
