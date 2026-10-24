export interface ApiErrorPayload {
  error?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("The app API URL is not configured.");
  }

  const { token, headers, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);

  if (requestOptions.body && !(requestOptions.body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...requestOptions,
      headers: requestHeaders,
    });
  } catch {
    throw new Error("Could not connect to Soldbay. Check your connection and try again.");
  }

  const payload = (await response.json().catch(() => ({}))) as T & ApiErrorPayload;
  if (!response.ok) {
    throw new ApiError(payload.error || "Something went wrong. Please try again.", response.status);
  }

  return payload;
}
