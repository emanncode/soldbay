import * as SecureStore from "expo-secure-store";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../lib/api";

const TOKEN_KEY = "soldbay_mobile_token";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  universityId?: string | null;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload extends LoginPayload {
  name: string;
  phone?: string;
  matricNumber: string;
  universityId: string;
  termsAccepted: true;
  privacyAccepted: true;
}

interface AuthContextValue {
  isLoading: boolean;
  token: string | null;
  user: AuthUser | null;
  signIn: (payload: LoginPayload) => Promise<void>;
  signUp: (payload: SignupPayload) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const clearSession = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const loadUser = useCallback(async (activeToken: string) => {
    const currentUser = await apiRequest<AuthUser>("/api/users/me", { token: activeToken });
    setUser(currentUser);
  }, []);

  useEffect(() => {
    let mounted = true;

    const restore = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (savedToken) {
          const currentUser = await apiRequest<AuthUser>("/api/users/me", { token: savedToken });
          if (mounted) {
            setToken(savedToken);
            setUser(currentUser);
          }
        }
      } catch {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void restore();
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (payload: LoginPayload) => {
    const result = await apiRequest<{ token: string; user: AuthUser }>(
      "/api/auth/mobile-login",
      { method: "POST", body: JSON.stringify(payload) },
    );
    await SecureStore.setItemAsync(TOKEN_KEY, result.token);
    setToken(result.token);
    setUser(result.user);
  }, []);

  const signUp = useCallback(async (payload: SignupPayload) => {
    await apiRequest<{ id: string }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ ...payload, role: "BUYER" }),
    });
    await signIn({ email: payload.email, password: payload.password });
  }, [signIn]);

  const signOut = useCallback(async () => {
    await clearSession();
  }, [clearSession]);

  const refreshUser = useCallback(async () => {
    if (token) await loadUser(token);
  }, [loadUser, token]);

  const value = useMemo(
    () => ({ isLoading, token, user, signIn, signUp, signOut, refreshUser }),
    [isLoading, token, user, signIn, signUp, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
