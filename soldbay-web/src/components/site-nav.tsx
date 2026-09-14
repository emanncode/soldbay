"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { SmoothLink } from "@/components/smooth-link";
import { soldbayEase } from "@/lib/motion";

const links = [
  { href: "/#join", label: "join" },
  { href: "/#how", label: "Process" },
  { href: "/#why", label: "Why us" },
  { href: "/#faq", label: "FAQ" },
] as const;

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: soldbayEase }}
      className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl"
    >
      <div className="container-page relative z-10">
        <div className="flex h-16 items-center justify-between md:h-22">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            aria-label="Soldbay home"
          >
            <BrandLogo
              variant="primary"
              showDot
              className="h-9 w-auto md:h-13"
            />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Primary"
          >
            {links.map((link) => (
              <SmoothLink
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-primary/60 transition-colors hover:text-primary"
              >
                {link.label}
              </SmoothLink>
            ))}
            <Button asChild className="h-12 rounded-full px-7 font-semibold">
              <SmoothLink href="/#join">Join the waitlist</SmoothLink>
            </Button>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="group flex flex-col items-end gap-1.5 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block h-0.5 bg-primary transition-all duration-300 ${
                menuOpen ? "w-6 translate-y-2 rotate-45" : "w-6"
              }`}
            />
            <span
              className={`block h-0.5 bg-primary transition-all duration-300 ${
                menuOpen ? "w-0 opacity-0" : "w-5"
              }`}
            />
            <span
              className={`block h-0.5 bg-primary transition-all duration-300 ${
                menuOpen ? "w-6 -translate-y-2 -rotate-45" : "w-4"
              }`}
            />
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: soldbayEase }}
              className="-mx-4 mb-4 border border-border bg-background px-6 py-6 shadow-elevation-3 sm:mx-0 lg:hidden"
            >
              <nav
                className="flex flex-col gap-4"
                aria-label="Mobile navigation"
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-primary/50">
                  Explore
                </span>
                {links.map((link) => (
                  <SmoothLink
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-base font-medium text-primary/80 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </SmoothLink>
                ))}
                <Button
                  asChild
                  className="mt-2 h-12 rounded-full px-7 font-semibold"
                >
                  <SmoothLink href="/#join" onClick={() => setMenuOpen(false)}>
                    Join the waitlist
                  </SmoothLink>
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
