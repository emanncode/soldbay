import { Hero } from "@/components/landing/hero";
import { JoinWaitlist } from "@/components/landing/join-waitlist";
import { HowItWorks } from "@/components/landing/how-it-works";
import { WhySoldbay } from "@/components/landing/why-soldbay";
import { SocialProof } from "@/components/landing/social-proof";
import { FaqQuestions } from "@/components/landing/faq-questions";
import { Footer } from "@/components/landing/footer";
import { PageShell } from "@/components/page-shell";
import { SiteNav } from "@/components/site-nav";
import { prisma } from "@/lib/prisma";

async function getWaitlistCount(): Promise<number> {
  try {
    return await prisma.waitlistSignup.count();
  } catch (error) {
    console.error("Waitlist count (home):", error);
    return 0;
  }
}

export default async function Home() {
  const waitlistCount = await getWaitlistCount();

  return (
    <PageShell>
      <SiteNav />
      <main>
        <Hero />
        <JoinWaitlist />
        <HowItWorks />
        <WhySoldbay />
        <SocialProof count={waitlistCount} />
        <FaqQuestions />
        <Footer />
      </main>
    </PageShell>
  );
}
