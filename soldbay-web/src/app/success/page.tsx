"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { soldbayEase } from "@/lib/motion"
import Link from "next/link"

export default function SuccessPage() {
  return (
    <div className="flex min-h-[calc(100vh-5.5rem)] flex-col bg-[#0b0b10]">
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: soldbayEase }}
          className="flex w-full max-w-[520px] flex-col items-center rounded-[24px] bg-white px-8 py-16 text-center shadow-lg md:px-12"
        >
          {/* Checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: soldbayEase }}
            className="mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-success"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M20 6L9 17l-5-5"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          <h1 className="font-display text-display-m text-text-primary">
            You&rsquo;re on the list!
          </h1>
          <p className="mt-3 text-body-m text-text-secondary leading-relaxed">
            We&rsquo;ll notify you when Soldbay launches on your campus. Hang tight &mdash;
            we&rsquo;ll be there soon.
          </p>

          <div className="my-8 h-px w-full bg-border" />

          <p className="text-body-s font-semibold text-text-primary">Tell your campus friends</p>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5z" fill="#16a34a" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9.4 4.1 0 0 .1-.9.3-2.1.5-2.6 2.7-4.8 5.3-5.1 2.6-.3 5.1.8 6 3.1z" fill="#2563eb" />
              </svg>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-start/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="4" fill="#5b3df0" />
                <path d="M16 8l-6 6-3-3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <Button asChild variant="outline" size="default" className="mt-8 w-full">
            <Link href="/">Back to homepage</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
