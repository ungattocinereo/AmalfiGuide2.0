import type { CategorySection, PlaceItem } from "@/lib/markdown-parser";
import { getImageForPlace } from "@/lib/place-images";
import { SITE_URL, getLocaleUrl } from "@/lib/site-config";
import { parseOpeningHours, type DayKey } from "@/lib/opening-hours";

type SchemaType = "Restaurant" | "Store" | "TouristAttraction";

function schemaTypeForCategory(category: string): SchemaType {
    const c = category.toLowerCase();
    if (
        c.includes("restaurant") ||
        c.includes("ristorante") ||
        c.includes("michelin") ||
        c.includes("dining") ||
        c.includes("ресторан") ||
        c.includes("street food") ||
        c.includes("cibo di strada") ||
        c.includes("comida callejera") ||
        c.includes("уличная еда") ||
        c.includes("breakfast") ||
        c.includes("colazione") ||
        c.includes("café") ||
        c.includes("desayuno") ||
        c.includes("frühstück") ||
        c.includes("завтрак")
    ) {
        return "Restaurant";
    }
    if (
        c.includes("market") ||
        c.includes("mercato") ||
        c.includes("mercado") ||
        c.includes("marché") ||
        c.includes("markt") ||
        c.includes("рынок") ||
        c.includes("supermarket") ||
        c.includes("supermercato") ||
        c.includes("супермаркет") ||
        c.includes("shop") ||
        c.includes("negozio") ||
        c.includes("tienda") ||
        c.includes("boutique") ||
        c.includes("магазин") ||
        c.includes("alimentari") ||
        c.includes("deli") ||
        c.includes("гастроном")
    ) {
        return "Store";
    }
    return "TouristAttraction";
}

function findGoogleMapsUrl(item: PlaceItem): string | undefined {
    for (const link of item.links) {
        const label = link.label.toLowerCase();
        if (label.includes("google") || label.includes("view location") || label.includes("map")) {
            return link.url;
        }
        if (link.url.includes("maps.") || link.url.includes("goo.gl/maps") || link.url.includes("maps.app.goo.gl")) {
            return link.url;
        }
    }
    return undefined;
}

// schema.org "dayOfWeek" uses full day names
const SCHEMA_DAY: Record<DayKey, string> = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
};

type OpeningHoursSpec = {
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string;
    opens: string;
    closes: string;
};

function buildOpeningHoursSpec(hours: string | undefined): OpeningHoursSpec[] | undefined {
    if (!hours) return undefined;
    const week = parseOpeningHours(hours);
    const spec: OpeningHoursSpec[] = [];
    (Object.keys(week) as DayKey[]).forEach((day) => {
        const intervals = week[day];
        if (intervals === "closed") return;
        for (const iv of intervals) {
            spec.push({
                "@type": "OpeningHoursSpecification",
                dayOfWeek: SCHEMA_DAY[day],
                opens: iv.open,
                closes: iv.close,
            });
        }
    });
    return spec.length > 0 ? spec : undefined;
}

// Map human difficulty → schema.org HikingTrail "difficulty" hint
const difficultyToText = (raw: string | undefined): string | undefined => {
    if (!raw) return undefined;
    return raw.trim();
};

// Parse a duration like "3h", "1.5h", "90m" into ISO 8601 duration (PT3H, PT1H30M, PT90M)
function toIsoDuration(raw: string | undefined): string | undefined {
    if (!raw) return undefined;
    const input = raw.trim().toLowerCase();
    const hourMatch = input.match(/^(\d+(?:\.\d+)?)\s*h$/);
    if (hourMatch) {
        const hours = parseFloat(hourMatch[1]);
        const whole = Math.floor(hours);
        const minutes = Math.round((hours - whole) * 60);
        if (minutes === 0) return `PT${whole}H`;
        return `PT${whole}H${minutes}M`;
    }
    const minMatch = input.match(/^(\d+)\s*(?:m|min)$/);
    if (minMatch) return `PT${minMatch[1]}M`;
    return undefined;
}

