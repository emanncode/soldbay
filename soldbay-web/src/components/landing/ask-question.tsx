"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { ErrorMessage } from "@/components/ui/error-message"
import {
  appErrorFromNetwork,
  appErrorFromResponse,
  type AppError,
} from "@/lib/api-error"
import {
  formCardEntry,
  formFieldEntry,
  scaleInVariants,
  scrollViewport,
  soldbayEase,
} from "@/lib/motion"

const fieldClass =
  "h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-white shadow-none placeholder:text-white/40 focus-visible:border-brand-light/50 focus-visible:ring-brand-start/25"

const textareaClass =
  "min-h-32 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white shadow-none placeholder:text-white/40 focus-visible:border-brand-light/50 focus-visible:ring-brand-start/25"

export function AskQuestion() {
  const reduceMotion = useReducedMotion()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [question, setQuestion] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<AppError | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, question }),
      })

      if (res.status === 201) {
        setSent(true)
        setName("")
        setEmail("")
        setQuestion("")
        return
      }

      setError(await appErrorFromResponse(res))
    } catch {
      setError(appErrorFromNetwork())
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatedSection className="py-24 md:py-32" id="questions">
      <div className="container-page max-w-3xl">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={scrollViewport}
          variants={scaleInVariants}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-display-m text-white md:text-display-l">
            Got a question?
          </h2>
          <p className="mt-4 text-body-m text-white/55">
            Ask anything about Soldbay — campus launch, buyers, sellers, or how
            it works. We&rsquo;ll get back to you by email.
          </p>
        </motion.div>

        <div className="form-spotlight">
          <div className="form-spotlight-glow" aria-hidden />
          <Card className="glass-panel-focus relative z-10 border-white/20 bg-transparent py-0 shadow-none ring-0">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: soldbayEase }}
                  className="flex flex-col items-center px-8 py-16 text-center md:px-12"
                >
                  <motion.div
                    initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 18,
                      delay: 0.05,
                    }}
                    className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-brand-start shadow-[0_0_40px_rgb(91_61_240/0.5)]"
                  >
                    <motion.svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <motion.path
                        d="M22 2L11 13"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={reduceMotion ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.2, ease: soldbayEase }}
                      />
                      <motion.path
                        d="M22 2L15 22L11 13L2 9L22 2Z"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={reduceMotion ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.15, ease: soldbayEase }}
                      />
                    </motion.svg>
                  </motion.div>

                  <motion.h3
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.35, ease: soldbayEase }}
                    className="font-display text-heading-l text-white"
                  >
                    Question sent
                  </motion.h3>
                  <motion.p
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.35, ease: soldbayEase }}
                    className="mt-4 max-w-md text-body-m text-white/60"
                  >
                    Thanks for reaching out. We&rsquo;ve received your question and
                    will reply to your email as soon as we can.
                  </motion.p>

                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.35, ease: soldbayEase }}
                    className="mt-8"
                  >
                    <Button
                      type="button"
                      variant="glass"
                      size="lg"
                      className="font-semibold"
                      onClick={() => {
                        setSent(false)
                        setError(null)
                      }}
                    >
                      Ask another question
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: soldbayEase }}
                >
                  <CardHeader className="px-8 pt-8 md:px-12 md:pt-12">
                    <CardTitle className="font-display text-heading-l text-white">
                      Ask us anything
                    </CardTitle>
                    <CardDescription className="mt-2 text-body-s text-white/55">
                      Your message goes to the Soldbay team — we&rsquo;ll answer by
                      email.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-8 pb-8 md:px-12 md:pb-12">
                    <motion.form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-6"
                      variants={formCardEntry}
                      initial={reduceMotion ? false : "hidden"}
                      animate="visible"
                    >
                      <motion.div
                        variants={formFieldEntry}
                        className="flex flex-col gap-2"
                      >
                        <Label htmlFor="q-name" className="text-white/80">
                          Your name
                        </Label>
                        <Input
                          id="q-name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full name"
                          className={fieldClass}
                          disabled={submitting}
                        />
                      </motion.div>

                      <motion.div
                        variants={formFieldEntry}
                        className="flex flex-col gap-2"
                      >
                        <Label htmlFor="q-email" className="text-white/80">
                          Email
                        </Label>
                        <Input
                          id="q-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@university.edu.ng"
                          className={fieldClass}
                          disabled={submitting}
                        />
                      </motion.div>

                      <motion.div
                        variants={formFieldEntry}
                        className="flex flex-col gap-2"
                      >
                        <Label htmlFor="q-body" className="text-white/80">
                          Your question
                        </Label>
                        <Textarea
                          id="q-body"
                          required
                          minLength={10}
                          maxLength={2000}
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="What would you like to know about Soldbay?"
                          className={textareaClass}
                          disabled={submitting}
                        />
                      </motion.div>

                      {error ? (
                        <motion.div variants={formFieldEntry}>
                          <ErrorMessage
                            error={error}
                            onDismiss={() => setError(null)}
                          />
                        </motion.div>
                      ) : null}

                      <motion.div variants={formFieldEntry}>
                        <Button
                          type="submit"
                          variant="glass-primary"
                          size="2xl"
                          className="w-full font-semibold"
                          disabled={submitting}
                        >
                          {submitting
                            ? "Sending…"
                            : error?.retryable
                              ? "Try again →"
                              : "Send question →"}
                        </Button>
                      </motion.div>
                    </motion.form>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </AnimatedSection>
  )
}
