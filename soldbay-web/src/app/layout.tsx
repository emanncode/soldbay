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
  metadataBase: new URL("https://soldbay.shop"),
  title: {
    default: "Soldbay — Campus Marketplace & Student Peer-to-Peer Escrow Trade | by EmannCode",
    template: "%s | Soldbay",
  },
  description:
    "Soldbay (soldbay.shop) is the student campus marketplace engineered by EmannCode. Safe peer-to-peer trading with student matric verification and escrow protection.",
  keywords: [
    "Soldbay",
    "SoldBay",
    "soldbay.shop",
    "campus marketplace",
    "student marketplace",
    "university trade",
    "peer to peer campus trade",
    "EmannCode",
    "EmannCode Soldbay",
    "Ifeoluwa Olajubaje",
    "campus escrow shopping",
  ],
  authors: [{ name: "EmannCode (Ifeoluwa Olajubaje)", url: "https://emanncode.work" }],
  creator: "EmannCode (Ifeoluwa Olajubaje)",
  publisher: "Soldbay",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Soldbay — Campus Marketplace & Student Peer-to-Peer Escrow Trade | by EmannCode",
    description:
      "Soldbay (soldbay.shop) is the student campus marketplace engineered by EmannCode. Safe peer-to-peer trading with student matric verification and escrow protection.",
    url: "https://soldbay.shop",
    siteName: "Soldbay",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Soldbay — Campus Marketplace by EmannCode",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Soldbay — Campus Marketplace & Student Peer-to-Peer Escrow Trade | by EmannCode",
    description:
      "Soldbay (soldbay.shop) is the student campus marketplace engineered by EmannCode. Safe peer-to-peer trading with student matric verification and escrow protection.",
    images: ["/icon.png"],
    creator: "@emanncode",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://soldbay.shop/#website",
      url: "https://soldbay.shop",
      name: "Soldbay",
      alternateName: ["SoldBay", "soldbay.shop", "Soldbay Campus Marketplace"],
      description:
        "Peer-to-peer campus marketplace for students to buy and sell safely with matric verification and escrow protection.",
      publisher: {
        "@type": "Person",
        name: "EmannCode",
        alternateName: "Ifeoluwa Olajubaje",
        url: "https://emanncode.work",
      },
    },
    {
      "@type": "WebApplication",
      "@id": "https://soldbay.shop/#app",
      name: "Soldbay",
      alternateName: "Soldbay Campus Marketplace",
      applicationCategory: "ShoppingApplication",
      operatingSystem: "Web, iOS, Android",
      url: "https://soldbay.shop",
      description:
        "Student marketplace platform engineered by EmannCode featuring verified matric handoffs and escrow payment protection.",
      creator: {
        "@type": "Person",
        name: "EmannCode",
        alternateName: "Ifeoluwa Olajubaje",
        url: "https://emanncode.work",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "NGN",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://soldbay.shop/#organization",
      name: "Soldbay",
      url: "https://soldbay.shop",
      founder: {
        "@type": "Person",
        name: "EmannCode",
        alternateName: "Ifeoluwa Olajubaje",
        url: "https://emanncode.work",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", sora.variable)} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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