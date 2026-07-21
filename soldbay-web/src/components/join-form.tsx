"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion, useReducedMotion } from "framer-motion"
import { formCardEntry, formFieldEntry } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { ErrorMessage } from "@/components/ui/error-message"
import {
  appErrorFromNetwork,
  appErrorFromResponse,
  type AppError,
} from "@/lib/api-error"
import { PageShell } from "@/components/page-shell"

const universities = [
  "University of Lagos (UNILAG)",
  "University of Ibadan (UI)",
  "Obafemi Awolowo University (OAU)",
  "University of Nigeria, Nsukka (UNN)",
  "Ahmadu Bello University (ABU)",
  "Lagos State University (LASU)",
  "University of Benin (UNIBEN)",
  "Federal University of Technology, Akure (FUTA)",
  "Covenant University",
  "Other",
]

const academicLevels = ["100L", "200L", "300L", "400L", "500L", "Postgraduate"]
const sellFrequencies = ["Daily", "Weekly", "Occasionally"]

/** Shared field look — heights/padding on 8-pt (h-48px, px-16) */
const fieldClass =
  "h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-white shadow-none placeholder:text-white/40 focus-visible:border-brand-light/50 focus-visible:ring-brand-start/25"

const selectContentClass =
  "rounded-xl border border-white/12 bg-[#12101f] text-white shadow-xl ring-1 ring-white/10"

interface ChipProps {
  label: string
  selected: boolean
  onClick: () => void
}

function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-[13px] font-medium transition-all",
        selected
          ? "border-brand-light/60 bg-brand-start/80 text-white shadow-[0_0_16px_rgb(91_61_240/0.35)]"
          : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white",
      )}
    >
      {label}
    </button>
  )
}

interface PollOption {
  label: string
  checked: boolean
}

interface JoinFormProps {
  type: "buyer" | "seller"
}

