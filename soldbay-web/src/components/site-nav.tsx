"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { soldbayEase } from "@/lib/motion"

const links = [
  { href: "/join/buyer", label: "Buyers" },
  { href: "/join/seller", label: "Sellers" },
  { href: "/#faq", label: "FAQ" },
] as const

export function SiteNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: soldbayEase }}
      className="fixed top-0 right-0 left-0 z-50 w-full bg-transparent"
    >
      {/* py-16px, gutters 16/24 — 8-pt */}
      <div className="container-page max-w-7xl py-4">
        <div className="glass-nav flex items-center justify-between rounded-full px-4 py-2 sm:px-6 sm:py-2">
          <Link href="/" className="flex items-center" aria-label="Soldbay home">
            <Image
              src="/logo.svg"
              alt="Soldbay"
              width={180}
              height={72}
              className="h-14 w-auto brightness-0 invert sm:h-16"
              priority
            />
          </Link>

          <nav className="flex items-center gap-4 sm:gap-8" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hidden cursor-pointer text-sm font-medium text-white/70 transition-colors hover:text-white md:inline"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild variant="glass-primary" size="sm">
              <Link href="/join/buyer">Join Waitlist</Link>
            </Button>
          </nav>
        </div>
      </div>
    </motion.header>
  )
}
