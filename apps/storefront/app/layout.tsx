import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomDock } from "@/components/layout/MobileBottomDock";

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
    default: "Vintage Watches in India | RetroTimeCo",
    template: "%s | RetroTimeCo",
  },
  description: "Discover authentic vintage Seiko, HMT, Citizen, Casio and Swiss watches at RetroTimeCo. Carefully curated timepieces, inspected and shipped across India.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Vintage Watches in India | RetroTimeCo",
    description: "Discover authentic vintage Seiko, HMT, Citizen, Casio and Swiss watches at RetroTimeCo. Carefully curated timepieces, inspected and shipped across India.",
    url: siteUrl,
    siteName: "RetroTimeCo",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/brand_japanese_hq.jpg",
        width: 1200,
        height: 630,
        alt: "RetroTimeCo Curated Vintage Watches India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vintage Watches in India | RetroTimeCo",
    description: "Discover authentic vintage Seiko, HMT, Citizen, Casio and Swiss watches at RetroTimeCo. Carefully curated timepieces, inspected and shipped across India.",
    images: ["/brand_japanese_hq.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "RetroTimeCo",
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        description: "Curated vintage Seiko, HMT, Citizen, Casio & Swiss timepieces in India.",
        areaServed: {
          "@type": "Country",
          name: "India",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "RetroTimeCo",
        description: "Authentic Vintage Watches in India",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-[#F4EFE6] text-[#11161B] selection:bg-[#C85A17] selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Nav />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
        <MobileBottomDock />
      </body>
    </html>
  );
}
