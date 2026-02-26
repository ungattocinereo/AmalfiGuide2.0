"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Language, LANGUAGES } from "@/lib/i18n/types";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  isTransitioning: boolean;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale() as Language;
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Use all translations (no namespace) so we can look up any "namespace.key" pattern
  const translations = useTranslations();

  const setLanguage = useCallback((lang: Language) => {
    if (lang === locale) return;

    // Use View Transitions API if available
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      setIsTransitioning(true);
      (document as Document & { startViewTransition: (cb: () => void) => void })
        .startViewTransition(() => {
          router.replace(pathname, { locale: lang });
        });
      // Clear transitioning state after animation
      setTimeout(() => setIsTransitioning(false), 400);
    } else {
      router.replace(pathname, { locale: lang });
    }
  }, [locale, router, pathname]);

  const t = useCallback((key: string): string => {
    try {
      // next-intl uses dot notation as namespace separators
      // "navbar.collapseAll" -> translations("navbar.collapseAll")
      return translations(key);
    } catch {
      return key;
    }
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ language: locale, setLanguage, isTransitioning, t }}>
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
