import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "soldbay-auth-token";
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
