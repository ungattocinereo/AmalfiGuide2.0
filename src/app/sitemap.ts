import type { MetadataRoute } from 'next'
import { getCanonicalSlugs } from '@/lib/markdown-parser'

const baseUrl = 'https://guide.amalfi.day'
const locales = ['en', 'it', 'es', 'fr', 'de', 'ru'] as const

function getLocaleUrl(locale: string, path: string = '') {
  if (locale === 'en') return `${baseUrl}${path}`
  return `${baseUrl}/${locale}${path}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  // Home page per locale
  for (const locale of locales) {
    const alternateLanguages: Record<string, string> = {}
    for (const loc of locales) {
      alternateLanguages[loc] = getLocaleUrl(loc)
    }
    entries.push({
      url: getLocaleUrl(locale),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: alternateLanguages },
    })
  }

  // Per-place pages — one URL per locale × slug, each with full hreflang alternates
  const slugs = getCanonicalSlugs()
  for (const slug of slugs) {
    for (const locale of locales) {
      const alternateLanguages: Record<string, string> = {}
      for (const loc of locales) {
        alternateLanguages[loc] = getLocaleUrl(loc, `/place/${slug}`)
      }
      entries.push({
        url: getLocaleUrl(locale, `/place/${slug}`),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: { languages: alternateLanguages },
      })
    }
  }

  return entries
}
