import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  cacheOnNavigation: false,
  reloadOnOnline: false,
  globPublicPatterns: [
    "manifest.json",
    "favicon.ico",
    "favicon-*.png",
    "apple-touch-icon.png",
    "images/icon*.png",
    "images/guide-logo.svg",
    "brand/*.svg",
  ],
});

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [65, 75, 80],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.mapbox.com',
        pathname: '/styles/v1/**',
      },
    ],
  },
};

export default withSerwist(withNextIntl(nextConfig));
