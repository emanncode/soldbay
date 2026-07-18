"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function Cta() {
  const [active, setActive] = useState<"shop" | "sell">("shop");

  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className="px-6 py-20 text-center"
    >
      <motion.h2
        variants={item}
        className="text-2xl font-semibold mb-4 text-text-primary"
      >
        Ready to get started?
      </motion.h2>
      <motion.p
        variants={item}
        className="text-text-secondary mb-8 max-w-md mx-auto"
      >
        Join students already buying and selling on Soldbay.
      </motion.p>
      <motion.div
        variants={item}
        className="relative inline-flex border border-border rounded-full p-1"
        onMouseLeave={() => setActive("shop")}
      >
        <div
          className="absolute inset-y-1 w-[calc(50%-2px)] rounded-full z-0 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={{
            backgroundColor: "#e1261c",
            left: active === "shop" ? "4px" : "calc(50%)",
          }}
        />
        <button
          onMouseEnter={() => setActive("shop")}
          className="relative z-10 rounded-full px-7 py-3 text-sm font-medium transition-colors"
        >
          <span
            className={active === "shop" ? "text-white" : "text-text-primary"}
          >
            Start shopping
          </span>
        </button>
        <button
          onMouseEnter={() => setActive("sell")}
          className="relative z-10 rounded-full px-7 py-3 text-sm font-medium transition-colors"
        >
          <span
            className={active === "sell" ? "text-white" : "text-text-primary"}
          >
            Start selling
          </span>
        </button>
      </motion.div>
    </motion.section>
  );
}
