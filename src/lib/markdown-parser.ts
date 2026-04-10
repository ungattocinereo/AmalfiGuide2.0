import fs from "fs";
import path from "path";
import { marked } from "marked";
import { Language } from "./i18n/types";

marked.setOptions({ gfm: false, breaks: false });

export type PlaceItem = {
    name: string;
    category: string;
    tagline: string;
    taglineHtml: string;
    shortInfo: string;
    shortInfoHtml: string;
    details: string;
    detailsHtml: string;
    links: { label: string; url: string }[];
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
                category: "",
                tagline: "",
                taglineHtml: "",
                shortInfo: "",
                shortInfoHtml: "",
                details: "",
                detailsHtml: "",
                links: []
            };
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
 */
export function parseMarkdownContentForLanguage(language: Language): CategorySection[] {
    const filePath = path.join(
        process.cwd(),
        "src/data/content",
        `texts.${language}.md`
    );
    return parseMarkdownContent(filePath);
}
