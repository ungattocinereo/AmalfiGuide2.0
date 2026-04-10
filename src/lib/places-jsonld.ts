import type { CategorySection, PlaceItem } from "@/lib/markdown-parser";
import { getImageForPlace } from "@/lib/place-images";
import { SITE_URL, getLocaleUrl } from "@/lib/site-config";

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
