import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "soldbay-auth-token";
let memoryToken: string | null = null;

function hasSecureStoreApi(): boolean {
  return (
    typeof SecureStore?.setItemAsync === "function" &&
    typeof SecureStore?.getItemAsync === "function" &&
    typeof SecureStore?.deleteItemAsync === "function"
  );
}

function getWebStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export async function saveToken(token: string): Promise<void> {
  memoryToken = token;

  if (!hasSecureStoreApi()) {
    const webStorage = getWebStorage();
    if (webStorage) {
      webStorage.setItem(TOKEN_KEY, token);
    }
    return;
  }

  try {
    if (Platform.OS === "web") {
      const webStorage = getWebStorage();
      if (webStorage) {
        webStorage.setItem(TOKEN_KEY, token);
        return;
      }
    }

    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    const webStorage = getWebStorage();
    if (webStorage) {
      webStorage.setItem(TOKEN_KEY, token);
    }
  }
}

export async function getToken(): Promise<string | null> {
  if (!hasSecureStoreApi()) {
    const webStorage = getWebStorage();
    if (webStorage) {
      return webStorage.getItem(TOKEN_KEY) ?? memoryToken;
    }

    return memoryToken;
  }

  try {
    if (Platform.OS === "web") {
      const webStorage = getWebStorage();
      if (webStorage) {
        return webStorage.getItem(TOKEN_KEY) ?? memoryToken;
      }
    }

    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    const webStorage = getWebStorage();
    if (webStorage) {
      return webStorage.getItem(TOKEN_KEY) ?? memoryToken;
    }

    return memoryToken;
  }
}

export async function clearToken(): Promise<void> {
  memoryToken = null;

  if (!hasSecureStoreApi()) {
    const webStorage = getWebStorage();
    if (webStorage) {
      webStorage.removeItem(TOKEN_KEY);
    }
    return;
  }

  try {
    if (Platform.OS === "web") {
      const webStorage = getWebStorage();
      if (webStorage) {
        webStorage.removeItem(TOKEN_KEY);
        return;
      }
    }

    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    const webStorage = getWebStorage();
    if (webStorage) {
      webStorage.removeItem(TOKEN_KEY);
    }
  }
}
