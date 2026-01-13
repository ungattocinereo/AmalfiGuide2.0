"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { SectionGrid } from "@/components/section-grid";
import { PlaceDetails } from "@/components/place-details";
import { AnimatePresence, motion } from "framer-motion";
import type { parseMarkdownContent, PlaceItem } from "@/lib/markdown-parser";

type CategorySection = ReturnType<typeof parseMarkdownContent>[number];

interface MainContentProps {
    sections: CategorySection[];
}

export function MainContent({ sections }: MainContentProps) {
    const [selectedItem, setSelectedItem] = useState<PlaceItem | null>(null);

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
                <footer className="py-16 md:py-20 px-8 bg-gray-950 text-gray-400 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <p className="mb-5 text-gray-500">© 2014-2026 Gregory Day // Amalfi.Day</p>
                        <div className="flex justify-center gap-8 text-sm">
                            <a href="#" className="hover:text-white transition-colors duration-150">Privacy</a>
                            <a href="mailto:hello@amalfi.day" className="hover:text-white transition-colors duration-150">Contact</a>
                            <a href="#" className="hover:text-white transition-colors duration-150">Instagram</a>
                        </div>
                    </motion.div>
                </footer>
            </motion.div>

            {/* Details Overlay */}
            <AnimatePresence mode="wait">
                {selectedItem && (
                    <PlaceDetails
                        item={selectedItem}
                        layoutId={selectedItem.name}
                        onClose={() => setSelectedItem(null)}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
