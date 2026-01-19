export type Language = 'en' | 'it' | 'es' | 'fr' | 'de' | 'ru';

export interface LanguageConfig {
  code: Language;
  name: string;        // English name
  nativeName: string;  // Native name
  flag: string;        // Emoji flag
}

export const LANGUAGES: Record<Language, LanguageConfig> = {
  en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  it: { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  ru: { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' }
};

export const DEFAULT_LANGUAGE: Language = 'en';

export function isValidLanguage(code: string): code is Language {
  return ['en', 'it', 'es', 'fr', 'de', 'ru'].includes(code);
}
