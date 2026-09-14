"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import { BrandLogo } from "@/components/brand-logo";
import { SmoothLink } from "@/components/smooth-link";
import { scaleInVariants, scrollViewport } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";

export function Footer() {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatedSection className="dark bg-background py-8 md:py-10">
      <div className="container-page">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={scrollViewport}
          variants={scaleInVariants}
          className="flex flex-col justify-between gap-12 md:flex-row"
        >
          <div className="flex max-w-xs flex-col items-start gap-4">
            <Link href="/" className="flex items-center" aria-label="Soldbay home">
              <BrandLogo
                variant="inverted"
                showDot
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-foreground/60">
              The student marketplace. Money moves last.
            </p>
            <a
              href="https://soldbay.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-accent px-3.5 text-caption font-semibold text-accent transition-colors hover:bg-accent/10"
            >
              soldbay.shop
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
            <p className="text-caption text-foreground/50">
              &copy; {new Date().getFullYear()} Soldbay. All rights reserved.
            </p>
          </div>

          <div className="flex gap-12 sm:gap-20 lg:gap-24">
            <div className="flex flex-col gap-3.5">
              <span className="text-caption font-semibold tracking-widest text-foreground">
                For Students
              </span>
              <SmoothLink
                href="/#join"
                className="cursor-pointer text-sm text-foreground/50 transition-colors hover:text-foreground"
              >
                Join as Buyer
              </SmoothLink>
              <SmoothLink
                href="/#join"
                className="cursor-pointer text-sm text-foreground/50 transition-colors hover:text-foreground"
              >
                Become a Seller
              </SmoothLink>
            </div>
            <div className="flex flex-col gap-3.5">
              <span className="text-caption font-semibold tracking-widest text-foreground">
                Company
              </span>
              <span className="text-sm text-foreground/50">
                Privacy Policy
              </span>
              <span className="text-sm text-foreground/50">
                Terms of Service
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}