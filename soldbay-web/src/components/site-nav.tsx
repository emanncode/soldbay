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
      className="relative z-50 w-full bg-[#0b0b10]"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center" aria-label="Soldbay home">
          <Image
            src="/logo.svg"
            alt="Soldbay"
            width={100}
            height={100}
            className="h-14 w-auto brightness-0 invert"
            priority
          />
        </Link>

        <nav className="flex items-center gap-4 sm:gap-8" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden text-sm font-medium text-text-tertiary transition-colors hover:text-white md:inline"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild variant="default" size="sm">
            <Link href="/join/buyer">Join Waitlist</Link>
          </Button>
        </nav>
      </div>
    </motion.header>
  )
}
