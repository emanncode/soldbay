/**
 * Human-facing social proof from a real waitlist count.
 * Avoids fake inflated numbers while still feeling progressive as signups grow.
 */

export type WaitlistProof = {
  /** Big display line, e.g. "Be first", "12", "100+" */
  headline: string
  /** Main line under the headline */
  title: string
  /** Supporting sentence */
  subtitle: string
}

/**
 * Round down to the nearest 50 once we hit 100+
 * 100–149 → "100+", 150–199 → "150+", 200–249 → "200+", …
 */
export function formatWaitlistCountDisplay(count: number): string {
  if (count < 100) return String(count)
  const bucket = Math.floor(count / 50) * 50
  return `${bucket}+`
}

export function getWaitlistProof(count: number): WaitlistProof {
  const n = Math.max(0, Math.floor(count))

  if (n === 0) {
    return {
      headline: "Be first",
      title: "No one on the waitlist yet",
      subtitle:
        "Claim the first spot and help bring Soldbay to your campus when we launch.",
    }
  }

  if (n === 1) {
    return {
      headline: "1",
      title: "student already on the waitlist",
      subtitle:
        "You're early — join them and be ready when Soldbay goes live on campus.",
    }
  }

  if (n < 100) {
    return {
      headline: String(n),
      title: "students already on the waitlist",
      subtitle:
        "From campuses across Nigeria — join the list before launch day.",
    }
  }

  // 100+ → rounded buckets (100+, 150+, 200+, …)
  return {
    headline: formatWaitlistCountDisplay(n),
    title: "students already on the waitlist",
    subtitle:
      "Momentum is building across Nigerian campuses. Join the waitlist and get notified at launch.",
  }
}
