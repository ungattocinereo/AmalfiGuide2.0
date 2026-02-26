import type { MetadataRoute } from 'next'

const baseUrl = 'https://guide.amalfi.day'
const locales = ['en', 'it', 'es', 'fr', 'de', 'ru'] as const
const pages = ['', '/privacy', '/terms'] as const

function getLocaleUrl(locale: string, path: string = '') {
  if (locale === 'en') return `${baseUrl}${path}`
  return `${baseUrl}/${locale}${path}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const page of pages) {
    for (const locale of locales) {
      const alternateLanguages: Record<string, string> = {}
      for (const loc of locales) {
        alternateLanguages[loc] = getLocaleUrl(loc, page)
      }

      entries.push({
        url: getLocaleUrl(locale, page),
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'yearly',
        priority: page === '' ? 1 : 0.3,
        alternates: {
          languages: alternateLanguages,
        },
      })
    }
  }

  return entries
}
