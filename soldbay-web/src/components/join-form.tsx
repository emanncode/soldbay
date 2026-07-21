"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion } from "framer-motion"
import { soldbayEase } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { ErrorMessage } from "@/components/ui/error-message"
import {
  appErrorFromNetwork,
  appErrorFromResponse,
  type AppError,
} from "@/lib/api-error"

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
        "inline-flex items-center rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all",
        selected
          ? "border-brand-start bg-brand-start text-white"
          : "border-border bg-white text-text-primary hover:border-text-tertiary",
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
    <div className="flex min-h-[calc(100vh-5.5rem)] flex-col bg-[#0b0b10]">
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: soldbayEase }}
          className="w-full max-w-140 rounded-[24px] bg-white p-8 shadow-lg md:p-12"
        >
          <h1 className="font-display text-heading-l text-text-primary">
            {isBuyer ? "Join as a Buyer" : "Become a Seller"}
          </h1>
          <p className="mt-1 text-body-s text-text-secondary">
            {isBuyer
              ? "Get notified when Soldbay launches on your campus."
              : "Start selling to students on your campus."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                required
                value={formData.name}
                onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                className="rounded-md border-border bg-white/50 px-3.5 py-2.5"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu.ng"
                required
                value={formData.email}
                onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                className="rounded-md border-border bg-white/50 px-3.5 py-2.5"
              />
            </div>

            {/* University */}
            <div className="flex flex-col gap-1.5">
              <Label>University</Label>
              <Select
                value={formData.university}
                onValueChange={(v) => setFormData((d) => ({ ...d, university: v }))}
              >
                <SelectTrigger className="h-10 w-full rounded-md border-border bg-white/50 px-3.5 text-left">
                  <SelectValue placeholder="Select your university" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Academic Level (buyer) or What they sell (seller) */}
            {isBuyer ? (
              <div className="flex flex-col gap-1.5">
                <Label>Academic Level</Label>
                <Select
                  value={formData.academicLevel}
                  onValueChange={(v) => setFormData((d) => ({ ...d, academicLevel: v }))}
                >
                  <SelectTrigger className="h-10 w-full rounded-md border-border bg-white/50 px-3.5 text-left">
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicLevels.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sellCategory">What do you sell?</Label>
                <Input
                  id="sellCategory"
                  placeholder="e.g. textbooks, gadgets, fashion, snacks"
                  value={formData.sellCategory}
                  onChange={(e) => setFormData((d) => ({ ...d, sellCategory: e.target.value }))}
                  className="rounded-md border-border bg-white/50 px-3.5 py-2.5"
                />
              </div>
            )}

            {/* Categories chips (buyer) or Sell frequency (seller) */}
            {isBuyer ? (
              <div className="flex flex-col gap-2">
                <Label>Interested Categories</Label>
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
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <Label>How often would you sell?</Label>
                <Select
                  value={formData.sellFrequency}
                  onValueChange={(v) => setFormData((d) => ({ ...d, sellFrequency: v }))}
                >
                  <SelectTrigger className="h-10 w-full rounded-md border-border bg-white/50 px-3.5 text-left">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {sellFrequencies.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Poll question */}
            <div className="flex flex-col gap-3 pt-2">
              <Label className="text-base">
                {isBuyer
                  ? "What matters most to you as a buyer?"
                  : "What matters most to you as a seller?"}
              </Label>
              {poll.map((option, i) => (
                <div key={option.label} className="flex items-center gap-3">
                  <Checkbox
                    id={`poll-${i}`}
                    checked={option.checked}
                    onCheckedChange={() => togglePoll(i)}
                    className="border-border data-[state=checked]:bg-brand-start data-[state=checked]:border-brand-start"
                  />
                  <label
                    htmlFor={`poll-${i}`}
                    className="text-body-s text-text-primary cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>

            {error ? (
              <ErrorMessage error={error} onDismiss={() => setError(null)} />
            ) : null}

            <Button
              type="submit"
              variant="default"
              size="2xl"
              className="mt-2 w-full"
              disabled={submitting}
            >
              {submitting
                ? "Joining…"
                : error?.retryable
                  ? "Try again →"
                  : "Join Waitlist →"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
