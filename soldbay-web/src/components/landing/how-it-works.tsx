"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Package, Lock, BadgeCheck } from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import {
  fadeUpVariants,
  scrollViewport,
  staggerCardVariants,
} from "@/lib/motion";

const steps = [
  {
    num: "01",
    title: "List it",
    icon: Package,
    desc: "Sellers verify with their student matric number before any listing goes live. Post in minutes, sell in hours.",
  },
  {
    num: "02",
    title: "Pay in through the app",
    icon: Lock,
    desc: "You pay securely in the app. Soldbay holds onto the money, so the seller can't touch it yet.",
  },
  {
    num: "03",
    title: "Meet & confirm",
    icon: BadgeCheck,
    desc: "Meet at a campus pickup point and enter your 4-digit PIN. The payment is released the moment you do. Simple handoff, guaranteed.",
  },
];

export function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatedSection className="scroll-mt-20 border-t border-border py-24 md:scroll-mt-24 md:py-32" id="how">
      <div className="container-page">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={scrollViewport}
          className="mb-16 flex flex-col items-center gap-3 text-center"
        >
          <motion.div
            variants={fadeUpVariants}
            className="flex items-center gap-3"
          >
            <span className="h-0.5 w-10 bg-accent" aria-hidden />
            <p className="text-caption font-semibold uppercase tracking-widest text-secondary">
              Step by step
            </p>
          </motion.div>

          <motion.h2
            variants={fadeUpVariants}
            className="font-display text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl"
          >
            From listing to handoff, in three steps.
          </motion.h2>
          <motion.p
            variants={fadeUpVariants}
            className="mt-1 max-w-xl text-base leading-normal text-secondary"
          >
            Money is held the whole way through: verified, then held, then
            confirmed.
          </motion.p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              custom={i}
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={scrollViewport}
              variants={staggerCardVariants}
              className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-7 will-change-transform"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <step.icon className="size-5" aria-hidden />
                </div>
                <span className="font-display text-4xl font-medium leading-none tracking-tight text-accent-400">
                  {step.num}
                </span>
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-normal text-primary/60">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
