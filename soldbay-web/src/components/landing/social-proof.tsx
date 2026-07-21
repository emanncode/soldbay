"use client"

import { AnimatedSection } from "@/components/animated-section"
import { motion } from "framer-motion"
import { soldbayEase } from "@/lib/motion"

export function SocialProof() {
  return (
    <AnimatedSection className="bg-surface py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: soldbayEase }}
          className="font-display text-[64px] font-bold leading-[1] text-brand-start md:text-[80px]"
        >
          2,847+
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: soldbayEase }}
          className="mt-2 font-display text-heading-m text-text-primary"
        >
          students already joined
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: soldbayEase }}
          className="mt-3 text-body-m text-text-secondary"
        >
          From universities across Nigeria — waiting for Soldbay to launch on their campus.
        </motion.p>
      </div>
    </AnimatedSection>
  )
}
