import { fetchWatchBySlug } from "@/lib/api"
import { WatchProductDetail } from "@/components/store/WatchProductDetail"
import { Metadata } from "next"
import { notFound } from "next/navigation"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://retrotimeco.in";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const res = await fetchWatchBySlug(resolvedParams.slug)
  if (!res.success || !res.data) {
    return { title: "Timepiece Not Found — RetroTimeCo" }
  }
  
  const watch = res.data;
  const title = `${watch.name} — RetroTimeCo`;
  const description = `${watch.condition_label}. ${watch.description}`;
  const imageUrl = watch.gallery_images?.[0] || watch.image;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/products/${watch.slug}`,
      images: imageUrl ? [{ url: imageUrl, width: 800, height: 800, alt: watch.name }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

function generateProductJsonLd(watch: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: watch.name,
    image: watch.gallery_images?.[0] || watch.image,
    description: watch.description,
    brand: {
      "@type": "Brand",
      name: watch.brand,
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${watch.slug}`,
      priceCurrency: "INR",
      price: watch.price,
      itemCondition: "https://schema.org/UsedCondition",
      availability: watch.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const res = await fetchWatchBySlug(resolvedParams.slug)

  if (!res.success || !res.data) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateProductJsonLd(res.data)) }}
      />
      <WatchProductDetail 
        watch={res.data}
        related={res.related || []}
      />
    </div>
  )
}
