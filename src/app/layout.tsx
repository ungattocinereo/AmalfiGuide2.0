import type { Metadata, Viewport } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LayoutProvider } from "@/components/layout-context";
import { LanguageProvider } from "@/components/language-context";
import { EnvironmentBadge } from "@/components/environment-badge";

const merriweather = Merriweather({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://guide.amalfi.day"),
  title: "Amalfi Coast Guide — Walks, Gems & Local Food",
  description:
    "Your pocket guide to the Amalfi Coast. Curated walks, secret beaches, restaurants, and hiking trails — with maps and transport tips in 6 languages.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Amalfi Coast Guide — Your Pocket Travel Companion",
    description:
      "Curated walks, hidden beaches, authentic restaurants, and scenic hiking trails along the Amalfi Coast. Offline maps, directions & transport tips in 6 languages.",
    url: "https://guide.amalfi.day",
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
    canonical: "https://guide.amalfi.day",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "name": "Amalfi Coast Guide",
                  "url": "https://guide.amalfi.day",
                  "description": "Your pocket guide to the Amalfi Coast. Curated walks, secret beaches, restaurants, and hiking trails.",
                  "inLanguage": ["en", "it", "es", "fr", "de", "ru"],
                  "publisher": {
                    "@type": "Organization",
                    "name": "CristallPont S.R.L.",
                    "url": "https://amalfi.day"
                  }
                },
                {
                  "@type": "TravelGuide",
                  "name": "Amalfi Coast Guide — Walks, Gems & Local Food",
                  "url": "https://guide.amalfi.day",
                  "description": "Curated walks, hidden beaches, authentic restaurants, and scenic hiking trails along the Amalfi Coast.",
                  "about": {
                    "@type": "Place",
                    "name": "Amalfi Coast",
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
                  "dateModified": "2025-06-01",
                  "inLanguage": ["en", "it", "es", "fr", "de", "ru"]
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
          </LanguageProvider>
        </ThemeProvider>
        <EnvironmentBadge />
      </body>
    </html>
  );
}
