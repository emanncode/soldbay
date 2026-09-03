import {
  getToken,
  saveToken,
  clearToken,
  saveLastActiveMode,
  getLastActiveMode,
  type ActiveMode,
} from "./auth-storage";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

export {
  getToken,
  saveToken,
  clearToken,
  saveLastActiveMode,
  getLastActiveMode,
  type ActiveMode,
};
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

export class NetworkError extends Error {
  constructor(message = "No internet connection. Please check your network and try again.") {
    super(message);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends Error {
  constructor(message = "The server took too long to respond. Please try again.") {
    super(message);
    this.name = "TimeoutError";
  }
}

const REQUEST_TIMEOUT_MS = 20_000;

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Turn a server error response into the clearest possible plain-language message.
 * Prefers the structured `error` field (or nested message) returned by the API,
 * and falls back to a specific message derived from HTTP status when the server
 * did not provide one.
 */
function messageFromResponse(status: number, data: unknown): string {
  if (data && typeof data === "object") {
    const body = data as Record<string, unknown>;
    const candidate =
      typeof body.error === "string"
        ? body.error
        : typeof body.message === "string"
          ? body.message
          : undefined;
    if (candidate) return candidate;
  }

  switch (status) {
    case 400:
      return "The request couldn't be processed. Please check the details you entered and try again.";
    case 401:
      return "You're not signed in or your session has expired. Please sign in again.";
    case 403:
      return "You don't have permission to do this.";
    case 404:
      return "We couldn't find what you were looking for. It may have been removed.";
    case 409:
      return "This record already exists. Please use different details.";
    case 429:
      return "You've made too many requests. Please wait a moment and try again.";
    default:
      return "Something unexpected happened on our end. Please try again in a moment.";
  }
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

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new TimeoutError();
    }
    throw new NetworkError();
  } finally {
    clearTimeout(timer);
  }

  let data: unknown = {};
  try {
    data = await res.json();
  } catch {
    // Non-JSON body (e.g. proxy/gateway errors). Rely on status-based message.
  }

  if (!res.ok) {
    throw new ApiError(messageFromResponse(res.status, data), res.status);
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
  businessName?: string;
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
    formData.append("image", { uri: await compressImageUri(uri), name: filename, type: "image/jpeg" } as unknown as Blob);
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

export function updateListing(
  id: string,
  payload: {
    title?: string;
    description?: string;
    price?: number;
    images?: string[];
    categorySlug?: string;
    stock?: number;
  },
) {
  return request<{
    ok: boolean;
    id: string;
    title: string | null;
    price: number | null;
    status: string;
  }>("PATCH", `/api/listings/${id}`, payload);
}

const MAX_IMAGE_EDGE = 1600;
const IMAGE_QUALITY = 0.75;

/**
 * Downscale and compress a locally-picked image before upload. Shrinking the
 * long edge to ~1600px and re-encoding as JPEG greatly reduces both the upload
 * payload and the stored file, so listing images load faster for buyers.
 *
 * Runs on native only (the web path keeps the original blob, where the browser
 * already applies its own encoding). Returns the original URI if the platform
 * doesn't support manipulation.
 */
async function compressImageUri(uri: string): Promise<string> {
  if (typeof document !== "undefined") {
    return uri;
  }

  try {
    const context = ImageManipulator.manipulate(uri);
    context.resize({ width: MAX_IMAGE_EDGE });
    const image = await context.renderAsync();
    const result = await image.saveAsync({
      format: SaveFormat.JPEG,
      compress: IMAGE_QUALITY,
    });
    context.release();
    image.release();
    return result.uri;
  } catch {
    // If compression fails for any reason, fall back to the original file.
    return uri;
  }
}

function buildNativeFormData(
  uri: string,
  field = "image",
): FormData {
  const filename = uri.split("/").pop() ?? "listing-photo.jpg";
  const mimeType = "image/jpeg";

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

  const uploads = uris.map(async (uri) => {
    const filename = uri.split("/").pop() ?? "listing-photo.jpg";

    if (typeof window !== "undefined" && typeof fetch !== "undefined") {
      // Web path: fetch the URI as a blob, then append as a File
      const response = await fetch(uri);
      const blob = await response.blob();
      const mimeType =
        /\.png$/i.test(filename) ? "image/png" : /\.webp$/i.test(filename) ? "image/webp" : "image/jpeg";
      const formData = new FormData();
      formData.append("image", new File([blob], filename, { type: mimeType }));
      return postImage("/api/upload/listing-image", formData, token);
    }

    const compressedUri = await compressImageUri(uri);
    const formData = buildNativeFormData(compressedUri);
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
  pinShownAt?: string | null;
  pinExpiresAt?: string | null;
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

export function revealOrderPin(orderId: string) {
  return request<{
    ok: boolean;
    id: string;
    status: string;
    pinShownAt: string | null;
    pinExpiresAt: string | null;
    expiresInSeconds: number;
  }>("POST", `/api/orders/${orderId}/reveal-pin`);
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

/* ─── Wallet ─────────────────────────────────────────────── */

export type WalletTransactionType =
  | "ESCROW_HOLD"
  | "ESCROW_RELEASE"
  | "REFUND"
  | "PAYOUT";

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  orderId: string | null;
  createdAt: string;
}

export interface WalletResponse {
  role: "SELLER" | "BUYER";
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
}

export function getWallet() {
  return request<WalletResponse>("GET", "/api/wallet");
}

