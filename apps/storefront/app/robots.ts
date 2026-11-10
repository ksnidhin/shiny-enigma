import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://retrotimeco.in'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/',
        '/jewlandniggesh',
        '/jewlandniggesh/',
        '/api',
        '/api/',
        '/cart',
        '/checkout',
        '/search',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
