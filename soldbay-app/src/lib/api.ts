import { getToken } from "./auth-storage";

export const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  method: string,
  path: string,
  body?: object,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(await authHeaders()),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(
      data.error ?? "Something went wrong. Please try again.",
      res.status,
    );
  }

  return data as T;
}

export type Role = "BUYER" | "SELLER";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };
}

export function login(payload: LoginPayload) {
  return request<LoginResponse>("POST", "/api/auth/mobile-login", payload);
}

export interface SignupPayload {
  email: string;
  password: string;
  name: string;
  role: Role;
  universityId: string;
  level?: string;
}

export interface SignupResponse {
  id: string;
  email: string;
  role: Role;
  profileId?: string;
}

export function signup(payload: SignupPayload) {
  return request<SignupResponse>("POST", "/api/auth/signup", payload);
}

export interface SellerMeResponse {
  verified: boolean;
  verifiedAt: string | null;
  idImageUrl: string | null;
}

export function getSellerMe() {
  return request<SellerMeResponse>("GET", "/api/sellers/me");
}

export async function uploadIdImage(uri: string): Promise<{ ok: boolean; idImageUrl: string }> {
  const token = await getToken();

  const formData = new FormData();
  const filename = uri.split("/").pop() ?? "id-photo.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const ext = match?.[1]?.toLowerCase() ?? "jpeg";
  const mimeType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  formData.append("image", {
    uri,
    name: filename,
    type: mimeType,
  } as unknown as Blob);

  const res = await fetch(`${BASE_URL}/api/sellers/verify`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(
      data.error ?? "Upload failed. Please try again.",
      res.status,
    );
  }

  return data;
}
