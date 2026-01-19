import { Language } from "./types";

/**
 * Loads UI translations for a given language from the public translations directory.
 * This runs on the client side using fetch.
 */
export async function loadUITranslations(language: Language): Promise<Record<string, string>> {
  try {
    const response = await fetch(`/translations/ui.${language}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${language}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading translations for ${language}:`, error);
    return {};
  }
}

/**
 * Creates a translator function for a given set of translations.
 * Falls back to the key itself if translation is not found.
 */
export function createTranslator(translations: Record<string, string>) {
  return (key: string): string => {
    return translations[key] || key;
  };
}
