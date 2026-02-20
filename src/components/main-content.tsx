"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { SectionGrid } from "@/components/section-grid";
import { PlaceDetails } from "@/components/place-details";
import { Footer } from "@/components/footer";
import { NewsletterSection } from "@/components/newsletter-section";
import { AnimatePresence, motion } from "framer-motion";
import type { parseMarkdownContent, PlaceItem } from "@/lib/markdown-parser";
import { useLanguage } from "@/components/language-context";
import { useLayout } from "@/components/layout-context";
import { LanguageTransition } from "@/components/language-transition";
import type { Language } from "@/lib/i18n/types";

type CategorySection = ReturnType<typeof parseMarkdownContent>[number];

interface MainContentProps {
    allContent: Record<Language, CategorySection[]>;
}

export function MainContent({ allContent }: MainContentProps) {
    const { language } = useLanguage();
    const { isAllExpanded } = useLayout();
    const [selectedItem, setSelectedItem] = useState<PlaceItem | null>(null);
    const modalHistoryPushed = useRef(false);

    // Select sections for current language
    const sections = allContent[language] || allContent.en;

    // Push history state when modal opens (with guard against double-push in strict mode)
    useEffect(() => {
        if (selectedItem && !modalHistoryPushed.current) {
            history.pushState({ modal: true }, '');
            modalHistoryPushed.current = true;
        }
    }, [selectedItem]);

    // Handle browser back button - closes modal when back is pressed
    useEffect(() => {
        const handlePopState = () => {
            // Back button was pressed (or history.back() called), close the modal
            if (modalHistoryPushed.current) {
                modalHistoryPushed.current = false;
                setSelectedItem(null);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Universal close handler for X button, backdrop, Escape
    // Calls history.back() which triggers popstate → setSelectedItem(null)
    const handleCloseModal = useCallback(() => {
        if (selectedItem && modalHistoryPushed.current) {
            history.back(); // This triggers popstate, which closes modal
        }
    }, [selectedItem]);

    return (
        <main className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
            <LanguageTransition />
            <Navbar />
            <Hero />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`relative z-20 bg-gray-100/80 dark:bg-black transition-[padding] duration-300 ${isAllExpanded ? "pt-8 md:pt-12" : "pt-1"}`}
            >
                {/* Container for Sections */}
                <div className={`transition-[gap] duration-300 space-y-0`}>
                    {sections.map((section, idx) => (
                        <SectionGrid
                            key={idx}
                            title={section.title}
                            description={section.description}
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
