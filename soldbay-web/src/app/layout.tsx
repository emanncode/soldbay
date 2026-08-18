import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Satisfy } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/auth-provider";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const satisfy = Satisfy({
  variable: "--font-satisfy",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "SoldBay — Buy and sell on campus",
  description: "The marketplace built for university students.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)} suppressHydrationWarning>
      <body
        className={`${display.variable} ${inter.variable} ${satisfy.variable} min-h-screen bg-[#070606] font-sans text-white antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}