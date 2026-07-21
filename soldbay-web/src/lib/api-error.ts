/**
 * Maps HTTP status codes / network failures to user-facing error display data.
 * Used by ErrorMessage and any form that talks to the API.
 */

export type ErrorVariant =
  | "validation" // 400
  | "unauthorized" // 401
  | "forbidden" // 403
  | "notFound" // 404
  | "conflict" // 409
  | "server" // 5xx / cold start
  | "network" // fetch failed
  | "unknown"

export type AppError = {
  /** Visual + semantic type */
  variant: ErrorVariant
  /** HTTP status when known */
  status?: number
  /** Short heading */
  title: string
  /** Body copy for the user */
  message: string
  /** Whether the user should retry the same action */
  retryable: boolean
  /** Small badge label e.g. "500" */
  codeLabel?: string
}

const SERVER_GENERIC =
  "Something went wrong on our side. This can happen when the database is waking up — please wait a moment and try again."

export function appErrorFromStatus(
  status: number,
  serverMessage?: string,
): AppError {
  switch (status) {
    case 400:
      return {
        variant: "validation",
        status: 400,
        title: "Check your details",
        message: serverMessage || "Some fields are missing or invalid.",
        retryable: false,
        codeLabel: "400",
      }
    case 401:
      return {
        variant: "unauthorized",
        status: 401,
        title: "Sign in required",
        message: serverMessage || "You need to be signed in to continue.",
        retryable: false,
        codeLabel: "401",
      }
    case 403:
      return {
        variant: "forbidden",
        status: 403,
        title: "Access denied",
        message:
          serverMessage || "You don’t have permission to do that with this account.",
        retryable: false,
        codeLabel: "403",
      }
    case 404:
      return {
        variant: "notFound",
        status: 404,
        title: "Not found",
        message: serverMessage || "We couldn’t find what you were looking for.",
        retryable: false,
        codeLabel: "404",
      }
    case 409:
      return {
        variant: "conflict",
        status: 409,
        title: "Already registered",
        message: serverMessage || "This email is already on the list.",
        retryable: false,
        codeLabel: "409",
      }
    default:
      if (status >= 500) {
        return {
          variant: "server",
          status,
          title: "Server busy — please retry",
          message: isGenericServerMessage(serverMessage)
            ? SERVER_GENERIC
            : serverMessage || SERVER_GENERIC,
          retryable: true,
          codeLabel: String(status),
        }
      }
      return {
        variant: "unknown",
        status,
        title: "Something went wrong",
        message: serverMessage || "Please try again in a moment.",
        retryable: true,
        codeLabel: status ? String(status) : undefined,
      }
  }
}

export function appErrorFromNetwork(): AppError {
  return {
    variant: "network",
    title: "Connection problem",
    message:
      "We couldn’t reach Soldbay. Check your internet connection, then try again.",
    retryable: true,
    codeLabel: "NET",
  }
}

/**
 * Parse a failed fetch Response into an AppError.
 * Prefer this over reading res.json() only for message text.
 */
export async function appErrorFromResponse(res: Response): Promise<AppError> {
  let serverMessage: string | undefined
  try {
    const data = (await res.json()) as { error?: string }
    if (typeof data?.error === "string" && data.error.trim()) {
      serverMessage = data.error.trim()
    }
  } catch {
    // non-JSON body
  }
  return appErrorFromStatus(res.status, serverMessage)
}

function isGenericServerMessage(msg?: string): boolean {
  if (!msg) return true
  const normalized = msg.toLowerCase()
  return (
    normalized.includes("something went wrong") ||
    normalized.includes("please try again") ||
    normalized.includes("internal server")
  )
}
