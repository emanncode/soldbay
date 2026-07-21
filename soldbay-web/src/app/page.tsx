import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { SocialProof } from "@/components/landing/social-proof"
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <SocialProof />
      <FAQ />
      <Footer />
    </main>
  )
}
