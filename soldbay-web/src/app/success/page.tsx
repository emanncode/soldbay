"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formCardEntry, formFieldEntry, soldbayEase } from "@/lib/motion"
import { PageShell } from "@/components/page-shell"
import Link from "next/link"

export default function SuccessPage() {
  const reduceMotion = useReducedMotion()

  return (
    <PageShell>
      <div className="flex min-h-screen flex-col pt-nav">
        <div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
          <motion.div
            className="form-spotlight w-full max-w-[520px]"
            variants={formCardEntry}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
          >
            {/* Lightened focal area behind the card */}
            <div className="form-spotlight-glow" aria-hidden />
            <Card className="glass-panel-focus relative z-10 border-white/20 bg-transparent py-0 text-center shadow-none ring-0">
              <CardHeader className="items-center px-8 pt-12 md:px-12">
                <motion.div
                  variants={formFieldEntry}
                  className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-success shadow-[0_0_32px_rgb(22_163_74/0.45)]"
                >
                  <motion.svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.45, delay: 0.35, ease: soldbayEase }}
                  >
                    <motion.path
                      d="M20 6L9 17l-5-5"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={reduceMotion ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.4, ease: soldbayEase }}
                    />
                  </motion.svg>
                </motion.div>

                <motion.div variants={formFieldEntry}>
                  <CardTitle className="font-display text-display-m text-white">
                    You&rsquo;re on the list!
                  </CardTitle>
                  <CardDescription className="mt-4 max-w-sm text-body-m leading-relaxed text-white/60">
                    We&rsquo;ll notify you when Soldbay launches on your campus. Hang
                    tight &mdash; we&rsquo;ll be there soon.
                  </CardDescription>
                </motion.div>
              </CardHeader>

              <CardContent className="flex flex-col items-center px-8 pb-12 md:px-12">
                <motion.div variants={formFieldEntry} className="w-full">
                  <Separator className="my-8 w-full bg-white/10" />
                </motion.div>

                <motion.p
                  variants={formFieldEntry}
                  className="text-body-s font-semibold text-white/90"
                >
                  Tell your campus friends
                </motion.p>

                <motion.div
                  variants={formFieldEntry}
                  className="mt-4 flex items-center gap-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-success/15">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5z"
                        fill="#16a34a"
                      />
                      <path
                        d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-info/15">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9.4 4.1 0 0 .1-.9.3-2.1.5-2.6 2.7-4.8 5.3-5.1 2.6-.3 5.1.8 6 3.1z"
                        fill="#2563eb"
                      />
                    </svg>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-brand-start/20">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <rect x="2" y="2" width="20" height="20" rx="4" fill="#5b3df0" />
                      <path
                        d="M16 8l-6 6-3-3"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </motion.div>

                <motion.div variants={formFieldEntry} className="mt-8 w-full">
                  <Button
                    asChild
                    variant="glass"
                    size="lg"
                    className="w-full font-semibold"
                  >
                    <Link href="/">Back to homepage</Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageShell>
  )
}
