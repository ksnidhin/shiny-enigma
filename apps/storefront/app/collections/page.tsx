import { fetchWatches } from "@/lib/api"
import { WatchCatalogGrid } from "@/components/store/WatchCatalogGrid"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "All Collections — RetroTimeCo",
  description: "Explore our complete horological catalog of Japanese & Swiss vintage timepieces, new Casio releases, and straps.",
}

export default async function AllCollectionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; limit?: string; [key: string]: string | undefined }>
}) {
  const resolvedParams = searchParams ? await searchParams : {}
  const page = Math.max(1, parseInt(resolvedParams.page || "1", 10) || 1)
  const limit = resolvedParams.limit ? parseInt(resolvedParams.limit, 10) || 50 : 50
  const result = await fetchWatches({ page, limit })

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <WatchCatalogGrid 
        initialWatches={result.data}
        initialTotal={result.total}
        initialPage={result.page || page}
        initialLimit={result.limit || limit}
        initialTotalPages={result.total_pages || Math.ceil((result.total || 0) / limit)}
        collectionSlug="all"
        availableBrands={result.available_brands}
        collectionTitle="The Complete Horological Archive"
        collectionSubtitle={`Explore our entire inventory of ${result.total || ''} verified timepieces. Filter by brand, era, price range, and mechanical specifications.`}
      />
    </div>
  )
}
