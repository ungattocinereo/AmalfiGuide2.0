import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { routeAssets, type StaticPreviewSize } from "../src/lib/place-routes";

const SERVICE_WORKER_PATH = path.join(process.cwd(), "public", "sw.js");
const MAX_PRECACHE_BYTES = 0;
const MAX_PREVIEW_BYTES = 70_000;
const MAX_ALL_PREVIEWS_BYTES = 350_000;
const EXPECTED_DIMENSIONS: Record<StaticPreviewSize, { width: number; height: number }> = {
  compact: { width: 600, height: 450 },
  wide: { width: 900, height: 675 },
};

function fail(message: string): never {
  throw new Error(`Traffic artifact check failed: ${message}`);
}

async function verifyServiceWorker() {
  const serviceWorker = await fs.readFile(SERVICE_WORKER_PATH, "utf8");
  const manifestMatch = serviceWorker.match(/precacheEntries:\[([\s\S]*?)\],skipWaiting/);
  if (!manifestMatch) fail("could not locate the generated Serwist precache manifest");

  const serializedManifest = manifestMatch[1];
  const forbidden = ["/_next/static", "/images/icon", "apple-touch-icon", "/brand/", "/favicon"];
  for (const value of forbidden) {
    if (serializedManifest.includes(value)) fail(`precache contains ${value}`);
  }

  const urls = Array.from(serializedManifest.matchAll(/["']url["']\s*:\s*["']([^"']+)["']/g), (match) => match[1]);
  let precacheBytes = 0;
  for (const url of urls) {
    const relativePath = decodeURIComponent(new URL(url, "https://amalfi.day").pathname).replace(/^\//, "");
    const candidate = relativePath.startsWith("_next/")
      ? path.join(process.cwd(), ".next", relativePath.replace(/^_next\//, ""))
      : path.join(process.cwd(), "public", relativePath);
    try {
      precacheBytes += (await fs.stat(candidate)).size;
    } catch {
      fail(`cannot resolve precached asset ${url}`);
    }
  }

  if (precacheBytes > MAX_PRECACHE_BYTES) {
    fail(`precache is ${precacheBytes} bytes; budget is ${MAX_PRECACHE_BYTES}`);
  }
  console.log(`Service worker precache: ${urls.length} files, ${precacheBytes} bytes`);
}

async function verifyRoutePreviews() {
  let totalBytes = 0;
  let fileCount = 0;

  for (const route of routeAssets) {
    for (const size of ["compact", "wide"] as const) {
      const publicPath = route.previewImages[size];
      if (!/-[a-f0-9]{12}\.webp$/.test(publicPath)) fail(`${publicPath} is not content-hashed`);

      const filePath = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
      const [metadata, stat] = await Promise.all([sharp(filePath).metadata(), fs.stat(filePath)]);
      const expected = EXPECTED_DIMENSIONS[size];
      if (metadata.format !== "webp") fail(`${publicPath} is not WebP`);
      if (metadata.width !== expected.width || metadata.height !== expected.height) {
        fail(`${publicPath} is ${metadata.width}x${metadata.height}; expected ${expected.width}x${expected.height}`);
      }
      if (stat.size > MAX_PREVIEW_BYTES) {
        fail(`${publicPath} is ${stat.size} bytes; per-file budget is ${MAX_PREVIEW_BYTES}`);
      }
      totalBytes += stat.size;
      fileCount += 1;
    }
  }

  if (fileCount !== 8) fail(`expected 8 route previews, found ${fileCount}`);
  if (totalBytes > MAX_ALL_PREVIEWS_BYTES) {
    fail(`route previews total ${totalBytes} bytes; budget is ${MAX_ALL_PREVIEWS_BYTES}`);
  }
  console.log(`Route previews: ${fileCount} files, ${totalBytes} bytes`);
}

async function main() {
  await verifyServiceWorker();
  await verifyRoutePreviews();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
