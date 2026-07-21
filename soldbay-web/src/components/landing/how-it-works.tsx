"use client"

import { motion, useReducedMotion } from "framer-motion"
import { AnimatedSection } from "@/components/animated-section"
import { TagIcon } from "@/components/tag-icon"
import { fadeUpVariants, scrollViewport, staggerCardVariants } from "@/lib/motion"

const steps = [
  {
    num: "01",
    title: "Join the waitlist",
    desc: "Sign up as a buyer or seller in under a minute. No fees, no commitments.",
  },
  {
    num: "02",
    title: "Get notified at launch",
    desc: "We'll email you the moment your campus goes live. Be first in.",
  },
  {
    num: "03",
    title: "Start buying or selling",
    desc: "Browse listings or post your own. Campus commerce, made simple.",
  },
]

export function HowItWorks() {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatedSection className="py-24 md:py-32">
      <div className="container-page">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={scrollViewport}
          className="mb-16 text-center"
        >
          <motion.h2
            variants={fadeUpVariants}
            className="font-display text-display-m text-white md:text-display-l"
          >
            How it works
          </motion.h2>
          <motion.p variants={fadeUpVariants} className="mt-4 text-body-m text-white/55">
            Three simple steps to get started on Soldbay.
          </motion.p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              custom={i}
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={scrollViewport}
              variants={staggerCardVariants}
              className="glass-panel flex flex-col gap-4 rounded-3xl p-8 will-change-transform"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-linear-to-br from-brand-start/90 to-brand-end/90 shadow-[0_0_20px_rgb(91_61_240/0.35)]">
                  <TagIcon size={18} fill="#ffffff" />
                </div>
                <span className="font-display text-[32px] font-bold leading-none text-brand-light">
                  {step.num}
                </span>
              </div>
              <h3 className="font-display text-heading-s text-white">{step.title}</h3>
              <p className="text-body-s text-white/55">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
