import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { Language } from "@/lib/i18n/types";
import {
    findPlaceBySlug,
    getCanonicalSlugs,
} from "@/lib/markdown-parser";
import { PlaceDetails } from "@/components/place-details";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getLocaleUrl, SITE_URL } from "@/lib/site-config";
import { getImageForPlace } from "@/lib/place-images";
import { buildPlaceJsonLd } from "@/lib/places-jsonld";

export const dynamic = "force-static";

export function generateStaticParams() {
    const slugs = getCanonicalSlugs();
    const params: { locale: string; slug: string }[] = [];
    for (const locale of routing.locales) {
        for (const slug of slugs) {
            params.push({ locale, slug });
        }
    }
    return params;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;
    if (!hasLocale(routing.locales, locale)) notFound();

    const place = findPlaceBySlug(locale as Language, slug);
    if (!place) return {};

    const t = await getTranslations({ locale, namespace: "metadata" });
    const imagePath = getImageForPlace(place.name);
    const absoluteImage = imagePath.startsWith("http") ? imagePath : `${SITE_URL}${imagePath}`;

    const alternateLanguages: Record<string, string> = {};
    for (const loc of routing.locales) {
        alternateLanguages[loc] = getLocaleUrl(loc, `/place/${slug}`);
    }
    alternateLanguages["x-default"] = `${SITE_URL}/place/${slug}`;

    const title = `${place.name} | Amalfi.Day`;
    const description = place.shortInfo || place.tagline || t("description");

    return {
        title,
        description,
        alternates: {
            canonical: getLocaleUrl(locale, `/place/${slug}`),
            languages: alternateLanguages,
        },
        openGraph: {
            title,
            description,
            url: getLocaleUrl(locale, `/place/${slug}`),
            siteName: "AMALFI.DAY Guide",
            images: [{ url: absoluteImage, width: 1200, height: 630, alt: place.name }],
            locale: locale === "en" ? "en_US" : `${locale}_${locale.toUpperCase()}`,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [absoluteImage],
        },
    };
}

export default async function PlacePage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    if (!hasLocale(routing.locales, locale)) notFound();

    setRequestLocale(locale);

    const place = findPlaceBySlug(locale as Language, slug);
    if (!place) notFound();

    const jsonLd = buildPlaceJsonLd(place, locale);

    return (
        <main id="guide-content" className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            <div className="pt-[72px] md:pt-[88px]">
                <PlaceDetails item={place} layoutId={place.slug} mode="page" />
            </div>
            <Footer />
        </main>
    );
}
