import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from "serwist";
import {
  ExpirationPlugin,
  NetworkFirst,
  Serwist,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const offlineCopy = {
  en: ["You’re offline", "Open a place once to keep it available for your trip."],
  it: ["Sei offline", "Apri un luogo una volta per averlo disponibile durante il viaggio."],
  es: ["Estás sin conexión", "Abre un lugar una vez para conservarlo durante tu viaje."],
  fr: ["Vous êtes hors ligne", "Ouvrez un lieu une fois pour le garder disponible pendant le voyage."],
  de: ["Du bist offline", "Öffne einen Ort einmal, damit er auf deiner Reise verfügbar bleibt."],
  ru: ["Нет подключения", "Откройте место один раз, чтобы оно осталось доступно в поездке."],
} as const;

function offlineResponse(request: Request): Response {
  const locale = new URL(request.url).pathname.split("/")[1];
  const language = locale in offlineCopy ? locale as keyof typeof offlineCopy : "en";
  const [title, text] = offlineCopy[language];
  const html = `<!doctype html><html lang="${language}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#1A0A00"><title>${title} · Amalfi.Day</title><style>html{color-scheme:light dark}*{box-sizing:border-box}body{margin:0;min-height:100svh;display:grid;place-items:center;padding:24px;background:#1a0a00;color:#fdf6f0;font:400 16px/1.65 Georgia,serif}.card{width:min(100%,560px);padding:clamp(28px,7vw,56px);border:1px solid #ff6b3d55;border-radius:28px;background:linear-gradient(145deg,#2a1408,#140803);box-shadow:0 28px 80px #0008}.mark{color:#ff6b3d;font-size:.75rem;letter-spacing:.22em;text-transform:uppercase}h1{margin:.65rem 0 1rem;font-size:clamp(2rem,9vw,4rem);line-height:1.05}p{margin:0;color:#fdf6f0b8}button{margin-top:1.75rem;border:0;border-radius:999px;padding:.8rem 1.2rem;background:#f43600;color:white;font:700 .8rem/1 system-ui;letter-spacing:.08em;text-transform:uppercase}</style><main class="card"><div class="mark">Amalfi.Day Guide</div><h1>${title}</h1><p>${text}</p><button onclick="location.reload()">↻ Retry</button></main></html>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
    status: 503,
  });
}

const offlineFallbackPlugin = {
  handlerDidError: async ({ request }: { request: Request }) => offlineResponse(request),
};

const smartOfflineCache: RuntimeCaching[] = [
  {
    matcher: ({ request, sameOrigin }) => sameOrigin && request.mode === "navigate",
    handler: new NetworkFirst({
      cacheName: "amalfi-pages",
      networkTimeoutSeconds: 4,
      plugins: [
        new ExpirationPlugin({ maxEntries: 40, maxAgeSeconds: 30 * 24 * 60 * 60 }),
        offlineFallbackPlugin,
      ],
    }),
  },
  ...defaultCache,
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: smartOfflineCache,
});

serwist.addEventListeners();
