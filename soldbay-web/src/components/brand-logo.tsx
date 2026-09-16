import { cn } from "@/lib/utils"

export type BrandLogoProps = {
  /** Fill color / variant. */
  variant?: "primary" | "inverted" | "mark" | "mark-inverted"
  /** Full lockup — includes the tan accent dot right of the wordmark. */
  showDot?: boolean
  className?: string
}

const FILL = {
  primary: "#2D3A1F",
  inverted: "#F4F1E8",
  mark: "#2D3A1F",
  "mark-inverted": "#F4F1E8",
} as const

/**
 * Standalone Soldbay Mark ("S." signature logo icon)
 * Source: design/design.pen (EXPORT — iOS Icon & Android Foreground)
 */
export function BrandIcon({
  variant = "primary",
  className,
  size = 40,
}: {
  variant?: "primary" | "inverted"
  className?: string
  size?: number
}) {
  const isDark = variant === "inverted"
  const bg = isDark ? "#2D3A1F" : "#F4F1E8"
  const glyphFill = isDark ? "#F4F1E8" : "#2D3A1F"

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn("rounded-2xl shrink-0 overflow-hidden", className)}
      role="img"
      aria-label="Soldbay Mark"
      fill="none"
    >
      <rect width="100" height="100" rx="22" fill={bg} />
      <text
        x="19"
        y="68"
        fill={glyphFill}
        fontSize="58"
        fontWeight="600"
        letterSpacing="-0.03em"
        style={{ fontFamily: "var(--font-serif, Fraunces, serif)" }}
      >
        S
      </text>
      <circle cx="58" cy="68" r="3.6" fill="#B8A678" />
    </svg>
  )
}

/**
 * Soldbay wordmark & brand logo.
 *
 * Supports both full wordmark lockup ("Soldbay." in Fraunces 500)
 * and signature mark ("S." in Fraunces 600) matching design/design.pen.
 */
export function BrandLogo({
  variant = "primary",
  showDot = true,
  className,
}: BrandLogoProps) {
  if (variant === "mark") {
    return <BrandIcon variant="primary" className={className} />
  }

  if (variant === "mark-inverted") {
    return <BrandIcon variant="inverted" className={className} />
  }

  return (
    <svg
      viewBox={showDot ? "0 0 360 100" : "0 0 440 100"}
      className={cn("h-10 w-auto", className)}
      role="img"
      aria-label="Soldbay"
      fill="none"
    >
      <text
        x="0"
        y="76"
        fill={FILL[variant]}
        fontSize="72"
        fontWeight="500"
        letterSpacing="-0.02em"
        style={{ fontFamily: "var(--font-serif, Fraunces, serif)" }}
      >
        Soldbay
      </text>
      {showDot && <circle cx="279" cy="22" r="5" fill="#B8A678" />}
    </svg>
  )
}