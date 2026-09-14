"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { SmoothLink } from "@/components/smooth-link";
import {
  Package,
  Lock,
  BadgeCheck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { fadeUpVariants, scaleInVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

const flowSteps = [
  {
    icon: Package,
    step: "Step 01",
    title: "List it",
    desc: "Verified students list textbooks, gadgets, snacks and services.",
  },
  {
    icon: Lock,
    step: "Step 02",
    title: "Pay in through the app",
    desc: "You pay securely in the app. Soldbay holds onto the money, so the seller can't touch it yet.",
  },
  {
    icon: BadgeCheck,
    step: "Step 03",
    title: "Confirm with PIN",
    desc: "Meet at a campus pickup point, enter your 4-digit PIN, and the payment is released.",
  },
] as const;

const trustItems = [
  { icon: ShieldCheck, label: "Verified students" },
  { icon: Lock, label: "Payment held safely" },
  { icon: BadgeCheck, label: "PIN-confirmed handoff" },
] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<"join" | "how">("join");
  const [pressed, setPressed] = useState<"join" | "how" | null>(null);

  const handlePress = (which: "join" | "how") => {
    setActive(which);
    setPressed(which);
    window.setTimeout(() => setPressed(null), 300);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="container-page pb-16 pt-nav sm:pb-24">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20"
        >
          <div className="min-w-0">
            <motion.div
              variants={fadeUpVariants}
              className="flex items-center gap-3"
            >
              <span className="h-0.5 w-10 bg-accent" aria-hidden />
              <p className="text-caption font-semibold uppercase tracking-widest text-secondary">
                Your money, held until pickup
              </p>
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="mt-6 font-display font-medium tracking-tight text-foreground"
            >
              <span className="block text-5xl leading-none md:text-6xl">
                The campus marketplace where
              </span>
              <span className="block text-5xl leading-none md:text-6xl">
                money moves last.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="mt-7 max-w-xl text-lg leading-normal text-secondary"
            >
              Buy from verified students, pay in through the app, and confirm
              pickup with your PIN. Your money stays held until the item is
              actually in your hands. No more sending cash and hoping for the
              best.
            </motion.p>

            <motion.div
              variants={scaleInVariants}
              className="mt-10 inline-flex items-center rounded-full border border-border bg-background p-1.5 shadow-elevation-3"
            >
              <SmoothLink
                href="/#join"
                onMouseEnter={() => setActive("join")}
                onFocus={() => setActive("join")}
                onClick={() => handlePress("join")}
                className="relative flex h-11 items-center overflow-hidden rounded-full px-6 font-semibold"
              >
                {active === "join" && (
                  <motion.span
                    layoutId="hero-cta-pill"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 400, damping: 34 }
                    }
                  />
                )}
                <AnimatePresence>
                  {pressed === "join" && (
                    <motion.span
                      key="join-press"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="pointer-events-none absolute inset-0 z-10 rounded-full bg-white/25"
                    />
                  )}
                </AnimatePresence>
                <span
                  className={cn(
                    "relative z-20 flex items-center gap-2 transition-colors",
                    active === "join"
                      ? "text-primary-foreground"
                      : "text-foreground",
                  )}
                >
                  Join the waitlist
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </SmoothLink>
              <SmoothLink
                href="/#how"
                onMouseEnter={() => setActive("how")}
                onFocus={() => setActive("how")}
                onClick={() => handlePress("how")}
                className="relative flex h-11 items-center overflow-hidden rounded-full px-6 font-semibold"
              >
                {active === "how" && (
                  <motion.span
                    layoutId="hero-cta-pill"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 400, damping: 34 }
                    }
                  />
                )}
                <AnimatePresence>
                  {pressed === "how" && (
                    <motion.span
                      key="how-press"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="pointer-events-none absolute inset-0 z-10 rounded-full bg-white/25"
                    />
                  )}
                </AnimatePresence>
                <span
                  className={cn(
                    "relative z-20 transition-colors",
                    active === "how"
                      ? "text-primary-foreground"
                      : "text-foreground",
                  )}
                >
                  See how it works
                </span>
              </SmoothLink>
            </motion.div>

            <motion.ul
              variants={scaleInVariants}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              {trustItems.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2 text-sm font-medium text-primary/70"
                >
                  <item.icon className="size-4 text-secondary" aria-hidden />
                  {item.label}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Built money-flow element — how list → escrow → PIN works */}
          <motion.div
            variants={scaleInVariants}
            className="w-full lg:justify-self-end"
          >
            <div className="rounded-2xl border border-border bg-surface p-7 will-change-transform sm:p-8">
              <div className="mb-7 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary/60">
                  How money moves
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-400 px-3 py-1 text-caption font-medium text-accent-400">
                  <Lock className="size-3.5" aria-hidden />
                  Held until pickup
                </span>
              </div>

              <div className="flex flex-col gap-5">
                {flowSteps.map((step) => (
                  <div key={step.step} className="flex gap-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <step.icon className="size-5" aria-hidden />
                    </div>
                    <div className={cn("flex flex-col gap-0.5")}>
                      <p className="text-caption font-medium uppercase tracking-widest text-secondary">
                        {step.step}
                      </p>
                      <h3 className="text-sm font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-0.5 text-caption text-primary/60">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                <Lock className="size-4 shrink-0 text-secondary" aria-hidden />
                <p className="text-caption text-primary/60">
                  Your payment stays held until you confirm the handoff. No
                  confirmation, no payout.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}