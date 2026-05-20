"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    faBagShopping,
    faBasketShopping,
    faBinoculars,
    faCamera,
    faChurch,
    faClock,
    faCoffee,
    faCompass,
    faCookieBite,
    faGem,
    faLocationDot,
    faMountain,
    faReceipt,
    faRoute,
    faStar,
    faStopwatch,
    faStore,
    faSun,
    faTree,
    faUmbrellaBeach,
    faUsers,
    faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import type { PlaceItem } from "@/lib/markdown-parser";
import { getImageForPlace, getHikingMapUrl } from "@/lib/place-images";
import { getBlurDataURL } from "@/lib/blur-data.generated";
import { useLanguage } from "@/components/language-context";
import { useIsOpenNow } from "@/hooks/use-is-open-now";

const getCategoryIcon = (category: string): IconDefinition => {
    const c = category.toLowerCase();
    if (c.includes("photo") || c.includes("foto")) return faCamera;
    if (c.includes("view") || c.includes("vista") || c.includes("панорам") || c.includes("vue") || c.includes("aussicht")) return faBinoculars;
    if (c.includes("beach") || c.includes("spiaggia") || c.includes("playa") || c.includes("plage") || c.includes("strand") || c.includes("пляж") || c.includes("seafront") || c.includes("beach chill") || c.includes("beach club")) return faUmbrellaBeach;
    if (c.includes("hidden") || c.includes("nascost") || c.includes("secret") || c.includes("скрыт") || c.includes("caché") || c.includes("versteckt")) return faGem;
    if (c.includes("gem") || c.includes("gemma") || c.includes("joya") || c.includes("perle") || c.includes("жемчуж")) return faGem;
    if (c.includes("top") || c.includes("#1") || c.includes("best") || c.includes("лучш") || c.includes("meilleur") || c.includes("mejor") || c.includes("migliore")) return faStar;
    if (c.includes("landmark") || c.includes("monument") || c.includes("достоприм")) return faChurch;
    if (c.includes("sightseeing") || c.includes("visite")) return faCompass;
    if (c.includes("nature") || c.includes("natura") || c.includes("природ") || c.includes("natur")) return faTree;
    if (c.includes("hiking") || c.includes("trail") || c.includes("sentier") || c.includes("sendero") || c.includes("escursion") || c.includes("wandern") || c.includes("поход") || c.includes("тропа")) return faRoute;
    if (c.includes("family") || c.includes("famigl") || c.includes("familia") || c.includes("famille") || c.includes("семей")) return faUsers;
    if (c.includes("michelin") || c.includes("restaurant") || c.includes("ristorante") || c.includes("dining") || c.includes("ресторан")) return faUtensils;
    if (c.includes("scenic") || c.includes("panoram") || c.includes("mountain dining")) return faUtensils;
    if (c.includes("legendary") || c.includes("legendar") || c.includes("легенд")) return faStar;
    if (c.includes("breakfast") || c.includes("colazione") || c.includes("desayuno") || c.includes("завтрак") || c.includes("café") || c.includes("frühstück")) return faCoffee;
    if (c.includes("street food") || c.includes("cibo di strada") || c.includes("comida callejera") || c.includes("уличная еда")) return faCookieBite;
    if (c.includes("market") || c.includes("mercato") || c.includes("mercado") || c.includes("marché") || c.includes("markt") || c.includes("рынок")) return faBasketShopping;
    if (c.includes("supermarket") || c.includes("supermercato") || c.includes("супермаркет")) return faBagShopping;
    if (c.includes("shop") || c.includes("negozio") || c.includes("tienda") || c.includes("boutique") || c.includes("магазин")) return faStore;
    if (c.includes("alimentari") || c.includes("deli") || c.includes("гастроном")) return faStore;
    if (c.includes("sun") || c.includes("sole") || c.includes("sol")) return faSun;
    if (c.includes("umbrella")) return faUmbrellaBeach;
    return faLocationDot;
};

const formatBestTime = (raw: string, t: (key: string) => string): string => {
    const key = raw.trim().toLowerCase();
    const lookup = t(`meta.bestTime.${key}`);
    return lookup === `meta.bestTime.${key}` ? raw : lookup;
};

const formatDifficulty = (raw: string, t: (key: string) => string): string => {
    const key = raw.trim().toLowerCase();
    const lookup = t(`meta.difficulty.${key}`);
    return lookup === `meta.difficulty.${key}` ? raw : lookup;
};

interface PlaceCardProps {
    item: PlaceItem;
    layoutId: string;
    onClick: () => void;
    aspectRatio?: string;
    sizes?: string;
    hideBadges?: boolean;
}

