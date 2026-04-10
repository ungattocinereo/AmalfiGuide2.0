export const SITE_URL = "https://guide.amalfi.day";

export function getLocaleUrl(locale: string, path: string = "") {
    if (locale === "en") return `${SITE_URL}${path}`;
    return `${SITE_URL}/${locale}${path}`;
}
