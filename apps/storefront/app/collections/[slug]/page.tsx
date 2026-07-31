import { fetchWatches } from "@/lib/api"
import { WatchCatalogGrid } from "@/components/store/WatchCatalogGrid"
import { Metadata } from "next"
import { notFound } from "next/navigation"

const getCollectionMeta = (slug: string, count?: number): { title: string; subtitle: string } => {
  const meta: Record<string, { title: string; subtitle: string }> = {
    "casio": {
      title: "New Casio Watches",
      subtitle: `Shop ${count || ''} official Casio models online. Edifice slim quartz, Casio Royale world time, G-Shock carbon core, and vintage digital classics. 100% Authentic.`
    },
    "japanese-vintage": {
      title: "Japanese Vintage Timepieces",
      subtitle: `From Tokyo to your wrist. Curated King Seiko, Grand Seiko, Citizen Bullhead chronographs, and Orient Super Compressors from the 1960s and 1970s Golden Era. Fully regulated in Chennai.`
    },
    "swiss-vintage": {
      title: "Swiss Vintage Timepieces — Maison Horlogère",
      subtitle: `${count || ''} Authenticated collector-grade pieces from Geneva and Le Locle. Featuring Tissot PRX automatic classics, 1960s Omega Seamasters, and Universal Genève microrotor masterpieces.`
    },
    "luxury-chronographs": {
      title: "Luxury Chronographs — Precision Racing & Pilot Timepieces",
      subtitle: "High-precision mechanical and quartz chronographs engineered for motorsport, aviation, and daily luxury wear. Verified authenticity."
    },
    "straps-accessories": {
      title: "Straps, Clasps & Horological Accessories",
      subtitle: "Preserve and customize your timepieces. High precision solid brass & steel butterfly deployant clasps, seatbelt weave NATO straps, and handmade Italian leather bands."
    },
    "hmt-watches": {
      title: "HMT Watches",
      subtitle: "Heritage Indian Timepieces. Rare, vintage, and fully restored hand-wound mechanical watches."
    },
    "all": {
      title: "The Complete Horological Archive",
      subtitle: `Explore our entire inventory of ${count || ''} verified timepieces. Filter by brand, era, price range, and mechanical specifications.`
    }
  }
  return meta[slug] || meta["all"]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const meta = getCollectionMeta(resolvedParams.slug.toLowerCase())
  return {
    title: `${meta.title} — RetroTimeCo`,
    description: meta.subtitle,
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const slug = resolvedParams.slug.toLowerCase()
  
  const result = await fetchWatches(slug === "all" ? {} : { collection: slug })
  
  if (result.data.length === 0 && slug !== "all") {
    // If no products, fallback to not found or just show empty. Let's just show empty for now, unless slug is completely invalid.
    // Assuming valid slugs are those in the getCollectionMeta switch.
    if (!["casio", "japanese-vintage", "swiss-vintage", "luxury-chronographs", "straps-accessories", "hmt-watches"].includes(slug)) {
       notFound()
    }
  }

  const metaCount = slug === "all" ? result.total : result.count;
  const meta = getCollectionMeta(slug, metaCount)

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
