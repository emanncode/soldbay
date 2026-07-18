import type { Metadata } from "next";
import { Bricolage_Grotesque, Glaser_Stencil } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const glaserStencil = Glaser_Stencil({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Soldbay — Buy and sell on campus",
  description: "The marketplace built for university students.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${glaserStencil.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}