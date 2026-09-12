import type { Metadata } from "next";
import { Sora, Fraunces, Satisfy } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/auth-provider";

const sora = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
    <html lang="en" className={cn("font-sans", sora.variable)} suppressHydrationWarning>
      <body
        className={`${sora.variable} ${fraunces.variable} ${satisfy.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}