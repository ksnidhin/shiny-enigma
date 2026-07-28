import { fetchWatchBySlug } from "@/lib/api"
import { WatchProductDetail } from "@/components/store/WatchProductDetail"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const res = await fetchWatchBySlug(resolvedParams.slug)
  if (!res.success || !res.data) {
    return { title: "Timepiece Not Found — RetroTimeCo" }
  }
  return {
    title: `${res.data.name} — RetroTimeCo`,
    description: `${res.data.condition_label}. ${res.data.description}`,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const res = await fetchWatchBySlug(resolvedParams.slug)

  if (!res.success || !res.data) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <WatchProductDetail 
        watch={res.data}
        related={res.related || []}
      />
    </div>
  )
}
