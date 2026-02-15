"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CaretRight, User, Diamond, Church, Mountains, ForkKnife, Cookie, Storefront, Compass } from "@phosphor-icons/react";
import { useLayout } from "@/components/layout-context";
import { useLanguage } from "@/components/language-context";
import { PlaceCard } from "@/components/place-card";
import type { PlaceItem } from "@/lib/markdown-parser";
import { getImageForPlace } from "@/lib/place-images";

interface SectionGridProps {
    title: string;
    description: string;
    items: PlaceItem[];
    onItemClick: (item: PlaceItem) => void;
}

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
    hidden: { opacity: 0, y: 20, scale: 0.97 },
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
        scale: 0.97,
        transition: {
            duration: 0.15,
        },
    },
};

const getSectionIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("gems") || t.includes("gemme") || t.includes("joyas") ||
        t.includes("joyaux") || t.includes("perlen") || t.includes("жемчужины") ||
        t.includes("atrani")) return Diamond;
    if (t.includes("must visit") || t.includes("da vedere") || t.includes("imprescindibles") ||
        t.includes("incontournables") || t.includes("обязательно")) return Church;
    if (t.includes("hiking") || t.includes("nature") || t.includes("escursioni") ||
        t.includes("natura") || t.includes("senderismo") || t.includes("naturaleza") ||
        t.includes("randonnées") || t.includes("wandern") || t.includes("поход") ||
        t.includes("природа")) return Mountains;
    if (t.includes("restaurant") || t.includes("ristoranti") || t.includes("restaurantes") ||
        t.includes("рестораны")) return ForkKnife;
    if (t.includes("street food") || t.includes("cibo di strada") || t.includes("comida callejera") ||
        t.includes("уличная еда")) return Cookie;
    if (t.includes("shop") || t.includes("negozi") || t.includes("tiendas") ||
        t.includes("boutiques") || t.includes("магазины")) return Storefront;
    if (t.includes("wider") || t.includes("not only") || t.includes("non solo") ||
        t.includes("más allá") || t.includes("au-delà") || t.includes("не только")) return Compass;
    return Diamond;
};

// ─── Compact section header (collapsed mode) ───
function CompactSectionHeader({ title, items, isExpanded, onToggle }: {
    title: string;
    items: PlaceItem[];
    isExpanded: boolean;
    onToggle: () => void;
}) {
    const Icon = getSectionIcon(title);

    return (
        <div
            className="cursor-pointer group flex items-center gap-3 md:gap-4 min-h-[52px] px-4 md:px-8 touch-manipulation"
            onClick={onToggle}
            role="button"
            aria-expanded={isExpanded}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
        >
            <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-orange-50 dark:bg-orange-950/30 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40 transition-colors duration-200">
                <Icon weight="duotone" className="h-5 w-5 text-orange-500 dark:text-orange-400" />
            </div>

            <div className="flex-1 min-w-0">
                <h2
                    style={{ fontFamily: 'var(--font-merriweather)' }}
                    className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-50 tracking-tight truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200"
                >
                    {title}
                </h2>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                    {items.length} {items.length === 1 ? 'place' : 'places'}
                </p>
            </div>

            {items.length > 0 && (
                <div className="hidden sm:flex -space-x-2 flex-shrink-0">
                    {items.slice(0, 4).map((item, idx) => {
                        const imgUrl = getImageForPlace(item.name);
                        return (
                            <div key={idx} className="w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-gray-900 shadow-sm">
                                <Image
                                    src={imgUrl}
                                    alt=""
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        );
                    })}
                    {items.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-gray-400">
                            +{items.length - 4}
                        </div>
                    )}
                </div>
            )}

            <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full"
            >
                <CaretRight
                    weight="bold"
                    className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-orange-500 transition-colors duration-200"
                />
            </motion.div>
        </div>
    );
}

