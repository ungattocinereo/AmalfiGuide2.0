/* eslint-disable react-hooks/static-components */
"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CaretRight, User, Diamond, Church, Mountains, ForkKnife, Cookie, Storefront, Compass, type Icon as PhosphorIcon } from "@phosphor-icons/react";
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

const CONTENT_EASE = [0.16, 1, 0.3, 1] as const;

const getSectionIcon = (title: string): PhosphorIcon => {
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

// ─── Shared compact strip header — same outer shape for every non-intro section ───
function SectionHeaderStrip({ title, items, isExpanded, onToggle, hidePreviews }: {
    title: string;
    items: PlaceItem[];
    isExpanded: boolean;
    onToggle: () => void;
    hidePreviews?: boolean;
}) {
    const Icon = getSectionIcon(title);

    return (
        <button
            type="button"
            onClick={onToggle}
            aria-expanded={isExpanded}
            className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-8 py-4 md:py-5
                       text-left cursor-pointer group touch-manipulation
                       transition-colors duration-200
                       hover:bg-orange-50/70 dark:hover:bg-gray-900/40
                       focus-visible:outline-none focus-visible:bg-orange-50/70 dark:focus-visible:bg-gray-900/40"
        >
            <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full
                            bg-orange-50 dark:bg-orange-950/30
                            group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40
                            transition-colors duration-200">
                <Icon weight="duotone" className="h-5 w-5 text-orange-500 dark:text-orange-400" />
            </div>

            <div className="flex-1 min-w-0">
                <h2
                    style={{ fontFamily: 'var(--font-merriweather)' }}
                    className="text-2xl md:text-3xl lg:text-[2rem] font-bold text-gray-900 dark:text-gray-50 tracking-tight truncate
                               group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200"
                >
                    {title}
                </h2>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                    {items.length} {items.length === 1 ? 'place' : 'places'}
                </p>
            </div>

            {items.length > 0 && !hidePreviews && (
                <div className="hidden sm:flex -space-x-2 flex-shrink-0">
                    {items.slice(0, 4).map((item, idx) => {
                        const imgUrl = getImageForPlace(item.name);
                        return (
                            <div key={idx} className="w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-gray-900 shadow-sm">
                                <Image src={imgUrl} alt="" width={32} height={32} className="w-full h-full object-cover" />
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
                transition={{ duration: 0.2, ease: CONTENT_EASE }}
                className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full"
            >
                <CaretRight
                    weight="bold"
                    className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-orange-500 transition-colors duration-200"
                />
            </motion.div>
        </button>
    );
}

// ─── Intro welcome block — replaces the strip for the Expert Guide section ───
function IntroWelcomeBlock({ t }: { t: (key: string) => string }) {
    return (
        <div className="px-4 md:px-8 pt-6 md:pt-10">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 via-white to-orange-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-orange-950/20 border border-gray-100 dark:border-gray-800/60">
                <div className="flex flex-col md:flex-row items-center gap-5 md:gap-10 p-6 md:p-10">
                    <div className="flex-shrink-0">
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
                    </div>

                    <div className="flex-1 min-w-0 text-center md:text-left">
                        <h2
                            style={{ fontFamily: 'var(--font-merriweather)', textWrap: 'balance' } as React.CSSProperties}
                            className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-gray-900 dark:text-gray-50 tracking-tight leading-tight"
                        >
                            <span dangerouslySetInnerHTML={{ __html: t('section.expertGuideTitle') }} />
                        </h2>
                        <p
                            className="mt-2.5 md:mt-3 text-sm md:text-[0.95rem] text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl mx-auto md:mx-0"
                            style={{ fontFamily: 'var(--font-merriweather)' }}
                        >
                            {t('section.expertGuideText')}
                        </p>
                        <div className="flex items-center gap-2.5 mt-3 md:mt-4 justify-center md:justify-start">
                            <div className="w-6 h-0.5 rounded-full bg-orange-400 dark:bg-orange-500" />
                            <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                                <User weight="duotone" className="h-4 w-4 text-orange-500" />
                                <span className="text-xs font-semibold uppercase tracking-wider">{t('section.expertGuideSignature')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Content region — rendered inside the height-animated reveal ───
function SectionContent({
    description,
    items,
    onItemClick,
    isIntro,
    isGemsOfAtrani,
    isHiking,
    isMustVisit,
    t,
}: {
    description: string;
    items: PlaceItem[];
    onItemClick: (item: PlaceItem) => void;
    isIntro: boolean;
    isGemsOfAtrani: boolean;
    isHiking: boolean;
    isMustVisit: boolean;
    t: (key: string) => string;
}) {
    const gridClass = isHiking
        ? "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start"
        : "grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 items-start";
    const itemAspect = isHiking ? "aspect-[4/3]" : undefined;
    const itemSizes = isHiking ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 128px, 33vw";

    return (
        <div className="px-2 md:px-8 pt-4 md:pt-6 pb-8 md:pb-12">
            {description && !isIntro && (
                <p
                    className="mb-6 md:mb-8 text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            )}

            <div className={gridClass}>
                {isGemsOfAtrani && (
                    <div className="hidden md:flex flex-col justify-center col-span-1 row-span-2 pr-4">
                        <h3
                            style={{ fontFamily: 'var(--font-merriweather)' }}
                            className="text-3xl lg:text-4xl font-light text-gray-900 dark:text-gray-50 leading-tight mb-6"
                        >
                            {t('section.gemsIntroTitle')}
                        </h3>
                        <p className="text-base lg:text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                            {t('section.gemsIntroText')}
                        </p>
                    </div>
                )}

                {items.map((item, idx) => (
                    <PlaceCard
                        key={idx}
                        item={item}
                        layoutId={item.name}
                        onClick={() => onItemClick(item)}
                        aspectRatio={itemAspect}
                        sizes={itemSizes}
                        hideBadges={isMustVisit}
                    />
                ))}
            </div>
        </div>
    );
}

export function SectionGrid({ title, description, items, onItemClick }: SectionGridProps) {
    const { isSectionExpanded, toggleSection } = useLayout();
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

    const isMustVisit = titleLower.includes("must visit") ||
                        titleLower.includes("da vedere") ||
                        titleLower.includes("imprescindibles") ||
                        titleLower.includes("incontournables") ||
                        titleLower.includes("обязательно");

    const isExpanded = isIntro ? true : isSectionExpanded(title);

    return (
        <section className="max-w-7xl mx-auto border-b border-gray-100 dark:border-gray-800/60 last:border-0">
            {isIntro ? (
                <IntroWelcomeBlock t={t} />
            ) : (
                <SectionHeaderStrip
                    title={title}
                    items={items}
                    isExpanded={isExpanded}
                    onToggle={() => toggleSection(title)}
                    hidePreviews={isHiking}
                />
            )}

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: CONTENT_EASE }}
                        className="overflow-hidden"
                    >
                        <SectionContent
                            description={description}
                            items={items}
                            onItemClick={onItemClick}
                            isIntro={isIntro}
                            isGemsOfAtrani={isGemsOfAtrani}
                            isHiking={isHiking}
                            isMustVisit={isMustVisit}
                            t={t}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
