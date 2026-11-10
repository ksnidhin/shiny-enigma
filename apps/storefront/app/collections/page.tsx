import { fetchWatches } from "@/lib/api"
import { WatchCatalogGrid } from "@/components/store/WatchCatalogGrid"
import { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://retrotimeco.in"

export const metadata: Metadata = {
  title: "The Complete Horological Archive | Vintage Watches India",
  description: "Explore our entire archive of verified vintage timepieces. Curated Japanese, Swiss, and Indian mechanical watches, inspected and shipped across India.",
  alternates: {
    canonical: `${siteUrl}/collections/all`,
  },
  openGraph: {
    title: "The Complete Horological Archive | Vintage Watches India",
    description: "Explore our entire archive of verified vintage timepieces. Curated Japanese, Swiss, and Indian mechanical watches, inspected and shipped across India.",
    url: `${siteUrl}/collections/all`,
    siteName: "RetroTimeCo",
    locale: "en_IN",
    type: "website",
  },
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
    ],
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <WatchCatalogGrid 
        initialWatches={result.data}
        initialTotal={result.total}
        initialPage={result.page || page}
        initialLimit={result.limit || limit}
        initialTotalPages={result.total_pages || Math.ceil((result.total || 0) / limit)}
        collectionSlug="all"
        availableBrands={result.available_brands}
        collectionTitle="The Complete Horological Archive"
        collectionSubtitle={`Explore our entire inventory of ${result.total || '200'} verified timepieces. Filter by brand, era, price range, and mechanical specifications.`}
      />
    </div>
  )
}
