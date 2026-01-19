import type { Metadata, Viewport } from "next";
import { Inter, Merriweather, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LayoutProvider } from "@/components/layout-context";
import { LanguageProvider } from "@/components/language-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-merriweather"
});

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://amalfi.day"),
  title: "Amalfi Guide",
  description: "This is your \"Amalfi in a Pocket\" Plan your perfect Amalfi Coast day with ready-to-use ideas for walks, swims, moto rides, and food stops complete with clear directions, offline-friendly maps, and simplified transport timings so moving around stays effortless.",
  manifest: "/manifest.json",
  openGraph: {
    title: "guide. AMALFI.DAY",
    description: "This is your \"Amalfi in a Pocket\" Plan your perfect Amalfi Coast day with ready-to-use ideas for walks, swims, moto rides, and food stops complete with clear directions, offline-friendly maps, and simplified transport timings so moving around stays effortless.",
    url: "https://amalfi.day",
    siteName: "Amalfi Guide",
    images: [
      {
        url: "/images/site-preview.webp",
        width: 1456,
        height: 816,
        alt: "Amalfi Coast guide with Italian flag",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "guide. AMALFI.DAY",
    description: "This is your \"Amalfi in a Pocket\" Plan your perfect Amalfi Coast day with ready-to-use ideas for walks, swims, moto rides, and food stops.",
    images: ["/images/site-preview.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#E64900",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${merriweather.variable} ${libreBaskerville.variable} font-sans antialiased`}>
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
