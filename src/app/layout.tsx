import type { Metadata, Viewport } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LayoutProvider } from "@/components/layout-context";
import { LanguageProvider } from "@/components/language-context";
import { EnvironmentBadge } from "@/components/environment-badge";
import { CookieBanner } from "@/components/cookie-banner";

const merriweather = Merriweather({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-merriweather",
  display: "swap",
});

const SITE_URL = "https://guide.amalfi.day";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Amalfi Coast Guide — Walks, Gems & Local Food",
  description:
    "Your pocket guide to the Amalfi Coast. Curated walks, secret beaches, restaurants, and hiking trails — with maps and transport tips in 6 languages.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Amalfi Coast Guide — Your Pocket Travel Companion",
    description:
      "Curated walks, hidden beaches, authentic restaurants, and scenic hiking trails along the Amalfi Coast. Offline maps, directions & transport tips in 6 languages.",
    url: SITE_URL,
    siteName: "AMALFI.DAY Guide",
    images: [
      {
        url: "/images/social.png",
        width: 2985,
        height: 1714,
        alt: "Amalfi Coast travel guide — walks, hidden gems, and local food",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amalfi Coast Guide — Walks, Gems & Local Food",
    description:
      "Your pocket guide to the Amalfi Coast. Curated walks, secret beaches, cliffside restaurants & hiking trails — with offline maps in 6 languages.",
    images: ["/images/social.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en": SITE_URL,
      "it": SITE_URL,
      "es": SITE_URL,
      "fr": SITE_URL,
      "de": SITE_URL,
      "ru": SITE_URL,
      "x-default": SITE_URL,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#E54800",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/images/hero.webp" as="image" type="image/webp" />

        {/* GTM Consent Mode v2 — default to denied until user consents */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500
              });
            `,
          }}
        />

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "name": "Amalfi Coast Guide",
                  "url": SITE_URL,
                  "description": "Your pocket guide to the Amalfi Coast. Curated walks, secret beaches, restaurants, and hiking trails.",
                  "inLanguage": ["en", "it", "es", "fr", "de", "ru"],
                  "publisher": {
                    "@type": "Organization",
                    "name": "CristallPont S.R.L.",
                    "url": "https://amalfi.day",
                    "address": {
                      "@type": "PostalAddress",
                      "streetAddress": "Traversa Dragone 2",
                      "addressLocality": "Atrani",
                      "postalCode": "84010",
                      "addressRegion": "SA",
                      "addressCountry": "IT"
                    },
                    "email": "hello@amalfi.day",
                    "taxID": "06863730650"
                  }
                },
                {
                  "@type": "TravelGuide",
                  "name": "Amalfi Coast Guide — Walks, Gems & Local Food",
                  "url": SITE_URL,
                  "description": "Curated walks, hidden beaches, authentic restaurants, and scenic hiking trails along the Amalfi Coast.",
                  "about": {
                    "@type": "TouristDestination",
                    "name": "Amalfi Coast",
                    "description": "The Amalfi Coast is a stretch of coastline on the southern edge of Italy's Sorrentine Peninsula, in the Campania region.",
                    "geo": {
                      "@type": "GeoCoordinates",
                      "latitude": 40.6340,
                      "longitude": 14.6027
                    },
                    "address": {
                      "@type": "PostalAddress",
                      "addressRegion": "Campania",
                      "addressCountry": "IT"
                    }
                  },
                  "author": {
                    "@type": "Person",
                    "name": "Gregory Day",
                    "url": "https://cinereo.it"
                  },
                  "publisher": {
                    "@type": "Organization",
                    "name": "CristallPont S.R.L.",
                    "url": "https://amalfi.day"
                  },
                  "datePublished": "2024-01-01",
                  "dateModified": "2026-02-01",
                  "inLanguage": ["en", "it", "es", "fr", "de", "ru"],
                  "isAccessibleForFree": true,
                  "audience": {
                    "@type": "TouristAudience",
                    "touristType": ["Cultural tourist", "Beach holiday", "Hiking enthusiast", "Food traveler"]
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://amalfi.day/#organization",
                  "name": "CristallPont S.R.L.",
                  "url": "https://amalfi.day",
                  "logo": `${SITE_URL}/brand/logo-color-black.svg`,
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Traversa Dragone 2",
                    "addressLocality": "Atrani",
                    "postalCode": "84010",
                    "addressRegion": "SA",
                    "addressCountry": "IT"
                  },
                  "email": "hello@amalfi.day",
                  "taxID": "06863730650",
                  "sameAs": [
                    "https://instagram.com/amalfi.day",
                    "https://facebook.com/amalfi.day",
                    "https://twitter.com/amalfiday"
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${merriweather.variable} font-serif antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <LayoutProvider>
              {children}
            </LayoutProvider>
            <CookieBanner />
          </LanguageProvider>
        </ThemeProvider>
        <EnvironmentBadge />
      </body>
    </html>
  );
}
