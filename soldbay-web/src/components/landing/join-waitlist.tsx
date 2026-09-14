"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import { WaitlistForm } from "@/components/waitlist-form";
import { fadeUpVariants, scrollViewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

const roles = [
  { value: "buyer", label: "Buyer" },
  { value: "seller", label: "Seller" },
] as const;

type Role = (typeof roles)[number]["value"];

export function JoinWaitlist() {
  const reduceMotion = useReducedMotion();
  const [role, setRole] = useState<Role>("buyer");

  return (
    <AnimatedSection className="dark bg-background scroll-mt-20 py-24 md:scroll-mt-24 md:py-32" id="join">
      <div className="container-page">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            variants={fadeUpVariants}
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={scrollViewport}
            className="flex flex-col items-center gap-6 text-center"
          >
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-10 bg-accent" aria-hidden />
              <p className="text-caption font-semibold uppercase tracking-widest text-accent">
                Join Waitlist
              </p>
              <span className="h-0.5 w-10 bg-accent" aria-hidden />
            </div>

            <h2 className="max-w-2xl font-display text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">
              Be first in line when Soldbay reaches your campus.
            </h2>
            <p className="max-w-xl text-base leading-normal text-foreground/60">
              Join now as a buyer or seller and we&rsquo;ll email you the moment
              your campus goes live.
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={scrollViewport}
            variants={fadeUpVariants}
            className="mt-8 inline-flex items-center rounded-full border border-border bg-background p-1.5"
            role="tablist"
            aria-label="Choose how you want to join"
          >
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                role="tab"
                aria-selected={role === r.value}
                onClick={() => setRole(r.value)}
                className="relative flex h-11 items-center rounded-full px-7 font-semibold"
              >
                {role === r.value && (
                  <motion.span
                    layoutId="join-role-pill"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 400, damping: 34 }
                    }
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 transition-colors",
                    role === r.value
                      ? "text-primary-foreground"
                      : "text-foreground",
                  )}
                >
                  {r.label}
                </span>
              </button>
            ))}
          </motion.div>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-140">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={role}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, x: role === "buyer" ? -24 : 24 }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: role === "buyer" ? 24 : -24 }
                }
                transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <WaitlistForm type={role} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}