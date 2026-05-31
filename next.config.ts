import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";
import createNextIntlPlugin from 'next-intl/plugin';
import type { RuntimeCaching } from "workbox-build";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const imageRuntimeCaching: RuntimeCaching[] = [
  {
    urlPattern: /\/_next\/image\?url=.+$/i,
    handler: "CacheFirst",
    options: {
      cacheName: "next-image",
      expiration: {
        maxEntries: 192,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  {
    urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)$/i,
    handler: "CacheFirst",
    options: {
      cacheName: "static-image-assets",
      expiration: {
        maxEntries: 192,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
];

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    runtimeCaching: imageRuntimeCaching,
  },
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

export default withPWA(withNextIntl(nextConfig));
