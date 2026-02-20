"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, DEFAULT_LANGUAGE, isValidLanguage, LANGUAGES } from "@/lib/i18n/types";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  isTransitioning: boolean;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "amalfi-language";

// Hash-to-language mapping (lowercase keys)
const HASH_LANGUAGE_MAP: Record<string, Language> = {
  // Language codes
  en: 'en', it: 'it', es: 'es', fr: 'fr', de: 'de', ru: 'ru',
  // English names
  english: 'en', italian: 'it', spanish: 'es', french: 'fr', german: 'de', russian: 'ru',
  // Native names
  italiano: 'it', español: 'es', français: 'fr', deutsch: 'de', русский: 'ru',
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Initialize language on mount
  useEffect(() => {
    // Priority 1: URL hash (e.g. #spanish, #italian, #fr)
    const hash = window.location.hash.replace('#', '').toLowerCase().trim();
    if (hash) {
      const hashLang = HASH_LANGUAGE_MAP[decodeURIComponent(hash)];
      if (hashLang) {
        setLanguageState(hashLang); // eslint-disable-line react-hooks/set-state-in-effect -- reading browser URL on mount
        // Clean URL (remove hash)
        window.history.replaceState({}, '', window.location.pathname + window.location.search);
        localStorage.setItem(STORAGE_KEY, hashLang);
        return;
      }
    }

    // Priority 2: URL search param
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && isValidLanguage(langParam)) {
      setLanguageState(langParam);
      // Clean URL (remove param)
      window.history.replaceState({}, '', window.location.pathname);
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, langParam);
      return;
    }

    // Priority 3: localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidLanguage(stored)) {
      setLanguageState(stored);
      return;
    }

    // Priority 4: Browser locale
    const browserLang = navigator.language.split('-')[0];
    if (isValidLanguage(browserLang)) {
      setLanguageState(browserLang);
      localStorage.setItem(STORAGE_KEY, browserLang);
      return;
    }

    // Priority 5: Default (English)
    setLanguageState(DEFAULT_LANGUAGE);
    localStorage.setItem(STORAGE_KEY, DEFAULT_LANGUAGE);
  }, []);

  // Load translations when language changes
  useEffect(() => {
    async function loadTranslations() {
      try {
        const response = await fetch(`/translations/ui.${language}.json`);
        if (response.ok) {
          const data = await response.json();
          setTranslations(data);
        }
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
      }
    }
    loadTranslations();
  }, [language]);

  const setLanguage = (lang: Language) => {
    if (lang === language) return; // No change needed

    // Start transition
    setIsTransitioning(true);

    // Update language after a brief delay to show the transition
    setTimeout(() => {
      setLanguageState(lang);
      localStorage.setItem(STORAGE_KEY, lang);
    }, 200);

    // End transition after 0.5 seconds
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isTransitioning, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

export { LANGUAGES };
