"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import { TagIcon } from "@/components/tag-icon";
import { soldbayEase } from "@/lib/motion";

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
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.15 * i, ease: soldbayEase },
  }),
};

export function HowItWorks() {
  return (
    <AnimatedSection className="bg-white py-20 md:py-28">
      <div className="mx-auto px-[5%]">
        <div className="mb-14 text-center">
          <h2 className="font-display text-display-m text-text-primary md:text-display-l">
            How it works
          </h2>
          <p className="mt-2 text-body-m text-text-secondary">
            Three simple steps to get started on Soldbay.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={cardVariants}
              className="flex flex-col gap-4 rounded-[24px] border border-border bg-white p-7 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-linear-to-br from-brand-start to-brand-end">
                  <TagIcon size={18} fill="#ffffff" />
                </div>
                <span className="font-display text-[28px] font-bold text-brand-start">
                  {step.num}
                </span>
              </div>
              <h3 className="font-display text-heading-s text-text-primary">
                {step.title}
              </h3>
              <p className="text-body-s text-text-secondary">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