// Extract "1.2km" or "7.8km" → QuantitativeValue in meters
function toMetersQuantity(raw: string | undefined): { "@type": "QuantitativeValue"; value: number; unitCode: "MTR" } | undefined {
    if (!raw) return undefined;
    const match = raw.match(/([\d.]+)\s*km/i);
    if (!match) return undefined;
    const km = parseFloat(match[1]);
    if (Number.isNaN(km)) return undefined;
    return { "@type": "QuantitativeValue", value: Math.round(km * 1000), unitCode: "MTR" };
}

function isTrail(item: PlaceItem): boolean {
    return Boolean(item.duration || item.difficulty || item.distance) ||
        /hiking|trail|sentier|sendero|escursion|wandern|поход|тропа|маршрут/i.test(item.category);
}

/**
 * Builds a rich per-place JSON-LD document. Emits a single @graph with a
 * schema.org object for the place itself + a BreadcrumbList tying it back to
 * the guide's home page. Types used:
 *   - Restaurant (priceRange, openingHours)
 *   - Store     (openingHours)
 *   - TouristAttraction (everything else, including hiking trails)
 *
 * The type union is loose because schema.org accepts many optional fields
 * and we enrich conditionally.
 */
export function buildPlaceJsonLd(item: PlaceItem, locale: string): Record<string, unknown> {
    const imagePath = getImageForPlace(item.name);
    const absoluteImage = imagePath.startsWith("http") ? imagePath : `${SITE_URL}${imagePath}`;
    const canonicalUrl = getLocaleUrl(locale, `/place/${item.slug}`);
    const mapUrl = findGoogleMapsUrl(item);
    const schemaType = schemaTypeForCategory(item.category);
    const trail = isTrail(item);

    const place: Record<string, unknown> = {
        "@type": trail ? "TouristAttraction" : schemaType,
        "@id": canonicalUrl,
        name: item.name,
        description: item.shortInfo || item.tagline,
        image: absoluteImage,
        url: canonicalUrl,
        inLanguage: locale,
        isAccessibleForFree: schemaType !== "Restaurant" && schemaType !== "Store",
        address: {
            "@type": "PostalAddress",
            addressLocality: "Amalfi Coast",
            addressRegion: "Campania",
            addressCountry: "IT",
        },
    };

    if (mapUrl) place.hasMap = mapUrl;

    if (schemaType === "Restaurant" && item.price) {
        place.priceRange = item.price;
        place.servesCuisine = "Italian";
    }

    const openingHours = buildOpeningHoursSpec(item.hours);
    if (openingHours) place.openingHoursSpecification = openingHours;

    if (trail) {
        place.touristType = "Hiking enthusiast";
        place.activityType = "Hiking";
        const duration = toIsoDuration(item.duration);
        if (duration) place.duration = duration;
        const distance = toMetersQuantity(item.distance);
        if (distance) place.additionalProperty = [
            { "@type": "PropertyValue", name: "distance", value: distance.value, unitCode: "MTR" },
        ];
        const diff = difficultyToText(item.difficulty);
        if (diff) {
            place.additionalProperty = [
                ...((place.additionalProperty as unknown[]) || []),
                { "@type": "PropertyValue", name: "difficulty", value: diff },
            ];
        }
    }

    const breadcrumbs = {
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Amalfi Coast Guide",
                item: getLocaleUrl(locale),
            },
            {
                "@type": "ListItem",
                position: 2,
                name: item.name,
                item: canonicalUrl,
            },
        ],
    };

    return {
        "@context": "https://schema.org",
        "@graph": [place, breadcrumbs],
    };
}

export function buildPlacesJsonLd(
    content: CategorySection[],
    locale: string,
) {
    const items = content.flatMap((section) => section.items);

    const itemListElement = items.map((item, index) => {
        const imagePath = getImageForPlace(item.name);
        const absoluteImage = imagePath.startsWith("http")
            ? imagePath
            : `${SITE_URL}${imagePath}`;
        const mapUrl = findGoogleMapsUrl(item);

        const base: Record<string, unknown> = {
            "@type": schemaTypeForCategory(item.category),
            "name": item.name,
            "description": item.shortInfo,
            "image": absoluteImage,
        };
        if (mapUrl) base.url = mapUrl;

        return {
            "@type": "ListItem",
            "position": index + 1,
            "item": base,
        };
    });

    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Amalfi Coast Guide – Places",
        "url": getLocaleUrl(locale),
        "inLanguage": locale,
        "numberOfItems": itemListElement.length,
        itemListElement,
    };
}
