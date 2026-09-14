"use client"

import { ArrowRight } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SmoothLink } from "@/components/smooth-link"
import { fadeUpVariants, scaleInVariants, scrollViewport } from "@/lib/motion"
import { getWaitlistProof } from "@/lib/waitlist-proof"

type SocialProofProps = {
  count?: number
}

export function SocialProof({ count = 0 }: SocialProofProps) {
  const reduceMotion = useReducedMotion()
  const proof = getWaitlistProof(count)

  return (
    <AnimatedSection className="border-t border-border py-20 md:py-28">
      <div className="container-page">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={scrollViewport}
          className="flex flex-col items-center gap-3"
        >
          <motion.div variants={fadeUpVariants} className="flex items-center gap-3">
            <span className="h-0.5 w-10 bg-accent" aria-hidden />
            <p className="text-caption font-semibold uppercase tracking-widest text-secondary">
              In early access
            </p>
          </motion.div>

          <div className="mt-10 flex w-full flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-12">
            <motion.div
              variants={fadeUpVariants}
              className="flex shrink-0 flex-col gap-2"
            >
              <p className="font-display text-6xl font-medium leading-none tracking-tight text-foreground md:text-8xl">
                {proof.headline}
              </p>
              <p className="text-sm font-medium text-secondary">
                on the waitlist
              </p>
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              className="flex min-w-0 flex-1 flex-col gap-3 text-center lg:px-2 lg:text-left"
            >
              <h2 className="font-display text-3xl font-medium leading-tight text-foreground md:text-5xl">
                Join them as Soldbay launches, campus by campus, across
                Nigeria.
              </h2>
              <p className="text-sm leading-normal text-primary/60">
                Sign up now and we&rsquo;ll email you the moment your campus goes
                live. You&rsquo;ll be first in.
              </p>
            </motion.div>

            <motion.div variants={scaleInVariants} className="shrink-0">
              <Button
                asChild
                className="h-14 rounded-full px-8 font-semibold"
              >
                <SmoothLink href="/#join">
                  Join the waitlist
                  <ArrowRight className="size-4" aria-hidden />
                </SmoothLink>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  )
}