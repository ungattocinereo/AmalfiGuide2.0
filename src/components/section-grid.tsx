"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLayout } from "@/components/layout-context";
import { PlaceCard } from "@/components/place-card";
import type { PlaceItem } from "@/lib/markdown-parser";

interface SectionGridProps {
    title: string;
    description: string;
    items: PlaceItem[];
    onItemClick: (item: PlaceItem) => void;
}

// Stagger animation for grid items
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.03,
            staggerDirection: -1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 24,
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transition: {
            duration: 0.15,
        },
    },
};

export function SectionGrid({ title, description, items, onItemClick }: SectionGridProps) {
    const { isAllExpanded } = useLayout();

    const isIntro = title.toLowerCase().includes("expert guide");
    const introGridClass = isIntro ? "grid grid-cols-1 md:grid-cols-3 gap-8 items-center" : "";

    return (
        <section className="py-10 md:py-20 px-4 md:px-8 max-w-7xl mx-auto border-b border-gray-100 dark:border-gray-800/50 last:border-0">
            <div className={introGridClass || "mb-8 md:mb-12 text-center md:text-left"}>
                <div className={isIntro ? "md:col-span-2 text-center md:text-left" : ""}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-6xl font-serif font-black mb-4 text-gray-900 dark:text-gray-50 tracking-tight"
                    >
                        {title}
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl font-serif italic mx-auto md:mx-0"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </div>

                {isIntro && (
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="hidden md:block md:col-span-1 relative"
                    >
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[140%] max-w-[500px]">
                            <img
                                src="/images/gregs-masked.png"
                                alt="Gregory Day"
                                className="w-full h-auto object-contain dark:opacity-90 drop-shadow-2xl"
                            />
                        </div>
                    </motion.div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isAllExpanded && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 pb-12">
                            {items.map((item, idx) => (
                                <motion.div key={idx} variants={itemVariants}>
                                    <PlaceCard
                                        item={item}
                                        layoutId={item.name}
                                        onClick={() => onItemClick(item)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
