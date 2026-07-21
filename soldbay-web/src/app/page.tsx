import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { SocialProof } from "@/components/landing/social-proof"
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"
import { PageShell } from "@/components/page-shell"
import { prisma } from "@/lib/prisma"

async function getWaitlistCount(): Promise<number> {
  try {
    return await prisma.waitlistSignup.count()
  } catch (error) {
    console.error("Waitlist count (home):", error)
    return 0
  }
}

export default async function Home() {
  const waitlistCount = await getWaitlistCount()

  return (
    <PageShell>
      <main>
        <Hero />
        <HowItWorks />
        <SocialProof count={waitlistCount} />
        <FAQ />
        <Footer />
      </main>
    </PageShell>
  )
}
