"use client"

import Link from "next/link"
import { AnimatedSection } from "@/components/animated-section"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { scaleInVariants, scrollViewport } from "@/lib/motion"
import { getWaitlistProof } from "@/lib/waitlist-proof"

type SocialProofProps = {
  count?: number
}

export function SocialProof({ count = 0 }: SocialProofProps) {
  const reduceMotion = useReducedMotion()
  const proof = getWaitlistProof(count)
  const isEmpty = count <= 0

  return (
    <AnimatedSection className="py-16 md:py-24">
      <div className="container-page max-w-3xl">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={scrollViewport}
          variants={scaleInVariants}
          className="glass-panel-strong rounded-3xl px-8 py-12 text-center sm:px-12 will-change-transform"
        >
          <p className="font-display text-[clamp(2.75rem,8vw,5rem)] font-bold leading-none text-brand-light md:text-[80px]">
            {proof.headline}
          </p>
          <p className="mt-4 font-display text-heading-m text-white">{proof.title}</p>
          <p className="mt-4 text-body-m text-white/55">{proof.subtitle}</p>

          {isEmpty ? (
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild variant="glass-primary" size="lg" className="font-semibold">
                <Link href="/join/buyer">Be the first buyer</Link>
              </Button>
              <Button asChild variant="glass" size="lg" className="font-semibold">
                <Link href="/join/seller">Be the first seller</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8">
              <Button asChild variant="glass" size="lg" className="font-semibold">
                <Link href="/join/buyer">Join the waitlist</Link>
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatedSection>
  )
}
