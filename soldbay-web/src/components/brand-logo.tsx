import { cn } from "@/lib/utils"

type BrandLogoProps = {
  /** Fill color — "primary" (dark olive) for light surfaces, "inverted" (cream) for dark. */
  variant?: "primary" | "inverted"
  /** Full lockup — includes the tan accent dot right of the wordmark. */
  showDot?: boolean
  className?: string
}

const FILL = {
  primary: "#2D3A1F",
  inverted: "#F4F1E8",
} as const

/**
 * Soldbay wordmark — "Soldbay" set in Fraunces Medium, matching the finalized
 * brand asset in `/public/soldbay-logo-*.svg` (weight 500, letter-spacing -0.02em,
 * tan accent dot in the full lockup).
 *
 * Rendered inline rather than via `<img>`/`next/image` because web fonts don't
 * load inside SVG-as-image — inlining lets the wordmark inherit the self-hosted
 * Fraunces that `next/font` already loads, so it renders identically every time.
 */
export function BrandLogo({
  variant = "primary",
  showDot = true,
  className,
}: BrandLogoProps) {
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