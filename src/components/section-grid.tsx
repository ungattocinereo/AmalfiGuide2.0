"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretRight, User, Diamond, Church, Mountains, ForkKnife, Cookie, Storefront, Compass } from "@phosphor-icons/react";
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
            type: "spring" as const,
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

const getSectionIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("gems") || t.includes("atrani")) return Diamond;
    if (t.includes("must visit") || t.includes("amalfi")) return Church;
    if (t.includes("hiking") || t.includes("nature")) return Mountains;
    if (t.includes("restaurant")) return ForkKnife;
    if (t.includes("street food")) return Cookie;
    if (t.includes("shop")) return Storefront;
    if (t.includes("wider") || t.includes("not only")) return Compass;
    return Diamond; // fallback
};

export function SectionGrid({ title, description, items, onItemClick }: SectionGridProps) {
    const { isSectionExpanded, toggleSection } = useLayout();

    const isIntro = title.toLowerCase().includes("expert guide");
    const isGemsOfAtrani = title.toLowerCase().includes("gems of atrani");
    const isHiking = title.toLowerCase().includes("hiking");
    const isExpanded = isIntro || isSectionExpanded(title);
    const introGridClass = isIntro ? "flex flex-col md:flex-row gap-8 items-center" : "";

    // Special layout for Gems of Atrani
    if (isGemsOfAtrani) {
        return (
            <section className="py-10 md:py-20 px-4 md:px-8 max-w-7xl mx-auto border-b border-gray-100 dark:border-gray-800/50 last:border-0">
                {/* Standard section header */}
                <div className="mb-8 md:mb-12 text-left">
                    <div
                        className="cursor-pointer group flex items-center gap-3 md:gap-4"
                        onClick={() => toggleSection(title)}
                    >
                        <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="flex-shrink-0"
                        >
                            <CaretRight
                                weight="bold"
                                className="h-6 w-6 md:h-8 md:w-8 text-gray-400 dark:text-gray-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors duration-150"
                            />
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            style={{ fontFamily: 'var(--font-libre-baskerville)' }}
                            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-50 tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-150"
                        >
                            {title}
                        </motion.h2>
                    </div>
                    {description && (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-center gap-3 mt-4 ml-9 md:ml-12"
                        >
                            <div className="w-px h-8 bg-gradient-to-b from-orange-400 to-orange-200 dark:from-orange-500 dark:to-orange-700"></div>
                            <Diamond weight="duotone" className="h-5 w-5 text-orange-500 flex-shrink-0" />
                            <p
                                className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl italic"
                                style={{ fontFamily: 'var(--font-libre-baskerville)' }}
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        </motion.div>
                    )}
                </div>

                {/* Content grid with text in first column on desktop */}
                <AnimatePresence mode="wait">
                    {isExpanded && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 pb-12 items-start">
                                {/* Desktop: Text column (hidden on mobile) */}
                                <motion.div
                                    variants={itemVariants}
                                    className="hidden md:flex flex-col justify-center col-span-1 row-span-2 pr-4"
                                >
                                    <h3
                                        style={{ fontFamily: 'var(--font-libre-baskerville)' }}
                                        className="text-3xl lg:text-4xl font-light text-gray-900 dark:text-gray-50 leading-tight mb-6"
                                    >
                                        Atrani: 0.2 km² Between the Mountains and the Sea
                                    </h3>
                                    <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                        A compact town compressed into just 0.2 km², set between Monte Aureo and Monte Civita and opening directly onto the sea. We live here, and this is a curated introduction to the places that define daily life in Atrani beyond its size.
                                    </p>
                                </motion.div>

                                {/* Cards */}
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

    // Special layout for Hiking & Nature - 2 cols desktop, 1 col mobile, 4:3 aspect
    if (isHiking) {
        return (
            <section className="py-10 md:py-20 px-4 md:px-8 max-w-7xl mx-auto border-b border-gray-100 dark:border-gray-800/50 last:border-0">
                {/* Standard section header */}
                <div className="mb-8 md:mb-12 text-left">
                    <div
                        className="cursor-pointer group flex items-center gap-3 md:gap-4"
                        onClick={() => toggleSection(title)}
                    >
                        <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="flex-shrink-0"
                        >
                            <CaretRight
                                weight="bold"
                                className="h-6 w-6 md:h-8 md:w-8 text-gray-400 dark:text-gray-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors duration-150"
                            />
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            style={{ fontFamily: 'var(--font-libre-baskerville)' }}
                            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-50 tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-150"
                        >
                            {title}
                        </motion.h2>
                    </div>
                    {description && (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-center gap-3 mt-4 ml-9 md:ml-12"
                        >
                            <div className="w-px h-8 bg-gradient-to-b from-orange-400 to-orange-200 dark:from-orange-500 dark:to-orange-700"></div>
                            <Mountains weight="duotone" className="h-5 w-5 text-orange-500 flex-shrink-0" />
                            <p
                                className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl italic"
                                style={{ fontFamily: 'var(--font-libre-baskerville)' }}
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        </motion.div>
                    )}
                </div>

                {/* Cards grid: 1 col mobile, 2 cols desktop */}
                <AnimatePresence mode="wait">
                    {isExpanded && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-10 pb-12 items-start">
                                {items.map((item, idx) => (
                                    <motion.div key={idx} variants={itemVariants}>
                                        <PlaceCard
                                            item={item}
                                            layoutId={item.name}
                                            onClick={() => onItemClick(item)}
                                            aspectRatio="aspect-[4/3]"
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

    return (
        <section className="py-10 md:py-20 px-4 md:px-8 max-w-7xl mx-auto border-b border-gray-100 dark:border-gray-800/50 last:border-0">
            <div className={introGridClass || "mb-8 md:mb-12 text-left"}>
                {/* Photo - 1/3 on left for intro */}
                {isIntro && (
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="hidden md:flex md:w-1/3 justify-center items-center"
                    >
                        <img
                            src="/images/gregs-masked.png"
                            alt="Gregory Day"
                            className="w-[250px] h-auto object-contain dark:opacity-90 drop-shadow-2xl"
                        />
                    </motion.div>
                )}

                {/* Text content - 2/3 on right for intro */}
                <div className={isIntro ? "md:w-2/3 text-center md:text-left" : ""}>
                    <div
                        className={!isIntro ? "cursor-pointer group flex items-center gap-3 md:gap-4" : ""}
                        onClick={() => !isIntro && toggleSection(title)}
                    >
                        {!isIntro && (
                            <motion.div
                                animate={{ rotate: isExpanded ? 90 : 0 }}
                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="flex-shrink-0"
                            >
                                <CaretRight
                                    weight="bold"
                                    className="h-6 w-6 md:h-8 md:w-8 text-gray-400 dark:text-gray-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors duration-150"
                                />
                            </motion.div>
                        )}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            style={{ fontFamily: 'var(--font-libre-baskerville)' }}
                            className={`text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-50 tracking-tight ${!isIntro ? "group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-150" : "mb-4"}`}
                        >
                            {isIntro ? (
                                <>Amalfi.Day Expert <span className="italic">Guide</span></>
                            ) : (
                                title
                            )}
                        </motion.h2>
                    </div>
                    {isIntro ? (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-4"
                        >
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl italic mx-auto md:mx-0" style={{ fontFamily: 'var(--font-libre-baskerville)' }}>
                                A personally curated selection of the best spots, hidden gems, and authentic flavors on the Amalfi Coast from someone who moved here years ago and fell in love with the place.
                            </p>
                            {/* Signature with vertical line */}
                            <div className="flex items-center gap-3 mt-6">
                                <div className="w-px h-10 bg-gradient-to-b from-orange-400 to-orange-200 dark:from-orange-500 dark:to-orange-700"></div>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <User weight="duotone" className="h-5 w-5 text-orange-500" />
                                    <span className="text-sm font-medium">Gregory Day, hotel owner</span>
                                </div>
                            </div>
                        </motion.div>
                    ) : description && (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-center gap-3 mt-4 ml-9 md:ml-12"
                        >
                            <div className="w-px h-8 bg-gradient-to-b from-orange-400 to-orange-200 dark:from-orange-500 dark:to-orange-700"></div>
                            {(() => {
                                const Icon = getSectionIcon(title);
                                return <Icon weight="duotone" className="h-5 w-5 text-orange-500 flex-shrink-0" />;
                            })()}
                            <p
                                className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl italic"
                                style={{ fontFamily: 'var(--font-libre-baskerville)' }}
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        </motion.div>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isExpanded && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 pb-12 items-start">
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
