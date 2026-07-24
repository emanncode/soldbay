"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUpVariants, scaleInVariants } from "@/lib/motion";
import Link from "next/link";
import Image from "next/image";

const HERO_ABSTRACT_SRC = "/hero-abstract.svg";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={HERO_ABSTRACT_SRC}
          alt=""
          fill
          priority
          className="object-cover object-center opacity-70"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#07060f]/50 via-[#07060f]/20 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-[#07060f]/15 via-transparent to-[#07060f]/90" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(91,61,240,0.2) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[100rem] flex-1 flex-col justify-center px-4 pt-nav pb-16 sm:px-6 sm:pb-24 md:px-8 lg:px-16 lg:pb-32">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          className="flex w-full flex-col items-stretch gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16"
        >
          <div className="min-w-0 flex-1">
            <motion.p
              variants={fadeUpVariants}
              className="mb-4 text-caption font-medium tracking-[0.2em] text-white/80 uppercase sm:text-body-s"
            >
              Campus commerce, reimagined
            </motion.p>

            <motion.h1
              variants={fadeUpVariants}
              className="w-full max-w-none font-display font-extrabold tracking-tight"
            >
              <span className="text-hero-gradient block text-[clamp(3.85rem,9vw,7.5rem)] leading-[0.95] drop-shadow-[0_4px_40px_rgba(0,0,0,0.55)]">
                Student marketplace
              </span>
              <span className="text-hero-gradient mt-0 block text-[clamp(3.85rem,9vw,7.5rem)] leading-[0.95] drop-shadow-[0_4px_40px_rgba(0,0,0,0.55)]">
                Coming to your campus.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="mt-8 max-w-2xl text-body-m text-white/85 sm:text-body-l"
            >
              The easiest way to buy and sell textbooks, gadgets, food, and
              services with real students on your campus.
            </motion.p>
          </div>

          <motion.div
            variants={scaleInVariants}
            className="glass-panel-strong w-full shrink-0 mt-15 rounded-3xl p-8 sm:max-w-md"
          >
            <p className="font-display text-heading-s text-white">
              Join our waitlist
            </p>
            <p className="mt-2 text-body-s text-white/70">
              Get notified when Soldbay launches on your campus.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                variant="glass-primary"
                size="xl"
                className="w-full font-semibold sm:flex-1"
              >
                <Link href="/join/buyer">Join as a Buyer</Link>
              </Button>
              <Button
                asChild
                variant="glass"
                size="xl"
                className="w-full font-semibold sm:flex-1"
              >
                <Link href="/join/seller">Become a Seller</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
