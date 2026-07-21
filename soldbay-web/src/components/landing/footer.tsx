"use client"

import Link from "next/link"
import Image from "next/image"
import { AnimatedSection } from "@/components/animated-section"

export function Footer() {
  return (
    <AnimatedSection className="bg-[#0b0b10] py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          {/* Brand */}
          <div className="flex max-w-xs flex-col gap-3">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Soldbay"
                width={100}
                height={50}
                className="h-7 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-body-s text-text-tertiary">The student marketplace.</p>
            <p className="text-caption text-text-tertiary">
              &copy; {new Date().getFullYear()} Soldbay. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <span className="text-body-s font-semibold text-white">For Students</span>
              <Link
                href="/join/buyer"
                className="text-body-s text-text-tertiary transition-colors hover:text-white"
              >
                Join as Buyer
              </Link>
              <Link
                href="/join/seller"
                className="text-body-s text-text-tertiary transition-colors hover:text-white"
              >
                Become a Seller
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-body-s font-semibold text-white">Company</span>
              <span className="text-body-s text-text-tertiary">Privacy Policy</span>
              <span className="text-body-s text-text-tertiary">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
