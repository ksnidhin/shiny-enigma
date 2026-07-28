import { fetchWatches } from "@/lib/api"
import { WatchCatalogGrid } from "@/components/store/WatchCatalogGrid"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "All Collections — RetroTimeCo",
  description: "Explore our complete horological catalog of Japanese & Swiss vintage timepieces, new Casio releases, and straps.",
}

export default async function AllCollectionsPage() {
  const result = await fetchWatches({})

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <WatchCatalogGrid 
        initialWatches={result.data}
        collectionSlug="all"
        availableBrands={result.available_brands}
        collectionTitle="The Complete Horological Archive"
        collectionSubtitle="Explore our entire inventory of 320+ verified timepieces. Filter by brand, era, price range, and mechanical specifications."
      />
    </div>
  )
}
