"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 mx-[5%] rounded-full py-2 mt-4 bg-white/80 backdrop-blur-2xl border-b border-border`}
        >
          <Image
            src="/logo.svg"
            alt="Soldbay Logo"
            width={140}
            height={50}
            priority
          />
          <Button variant="ghost" size="lg">
            Get App
          </Button>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
