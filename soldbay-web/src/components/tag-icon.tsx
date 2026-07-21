import { cn } from "@/lib/utils"

interface TagIconProps {
  className?: string
  size?: number
  fill?: string
}

export function TagIcon({ className, size = 24, fill = "currentColor" }: TagIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d="M2 3h12.5a1.5 1.5 0 0 1 1.06.44l6.5 6.5a1.5 1.5 0 0 1 0 2.12l-8 8a1.5 1.5 0 0 1-2.12 0l-6.5-6.5A1.5 1.5 0 0 1 5 12.5V3z"
        fill={fill}
        stroke={fill}
        strokeWidth="0.5"
        rx="3"
      />
      <circle cx="9" cy="7" r="1.5" fill="currentColor" />
    </svg>
  )
}

export function TagBadgeIcon({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <rect x="2" y="4" width="24" height="28" rx="6" fill="url(#tag-gradient)" />
      <circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.3" />
      <defs>
        <linearGradient id="tag-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="var(--color-brand-start)" />
          <stop offset="1" stopColor="var(--color-brand-end)" />
        </linearGradient>
      </defs>
    </svg>
  )
}
