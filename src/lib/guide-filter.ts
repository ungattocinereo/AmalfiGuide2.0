import type { CategorySection, PlaceItem } from "./markdown-parser";
import { isOpenNow } from "./opening-hours";

export type GuideFilter = {
    query?: string;
    section?: string;
    openNow?: boolean;
};

export function normalizeGuideSearch(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

function searchablePlaceText(item: PlaceItem): string {
    return normalizeGuideSearch([
        item.name,
        item.category,
        item.tagline,
        item.shortInfo,
    ].join(" "));
}

export function filterGuideSections(
    sections: CategorySection[],
    filter: GuideFilter,
    now: Date = new Date(),
): CategorySection[] {
    const query = normalizeGuideSearch(filter.query ?? "");

    return sections.flatMap((section, index) => {
        if (filter.section && filter.section !== String(index + 1)) return [];

        const items = section.items.filter((item) => {
            if (query && !searchablePlaceText(item).includes(query)) return false;
            if (filter.openNow && isOpenNow(item.hours, now) !== true) return false;
            return true;
        });

        if (items.length === 0) return [];
        return [{ ...section, items }];
    });
}
