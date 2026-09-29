"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import type { AppError, ErrorVariant } from "@/lib/api-error"

const errorMessageVariants = cva(
  "flex w-full gap-4 rounded-xl border px-4 py-4 text-left shadow-sm",
  {
    variants: {
      variant: {
        /** 400 — amber */
        validation:
          "border-amber-300 bg-amber-50 text-amber-950 [&_[data-slot=error-badge]]:bg-amber-200 [&_[data-slot=error-badge]]:text-amber-900 [&_[data-slot=error-icon]]:text-amber-600",
        /** 401 — orange */
        unauthorized:
          "border-orange-300 bg-orange-50 text-orange-950 [&_[data-slot=error-badge]]:bg-orange-200 [&_[data-slot=error-badge]]:text-orange-900 [&_[data-slot=error-icon]]:text-orange-600",
        /** 403 — deep orange / rose */
        forbidden:
          "border-rose-300 bg-rose-50 text-rose-950 [&_[data-slot=error-badge]]:bg-rose-200 [&_[data-slot=error-badge]]:text-rose-900 [&_[data-slot=error-icon]]:text-rose-600",
        /** 404 — blue (info) */
        notFound:
          "border-sky-300 bg-sky-50 text-sky-950 [&_[data-slot=error-badge]]:bg-sky-200 [&_[data-slot=error-badge]]:text-sky-900 [&_[data-slot=error-icon]]:text-sky-600",
        /** 409 — brand purple */
        conflict:
          "border-violet-300 bg-violet-50 text-violet-950 [&_[data-slot=error-badge]]:bg-violet-200 [&_[data-slot=error-badge]]:text-violet-900 [&_[data-slot=error-icon]]:text-violet-600",
        /** 5xx / cold start — red */
        server:
          "border-red-300 bg-red-50 text-red-950 [&_[data-slot=error-badge]]:bg-red-200 [&_[data-slot=error-badge]]:text-red-900 [&_[data-slot=error-icon]]:text-red-600",
        /** Network offline — slate */
        network:
          "border-slate-300 bg-slate-100 text-slate-950 [&_[data-slot=error-badge]]:bg-slate-300 [&_[data-slot=error-badge]]:text-slate-900 [&_[data-slot=error-icon]]:text-slate-600",
        /** Fallback */
        unknown:
          "border-zinc-300 bg-zinc-100 text-zinc-950 [&_[data-slot=error-badge]]:bg-zinc-300 [&_[data-slot=error-badge]]:text-zinc-900 [&_[data-slot=error-icon]]:text-zinc-600",
      },
    },
    defaultVariants: {
      variant: "unknown",
    },
  },
)

function ErrorIcon({ variant }: { variant: ErrorVariant }) {
  const common = "mt-0.5 size-5 shrink-0"
  // Simple inline SVGs — no extra icon package dependency beyond what’s already used
  if (variant === "server" || variant === "network") {
    return (
      <svg
        data-slot="error-icon"
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (variant === "notFound") {
    return (
      <svg
        data-slot="error-icon"
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path
          d="M21 21l-4.3-4.3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  return (
    <svg
      data-slot="error-icon"
      className={common}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 8v5m0 3h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export type ErrorMessageProps = {
  error: AppError
  className?: string
  /** Optional dismiss / clear */
  onDismiss?: () => void
} & VariantProps<typeof errorMessageVariants>

export function ErrorMessage({ error, className, onDismiss }: ErrorMessageProps) {
  const variant = error.variant

  return (
    <div
      role="alert"
      aria-live="polite"
      data-slot="error-message"
      data-variant={variant}
      className={cn(errorMessageVariants({ variant }), className)}
    >
      <ErrorIcon variant={variant} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold leading-snug">{error.title}</p>
          {error.codeLabel ? (
            <span
              data-slot="error-badge"
              className="inline-flex items-center rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide uppercase"
            >
              {error.codeLabel}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-body-s leading-relaxed opacity-90">{error.message}</p>
        {error.retryable ? (
          <p className="mt-2 text-xs font-medium opacity-80">
            Tap the button below to try again.
          </p>
        ) : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 cursor-pointer rounded-md px-1.5 py-0.5 text-xs font-medium opacity-60 transition-opacity hover:opacity-100"
          aria-label="Dismiss error"
        >
          ✕
        </button>
      ) : null}
    </div>
  )
}

export { errorMessageVariants }
