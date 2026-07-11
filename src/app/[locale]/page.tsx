import { MainContent } from "@/components/main-content";
import { parseMarkdownContentForLanguage } from "@/lib/markdown-parser";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Language } from "@/lib/i18n/types";
import { buildPlacesJsonLd } from "@/lib/places-jsonld";

export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const content = parseMarkdownContentForLanguage(locale as Language);
  const placesJsonLd = buildPlacesJsonLd(content, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placesJsonLd) }}
      />
      <MainContent content={content} />
    </>
  );
}
