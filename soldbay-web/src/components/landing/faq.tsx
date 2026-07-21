"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AnimatedSection } from "@/components/animated-section"

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
  return (
    <AnimatedSection className="bg-white py-20 md:py-28">
      <div className="mx-auto px-[5%]" id="faq">
        <h2 className="mb-12 text-center font-display text-display-m text-text-primary md:text-display-l">
          Frequently asked questions
        </h2>

        <Accordion type="single" collapsible className="w-full border-0">
          {faqs.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q} className="border-b border-border py-1">
              <AccordionTrigger className="px-0 py-4 text-left font-display text-heading-s text-text-primary hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-4 text-body-m text-text-secondary">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AnimatedSection>
  )
}
