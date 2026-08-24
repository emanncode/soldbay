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
  universityId?: string;
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

export interface UserMeResponse {
  id: string;
  email: string;
  name: string;
  role: Role;
  universityId: string | null;
  level: string | null;
}

export function getMe() {
  return request<UserMeResponse>("GET", "/api/users/me");
}

export interface UpdateUserPayload {
  universityId?: string;
  level?: string;
}

export function updateUserProfile(payload: UpdateUserPayload) {
  return request<UserMeResponse>("PATCH", "/api/users/me", payload);
}

export interface SellerListing {
  id: string;
  title: string;
  price: string;
  images: string[];
  stock: number;
  status: string;
  createdAt: string;
  category: { name: string; slug: string };
}

export interface SellerMeResponse {
  sellerProfileId: string;
  username: string;
  name: string;
  walletBalance: string;
  verified: boolean;
  verifiedAt: string | null;
  idImageUrl: string | null;
  listings: SellerListing[];
}

export function getSellerMe() {
  return request<SellerMeResponse>("GET", "/api/sellers/me");
}

export interface PublicListing {
  id: string;
  sellerId: string;
  categoryId: string;
  title: string;
  description: string;
  price: string;
  images: string[];
  stock: number;
  status: string;
  createdAt: string;
  seller: { username: string; businessName: string | null };
  category: { name: string; slug: string };
}

export interface ListingPage {
  items: PublicListing[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function getListings(
  params: {
    categorySlug?: string;
    search?: string;
    cursor?: string;
    limit?: number;
  } = {},
) {
  const query = new URLSearchParams();
  if (params.categorySlug) query.set("category", params.categorySlug);
  if (params.search) query.set("search", params.search);
  if (params.cursor) query.set("cursor", params.cursor);
  if (params.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  return request<ListingPage>("GET", `/api/listings${qs ? `?${qs}` : ""}`);
}

export interface ListingDetail extends PublicListing {
  seller: PublicListing["seller"] & {
    user: { name: string; university: { name: string; code: string } | null };
  };
}

export function getListingById(id: string) {
  return request<ListingDetail>("GET", `/api/listings/${id}`);
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  commissionRate: string;
}

export function getCategories() {
  return request<Category[]>("GET", "/api/categories");
}

export async function uploadIdImage(uri: string): Promise<{ ok: boolean; idImageUrl: string }> {
  const token = await getToken();

  const filename = uri.split("/").pop() ?? "portal-screenshot.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const ext = match?.[1]?.toLowerCase() ?? "jpeg";
  const mimeType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  const formData = new FormData();

  if (typeof window !== "undefined" && typeof fetch !== "undefined") {
    // Web path: fetch the URI as a blob, then append as a File
    const response = await fetch(uri);
    const blob = await response.blob();
    const file = new File([blob], filename, { type: mimeType });
    formData.append("image", file);
  } else {
    // Native path: React-native style object works fine
    formData.append("image", { uri, name: filename, type: mimeType } as unknown as Blob);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/api/sellers/verify`);
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data);
        } else {
          reject(new ApiError(data.error ?? "Upload failed. Please try again.", xhr.status));
        }
      } catch {
        reject(new Error(`Server returned ${xhr.status} with no valid JSON body`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error: could not reach server"));
    };

    xhr.send(formData);
  });
}

/* ─── Listing creation ──────────────────────────────────── */

export interface CreateListingPayload {
  sellerId: string;
  categorySlug: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
}

export function createListing(payload: CreateListingPayload) {
  return request<{ id: string }>("POST", "/api/listings", payload);
}

export function deleteListing(id: string) {
  return request<{ ok: boolean }>("DELETE", `/api/listings/${id}`);
}

function buildNativeFormData(
  uri: string,
  field = "image",
): FormData {
  const filename = uri.split("/").pop() ?? "listing-photo.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const ext = match?.[1]?.toLowerCase() ?? "jpeg";
  const mimeType =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  const formData = new FormData();
  formData.append(
    field,
    { uri, name: filename, type: mimeType } as unknown as Blob,
  );

  return formData;
}

function postImage(
  endpoint: string,
  formData: FormData,
  token: string | null,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}${endpoint}`);
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data.url);
        } else {
          reject(
            new ApiError(
              data.error ?? "Image upload failed.",
              xhr.status,
            ),
          );
        }
      } catch {
        reject(
          new Error(`Server returned ${xhr.status} with no valid JSON body`),
        );
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error: could not reach server"));
    };

    xhr.send(formData);
  });
}

export async function uploadListingImages(
  uris: string[],
): Promise<string[]> {
  const token = await getToken();

  const uploads = uris.map((uri) => {
    const filename = uri.split("/").pop() ?? "listing-photo.jpg";

    if (typeof window !== "undefined" && typeof fetch !== "undefined") {
      // Web path: fetch the URI as a blob, then append as a File
      return (async () => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const mimeType =
          /\.png$/i.test(filename) ? "image/png" : /\.webp$/i.test(filename) ? "image/webp" : "image/jpeg";
        const formData = new FormData();
        formData.append("image", new File([blob], filename, { type: mimeType }));
        return postImage("/api/upload/listing-image", formData, token);
      })();
    }

    const formData = buildNativeFormData(uri);
    return postImage("/api/upload/listing-image", formData, token);
  });

  return Promise.all(uploads);
}
