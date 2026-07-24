"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [touched, setTouched] = useState({ email: false, password: false })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fieldErrors = {
    email: !email.trim()
      ? "Email is required."
      : !EMAIL_RE.test(email)
        ? "Enter a valid email address."
        : "",
    password: !password ? "Password is required." : "",
  }

  const showEmailError = touched.email && fieldErrors.email
  const showPasswordError = touched.password && fieldErrors.password

  function handleBlur(field: "email" | "password") {
    setTouched((t) => ({ ...t, [field]: true }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setTouched({ email: true, password: true })
    setSubmitted(true)

    if (fieldErrors.email || fieldErrors.password) return

    setSubmitting(true)
    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })
      if (res?.error) {
        setError("Invalid email or password.")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = email.trim() && password && !submitting

  return (
    <div className="page-atmosphere relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="page-noise" />

      <div className="form-spotlight relative z-10 flex w-full flex-col items-center">
        <div className="form-spotlight-glow" />

        <Image
          src="/logo.png"
          alt="Soldbay"
          width={180}
          height={72}
          className="relative z-10 mb-8 h-15 w-auto"
          priority
        />

        <div className="glass-panel-focus relative z-10 w-full max-w-sm rounded-xl p-8">
          <h1 className="mb-8 text-heading-l text-white">Admin login</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/15 px-4 py-3 text-sm font-medium text-red-200 backdrop-blur-sm"
              >
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-white/60">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@soldbay.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                aria-invalid={showEmailError ? true : undefined}
                className={cn(
                  "h-12 rounded-xl glass-input px-4 text-white placeholder:text-white/40 focus-visible:border-white/30 focus-visible:ring-white/20",
                  showEmailError && "border-red-400/60 ring-red-400/20"
                )}
              />
              {showEmailError && (
                <p className="text-body-s text-red-300">{fieldErrors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-white/60">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  aria-invalid={showPasswordError ? true : undefined}
                  className={cn(
                    "h-12 rounded-xl glass-input px-4 pr-11 text-white placeholder:text-white/40 focus-visible:border-white/30 focus-visible:ring-white/20",
                    showPasswordError && "border-red-400/60 ring-red-400/20"
                  )}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/70"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
              {showPasswordError && (
                <p className="text-body-s text-red-300">{fieldErrors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              size="xl"
              className="mt-2 w-full rounded-full font-semibold"
              disabled={!canSubmit}
            >
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
