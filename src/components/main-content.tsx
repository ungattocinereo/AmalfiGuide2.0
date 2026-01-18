"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { SectionGrid } from "@/components/section-grid";
import { PlaceDetails } from "@/components/place-details";
import { Footer } from "@/components/footer";
import { AnimatePresence, motion } from "framer-motion";
import type { parseMarkdownContent, PlaceItem } from "@/lib/markdown-parser";

type CategorySection = ReturnType<typeof parseMarkdownContent>[number];

interface MainContentProps {
    sections: CategorySection[];
}

export function MainContent({ sections }: MainContentProps) {
    const [selectedItem, setSelectedItem] = useState<PlaceItem | null>(null);
    const modalHistoryPushed = useRef(false);

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
            <Navbar />
            <Hero />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-20 bg-white dark:bg-black -mt-8 rounded-t-[2rem] pt-12 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.15)]"
            >
                {/* Container for Sections */}
                <div className="space-y-2">
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
