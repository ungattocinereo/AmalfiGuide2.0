import { MainContent } from "@/components/main-content";
import { parseMarkdownContentForLanguage } from "@/lib/markdown-parser";
import type { Language } from "@/lib/i18n/types";

// Force static generation where possible, or stick to server rendering
export const dynamic = "force-static";

export default function Home() {
  // Load content for all languages at build time
  const allContent: Record<Language, ReturnType<typeof parseMarkdownContentForLanguage>> = {
    en: parseMarkdownContentForLanguage('en'),
    it: parseMarkdownContentForLanguage('it'),
    es: parseMarkdownContentForLanguage('es'),
    fr: parseMarkdownContentForLanguage('fr'),
    de: parseMarkdownContentForLanguage('de'),
    ru: parseMarkdownContentForLanguage('ru'),
  };

  return <MainContent allContent={allContent} />;
}
