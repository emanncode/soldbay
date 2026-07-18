"use client";

import { motion } from "framer-motion";

const studentFeatures = [
  "Browse listings from verified students on your campus",
  "Save items to your wishlist and get notified on price drops",
  "Chat with sellers directly, no middleman",
];

const vendorFeatures = [
  "List products in under a minute, right from your phone",
  "Track orders and manage inventory in one dashboard",
  "Get paid securely, withdraw straight to your bank",
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function Features() {
  return (
    <section id="features" className="px-6 py-20 bg-surface">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12"
      >
        <motion.div variants={item}>
          <h3 className="text-lg font-semibold mb-4 text-text-primary">
            For students
          </h3>
          <ul className="space-y-3">
            {studentFeatures.map((f) => (
              <li key={f} className="text-sm text-text-secondary flex gap-2">
                <span className="text-accent">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div variants={item}>
          <h3 className="text-lg font-semibold mb-4 text-text-primary">
            For vendors
          </h3>
          <ul className="space-y-3">
            {vendorFeatures.map((f) => (
              <li key={f} className="text-sm text-text-secondary flex gap-2">
                <span className="text-accent">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
