import { cn } from "@/lib/utils"

/**
 * Shared landing-style shell: light editorial atmosphere (cream + olive/tan
 * washes) defined in globals.css. Used by home, join, and success.
 */
export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("page-atmosphere-light relative min-h-screen text-foreground", className)}>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
