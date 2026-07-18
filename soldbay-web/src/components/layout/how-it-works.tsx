"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Browse or list",
    description: "Search what your campus is selling, or post your own item in under a minute.",
  },
  {
    title: "Chat and agree",
    description: "Message the seller directly, ask questions, agree on pickup or delivery.",
  },
  {
    title: "Pay securely",
    description: "Pay in-app — funds only release to the seller after you confirm delivery.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-20">
      <h2 className="text-2xl font-semibold text-center mb-12 text-text-primary">
        How it works
      </h2>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
      >
        {steps.map((step, i) => (
          <motion.div key={step.title} variants={item} className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-accent text-white flex items-center justify-center text-sm font-medium">
              {i + 1}
            </div>
            <h3 className="font-medium mb-2 text-text-primary">{step.title}</h3>
            <p className="text-sm text-text-secondary">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}