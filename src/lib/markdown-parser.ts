import fs from "fs";
import path from "path";
import { marked } from "marked";
import { Language } from "./i18n/types";
import { slugify } from "./slugify";

marked.setOptions({ gfm: false, breaks: false });

export type PlaceItem = {
    name: string;
    slug: string;
    category: string;
    tagline: string;
    taglineHtml: string;
    shortInfo: string;
    shortInfoHtml: string;
    details: string;
    detailsHtml: string;
    links: { label: string; url: string }[];
    hours?: string;
    price?: string;
    duration?: string;
    difficulty?: string;
    distance?: string;
    bestTime?: string;
};

export type CategorySection = {
    title: string;
    description: string;
    descriptionHtml: string;
    items: PlaceItem[];
};

const renderInline = (text: string): string =>
    text ? (marked.parseInline(text) as string) : "";

const renderBlock = (text: string): string =>
    text ? (marked.parse(text) as string) : "";

export function parseMarkdownContent(filePath: string): CategorySection[] {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    const sections: CategorySection[] = [];

    let currentSection: CategorySection | null = null;
    let currentItem: PlaceItem | null = null;
    let captureMode: "none" | "shortInfo" | "details" = "none";
    let buffer: string[] = [];

    const flushBuffer = () => {
        if (currentItem && captureMode === "shortInfo") {
            currentItem.shortInfo = buffer.join("\n").trim();
        } else if (currentItem && captureMode === "details") {
            currentItem.details = buffer.join("\n").trim();
        }
        buffer = [];
        captureMode = "none";
    };

    for (const line of lines) {
        const trimmed = line.trim();

        // New Category Section
        if (line.startsWith("# ") && !line.startsWith("## ")) { // Single #
            if (currentItem) flushBuffer();
            // Reset currentItem when starting a new section so description can be captured
            currentItem = null;

            currentSection = {
                title: line.replace("# ", "").trim(),
                description: "",
                descriptionHtml: "",
                items: []
            };
            sections.push(currentSection);
            continue;
        }

        // Category Description (text immediately after H1)
        if (currentSection && !currentItem && trimmed && !line.startsWith("#") && !line.startsWith("---")) {
            if (!currentSection.description) currentSection.description = trimmed;
            else currentSection.description += " " + trimmed;
            continue;
        }

        // New Item
        if (line.startsWith("### ")) {
            if (currentItem) flushBuffer(); // Flush previous item

            currentItem = {
                name: line.replace("### ", "").trim(),
                slug: "",
                category: "",
                tagline: "",
                taglineHtml: "",
                shortInfo: "",
                shortInfoHtml: "",
                details: "",
                detailsHtml: "",
                links: []
            };
            // Optional meta fields (hours, price, duration, difficulty, distance, bestTime)
            // stay undefined until their lines are encountered.
            if (currentSection) currentSection.items.push(currentItem);
            continue;
        }

        if (!currentItem) continue;

        // Metadata
        if (line.startsWith("**Category**:")) {
            currentItem.category = line.split("**Category**:")[1].trim();
            continue;
        }
        if (line.startsWith("**Tagline**:")) {
            currentItem.tagline = line.split("**Tagline**:")[1].trim();
            continue;
        }
        if (line.startsWith("**Hours**:")) {
            currentItem.hours = line.split("**Hours**:")[1].trim();
            continue;
        }
        if (line.startsWith("**Price**:")) {
            currentItem.price = line.split("**Price**:")[1].trim();
            continue;
        }
        if (line.startsWith("**Duration**:")) {
            currentItem.duration = line.split("**Duration**:")[1].trim();
            continue;
        }
        if (line.startsWith("**Difficulty**:")) {
            currentItem.difficulty = line.split("**Difficulty**:")[1].trim();
            continue;
        }
        if (line.startsWith("**Distance**:")) {
            currentItem.distance = line.split("**Distance**:")[1].trim();
            continue;
        }
        if (line.startsWith("**Best time**:")) {
            currentItem.bestTime = line.split("**Best time**:")[1].trim();
            continue;
        }

        // Content Blocks
        if (line.startsWith("**Short info:**")) {
            flushBuffer();
            captureMode = "shortInfo";
            continue;
        }
        if (line.startsWith("**The Details:**")) {
            flushBuffer();
            captureMode = "details";
            continue;
        }

        // Links Block
        if (line.startsWith("> [!info]")) {
            flushBuffer();
            continue;
        }
        if (line.startsWith("> -") || line.startsWith("> **")) {
            // Parse markdown links [Label](url)
            const linkMatch = line.match(/\[(.*?)\]\((.*?)\)/);
            if (linkMatch) {
                currentItem.links.push({
                    label: linkMatch[1],
                    url: linkMatch[2]
                });
            }
            continue;
        }

        // Content Accumulation
        if (captureMode !== "none") {
            if (!trimmed && buffer.length === 0) continue; // Skip leading empty lines
            if (line.startsWith("---")) continue; // Separator
            buffer.push(line);
        }
    }

    if (currentItem) flushBuffer();

    // Populate HTML variants after parsing
    for (const section of sections) {
        section.descriptionHtml = renderInline(section.description);
        for (const item of section.items) {
            item.taglineHtml = renderInline(item.tagline);
            item.shortInfoHtml = renderInline(item.shortInfo);
            item.detailsHtml = renderBlock(item.details);
        }
    }

    return sections;
}

/**
 * Parses markdown content for a specific language.
 * Looks for language-specific content files in src/data/content/texts.{lang}.md
 *
 * Slugs are derived from the EN canonical names so a single /place/{slug} URL
 * resolves the same place in every locale. The EN file is parsed once and
 * cached at module level — the content files are only ~540 lines each.
 */
export function parseMarkdownContentForLanguage(language: Language): CategorySection[] {
    const filePath = path.join(
        process.cwd(),
        "src/data/content",
        `texts.${language}.md`,
    );
    const sections = parseMarkdownContent(filePath);
    const canonicalSlugs = getCanonicalSlugs();
    let index = 0;
    for (const section of sections) {
        for (const item of section.items) {
            item.slug = canonicalSlugs[index] ?? slugify(item.name);
            index++;
        }
    }
    return sections;
}

let canonicalSlugsCache: string[] | null = null;

/**
 * Returns the ordered list of canonical slugs derived from the EN content file.
 * Since all language files are parallel (same place order and count), a place's
 * position in this list is its stable identity across locales.
 */
export function getCanonicalSlugs(): string[] {
    if (canonicalSlugsCache) return canonicalSlugsCache;
    const enPath = path.join(process.cwd(), "src/data/content", "texts.en.md");
    const enSections = parseMarkdownContent(enPath);
    const slugs: string[] = [];
    const seen = new Set<string>();
    for (const section of enSections) {
        for (const item of section.items) {
            let slug = slugify(item.name);
            // Guard against accidental slug collision by suffixing.
            let suffix = 2;
            const base = slug;
            while (seen.has(slug)) {
                slug = `${base}-${suffix++}`;
            }
            seen.add(slug);
            slugs.push(slug);
        }
    }
    canonicalSlugsCache = slugs;
    return slugs;
}

/** Flat list of all places for a locale, with slugs assigned. */
export function getAllPlacesForLanguage(language: Language): PlaceItem[] {
    return parseMarkdownContentForLanguage(language).flatMap((s) => s.items);
}

/** Find a single place by slug in a specific locale. */
export function findPlaceBySlug(language: Language, slug: string): PlaceItem | null {
    return getAllPlacesForLanguage(language).find((p) => p.slug === slug) ?? null;
}