export function JoinForm({ type }: JoinFormProps) {
  const router = useRouter()
  const isBuyer = type === "buyer"
  const reduceMotion = useReducedMotion()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    academicLevel: "",
    sellCategory: "",
    sellFrequency: "",
  })

  const [categories, setCategories] = useState([
    { label: "Textbooks", selected: false },
    { label: "Electronics", selected: false },
    { label: "Fashion", selected: false },
    { label: "Food & Drinks", selected: false },
    { label: "Services", selected: false },
    { label: "Housing", selected: false },
  ])

  const buyerPollOptions = [
    "Verified sellers",
    "Secure payments",
    "Campus delivery",
    "In-app chat",
    "Buyer protection",
  ]

  const sellerPollOptions = [
    "Easy listings",
    "Fast payouts",
    "Buyer reach",
    "Secure payments",
    "In-app chat",
  ]

  const [poll, setPoll] = useState<PollOption[]>(
    (isBuyer ? buyerPollOptions : sellerPollOptions).map((label) => ({
      label,
      checked: false,
    })),
  )

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<AppError | null>(null)

  const toggleCategory = (index: number) => {
    setCategories((prev) =>
      prev.map((c, i) => (i === index ? { ...c, selected: !c.selected } : c)),
    )
  }

  const togglePoll = (index: number) => {
    setPoll((prev) => prev.map((p, i) => (i === index ? { ...p, checked: !p.checked } : p)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: type,
          name: formData.name,
          email: formData.email,
          university: formData.university,
          level: isBuyer ? formData.academicLevel : null,
          sellsWhat: isBuyer ? null : formData.sellCategory,
          frequency: isBuyer ? null : formData.sellFrequency,
          categories: categories.filter((c) => c.selected).map((c) => c.label),
          pollAnswers: poll.filter((p) => p.checked).map((p) => p.label),
        }),
      })

      if (res.status === 201) {
        router.push("/success")
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
    <PageShell>
      <div className="flex min-h-screen flex-col pt-nav">
        <div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
          <motion.div
            className="form-spotlight w-full max-w-140"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Lightened focal area behind the form */}
            <div className="form-spotlight-glow" aria-hidden />
            <Card className="glass-panel-focus relative z-10 border-white/20 bg-transparent py-0 shadow-none ring-0">
              <CardHeader className="px-8 pt-8 md:px-12 md:pt-12">
                <motion.div
                  initial={reduceMotion ? false : "hidden"}
                  animate="visible"
                  variants={formFieldEntry}
                >
                  <CardTitle className="font-display text-heading-l text-white">
                    {isBuyer ? "Join as a Buyer" : "Become a Seller"}
                  </CardTitle>
                  <CardDescription className="mt-2 text-body-s text-white/55">
                    {isBuyer
                      ? "Get notified when Soldbay launches on your campus."
                      : "Start selling to students on your campus."}
                  </CardDescription>
                </motion.div>
              </CardHeader>

              <CardContent className="px-8 pb-8 md:px-12 md:pb-12">
                <motion.form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                  variants={formCardEntry}
                  initial={reduceMotion ? false : "hidden"}
                  animate="visible"
                >
                  <motion.div variants={formFieldEntry} className="flex flex-col gap-2">
                    <Label htmlFor="name" className="text-white/80">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((d) => ({ ...d, name: e.target.value }))
                      }
                      className={fieldClass}
                    />
                  </motion.div>

                  <motion.div variants={formFieldEntry} className="flex flex-col gap-2">
                    <Label htmlFor="email" className="text-white/80">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@university.edu.ng"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((d) => ({ ...d, email: e.target.value }))
                      }
                      className={fieldClass}
                    />
                  </motion.div>

                  <motion.div variants={formFieldEntry} className="flex flex-col gap-2">
                    <Label className="text-white/80">University</Label>
                    <Select
                      value={formData.university}
                      onValueChange={(v) =>
                        setFormData((d) => ({ ...d, university: v }))
                      }
                    >
                      <SelectTrigger className={cn(fieldClass, "w-full text-left")}>
                        <SelectValue placeholder="Select your university" />
                      </SelectTrigger>
                      <SelectContent className={selectContentClass}>
                        {universities.map((u) => (
                          <SelectItem
                            key={u}
                            value={u}
                            className="focus:bg-white/10 focus:text-white"
                          >
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {isBuyer ? (
                    <motion.div variants={formFieldEntry} className="flex flex-col gap-2">
                      <Label className="text-white/80">Academic Level</Label>
                      <Select
                        value={formData.academicLevel}
                        onValueChange={(v) =>
                          setFormData((d) => ({ ...d, academicLevel: v }))
                        }
                      >
                        <SelectTrigger className={cn(fieldClass, "w-full text-left")}>
                          <SelectValue placeholder="Select your level" />
                        </SelectTrigger>
                        <SelectContent className={selectContentClass}>
                          {academicLevels.map((l) => (
                            <SelectItem
                              key={l}
                              value={l}
                              className="focus:bg-white/10 focus:text-white"
                            >
                              {l}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  ) : (
                    <motion.div variants={formFieldEntry} className="flex flex-col gap-2">
                      <Label htmlFor="sellCategory" className="text-white/80">
                        What do you sell?
                      </Label>
                      <Input
                        id="sellCategory"
                        placeholder="e.g. textbooks, gadgets, fashion, snacks"
                        value={formData.sellCategory}
                        onChange={(e) =>
                          setFormData((d) => ({
                            ...d,
                            sellCategory: e.target.value,
                          }))
                        }
                        className={fieldClass}
                      />
                    </motion.div>
                  )}

                  {isBuyer ? (
                    <motion.div variants={formFieldEntry} className="flex flex-col gap-2">
                      <Label className="text-white/80">Interested Categories</Label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat, i) => (
                          <Chip
                            key={cat.label}
                            label={cat.label}
                            selected={cat.selected}
                            onClick={() => toggleCategory(i)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div variants={formFieldEntry} className="flex flex-col gap-2">
                      <Label className="text-white/80">How often would you sell?</Label>
                      <Select
                        value={formData.sellFrequency}
                        onValueChange={(v) =>
                          setFormData((d) => ({ ...d, sellFrequency: v }))
                        }
                      >
                        <SelectTrigger className={cn(fieldClass, "w-full text-left")}>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent className={selectContentClass}>
                          {sellFrequencies.map((f) => (
                            <SelectItem
                              key={f}
                              value={f}
                              className="focus:bg-white/10 focus:text-white"
                            >
                              {f}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}

                  <motion.div variants={formFieldEntry} className="flex flex-col gap-4 pt-2">
                    <Label className="text-base text-white/90">
                      {isBuyer
                        ? "What matters most to you as a buyer?"
                        : "What matters most to you as a seller?"}
                    </Label>
                    {poll.map((option, i) => (
                      <div key={option.label} className="flex items-center gap-4">
                        <Checkbox
                          id={`poll-${i}`}
                          checked={option.checked}
                          onCheckedChange={() => togglePoll(i)}
                          className="border-white/25 bg-white/5 data-checked:border-brand-start data-checked:bg-brand-start"
                        />
                        <label
                          htmlFor={`poll-${i}`}
                          className="cursor-pointer text-body-s text-white/80 select-none"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </motion.div>

                  {error ? (
                    <motion.div variants={formFieldEntry}>
                      <ErrorMessage error={error} onDismiss={() => setError(null)} />
                    </motion.div>
                  ) : null}

                  <motion.div variants={formFieldEntry}>
                    <Button
                      type="submit"
                      variant="glass-primary"
                      size="2xl"
                      className="mt-0 w-full font-semibold"
                      disabled={submitting}
                    >
                      {submitting
                        ? "Joining…"
                        : error?.retryable
                          ? "Try again →"
                          : "Join Waitlist →"}
                    </Button>
                  </motion.div>
                </motion.form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageShell>
  )
}