// ─── Expanded section header — clean minimal style ───
function ExpandedSectionHeader({ title, description, isExpanded, onToggle, showCaret }: {
    title: string;
    description: string;
    isExpanded: boolean;
    onToggle: () => void;
    showCaret: boolean;
}) {
    const Icon = getSectionIcon(title);

    return (
        <div className="mb-10 md:mb-16 text-left">
            <div
                className={`flex items-center gap-3 md:gap-4 ${showCaret ? "cursor-pointer group touch-manipulation" : ""}`}
                onClick={() => showCaret && onToggle()}
                role={showCaret ? "button" : undefined}
                aria-expanded={showCaret ? isExpanded : undefined}
                tabIndex={showCaret ? 0 : undefined}
                onKeyDown={showCaret ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } } : undefined}
            >
                {/* Icon inline with title */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/30"
                >
                    <Icon weight="duotone" className="h-5 w-5 md:h-6 md:w-6 text-orange-500 dark:text-orange-400" />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ fontFamily: 'var(--font-merriweather)', textWrap: 'balance' } as React.CSSProperties}
                    className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-50 tracking-tight transition-all duration-300 ${showCaret ? "group-hover:text-orange-600 dark:group-hover:text-orange-400" : ""}`}
                >
                    {title}
                </motion.h2>
                {showCaret && (
                    <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-shrink-0 mt-1"
                    >
                        <CaretRight
                            weight="bold"
                            className="h-6 w-6 text-gray-300 dark:text-gray-600 group-hover:text-orange-500 transition-colors duration-200"
                        />
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {description && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <p
                            className="mt-4 text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function SectionGrid({ title, description, items, onItemClick }: SectionGridProps) {
    const { isAllExpanded, isSectionExpanded, toggleSection } = useLayout();
    const { t } = useLanguage();

    const titleLower = title.toLowerCase();

    const isIntro = titleLower.includes("expert guide") ||
                    titleLower.includes("guida esperta") ||
                    titleLower.includes("guía experta") ||
                    titleLower.includes("guide expert") ||
                    titleLower.includes("experten-guide") ||
                    titleLower.includes("экспертный путеводитель");

    const isGemsOfAtrani = titleLower.includes("atrani") && !isIntro;

    const isHiking = titleLower.includes("hiking") ||
                     titleLower.includes("escursioni") ||
                     titleLower.includes("senderismo") ||
                     titleLower.includes("randonnées") ||
                     titleLower.includes("поход");

    const isExpanded = isIntro ? true : isSectionExpanded(title);
    const effectiveExpanded = isIntro || isAllExpanded;
    const showCaret = !isIntro;

    // ===== COMPACT MODE =====
    if (!effectiveExpanded && !isIntro) {
        return (
            <section className="py-4 md:py-5 max-w-7xl mx-auto border-b border-gray-100 dark:border-gray-800/60 last:border-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <CompactSectionHeader
                    title={title}
                    items={items}
                    isExpanded={isExpanded}
                    onToggle={() => toggleSection(title)}
                />

                <AnimatePresence mode="wait">
                    {isExpanded && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="overflow-hidden px-4 md:px-8 pt-6"
                        >
                            <div className={`grid ${isHiking ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3'} gap-4 md:gap-6 pb-8 items-start`}>
                                {items.map((item, idx) => (
                                    <motion.div key={idx} variants={itemVariants}>
                                        <PlaceCard
                                            item={item}
                                            layoutId={item.name}
                                            onClick={() => onItemClick(item)}
                                            aspectRatio={isHiking ? "aspect-[4/3]" : undefined}
                                            sizes={isHiking ? "(max-width: 768px) 100vw, 50vw" : undefined}
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

    // ===== GEMS OF ATRANI =====
    if (isGemsOfAtrani) {
        return (
            <section className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto border-b border-gray-100 dark:border-gray-800/60 last:border-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <ExpandedSectionHeader
                    title={title}
                    description={description}
                    isExpanded={isExpanded}
                    onToggle={() => toggleSection(title)}
                    showCaret={showCaret}
                />

                <AnimatePresence mode="wait">
                    {isExpanded && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pb-8 md:pb-12 items-start">
                                {/* Desktop: Text column */}
                                <motion.div
                                    variants={itemVariants}
                                    className="hidden md:flex flex-col justify-center col-span-1 row-span-2 pr-4"
                                >
                                    <h3
                                        style={{ fontFamily: 'var(--font-merriweather)' }}
                                        className="text-3xl lg:text-4xl font-light text-gray-900 dark:text-gray-50 leading-tight mb-6"
                                    >
                                        {t('section.gemsIntroTitle')}
                                    </h3>
                                    <p className="text-base lg:text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                                        {t('section.gemsIntroText')}
                                    </p>
                                </motion.div>

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

    // ===== HIKING & NATURE =====
    if (isHiking) {
        return (
            <section className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto border-b border-gray-100 dark:border-gray-800/60 last:border-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <ExpandedSectionHeader
                    title={title}
                    description={description}
                    isExpanded={isExpanded}
                    onToggle={() => toggleSection(title)}
                    showCaret={showCaret}
                />

                <AnimatePresence mode="wait">
                    {isExpanded && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-8 md:pb-12 items-start">
                                {items.map((item, idx) => (
                                    <motion.div key={idx} variants={itemVariants}>
                                        <PlaceCard
                                            item={item}
                                            layoutId={item.name}
                                            onClick={() => onItemClick(item)}
                                            aspectRatio="aspect-[4/3]"
                                            sizes="(max-width: 768px) 100vw, 50vw"
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

    // ===== INTRO SECTION =====
    if (isIntro) {
        return (
            <section className="py-6 md:py-10 px-4 md:px-8 max-w-7xl mx-auto border-b border-gray-100 dark:border-gray-800/60 last:border-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                {/* Intro Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 via-white to-orange-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-orange-950/20 border border-gray-100 dark:border-gray-800/60"
                >
                    <div className="flex flex-col md:flex-row items-center gap-5 md:gap-10 p-6 md:p-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="flex-shrink-0"
                        >
                            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full p-[5px] bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 dark:from-orange-500 dark:via-orange-600 dark:to-amber-600 shadow-lg shadow-orange-200/40 dark:shadow-orange-900/30">
                                <div className="w-full h-full rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-900">
                                    <Image
                                        src="/gregs-avatar-new.png"
                                        alt="Gregory Day"
                                        width={176}
                                        height={176}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <div className="flex-1 min-w-0 text-center md:text-left">
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                style={{ fontFamily: 'var(--font-merriweather)', textWrap: 'balance' } as React.CSSProperties}
                                className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-gray-900 dark:text-gray-50 tracking-tight leading-tight"
                            >
                                <span dangerouslySetInnerHTML={{ __html: t('section.expertGuideTitle') }} />
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="mt-2.5 md:mt-3 text-sm md:text-[0.95rem] text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl mx-auto md:mx-0"
                                style={{ fontFamily: 'var(--font-merriweather)' }}
                            >
                                {t('section.expertGuideText')}
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                                className="flex items-center gap-2.5 mt-3 md:mt-4 justify-center md:justify-start"
                            >
                                <div className="w-6 h-0.5 rounded-full bg-orange-400 dark:bg-orange-500" />
                                <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                                    <User weight="duotone" className="h-4 w-4 text-orange-500" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">{t('section.expertGuideSignature')}</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {isExpanded && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="overflow-hidden mt-6 md:mt-10"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pb-4 md:pb-6 items-start">
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

    // ===== DEFAULT SECTION =====
    return (
        <section className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto border-b border-gray-100 dark:border-gray-800/60 last:border-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <ExpandedSectionHeader
                title={title}
                description={description}
                isExpanded={isExpanded}
                onToggle={() => toggleSection(title)}
                showCaret={showCaret}
            />

            <AnimatePresence mode="wait">
                {isExpanded && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pb-8 md:pb-12 items-start">
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
