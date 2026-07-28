import { fetchWatches } from "@/lib/api"
import { WatchCatalogGrid } from "@/components/store/WatchCatalogGrid"
import { Metadata } from "next"
import { notFound } from "next/navigation"

const COLLECTION_META: Record<string, { title: string; subtitle: string }> = {
  "casio": {
    title: "New Casio Watches",
    subtitle: "Shop 199+ official Casio models online. Edifice slim quartz, Casio Royale world time, G-Shock carbon core, and vintage digital classics. 100% Authentic with 2-year Casio India warranty."
  },
  "japanese-vintage": {
    title: "Japanese Vintage Timepieces",
    subtitle: "From Tokyo to your wrist. Curated King Seiko, Grand Seiko, Citizen Bullhead chronographs, and Orient Super Compressors from the 1960s and 1970s Golden Era. Fully regulated in Mumbai."
  },
  "swiss-vintage": {
    title: "Swiss Vintage Timepieces — Maison Horlogère",
    subtitle: "81 Authenticated collector-grade pieces from Geneva and Le Locle. Featuring Tissot PRX automatic classics, 1960s Omega Seamasters, and Universal Genève microrotor masterpieces."
  },
  "luxury-chronographs": {
    title: "Luxury Chronographs — Precision Racing & Pilot Timepieces",
    subtitle: "High-precision mechanical and quartz chronographs engineered for motorsport, aviation, and daily luxury wear. Verified authenticity."
  },
  "straps-accessories": {
    title: "Straps, Clasps & Horological Accessories",
    subtitle: "Preserve and customize your timepieces. High precision solid brass & steel butterfly deployant clasps, seatbelt weave NATO straps, and handmade Italian leather bands."
  },
  "all": {
    title: "The Complete Horological Archive",
    subtitle: "Explore our entire inventory of 320+ verified timepieces. Filter by brand, era, price range, and mechanical specifications."
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const meta = COLLECTION_META[resolvedParams.slug.toLowerCase()] || COLLECTION_META["all"]
  return {
    title: `${meta.title} — RetroTimeCo`,
    description: meta.subtitle,
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const slug = resolvedParams.slug.toLowerCase()
  
  if (!COLLECTION_META[slug] && slug !== "all") {
    notFound()
  }

  const result = await fetchWatches(slug === "all" ? {} : { collection: slug })
  const meta = COLLECTION_META[slug] || COLLECTION_META["all"]

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <WatchCatalogGrid 
        initialWatches={result.data}
        collectionSlug={slug}
        availableBrands={result.available_brands}
        collectionTitle={meta.title}
        collectionSubtitle={meta.subtitle}
      />
    </div>
  )
}
