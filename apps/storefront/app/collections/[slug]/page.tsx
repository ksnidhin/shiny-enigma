import { fetchWatches } from "@/lib/api"
import { WatchCatalogGrid } from "@/components/store/WatchCatalogGrid"
import { Metadata } from "next"
import Link from "next/link"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://retrotimeco.in"

interface CollectionMeta {
  title: string
  seoTitle: string
  subtitle: string
  canonicalSlug: string
  query: { collection?: string; brand?: string }
}

const COLLECTION_REGISTRY: Record<string, CollectionMeta> = {
  "vintage-watches": {
    title: "Curated Vintage Watches in India",
    seoTitle: "Vintage Watches in India | Curated Horological Archive",
    subtitle: "Explore authentic vintage watches in India. Curated mechanical and quartz timepieces from Seiko, HMT, Citizen, Casio & Swiss makers. Inspected, regulated and guaranteed.",
    canonicalSlug: "vintage-watches",
    query: {},
  },
  "seiko": {
    title: "Vintage Seiko Watches India",
    seoTitle: "Vintage Seiko Watches India | Classic Seiko 5 & Automatics",
    subtitle: "Shop authentic vintage Seiko watches in India. Serviced Seiko 5 automatics, King Seiko, Actus, and Suwa factory calibers. 100% verified with pan-India delivery.",
    canonicalSlug: "seiko",
    query: { brand: "Seiko" },
  },
  "seiko-vintage": {
    title: "Vintage Seiko Watches India",
    seoTitle: "Vintage Seiko Watches India | Classic Seiko 5 & Automatics",
    subtitle: "Shop authentic vintage Seiko watches in India. Serviced Seiko 5 automatics, King Seiko, Actus, and Suwa factory calibers. 100% verified with pan-India delivery.",
    canonicalSlug: "seiko",
    query: { brand: "Seiko" },
  },
  "hmt-watches": {
    title: "Original HMT Vintage Watches",
    seoTitle: "HMT Vintage Watches India | Authentic Mechanical Timepieces",
    subtitle: "Buy original vintage HMT watches online in India. Rare hand-wound Janata, Pilot, Kohinoor, and Tareeq timepieces, fully serviced with Bengaluru heritage.",
    canonicalSlug: "hmt-watches",
    query: { collection: "hmt-watches" },
  },
  "hmt": {
    title: "Original HMT Vintage Watches",
    seoTitle: "HMT Vintage Watches India | Authentic Mechanical Timepieces",
    subtitle: "Buy original vintage HMT watches online in India. Rare hand-wound Janata, Pilot, Kohinoor, and Tareeq timepieces, fully serviced with Bengaluru heritage.",
    canonicalSlug: "hmt-watches",
    query: { collection: "hmt-watches" },
  },
  "hmt-vintage": {
    title: "Original HMT Vintage Watches",
    seoTitle: "HMT Vintage Watches India | Authentic Mechanical Timepieces",
    subtitle: "Buy original vintage HMT watches online in India. Rare hand-wound Janata, Pilot, Kohinoor, and Tareeq timepieces, fully serviced with Bengaluru heritage.",
    canonicalSlug: "hmt-watches",
    query: { collection: "hmt-watches" },
  },
  "citizen": {
    title: "Vintage Citizen Watches India",
    seoTitle: "Vintage Citizen Watches India | Eagle 7 & Automatic Classics",
    subtitle: "Discover vintage Citizen watches in India. Collectible Citizen Eagle 7 automatics, vintage TV dial models, and precision Miyota mechanical movements.",
    canonicalSlug: "citizen",
    query: { brand: "Citizen" },
  },
  "citizen-vintage": {
    title: "Vintage Citizen Watches India",
    seoTitle: "Vintage Citizen Watches India | Eagle 7 & Automatic Classics",
    subtitle: "Discover vintage Citizen watches in India. Collectible Citizen Eagle 7 automatics, vintage TV dial models, and precision Miyota mechanical movements.",
    canonicalSlug: "citizen",
    query: { brand: "Citizen" },
  },
  "casio": {
    title: "Vintage & Retro Casio Watches",
    seoTitle: "Vintage Casio Watches India | Retro Digital & Quartz Classics",
    subtitle: "Authentic vintage and retro Casio watches in India. World Time, Databank, Telememo, Twincept, and G-Shock classics, fully tested and authenticated.",
    canonicalSlug: "casio",
    query: { collection: "casio" },
  },
  "casio-vintage": {
    title: "Vintage & Retro Casio Watches",
    seoTitle: "Vintage Casio Watches India | Retro Digital & Quartz Classics",
    subtitle: "Authentic vintage and retro Casio watches in India. World Time, Databank, Telememo, Twincept, and G-Shock classics, fully tested and authenticated.",
    canonicalSlug: "casio",
    query: { collection: "casio" },
  },
  "orient": {
    title: "Vintage Orient Watches India",
    seoTitle: "Vintage Orient Watches India | Three Star & Automatic Classics",
    subtitle: "Explore vintage Orient mechanical automatics in India. Distinctive 1970s dial finishes, robust in-house calibers, and classic vintage Japanese design.",
    canonicalSlug: "orient",
    query: { brand: "Orient" },
  },
  "orient-vintage": {
    title: "Vintage Orient Watches India",
    seoTitle: "Vintage Orient Watches India | Three Star & Automatic Classics",
    subtitle: "Explore vintage Orient mechanical automatics in India. Distinctive 1970s dial finishes, robust in-house calibers, and classic vintage Japanese design.",
    canonicalSlug: "orient",
    query: { brand: "Orient" },
  },
  "japanese-vintage": {
    title: "Japanese Vintage Timepieces",
    seoTitle: "Japanese Vintage Watches India | Seiko, Citizen & Orient",
    subtitle: "From Tokyo to your wrist. Curated King Seiko, Grand Seiko, Citizen Bullhead chronographs, and Orient Super Compressors from the 1960s and 1970s Golden Era. Fully regulated before dispatch.",
    canonicalSlug: "japanese-vintage",
    query: { collection: "japanese-vintage" },
  },
  "swiss-vintage": {
    title: "Swiss Vintage Timepieces — Maison Horlogère",
    seoTitle: "Swiss Vintage Watches India | Serviced Mechanical Timepieces",
    subtitle: "Authenticated collector-grade pieces from Geneva, Le Locle and Biel. Featuring Sandoz, Favre-Leuba, Omega, Tissot, and Rado timepieces with verified Swiss movements.",
    canonicalSlug: "swiss-vintage",
    query: { collection: "swiss-vintage" },
  },
  "luxury-chronographs": {
    title: "Luxury Vintage Chronographs",
    seoTitle: "Luxury Vintage Chronographs India | Precision Pilot & Racing Watches",
    subtitle: "High-precision mechanical and quartz chronographs engineered for motorsport, aviation, and daily luxury wear. Verified authenticity.",
    canonicalSlug: "luxury-chronographs",
    query: { collection: "luxury-chronographs" },
  },
  "straps-accessories": {
    title: "Straps, Clasps & Horological Accessories",
    seoTitle: "Watch Straps & Horological Accessories India | RetroTimeCo",
    subtitle: "Preserve and customize your timepieces. High precision solid brass & steel butterfly deployant clasps, seatbelt weave NATO straps, and handmade Italian leather bands.",
    canonicalSlug: "straps-accessories",
    query: { collection: "straps-accessories" },
  },
  "all": {
    title: "The Complete Horological Archive",
    seoTitle: "The Complete Horological Archive | Vintage Watches India",
    subtitle: "Explore our entire archive of verified vintage timepieces. Filter by Japanese, Swiss, Indian makers, mechanical movements, and price ranges.",
    canonicalSlug: "all",
    query: {},
  },
}

