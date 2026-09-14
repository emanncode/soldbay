"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Plus } from "lucide-react"
import { fadeUpVariants, scrollViewport, soldbayEase } from "@/lib/motion"
import { cn } from "@/lib/utils"

const faqs = [
  {
    q: "Is it free to use?",
    a: "Joining and browsing Soldbay is completely free — buyers never pay platform fees. Sellers keep the large majority of every sale.",
  },
  {
    q: "How do payments work?",
    a: "You pay securely in the app via Paystack (card, bank transfer, or USSD). Your payment is held by Soldbay and is only paid out once you've confirmed you received your item.",
  },
  {
    q: "Is delivery available?",
    a: "For now, exchanges happen at fixed pickup points we set up on your campus — no arranging meetups with a stranger yourself.",
  },
  {
    q: "How do you prevent scams?",
    a: "Every seller signs up with their student matric number and goes through verification before listings go live. Held payments and after-sale ratings flag problem sellers fast.",
  },
]

export function FaqAccordion() {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState<string | null>(null)

  return (
    <motion.div
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={scrollViewport}
      variants={fadeUpVariants}
      className="border-y border-border"
    >
      {faqs.map((faq) => {
        const isOpen = open === faq.q
        return (
          <div key={faq.q} className="border-b border-border last:border-b-0">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : faq.q)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-4 py-6 text-left"
            >
              <span className="text-base font-semibold text-foreground">
                {faq.q}
              </span>
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                  isOpen
                    ? "rotate-45 bg-primary text-primary-foreground"
                    : "bg-muted text-secondary",
                )}
              >
                <Plus className="size-4" aria-hidden />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="answer"
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: soldbayEase }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 text-sm leading-normal text-primary/60">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </motion.div>
  )
}