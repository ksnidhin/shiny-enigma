import { MetadataRoute } from 'next'
import { fetchWatches } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://retrotimeco.in'
  
  // Static Routes
  const routes = ['', '/watches', '/collections', '/about', '/policies/shipping', '/policies/returns', '/policies/privacy'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    // Dynamic Product Routes
    const watchesRes = await fetchWatches()
    if (watchesRes && watchesRes.data) {
      const productRoutes = watchesRes.data.map((watch) => ({
        url: `${baseUrl}/products/${watch.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }))
      return [...routes, ...productRoutes]
    }
  } catch (error) {
    console.error('Failed to fetch watches for sitemap:', error)
  }

  return routes
}
