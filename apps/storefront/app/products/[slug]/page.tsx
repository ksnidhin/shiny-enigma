import { fetchWatchBySlug } from "@/lib/api"
import { WatchProductDetail } from "@/components/store/WatchProductDetail"
import { Metadata } from "next"
import { notFound } from "next/navigation"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://retrotimeco.in"

function buildSeoTitle(watch: { name: string; brand: string }): string {
  const name = (watch.name || "").trim()
  const brand = (watch.brand || "").trim()
  const lowerName = name.toLowerCase()

  if (lowerName.includes("vintage")) {
    return lowerName.includes(brand.toLowerCase()) ? name : `${brand} ${name}`
  }

  return lowerName.includes(brand.toLowerCase()) ? `Vintage ${name}` : `Vintage ${brand} ${name}`
}

function buildMetaDescription(watch: {
  name: string
  description?: string
  condition_label?: string
  price?: number
  in_stock?: boolean
}): string {
  const cleanDesc = (watch.description || "").replace(/\s+/g, " ").trim()
  const conditionText = watch.condition_label && watch.condition_label !== "undefined"
    ? `${watch.condition_label} condition. `
    : ""
  const priceText = watch.price ? `₹${watch.price.toLocaleString("en-IN")}. ` : ""
  const stockText = watch.in_stock
    ? "Available now with insured India-wide shipping."
    : "Sold archive reference."

  const rawMeta = `${watch.name} authentic vintage watch. ${conditionText}${priceText}${cleanDesc}`
  if (rawMeta.length > 155) {
    return `${rawMeta.slice(0, 152).trim()}...`
  }
  const combined = `${rawMeta} ${stockText}`.trim()
  return combined.length > 155 ? `${combined.slice(0, 152).trim()}...` : combined
}

function getProductImages(watch: any): string[] {
  const images: string[] = []
  if (Array.isArray(watch.gallery_images) && watch.gallery_images.length > 0) {
    for (const img of watch.gallery_images) {
      if (img && typeof img === "string") {
        images.push(img.startsWith("http") ? img : `${siteUrl}${img.startsWith("/") ? "" : "/"}${img}`)
      }
    }
  }
  if (watch.image && typeof watch.image === "string") {
    const fullImg = watch.image.startsWith("http") ? watch.image : `${siteUrl}${watch.image.startsWith("/") ? "" : "/"}${watch.image}`
    if (!images.includes(fullImg)) {
      images.unshift(fullImg)
    }
  }
  if (images.length === 0) {
    images.push(`${siteUrl}/hero_vintage_watch_1785170825322.jpg`)
  }
  return images
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const res = await fetchWatchBySlug(resolvedParams.slug)
  if (!res.success || !res.data) {
    return { title: "Timepiece Not Found" }
  }

  const watch = res.data
  const title = buildSeoTitle(watch)
  const description = buildMetaDescription(watch)
  const images = getProductImages(watch)
  const canonicalUrl = `${siteUrl}/products/${watch.slug}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | RetroTimeCo`,
      description,
      url: canonicalUrl,
      siteName: "RetroTimeCo",
      locale: "en_IN",
      type: "website",
      images: images.map((img) => ({
        url: img,
        width: 800,
        height: 800,
        alt: `${watch.name} vintage watch`,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | RetroTimeCo`,
      description,
      images: [images[0]],
    },
  }
}

function generateProductJsonLd(watch: any) {
  const images = getProductImages(watch)
  const cleanDescription = (watch.description || `${watch.name} vintage authentic timepiece`).replace(/\s+/g, " ").trim()
  const collectionSlug = watch.collection || "vintage-watches"
  const collectionName = watch.collection_title || watch.brand || "Vintage Watches"

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${siteUrl}/products/${watch.slug}#product`,
    name: watch.name,
    image: images,
    description: cleanDescription,
    sku: watch.reference_number || watch.id,
    mpn: watch.reference_number || watch.id,
    category: collectionName,
    brand: {
      "@type": "Brand",
      name: watch.brand || "Vintage",
    },
    offers: {
      "@type": "Offer",
      "@id": `${siteUrl}/products/${watch.slug}#offer`,
      url: `${siteUrl}/products/${watch.slug}`,
      priceCurrency: "INR",
      price: watch.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/UsedCondition",
      availability: watch.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "RetroTimeCo",
        url: siteUrl,
      },
    },
  }

  const breadcrumbSchema = {
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
        name: collectionName,
        item: `${siteUrl}/collections/${collectionSlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: watch.name,
        item: `${siteUrl}/products/${watch.slug}`,
      },
    ],
  }

  return {
    "@context": "https://schema.org",
    "@graph": [productSchema, breadcrumbSchema],
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
