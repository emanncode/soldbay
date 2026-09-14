"use client"

import { motion, useReducedMotion } from "framer-motion"
import { BadgeCheck, Lock, Smartphone } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import {
  fadeUpVariants,
  scaleInVariants,
  scrollViewport,
  staggerCardVariants,
} from "@/lib/motion"

const reasons = [
  {
    icon: BadgeCheck,
    title: "Verified students, only",
    desc: "Every seller signs up with their student matric number and is verified before any listing goes live. You know exactly who you're dealing with.",
  },
  {
    icon: Lock,
    title: "Your money stays safe",
    desc: "Payment goes to Soldbay, never straight to the seller. If the handoff never happens, the money is returned to you.",
  },
  {
    icon: Smartphone,
    title: "PIN-confirmed handoff",
    desc: "At pickup you confirm receipt with a 4-digit PIN before the seller gets paid. Nothing is released without your say-so.",
  },
]

const chips = ["No send-and-block", "No stranger meetups", "No release without you"]

export function WhySoldbay() {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatedSection className="dark bg-background scroll-mt-20 py-24 md:scroll-mt-24 md:py-32" id="why">
      <div className="container-page">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={scrollViewport}
            className="flex flex-col items-start lg:sticky lg:top-28"
          >
            <motion.div
              variants={fadeUpVariants}
              className="flex items-center gap-3"
            >
              <span className="h-0.5 w-10 bg-accent" aria-hidden />
              <p className="text-caption font-semibold uppercase tracking-widest text-accent">
                The difference
              </p>
              <span className="h-0.5 w-10 bg-accent" aria-hidden />
            </motion.div>
            <motion.h2
              variants={fadeUpVariants}
              className="mt-6 font-display text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl"
            >
              Why not just another WhatsApp or Jiji deal?
            </motion.h2>
            <motion.p
              variants={fadeUpVariants}
              className="mt-6 max-w-xl text-base leading-normal text-foreground/60"
            >
              Most campus deals run on trust-me vibes: send the money, hope the
              seller shows up, hope the item works. Soldbay turns that trust
              into an actual system. Verified students, money held safely until
              pickup, and a handoff you confirm yourself with a PIN.
            </motion.p>
            <motion.div
              variants={scaleInVariants}
              className="mt-8 flex flex-wrap gap-2.5"
            >
              {chips.map((t) => (
                <span
                  key={t}
                  className="inline-flex h-8 items-center rounded-full border border-accent px-4 text-caption font-medium text-foreground"
                >
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <div className="flex flex-col gap-4">
            {reasons.map((reason, i) => (
              <motion.div
                key={reason.title}
                custom={i}
                initial={reduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={scrollViewport}
                variants={staggerCardVariants}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 will-change-transform"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <reason.icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {reason.title}
                  </h3>
                </div>
                <p className="text-sm leading-normal text-foreground/50">
                  {reason.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}