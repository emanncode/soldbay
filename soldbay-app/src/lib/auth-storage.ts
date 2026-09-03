import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "soldbay-auth-token";
const LAST_ACTIVE_MODE_KEY = "soldbay-last-active-mode";
let memoryToken: string | null = null;

let secureStoreUsable: boolean | null = null;

async function isSecureStoreUsable(): Promise<boolean> {
  if (secureStoreUsable !== null) return secureStoreUsable;
  try {
    secureStoreUsable = await SecureStore.isAvailableAsync();
  } catch {
    secureStoreUsable = false;
  }
  return secureStoreUsable;
}

function getWebStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export async function saveToken(token: string): Promise<void> {
  memoryToken = token;

  if (Platform.OS === "web" || !(await isSecureStoreUsable())) {
    const webStorage = getWebStorage();
    if (webStorage) webStorage.setItem(TOKEN_KEY, token);
    return;
  }

  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    const webStorage = getWebStorage();
    if (webStorage) webStorage.setItem(TOKEN_KEY, token);
  }
}

export async function getToken(): Promise<string | null> {
  if (Platform.OS === "web" || !(await isSecureStoreUsable())) {
    const webStorage = getWebStorage();
    return webStorage?.getItem(TOKEN_KEY) ?? memoryToken;
  }

  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    const webStorage = getWebStorage();
    return webStorage?.getItem(TOKEN_KEY) ?? memoryToken;
  }
}

export async function clearToken(): Promise<void> {
  memoryToken = null;

  if (Platform.OS === "web" || !(await isSecureStoreUsable())) {
    const webStorage = getWebStorage();
    if (webStorage) webStorage.removeItem(TOKEN_KEY);
    return;
  }

  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    const webStorage = getWebStorage();
    if (webStorage) webStorage.removeItem(TOKEN_KEY);
  }
}

export type ActiveMode = "buyer" | "seller";

/**
 * Persists the seller's last active mode across cold starts so the app can
 * resume where they left off. Stored in secure storage (survives process
 * death), not just in-memory state. BUYER users always resume on buyer home,
 * so this only meaningfully changes for sellers.
 */
export async function saveLastActiveMode(mode: ActiveMode): Promise<void> {
  if (Platform.OS === "web" || !(await isSecureStoreUsable())) {
    const webStorage = getWebStorage();
    if (webStorage) webStorage.setItem(LAST_ACTIVE_MODE_KEY, mode);
    return;
  }

  try {
    await SecureStore.setItemAsync(LAST_ACTIVE_MODE_KEY, mode);
  } catch {
    const webStorage = getWebStorage();
    if (webStorage) webStorage.setItem(LAST_ACTIVE_MODE_KEY, mode);
  }
}

export async function getLastActiveMode(): Promise<ActiveMode | null> {
  if (Platform.OS === "web" || !(await isSecureStoreUsable())) {
    const webStorage = getWebStorage();
    const value = webStorage?.getItem(LAST_ACTIVE_MODE_KEY) ?? null;
    return value === "buyer" || value === "seller" ? value : null;
  }

  try {
    const value = await SecureStore.getItemAsync(LAST_ACTIVE_MODE_KEY);
    return value === "buyer" || value === "seller" ? value : null;
  } catch {
    return null;
  }
}
