"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { soldbayEase } from "@/lib/motion";

const links = [
  { href: "/join/buyer", label: "Buyers" },
  { href: "/join/seller", label: "Sellers" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#questions", label: "Questions" },
] as const;

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: soldbayEase }}
      className="fixed top-0 right-0 left-0 z-50 w-full bg-transparent"
    >
      {/* Mobile backdrop — covers the page behind the header */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: soldbayEase }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-0 bg-black/60 backdrop-blur-md md:hidden"
          />
        )}
      </AnimatePresence>

      <div className="container-page relative z-10 py-4">
        <div
          className={`flex items-center justify-between rounded-full px-4 py-2 sm:px-6 sm:py-2 transition-colors duration-300 ${
            scrolled
              ? "border border-white/14 bg-[#07060f]/70 shadow-[inset_0_1px_0_rgb(255_255_255/0.1)] backdrop-blur-2xl saturate-[1.6]"
              : "glass-nav"
          }`}
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center"
            aria-label="Soldbay home"
          >
            <Image
              src="/logo.png"
              alt="Soldbay"
              width={180}
              height={72}
              className="h-14 w-auto sm:h-16"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-4 sm:gap-8 md:flex"
            aria-label="Primary"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild variant="glass-primary" size="sm">
              <Link href="/join/buyer">Join Waitlist</Link>
            </Button>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="group flex flex-col items-end gap-1.5 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`block h-0.5 bg-white/70 transition-all duration-300 ${
                menuOpen ? "w-6 translate-y-2 rotate-45" : "w-6"
              }`}
            />
            <span
              className={`block h-0.5 bg-white/70 transition-all duration-300 ${
                menuOpen ? "w-0 opacity-0" : "w-5"
              }`}
            />
            <span
              className={`block h-0.5 bg-white/70 transition-all duration-300 ${
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
              className="glass-nav mt-2 rounded-2xl px-6 py-6 md:hidden"
            >
              <nav
                className="flex flex-col gap-4"
                aria-label="Mobile navigation"
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  Join as
                </span>
                <Link
                  href="/join/buyer"
                  onClick={() => setMenuOpen(false)}
                  className="text-base font-medium text-white/80 transition-colors hover:text-white"
                >
                  Buyer
                </Link>
                <Link
                  href="/join/seller"
                  onClick={() => setMenuOpen(false)}
                  className="text-base font-medium text-white/80 transition-colors hover:text-white"
                >
                  Seller
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
