/**
 * Produce a stable ASCII slug from a place name.
 * Strips diacritics, lowercases, collapses non-alphanumeric runs into dashes.
 * Kept intentionally simple so EN/IT/DE names yield the same slug when parentheses
 * contain a shared Italian name (e.g. "Path of the Gods (Sentiero degli Dei)").
 */
export function slugify(input: string): string {
    return input
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[''`]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
