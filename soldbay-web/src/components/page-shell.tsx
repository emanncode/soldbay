import { cn } from "@/lib/utils"

/**
 * Shared landing-style shell: fixed brand atmosphere + grain.
 * Used by home, join, and success so every public page matches.
 */
export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("page-atmosphere relative min-h-screen", className)}>
      <div className="page-noise" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
