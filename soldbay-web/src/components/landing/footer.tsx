"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import { scaleInVariants, scrollViewport } from "@/lib/motion";

const socials = [
  {
    label: "X",
    handle: "@emanncode",
    href: "https://x.com/emanncode",
  },
  {
    label: "GitHub",
    handle: "emanncode",
    href: "https://github.com/emanncode",
  },
  {
    label: "WhatsApp",
    handle: "09048801668",
    href: "https://wa.me/2349048801668",
  },
] as const;

export function Footer() {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatedSection className="border-t border-white/10 py-16">
      <div className="container-page">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={scrollViewport}
          variants={scaleInVariants}
          className="glass-panel flex flex-col gap-8 rounded-3xl p-8 will-change-transform md:gap-10 md:p-10"
        >
          <div className="flex flex-col justify-between gap-10 md:flex-row">
            <div className="flex max-w-xs flex-col gap-4">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Soldbay"
                  width={140}
                  height={56}
                  className="h-10 w-auto sm:h-12"
                />
              </Link>
              <p className="text-body-s text-white/50">
                The student marketplace.
              </p>
              <p className="text-caption text-white/35">
                &copy; {new Date().getFullYear()} Soldbay. All rights reserved.
              </p>
            </div>

            <div className="flex gap-16">
              <div className="flex flex-col gap-4">
                <span className="text-body-s font-semibold text-white">
                  For Students
                </span>
                <Link
                  href="/join/buyer"
                  className="cursor-pointer text-body-s text-white/50 transition-colors hover:text-white"
                >
                  Join as Buyer
                </Link>
                <Link
                  href="/join/seller"
                  className="cursor-pointer text-body-s text-white/50 transition-colors hover:text-white"
                >
                  Become a Seller
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-body-s font-semibold text-white">
                  Company
                </span>
                <span className="text-body-s text-white/50">
                  Privacy Policy
                </span>
                <span className="text-body-s text-white/50">
                  Terms of Service
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <p className="text-caption font-medium tracking-wide text-white/40 uppercase">
              Built by
            </p>
            <p className="mt-2 font-display text-heading-s text-white">
              emanncode
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-body-s text-white/70 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <span className="font-medium text-white/90">{s.label}</span>
                  <span className="text-white/45">{s.handle}</span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
