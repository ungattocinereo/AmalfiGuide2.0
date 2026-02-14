import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LayoutProvider } from "@/components/layout-context";
import { LanguageProvider } from "@/components/language-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const playfairDisplay = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://guide.amalfi.day"),
  title: "Amalfi Coast Guide — Walks, Hidden Gems & Local Food | AMALFI.DAY",
  description:
    "Your pocket guide to the Amalfi Coast. Curated walks, secret beaches, cliffside restaurants, and hiking trails — with directions, maps, and transport tips in 6 languages.",
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
      </head>
      <body className={`${inter.variable} ${playfairDisplay.variable} font-sans antialiased`}>
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
      </body>
    </html>
  );
}
