import { MainContent } from "@/components/main-content";
import { parseMarkdownContentForLanguage } from "@/lib/markdown-parser";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Language } from "@/lib/i18n/types";

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
  setRequestLocale(locale);

  const content = parseMarkdownContentForLanguage(locale as Language);

  return <MainContent content={content} />;
}
