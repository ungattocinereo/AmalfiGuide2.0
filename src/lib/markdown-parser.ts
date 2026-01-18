import fs from "fs";
import path from "path";

export type PlaceItem = {
    name: string;
    category: string;
    tagline: string;
    shortInfo: string;
    details: string;
    links: { label: string; url: string }[];
};

export type CategorySection = {
    title: string;
    description: string;
    items: PlaceItem[];
};

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
                shortInfo: "",
                details: "",
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

    return sections;
}
