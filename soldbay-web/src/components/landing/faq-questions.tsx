"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { FaqAccordion } from "@/components/landing/faq-accordion"
import { QuestionForm } from "@/components/question-form"
import { AnimatedSection } from "@/components/animated-section"
import { fadeUpVariants, scrollViewport } from "@/lib/motion"
import { cn } from "@/lib/utils"

const tabs = [
  { value: "faq", label: "FAQ" },
  { value: "question", label: "Questions" },
] as const

type Tab = (typeof tabs)[number]["value"]

export function FaqQuestions() {
  const reduceMotion = useReducedMotion()
  const [tab, setTab] = useState<Tab>("faq")

  return (
    <AnimatedSection
      className="dark bg-background scroll-mt-20 py-24 md:scroll-mt-24 md:py-32"
      id="faq"
    >
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
                FAQ
              </p>
              <span className="h-0.5 w-10 bg-accent" aria-hidden />
            </div>

            <h2 className="max-w-2xl font-display text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">
              Everything you need to know before we launch.
            </h2>
            <p className="max-w-xl text-base leading-normal text-foreground/60">
              Find quick answers below, or ask the team anything and
              we&rsquo;ll get back to you by email.
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={scrollViewport}
            variants={fadeUpVariants}
            className="mt-8 inline-flex items-center rounded-full border border-border bg-background p-1.5"
            role="tablist"
            aria-label="Choose between FAQ and questions"
          >
            {tabs.map((t) => (
              <button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={tab === t.value}
                onClick={() => setTab(t.value)}
                className="relative flex h-11 items-center rounded-full px-7 font-semibold"
              >
                {tab === t.value && (
                  <motion.span
                    layoutId="faq-questions-pill"
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
                    tab === t.value
                      ? "text-primary-foreground"
                      : "text-foreground",
                  )}
                >
                  {t.label}
                </span>
              </button>
            ))}
          </motion.div>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-3xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, x: tab === "faq" ? -24 : 24 }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: tab === "faq" ? 24 : -24 }
                }
                transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {tab === "faq" ? <FaqAccordion /> : <QuestionForm />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}