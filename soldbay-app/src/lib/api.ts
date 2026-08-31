import { getToken, saveToken, clearToken } from "./auth-storage";

export { getToken, saveToken, clearToken };
export const setToken = saveToken;
export const removeToken = clearToken;

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
  avatar?: string | null;
}

export function getMe() {
  return request<UserMeResponse>("GET", "/api/users/me");
}

export interface UpdateUserPayload {
  universityId?: string;
  level?: string;
  role?: Role;
  name?: string;
}

export function updateUserProfile(payload: UpdateUserPayload) {
  return request<UserMeResponse>("PATCH", "/api/users/me", payload);
}

export function deleteAccount() {
  return request<{ ok: boolean; message: string }>("DELETE", "/api/users/me");
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
  verificationStatus?: string;
  rejectionReason?: string | null;
  verificationAttempts?: number;
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

export interface University {
  id: string;
  name: string;
  code: string;
}

export function getUniversities() {
  return request<University[]>("GET", "/api/universities");
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

/* ─── Password Reset Flow ───────────────────────────────── */

export interface ForgotPasswordResponse {
  ok: boolean;
  message: string;
  devOtp?: string;
}

export function forgotPassword(email: string) {
  return request<ForgotPasswordResponse>("POST", "/api/auth/forgot-password", { email });
}

export function verifyOtp(email: string, otp: string) {
  return request<{ ok: boolean; valid: boolean }>("POST", "/api/auth/verify-otp", { email, otp });
}

export function resetPassword(payload: { email: string; otp: string; newPassword: string }) {
  return request<{ ok: boolean; message: string }>("POST", "/api/auth/reset-password", payload);
}

/* ─── Listing Drafts ────────────────────────────────────── */

export interface DraftListing {
  id: string;
  title: string;
  description: string;
  price: number | null;
  categoryId: string | null;
  category?: { id: string; name: string; slug: string } | null;
  images: string[];
  draftStep: number;
  updatedAt: string;
}

export function createDraft() {
  return request<{ ok: boolean; id: string; draftStep: number }>("POST", "/api/listings/drafts");
}

export function getDraft(id: string) {
  return request<DraftListing>("GET", `/api/listings/drafts/${id}`);
}

export function getDrafts() {
  return request<{ drafts: DraftListing[] }>("GET", "/api/listings/drafts");
}

export function deleteDraft(id: string) {
  return request<{ ok: boolean }>("DELETE", `/api/listings/drafts/${id}`);
}

export function patchDraft(id: string, payload: Partial<DraftListing> & { categorySlug?: string }) {
  return request<{ ok: boolean; id: string; draftStep: number; updatedAt: string }>(
    "PATCH",
    `/api/listings/drafts/${id}`,
    payload
  );
}

export function publishDraft(id: string) {
  return request<{ ok: boolean; id: string; status: string }>(
    "POST",
    `/api/listings/drafts/${id}/publish`
  );
}

/* ─── Orders & Escrow ───────────────────────────────────── */

export interface OrderItem {
  id: string;
  orderNumber: string;
  title: string;
  amount: number;
  status: string;
  date: string;
  sellerUsername: string;
  thumbnail: string | null;
  isBuyer: boolean;
}

export function getOrders() {
  return request<{ orders: OrderItem[] }>("GET", "/api/orders");
}

export interface OrderDetailResponse {
  id: string;
  orderNumber: string;
  title: string;
  description: string;
  amount: number;
  status: string;
  pickupLocation: string;
  images: string[];
  category?: { name: string; slug: string };
  createdAt: string;
  updatedAt: string;
  sellerUsername: string;
  isBuyer: boolean;
  isSeller: boolean;
  sellerPin?: string;
  dispute?: {
    id: string;
    reason: string;
    status: string;
    resolution: string | null;
    resolutionNotes: string | null;
  } | null;
}

export function getOrderDetail(id: string) {
  return request<OrderDetailResponse>("GET", `/api/orders/${id}`);
}

export function checkoutOrder(payload: { listingId: string; pickupLocation: string }) {
  return request<{
    ok: boolean;
    orderId: string;
    orderNumber: string;
    amount: number;
    status: string;
    authorizationUrl: string;
  }>("POST", "/api/orders/checkout", payload);
}

export function verifyOrderPin(orderId: string, pin: string) {
  return request<{ ok: boolean; id: string; status: string }>(
    "POST",
    `/api/orders/${orderId}/verify-pin`,
    { pin }
  );
}

export function confirmOrderReceipt(orderId: string) {
  return request<{ ok: boolean; id: string; status: string }>(
    "POST",
    `/api/orders/${orderId}/confirm-receipt`
  );
}

export function disputeOrder(orderId: string, reason: string) {
  return request<{ ok: boolean; disputeId: string; status: string }>(
    "POST",
    `/api/orders/${orderId}/dispute`,
    { reason }
  );
}