export function PlaceCard({ item, layoutId, onClick, aspectRatio, sizes, hideBadges = false }: PlaceCardProps) {
    const { t } = useLanguage();
    const imageUrl = getImageForPlace(item.name);
    const hikingMapUrl = getHikingMapUrl(item.name);
    const blurDataURL = getBlurDataURL(imageUrl);
    const CategoryIcon = getCategoryIcon(item.category);
    const openNow = useIsOpenNow(item.hours);

    // Data-driven badge selection (no category regex). If a place has trail
    // fields (duration/difficulty) we show those; otherwise we surface the two
    // most useful facts from whatever is populated — price, open-now, best time.
    type Badge = { icon: IconDefinition; label: string; tone: "neutral" | "positive" | "muted" };
    const badges: Badge[] = [];
    const isTrailish = Boolean(item.duration || item.difficulty);
    if (isTrailish) {
        if (item.duration) badges.push({ icon: faStopwatch, label: item.duration, tone: "neutral" });
        if (item.difficulty) badges.push({ icon: faMountain, label: formatDifficulty(item.difficulty, t), tone: "neutral" });
    } else {
        if (item.price) badges.push({ icon: faReceipt, label: item.price, tone: "neutral" });
        if (openNow !== null) {
            badges.push({
                icon: faClock,
                label: openNow ? t("meta.openNow") : t("meta.closed"),
                tone: openNow ? "positive" : "muted",
            });
        }
        if (item.bestTime && badges.length < 2) {
            badges.push({ icon: faSun, label: formatBestTime(item.bestTime, t), tone: "neutral" });
        }
    }
    const visibleBadges = badges.slice(0, 2);

    return (
        <motion.div
            layoutId={layoutId}
            onClick={onClick}
            className="group relative w-full cursor-pointer flex flex-col touch-manipulation"
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
        >
            {/* Card container — horizontal on mobile (non-hiking), vertical on desktop and hiking */}
            <div className={`rounded-2xl bg-white dark:bg-amalfi-espresso border border-gray-200/60 dark:border-orange-950/40 group-hover:shadow-lg group-hover:border-gray-200 dark:group-hover:border-orange-900/60 transition-all duration-300 overflow-hidden ${hikingMapUrl ? "flex flex-col" : "flex flex-row md:flex-col"}`}>
                {/* Image container — fixed width on mobile for horizontal layout, full width on desktop */}
                <div className={`relative overflow-hidden bg-gray-100 dark:bg-amalfi-espresso-soft ${
                    hikingMapUrl
                        ? `${aspectRatio || "aspect-[4/3]"} w-full`
                        : "shrink-0 w-1/3 min-h-[9rem] md:w-full md:min-h-0 md:aspect-[4/3]"
                }`}>
                    {hikingMapUrl ? (
                        <iframe
                            src={hikingMapUrl}
                            className="map-embed"
                            width={600}
                            height={450}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Map of ${item.name}`}
                        />
                    ) : (
                        <Image
                            src={imageUrl}
                            alt=""
                            fill
                            quality={65}
                            sizes={sizes || "(max-width: 768px) 33vw, 33vw"}
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            placeholder={blurDataURL ? "blur" : "empty"}
                            blurDataURL={blurDataURL}
                        />
                    )}

                    {/* Category pill — on image: desktop always, mobile only for hiking */}
                    <div className={`absolute top-1.5 right-1.5 md:top-3 md:right-3 items-center gap-1 md:gap-1.5 bg-white/95 dark:bg-black/75 backdrop-blur-md px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-[11px] uppercase font-bold tracking-wider text-gray-900 dark:text-white border border-black/5 dark:border-orange-400/30 ${hikingMapUrl ? "flex" : "hidden md:flex"}`}>
                        <FontAwesomeIcon icon={CategoryIcon} className="h-3 w-3 text-orange-700 dark:text-orange-400 flex-shrink-0" />
                        <span>{item.category}</span>
                    </div>
                </div>

                {/* Content area inside card */}
                <div className="relative flex-1 min-w-0 flex flex-col gap-1.5 md:gap-2 p-3 md:p-5">
                    {/* Category pill — mobile only, own row at top (non-hiking cards) */}
                    {!hikingMapUrl && (
                        <div className="md:hidden flex justify-end">
                            <span className="inline-flex items-center gap-1 bg-white/95 dark:bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider text-gray-900 dark:text-white border border-black/5 dark:border-orange-400/30">
                                <FontAwesomeIcon icon={CategoryIcon} className="h-3 w-3 text-orange-700 dark:text-orange-400 flex-shrink-0" />
                                <span>{item.category}</span>
                            </span>
                        </div>
                    )}

                    {/* Title — always visible */}
                    <h3
                        style={{ fontFamily: 'var(--font-merriweather)' }}
                        className="text-base lg:text-[1.05rem] font-bold leading-tight text-gray-900 dark:text-gray-50 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200 line-clamp-2"
                    >
                        {item.name}
                    </h3>

                    {/* Short description — 3-line box so rows align */}
                    <p
                        className="text-[13px] md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: item.shortInfoHtml }}
                    />

                    {/* Meta badges — price, open-now, trail duration/difficulty, best time */}
                    {!hideBadges && visibleBadges.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {visibleBadges.map((badge, i) => {
                                const Icon = badge.icon;
                                const toneClasses =
                                    badge.tone === "positive"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60"
                                        : badge.tone === "muted"
                                            ? "bg-gray-100 text-gray-500 border-gray-200/70 dark:bg-gray-800/60 dark:text-gray-400 dark:border-gray-700/60"
                                            : "bg-orange-50 text-orange-700 border-orange-200/70 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-900/50";
                                return (
                                    <span
                                        key={i}
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${toneClasses}`}
                                    >
                                        <FontAwesomeIcon icon={Icon} className="h-3 w-3 flex-shrink-0" />
                                        <span className="leading-none">{badge.label}</span>
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
