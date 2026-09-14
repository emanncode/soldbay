"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { WaitlistForm } from "@/components/waitlist-form";
import { PageShell } from "@/components/page-shell";

interface JoinFormProps {
  type: "buyer" | "seller";
}

export function JoinForm({ type }: JoinFormProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  return (
    <PageShell>
      <div className="flex min-h-screen flex-col pt-nav">
        <div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
          <motion.div
            className="w-full max-w-140"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <WaitlistForm
              type={type}
              onSuccess={() => router.push("/success")}
            />
          </motion.div>
        </div>
      </div>
    </PageShell>
  );
}