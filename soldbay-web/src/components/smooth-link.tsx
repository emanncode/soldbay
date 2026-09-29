"use client"

import { useCallback } from "react"
import Link from "next/link"
import { useReducedMotion } from "framer-motion"
import type { ComponentProps } from "react"

/** Smooth-scroll to an element by id, respecting the fixed header offset. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: "smooth", block: "start" })
}

/**
 * Link that smooth-scrolls to an in-page section when the href carries a
 * `/#...` hash on the same route, instead of doing an instant jump.
 * Falls back to normal navigation for everything else.
 */
export function SmoothLink({
  href,
  onClick,
  children,
  ...props
}: ComponentProps<typeof Link>) {
  const reduceMotion = useReducedMotion()

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      let hash: string | undefined
      if (typeof href === "string") {
        const hashIndex = href.indexOf("#")
        if (hashIndex !== -1) hash = href.slice(hashIndex + 1)
      }
      if (hash && document.getElementById(hash)) {
        e.preventDefault()
        if (typeof href === "string") window.history.replaceState(null, "", href)
        if (reduceMotion) {
          document
            .getElementById(hash)
            ?.scrollIntoView({ behavior: "auto", block: "start" })
        } else {
          scrollToSection(hash)
        }
      }
      onClick?.(e)
    },
    [href, onClick, reduceMotion],
  )

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}