import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://retrotimeco.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RetroTimeCo | Buy Vintage Seiko, Casio & Swiss Watches in India",
    template: "%s | RetroTimeCo",
  },
  description: "Shop curated Japanese & Swiss vintage timepieces in India. Fully serviced, 100% authentic watches with express delivery. Browse rare Seiko, Casio, and luxury chronographs.",
  openGraph: {
    title: "RetroTimeCo | Vintage Watches in India",
    description: "Curated vintage Seiko, Casio & Swiss timepieces. Fully serviced & authenticated.",
    url: siteUrl,
    siteName: "RetroTimeCo",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Fallback OG image if available
        width: 1200,
        height: 630,
        alt: "RetroTimeCo Vintage Watches",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RetroTimeCo | Vintage Watches in India",
    description: "Curated vintage Seiko, Casio & Swiss timepieces. Fully serviced & authenticated.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RetroTimeCo",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: "Curated vintage Seiko, Casio & Swiss timepieces in India.",
  };

  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
      <body className="antialiased min-h-screen flex flex-col selection:bg-[var(--color-brand)] selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Nav />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
