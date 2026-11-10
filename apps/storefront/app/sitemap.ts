import { MetadataRoute } from 'next'
import { fetchWatches } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://retrotimeco.in'
  const now = new Date().toISOString()
  
  // 1. Static & Core Editorial Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/watches`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pages/authenticity`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/policies/shipping`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/policies/returns`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/policies/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // 2. High-Intent Target Collection Pages
  const collectionSlugs = [
    'all',
    'vintage-watches',
    'seiko',
    'hmt-watches',
    'citizen',
    'casio',
    'orient',
    'japanese-vintage',
    'swiss-vintage',
    'luxury-chronographs',
    'straps-accessories',
  ]

  const collectionRoutes: MetadataRoute.Sitemap = collectionSlugs.map((slug) => ({
    url: `${baseUrl}/collections/${slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  try {
    // 3. Dynamic Product Routes — Fetch ALL items via limit: 'all'
    const watchesRes = await fetchWatches({ limit: 'all' })
    if (watchesRes && watchesRes.data && Array.isArray(watchesRes.data)) {
      const seenSlugs = new Set<string>()
      const productRoutes: MetadataRoute.Sitemap = []

      for (const watch of watchesRes.data) {
        if (!watch.slug || seenSlugs.has(watch.slug)) continue
        seenSlugs.add(watch.slug)

        productRoutes.push({
          url: `${baseUrl}/products/${watch.slug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: watch.in_stock ? 0.9 : 0.7,
        })
      }

      return [...staticRoutes, ...collectionRoutes, ...productRoutes]
    }
  } catch (error) {
    console.error('Failed to fetch watches for sitemap:', error)
  }

  return [...staticRoutes, ...collectionRoutes]
}
