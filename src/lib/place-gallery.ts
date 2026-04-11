import { placeGalleries } from "./place-gallery.generated";
import { slugify } from "./slugify";

/**
 * Returns the multi-photo gallery for a place, or an empty array when the place
 * only has a single hero image (which lives in src/lib/place-images.ts).
 *
 * Galleries live in public/guide-webp/{slug}/1.webp, 2.webp, … — drop new files
 * into a matching folder and the next build picks them up automatically.
 */
export function getPlaceGallery(placeName: string): readonly string[] {
    const slug = slugify(placeName);
    return placeGalleries[slug] ?? [];
}

export { slugify };
