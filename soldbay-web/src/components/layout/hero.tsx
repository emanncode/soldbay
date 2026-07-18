"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function Hero() {
  const [active, setActive] = useState<"shop" | "sell">("shop");

  return (
    <section className="relative overflow-hidden bg-[#0b0b10] text-white min-h-screen rounded-b-full">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, var(--color-brand-start), transparent 45%), radial-gradient(circle at 85% 60%, var(--color-brand-end), transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display text-6xl lg:text-9xl font-bold tracking-tight leading-[1.02]"
        >
          Everything on
          <br />
          <span className="text-white/40">campus is</span> for sale
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-6 text-lg text-white/60 max-w-md mx-auto"
        >
          Textbooks, gadgets, food, services — tagged, listed, and sold by real
          students on your campus.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative mt-10 flex border border-white/20 rounded-full p-1 bg-white/5 backdrop-blur-sm"
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
            className="relative z-10 rounded-full px-7 py-3.5 text-lg font-bold transition-colors cursor-pointer"
          >
            <span
              className={active === "shop" ? "text-white" : "text-white/30"}
            >
              Start shopping
            </span>
          </button>
          <button
            onMouseEnter={() => setActive("sell")}
            className="relative z-10 rounded-full px-7 py-3.5 text-lg font-bold transition-colors cursor-pointer"
          >
            <span
              className={active === "sell" ? "text-white" : "text-white/30"}
            >
              Start selling
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