function resolveCollection(rawSlug: string): CollectionMeta {
  const slug = rawSlug.toLowerCase()
  if (COLLECTION_REGISTRY[slug]) {
    return COLLECTION_REGISTRY[slug]
  }

  // Fallback for dynamic categories
  const formatted = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  return {
    title: formatted,
    seoTitle: `${formatted} Vintage Watches India`,
    subtitle: `Explore authentic vintage ${formatted} timepieces in India. Serviced and regulated with express insured delivery.`,
    canonicalSlug: slug,
    query: { collection: slug },
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const meta = resolveCollection(resolvedParams.slug)
  const canonicalUrl = `${siteUrl}/collections/${meta.canonicalSlug}`

  return {
    title: meta.seoTitle,
    description: meta.subtitle,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${meta.seoTitle} | RetroTimeCo`,
      description: meta.subtitle,
      url: canonicalUrl,
      siteName: "RetroTimeCo",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.seoTitle} | RetroTimeCo`,
      description: meta.subtitle,
    },
  }
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ page?: string; limit?: string; [key: string]: string | undefined }>
}) {
  const resolvedParams = await params
  const resolvedSearch = searchParams ? await searchParams : {}
  const rawSlug = resolvedParams.slug.toLowerCase()
  const meta = resolveCollection(rawSlug)

  const page = Math.max(1, parseInt(resolvedSearch.page || "1", 10) || 1)
  const limit = resolvedSearch.limit ? parseInt(resolvedSearch.limit, 10) || 50 : 50

  const result = await fetchWatches({
    ...meta.query,
    page,
    limit,
  })

  // Structured Data: BreadcrumbList + ItemList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collections",
        item: `${siteUrl}/collections/all`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: meta.title,
        item: `${siteUrl}/collections/${meta.canonicalSlug}`,
      },
    ],
  }

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: meta.title,
    description: meta.subtitle,
    numberOfItems: result.total || result.data.length,
    itemListElement: result.data.slice(0, 20).map((watch, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: watch.name,
      url: `${siteUrl}/products/${watch.slug}`,
    })),
  }

  // Related collections for crawlable internal linking
  const relatedCollections = [
    { name: "Vintage Watches India", href: "/collections/vintage-watches" },
    { name: "Vintage Seiko", href: "/collections/seiko" },
    { name: "HMT Vintage", href: "/collections/hmt-watches" },
    { name: "Vintage Citizen", href: "/collections/citizen" },
    { name: "Vintage Casio", href: "/collections/casio" },
    { name: "Japanese Vintage", href: "/collections/japanese-vintage" },
    { name: "Swiss Vintage", href: "/collections/swiss-vintage" },
  ].filter((c) => !c.href.endsWith(`/${meta.canonicalSlug}`))

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      
      <WatchCatalogGrid
        initialWatches={result.data}
        initialTotal={result.total}
        initialPage={result.page || page}
        initialLimit={result.limit || limit}
        initialTotalPages={result.total_pages || Math.ceil((result.total || 0) / limit)}
        collectionSlug={rawSlug}
        availableBrands={result.available_brands}
        collectionTitle={meta.title}
        collectionSubtitle={meta.subtitle}
      />

      {/* Internal Linking: Related Collections Navigation */}
      <section className="border-t border-[#D8D1C5] bg-[#EAE4D9]/50 py-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl">
            <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#C85A17] uppercase block mb-2">
              EXPLORE MORE TIMEPIECES
            </span>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-[#11161B] mb-4">
              Related Vintage Collections
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {relatedCollections.map((col) => (
                <Link
                  key={col.href}
                  href={col.href}
                  className="px-3.5 py-1.5 bg-[#F8F5EE] border border-[#D8D1C5] hover:border-[#C85A17] hover:text-[#C85A17] text-xs font-mono font-medium text-[#11161B] transition-colors"
                >
                  {col.name} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
