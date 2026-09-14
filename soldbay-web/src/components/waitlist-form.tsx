"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, useReducedMotion } from "framer-motion";
import { formCardEntry, formFieldEntry, soldbayEase } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ErrorMessage } from "@/components/ui/error-message";
import {
  appErrorFromNetwork,
  appErrorFromResponse,
  type AppError,
} from "@/lib/api-error";
import { universities } from "@/lib/universities";

const academicLevels = ["100L", "200L", "300L", "400L", "500L", "Postgraduate"];
const sellFrequencies = ["Daily", "Weekly", "Occasionally"];

/** Shared field look — surface card bg with cream (background) inputs */
const fieldClass =
  "h-12 w-full rounded-xl border-none bg-background px-4 shadow-none focus-visible:border-ring/60";

const selectContentClass =
  "rounded-xl border border-none bg-popover text-popover-foreground shadow-elevation-3";

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-[13px] font-medium transition-all",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground/70 hover:border-primary/40 hover:bg-muted hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

interface PollOption {
  label: string;
  checked: boolean;
}

interface WaitlistFormProps {
  type: "buyer" | "seller";
  /** When provided, called after a successful signup (e.g. navigate away). Otherwise an inline success state shows. */
  onSuccess?: () => void;
}

export function WaitlistForm({ type, onSuccess }: WaitlistFormProps) {
  const isBuyer = type === "buyer";
  const reduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    academicLevel: "",
    sellCategory: "",
    sellFrequency: "",
  });

  const [categories, setCategories] = useState([
    { label: "Textbooks", selected: false },
    { label: "Electronics", selected: false },
    { label: "Fashion", selected: false },
    { label: "Food & Drinks", selected: false },
    { label: "Services", selected: false },
    { label: "Housing", selected: false },
    { label: "Other", selected: false },
  ]);

  const [otherCategory, setOtherCategory] = useState("");

  const buyerPollOptions = [
    "Verified sellers",
    "Secure payments",
    "Campus delivery",
    "In-app chat",
    "Buyer protection",
  ];

  const sellerPollOptions = [
    "Easy listings",
    "Fast payouts",
    "Buyer reach",
    "Secure payments",
    "In-app chat",
  ];

  const [poll, setPoll] = useState<PollOption[]>(
    (isBuyer ? buyerPollOptions : sellerPollOptions).map((label) => ({
      label,
      checked: false,
    })),
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [sent, setSent] = useState(false);

  const toggleCategory = (index: number) => {
    setCategories((prev) =>
      prev.map((c, i) => (i === index ? { ...c, selected: !c.selected } : c)),
    );
    if (categories[index]?.label === "Other" && categories[index].selected) {
      setOtherCategory("");
    }
  };

  const togglePoll = (index: number) => {
    setPoll((prev) =>
      prev.map((p, i) => (i === index ? { ...p, checked: !p.checked } : p)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

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
          categories: categories
            .filter((c) => c.selected && c.label !== "Other")
            .map((c) => c.label)
            .concat(
              categories.some((c) => c.label === "Other" && c.selected) &&
                otherCategory.trim()
                ? [otherCategory.trim()]
                : [],
            ),
          pollAnswers: poll.filter((p) => p.checked).map((p) => p.label),
        }),
      });

      if (res.status === 201) {
        if (onSuccess) {
          onSuccess();
          return;
        }
        setSent(true);
        return;
      }

      setError(await appErrorFromResponse(res));
    } catch {
      setError(appErrorFromNetwork());
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <Card className="rounded-2xl border border-border bg-surface py-0 text-center shadow-none ring-0">
        <CardHeader className="items-center px-8 pt-12 md:px-12">
          <motion.div
            variants={formFieldEntry}
            className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-success shadow-elevation-3"
          >
            <motion.svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.15, ease: soldbayEase }}
            >
              <motion.path
                d="M20 6L9 17l-5-5"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.2, ease: soldbayEase }}
              />
            </motion.svg>
          </motion.div>

          <motion.div variants={formFieldEntry}>
            <CardTitle className="font-display text-3xl font-medium text-foreground">
              You&rsquo;re on the list!
            </CardTitle>
            <CardDescription className="mt-4 max-w-sm text-[16px] leading-relaxed text-secondary">
              We&rsquo;ll notify you when Soldbay launches on your campus. Hang
              tight, we&rsquo;ll be there soon.
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="flex flex-col items-center px-8 pb-10 md:px-12">
          <motion.div variants={formFieldEntry} className="mt-2">
            <Button
              variant="outline"
              onClick={() => {
                setSent(false);
                setOtherCategory("");
                setPoll(
                  (isBuyer ? buyerPollOptions : sellerPollOptions).map(
                    (label) => ({ label, checked: false }),
                  ),
                );
              }}
              className="rounded-full px-7 font-medium"
            >
              Join the other side
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  const shell = (
    <Card className="rounded-2xl border border-border bg-surface py-0 shadow-none ring-0">
      <CardHeader className="px-8 pt-8 md:px-12 md:pt-12">
        <CardTitle className="font-display text-2xl font-medium text-foreground">
          {isBuyer ? "Join as a Buyer" : "Become a Seller"}
        </CardTitle>
        <CardDescription className="mt-2 text-[14px] text-secondary">
          {isBuyer
            ? "Get notified when Soldbay launches on your campus."
            : "Start selling to students on your campus."}
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
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((d) => ({ ...d, name: e.target.value }))
              }
              className={fieldClass}
            />
          </motion.div>

          <motion.div
            variants={formFieldEntry}
            className="flex flex-col gap-2"
          >
            <Label htmlFor="email">Email Address</Label>
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

          <motion.div
            variants={formFieldEntry}
            className="flex flex-col gap-2"
          >
            <Label>University</Label>
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
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {isBuyer ? (
            <motion.div
              variants={formFieldEntry}
              className="flex flex-col gap-2"
            >
              <Label>Academic Level</Label>
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
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          ) : (
            <motion.div
              variants={formFieldEntry}
              className="flex flex-col gap-2"
            >
              <Label htmlFor="sellCategory">What do you sell?</Label>
              <Input
                id="sellCategory"
                type="text"
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
            <motion.div
              variants={formFieldEntry}
              className="flex flex-col gap-2"
            >
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
              {categories.some((c) => c.label === "Other" && c.selected) ? (
                <Input
                  type="text"
                  placeholder="Tell us what category you're interested in"
                  value={otherCategory}
                  onChange={(e) => setOtherCategory(e.target.value)}
                  className={fieldClass}
                />
              ) : null}
            </motion.div>
          ) : (
            <motion.div
              variants={formFieldEntry}
              className="flex flex-col gap-2"
            >
              <Label>How often would you sell?</Label>
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
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}

          <motion.div
            variants={formFieldEntry}
            className="flex flex-col gap-4 pt-2"
          >
            <Label className="text-base">
              {isBuyer
                ? "What matters most to you as a buyer?"
                : "What matters most to you as a seller?"}
            </Label>
            {poll.map((option, i) => (
              <div
                key={option.label}
                className="flex items-center gap-4"
              >
                <Checkbox
                  id={`poll-${i}`}
                  checked={option.checked}
                  onCheckedChange={() => togglePoll(i)}
                  className="border-border bg-background data-checked:border-primary data-checked:bg-primary"
                />
                <label
                  htmlFor={`poll-${i}`}
                  className="cursor-pointer text-[14px] text-foreground/80 select-none"
                >
                  {option.label}
                </label>
              </div>
            ))}
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
              size="xl"
              className="mt-0 w-full rounded-full font-semibold"
              disabled={submitting}
            >
              {submitting
                ? "Joining…"
                : error?.retryable
                  ? "Try again →"
                  : "Join the waitlist →"}
            </Button>
          </motion.div>
        </motion.form>
      </CardContent>
    </Card>
  );

  return shell;
}