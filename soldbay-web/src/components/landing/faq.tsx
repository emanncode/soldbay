"use client"

import { motion, useReducedMotion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AnimatedSection } from "@/components/animated-section"
import { fadeUpVariants, scaleInVariants, scrollViewport } from "@/lib/motion"

const faqs = [
  {
    q: "Is it free to use?",
    a: "Joining and browsing Soldbay is completely free — buyers never pay platform fees. Sellers keep the large majority of every sale; a small commission helps us keep the platform safe and running.",
  },
  {
    q: "How do payments work?",
    a: "You pay securely in-app via Paystack (card, bank transfer, or USSD). Your payment is held by Soldbay, not released to the seller right away — it's only paid out once you've confirmed you received your item.",
  },
  {
    q: "Is delivery available?",
    a: "For now, exchanges happen at fixed pickup points we set up on your campus — no arranging meetups with a stranger yourself. In-hostel delivery is on our roadmap for a future update.",
  },
  {
    q: "What if there's a problem with my order?",
    a: "You have a set window after receiving an item to report a problem before the seller gets paid. If something's wrong, our team steps in to review it and can issue a refund.",
  },
  {
    q: "How do you prevent scams?",
    a: "Every seller signs up with their student matric number and goes through verification before their listings go live. Combined with held payments and after-sale ratings, problem sellers get flagged fast.",
  },
]

export function FAQ() {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatedSection className="py-24 md:py-32" id="faq">
      <div className="container-page max-w-3xl">
        <motion.h2
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={scrollViewport}
          variants={fadeUpVariants}
          className="mb-16 text-center font-display text-display-m text-white md:text-display-l"
        >
          Frequently asked questions
        </motion.h2>

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={scrollViewport}
          variants={scaleInVariants}
        >
          <Accordion
            type="single"
            collapsible
            className="glass-panel w-full overflow-hidden rounded-3xl border-white/12"
          >
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.q}
                value={faq.q}
                className="border-b border-white/10 px-0 last:border-b-0 data-open:bg-white/5"
              >
                <AccordionTrigger className="cursor-pointer px-4 py-4 text-left font-display text-heading-s text-white hover:no-underline hover:text-white sm:px-8 sm:py-6 **:data-[slot=accordion-trigger-icon]:text-white/50">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-body-m text-white/60 sm:px-8 sm:pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </AnimatedSection>
  )
}
