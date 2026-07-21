"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { soldbayEase } from "@/lib/motion";
import Link from "next/link";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: soldbayEase },
  },
};

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-linear-to-b from-[#0b0b10] via-[#0b0b10] to-[#1f1460]">
      {/* Faint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial glow */}
      <div
        className="pointer-events-none absolute -top-48 left-1/2 h-full w-225 -translate-x-1/2 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(91,61,240,0.3) 0%, rgba(69,39,200,0.15) 40%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6">
        {/* Hero Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-1 flex-col items-center justify-center text-center"
        >
          {/* Headline - mixed opacity */}
          <motion.h1 variants={childVariants} className="max-w-3xl">
            <span className="block font-display text-[56px] font-bold leading-[1.02] text-white md:text-[72px] lg:text-[96px]">
              Student e-marketplace
            </span>
            <span className="block font-display text-[56px] font-bold leading-[1.02] text-text-tertiary md:text-[72px] lg:text-[96px]">
              Coming to your campus.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={childVariants}
            className="mt-6 max-w-140 text-body-l text-text-tertiary"
          >
            The easiest way to buy and sell textbooks, gadgets, food, and
            services with real students on your campus.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={childVariants}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Button
              asChild
              variant="default"
              size="2xl"
              className="w-full sm:w-auto font-semibold"
            >
              <Link href="/join/buyer">Join as a Buyer</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="2xl"
              className="w-full border-white/25 text-white hover:bg-white/5 sm:w-auto font-semibold"
            >
              <Link href="/join/seller">Become a Seller</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}