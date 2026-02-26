import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'it', 'es', 'fr', 'de', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});
