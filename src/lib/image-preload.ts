export const PLACE_DETAIL_IMAGE_WIDTH = 1200;
export const PLACE_DETAIL_IMAGE_QUALITY = 65;

type PreloadPriority = "high" | "low" | "auto";

type PreloadRecord = {
    image?: HTMLImageElement;
    timeoutId?: number;
};

const preloadCache = new Map<string, PreloadRecord>();

export function getPlaceDetailImagePreloadUrl(src: string): string {
    const params = new URLSearchParams({
        url: src,
        w: String(PLACE_DETAIL_IMAGE_WIDTH),
        q: String(PLACE_DETAIL_IMAGE_QUALITY),
    });

    return `/_next/image?${params.toString()}`;
}

function startImagePreload(url: string, priority: PreloadPriority) {
    if (typeof window === "undefined") return;

    const existing = preloadCache.get(url);
    if (existing?.image) return;
    if (existing?.timeoutId) {
        window.clearTimeout(existing.timeoutId);
    }

    const image = new window.Image();
    image.decoding = "async";
    (image as HTMLImageElement & { fetchPriority?: PreloadPriority }).fetchPriority = priority;
    image.src = url;
    preloadCache.set(url, { image });
}

export function prewarmPlaceDetailImage(src: string, priority: PreloadPriority = "low") {
    if (typeof window === "undefined" || !src.startsWith("/")) return;

    const url = getPlaceDetailImagePreloadUrl(src);
    const existing = preloadCache.get(url);
    if (existing?.image) return;

    if (priority === "high") {
        startImagePreload(url, "high");
        return;
    }

    if (existing?.timeoutId) return;
    const timeoutId = window.setTimeout(() => startImagePreload(url, priority), 250);
    preloadCache.set(url, { timeoutId });
}
