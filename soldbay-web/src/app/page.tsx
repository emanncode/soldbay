import { Header } from "@/components/layout/header";
import { Hero } from "@/components/layout/hero";
import { HowItWorks } from "@/components/layout/how-it-works";
import { Features } from "@/components/layout/features";
import { Cta } from "@/components/layout/cta";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <Cta />
      <Footer />
    </main>
  );
}
