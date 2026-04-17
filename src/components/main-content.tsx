"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocale } from "next-intl";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { SectionGrid } from "@/components/section-grid";
import { PlaceDetails } from "@/components/place-details";
import { Footer } from "@/components/footer";
import { NewsletterSection } from "@/components/newsletter-section";
import { AnimatePresence, motion } from "framer-motion";
import type { PlaceItem, CategorySection } from "@/lib/markdown-parser";

interface MainContentProps {
    content: CategorySection[];
}

// Build a locale-aware URL for a place. EN omits the prefix, others use /{locale}.
function placePath(locale: string, slug: string): string {
    return locale === "en" ? `/place/${slug}` : `/${locale}/place/${slug}`;
}

export function MainContent({ content }: MainContentProps) {
    const locale = useLocale();
    const [selectedItem, setSelectedItem] = useState<PlaceItem | null>(null);
    const modalHistoryPushed = useRef(false);
    const previousUrl = useRef<string | null>(null);

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
        <main className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
            <Navbar />
            <Hero />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-20 bg-gray-100/80 dark:bg-black"
            >
                <div>
                    {content.map((section, idx) => (
                        <SectionGrid
                            key={idx}
                            title={section.title}
                            description={section.descriptionHtml}
                            items={section.items}
                            onItemClick={setSelectedItem}
                        />
                    ))}
                </div>

                {/* Newsletter pre-footer */}
                <NewsletterSection />

                {/* Footer */}
                <Footer />
            </motion.div>

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
