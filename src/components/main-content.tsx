"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLocale } from "next-intl";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { SectionGrid, isIntroSectionTitle } from "@/components/section-grid";
import { PlaceDetails } from "@/components/place-details";
import { Footer } from "@/components/footer";
import { NewsletterSection } from "@/components/newsletter-section";
import { AnimatePresence, motion } from "framer-motion";
import type { PlaceItem, CategorySection } from "@/lib/markdown-parser";
import { GuideDiscovery } from "@/components/guide-discovery";
import { filterGuideSections, normalizeGuideSearch, type GuideFilter } from "@/lib/guide-filter";
import { useLanguage } from "@/components/language-context";

interface MainContentProps {
    content: CategorySection[];
}

// Build a locale-aware URL for a place. EN omits the prefix, others use /{locale}.
function placePath(locale: string, slug: string): string {
    return locale === "en" ? `/place/${slug}` : `/${locale}/place/${slug}`;
}

export function MainContent({ content }: MainContentProps) {
    const locale = useLocale();
    const { t } = useLanguage();
    const [selectedItem, setSelectedItem] = useState<PlaceItem | null>(null);
    const [guideFilter, setGuideFilter] = useState<GuideFilter>({});
    const modalHistoryPushed = useRef(false);
    const previousUrl = useRef<string | null>(null);
    const isFiltering = Boolean(
        normalizeGuideSearch(guideFilter.query ?? "") || guideFilter.section || guideFilter.openNow,
    );
    const visibleContent = useMemo(
        () => isFiltering ? filterGuideSections(content, guideFilter) : content,
        [content, guideFilter, isFiltering],
    );
    const sectionNumbers = useMemo(() => {
        const numbers = new Map<string, number>();
        let nextNumber = 1;
        for (const section of content) {
            if (isIntroSectionTitle(section.title)) continue;
            numbers.set(section.title, nextNumber);
            nextNumber += 1;
        }
        return numbers;
    }, [content]);
    const discoverySections = useMemo(
        () => content.flatMap((section, index) => isIntroSectionTitle(section.title)
            ? []
            : [{ value: String(index + 1), title: section.title }]),
        [content],
    );
    const numberedContent: Array<CategorySection & { sectionNumber?: number }> = visibleContent.map((section) => ({
        ...section,
        sectionNumber: sectionNumbers.get(section.title),
    }));
    const resultCount = visibleContent.reduce((count, section) => count + section.items.length, 0);

    const syncFilterFromUrl = useCallback(() => {
        const params = new URLSearchParams(window.location.search);
        setGuideFilter({
            query: params.get("q") ?? undefined,
            section: params.get("section") ?? undefined,
            openNow: params.get("open") === "1" || undefined,
        });
    }, []);

    useEffect(() => {
        queueMicrotask(syncFilterFromUrl);
        window.addEventListener("popstate", syncFilterFromUrl);
        return () => window.removeEventListener("popstate", syncFilterFromUrl);
    }, [syncFilterFromUrl]);

    const updateGuideFilter = useCallback((next: GuideFilter) => {
        setGuideFilter(next);
        const params = new URLSearchParams(window.location.search);
        const query = next.query?.trim();
        if (query) params.set("q", query); else params.delete("q");
        if (next.section) params.set("section", next.section); else params.delete("section");
        if (next.openNow) params.set("open", "1"); else params.delete("open");
        const search = params.toString();
        history.replaceState(history.state, "", `${window.location.pathname}${search ? `?${search}` : ""}`);
    }, []);

    // When the modal opens, push a shallow history entry with the canonical
    // /place/{slug} URL so the user can share or reload straight into the
    // same place (the static [slug]/page.tsx takes over on a hard hit).
    useEffect(() => {
        if (selectedItem && !modalHistoryPushed.current) {
            previousUrl.current = window.location.pathname + window.location.search;
            history.pushState({ modal: true }, "", placePath(locale, selectedItem.slug));
            modalHistoryPushed.current = true;
        }
    }, [selectedItem, locale]);

    // Browser back button (or history.back()) closes the modal
    useEffect(() => {
        const handlePopState = () => {
            if (modalHistoryPushed.current) {
                modalHistoryPushed.current = false;
                previousUrl.current = null;
                setSelectedItem(null);
            }
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    // Universal close handler for X button, backdrop, Escape, drag-to-close
    const handleCloseModal = useCallback(() => {
        if (selectedItem && modalHistoryPushed.current) {
            history.back(); // triggers popstate → setSelectedItem(null)
        }
    }, [selectedItem]);

    return (
        <main id="guide-content" className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
            <div inert={selectedItem ? true : undefined} aria-hidden={selectedItem ? true : undefined}>
                <Navbar />
                <Hero />
                <GuideDiscovery
                    sections={discoverySections}
                    filter={guideFilter}
                    resultCount={resultCount}
                    onChange={updateGuideFilter}
                    onReset={() => updateGuideFilter({})}
                />

                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-20 bg-gray-100/80 dark:bg-black"
            >
                <div>
                    {numberedContent.map((section, idx) => (
                        <SectionGrid
                            key={idx}
                            title={section.title}
                            description={section.descriptionHtml}
                            items={section.items}
                            onItemClick={setSelectedItem}
                            sectionNumber={section.sectionNumber}
                            forceExpanded={isFiltering}
                        />
                    ))}
                    {isFiltering && numberedContent.length === 0 && (
                        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#F43600]">
                                {t("discovery.noResultsKicker")}
                            </p>
                            <h2 className="mt-3 text-3xl text-[#1A0A00] dark:text-[#FDF6F0]">
                                {t("discovery.noResults")}
                            </h2>
                            <button
                                type="button"
                                onClick={() => updateGuideFilter({})}
                                className="mt-7 rounded-full bg-[#F43600] px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.1em] text-white transition-[background-color,transform] hover:bg-[#D93200] active:scale-95"
                            >
                                {t("discovery.reset")}
                            </button>
                        </div>
                    )}
                </div>

                {/* Newsletter pre-footer */}
                <NewsletterSection />

                {/* Footer */}
                <Footer />
                </motion.div>
            </div>

            {/* Details Overlay */}
            <AnimatePresence mode="wait">
                {selectedItem && (
                    <PlaceDetails
                        item={selectedItem}
                        layoutId={selectedItem.name}
                        onClose={handleCloseModal}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
