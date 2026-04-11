/* eslint-disable react-hooks/static-components */
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    Camera, Umbrella, MapPin, Star, Church, Binoculars,
    Diamond, Tree, Path, Users, ForkKnife,
    Sun, Storefront, Cookie, ShoppingBag, Basket,
    Compass, Coffee, UmbrellaSimple,
    Clock, Timer, CurrencyEur, Mountains as MountainIcon
} from "@phosphor-icons/react";
import type { PlaceItem } from "@/lib/markdown-parser";
import { getImageForPlace, getHikingMapUrl } from "@/lib/place-images";
import { getBlurDataURL } from "@/lib/blur-data.generated";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { useLanguage } from "@/components/language-context";
import { useIsOpenNow } from "@/hooks/use-is-open-now";

const getCategoryIcon = (category: string): PhosphorIcon => {
    const c = category.toLowerCase();
    if (c.includes("photo") || c.includes("foto")) return Camera;
    if (c.includes("view") || c.includes("vista") || c.includes("панорам") || c.includes("vue") || c.includes("aussicht")) return Binoculars;
    if (c.includes("beach") || c.includes("spiaggia") || c.includes("playa") || c.includes("plage") || c.includes("strand") || c.includes("пляж") || c.includes("seafront") || c.includes("beach chill") || c.includes("beach club")) return UmbrellaSimple;
    if (c.includes("hidden") || c.includes("nascost") || c.includes("secret") || c.includes("скрыт") || c.includes("caché") || c.includes("versteckt")) return Diamond;
    if (c.includes("gem") || c.includes("gemma") || c.includes("joya") || c.includes("perle") || c.includes("жемчуж")) return Diamond;
    if (c.includes("top") || c.includes("#1") || c.includes("best") || c.includes("лучш") || c.includes("meilleur") || c.includes("mejor") || c.includes("migliore")) return Star;
    if (c.includes("landmark") || c.includes("monument") || c.includes("достоприм")) return Church;
    if (c.includes("sightseeing") || c.includes("visite")) return Compass;
    if (c.includes("nature") || c.includes("natura") || c.includes("природ") || c.includes("natur")) return Tree;
    if (c.includes("hiking") || c.includes("trail") || c.includes("sentier") || c.includes("sendero") || c.includes("escursion") || c.includes("wandern") || c.includes("поход") || c.includes("тропа")) return Path;
    if (c.includes("family") || c.includes("famigl") || c.includes("familia") || c.includes("famille") || c.includes("семей")) return Users;
    if (c.includes("michelin") || c.includes("restaurant") || c.includes("ristorante") || c.includes("dining") || c.includes("ресторан")) return ForkKnife;
    if (c.includes("scenic") || c.includes("panoram") || c.includes("mountain dining")) return ForkKnife;
    if (c.includes("legendary") || c.includes("legendar") || c.includes("легенд")) return Star;
    if (c.includes("breakfast") || c.includes("colazione") || c.includes("desayuno") || c.includes("завтрак") || c.includes("café") || c.includes("frühstück")) return Coffee;
    if (c.includes("street food") || c.includes("cibo di strada") || c.includes("comida callejera") || c.includes("уличная еда")) return Cookie;
    if (c.includes("market") || c.includes("mercato") || c.includes("mercado") || c.includes("marché") || c.includes("markt") || c.includes("рынок")) return Basket;
    if (c.includes("supermarket") || c.includes("supermercato") || c.includes("супермаркет")) return ShoppingBag;
    if (c.includes("shop") || c.includes("negozio") || c.includes("tienda") || c.includes("boutique") || c.includes("магазин")) return Storefront;
    if (c.includes("alimentari") || c.includes("deli") || c.includes("гастроном")) return Storefront;
    if (c.includes("sun") || c.includes("sole") || c.includes("sol")) return Sun;
    if (c.includes("umbrella")) return Umbrella;
    return MapPin;
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
}

export function PlaceCard({ item, layoutId, onClick, aspectRatio, sizes }: PlaceCardProps) {
    const { t } = useLanguage();
    const imageUrl = getImageForPlace(item.name);
    const hikingMapUrl = getHikingMapUrl(item.name);
    const blurDataURL = getBlurDataURL(imageUrl);
    const CategoryIcon = getCategoryIcon(item.category);
    const openNow = useIsOpenNow(item.hours);

    // Data-driven badge selection (no category regex). If a place has trail
    // fields (duration/difficulty) we show those; otherwise we surface the two
    // most useful facts from whatever is populated — price, open-now, best time.
    type Badge = { icon: PhosphorIcon; label: string; tone: "neutral" | "positive" | "muted" };
    const badges: Badge[] = [];
    const isTrailish = Boolean(item.duration || item.difficulty);
    if (isTrailish) {
        if (item.duration) badges.push({ icon: Timer, label: item.duration, tone: "neutral" });
        if (item.difficulty) badges.push({ icon: MountainIcon, label: formatDifficulty(item.difficulty, t), tone: "neutral" });
    } else {
        if (item.price) badges.push({ icon: CurrencyEur, label: item.price, tone: "neutral" });
        if (openNow !== null) {
            badges.push({
                icon: Clock,
                label: openNow ? t("meta.openNow") : t("meta.closed"),
                tone: openNow ? "positive" : "muted",
            });
        }
        if (item.bestTime && badges.length < 2) {
            badges.push({ icon: Sun, label: formatBestTime(item.bestTime, t), tone: "neutral" });
        }
    }
    const visibleBadges = badges.slice(0, 2);

    return (
        <motion.div
            layoutId={layoutId}
            onClick={onClick}
            className="group relative w-full cursor-pointer flex flex-col touch-manipulation"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
        >
            {/* Card container — clean white card with border; warm espresso surface in dark mode */}
            <div className="rounded-2xl bg-white dark:bg-amalfi-espresso border border-gray-200/60 dark:border-orange-950/40 group-hover:shadow-lg group-hover:border-gray-200 dark:group-hover:border-orange-900/60 transition-all duration-300 overflow-hidden">
                {/* Image container */}
                <div className={`relative ${aspectRatio || "aspect-[3/4] md:aspect-[4/3]"} w-full overflow-hidden bg-gray-100 dark:bg-amalfi-espresso-soft`}>
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
                            sizes={sizes || "(max-width: 768px) 50vw, 33vw"}
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            placeholder={blurDataURL ? "blur" : "empty"}
                            blurDataURL={blurDataURL}
                        />
                    )}

                    {/* Category pill — top-right over image. Orange-700 on light for WCAG AA; warm glow in dark. */}
                    <div className="absolute top-2.5 right-2.5 md:top-3 md:right-3 flex items-center gap-1.5 bg-white/95 dark:bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] uppercase font-bold tracking-wider text-gray-900 dark:text-white border border-black/5 dark:border-orange-400/30 shadow-sm dark:shadow-[0_0_12px_rgba(245,54,0,0.22)]">
                        <CategoryIcon weight="duotone" className="h-3 w-3 text-orange-700 dark:text-orange-400 flex-shrink-0" />
                        {item.category}
                    </div>

                    {/* Bottom gradient overlay for text legibility on mobile */}
                    {!hikingMapUrl && (
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/25 to-transparent pointer-events-none md:hidden" />
                    )}

                    {/* Title overlaid on image - mobile only */}
                    {!hikingMapUrl && (
                        <div className="absolute bottom-0 inset-x-0 p-4 md:hidden">
                            <h3
                                style={{ fontFamily: 'var(--font-merriweather)' }}
                                className="text-lg font-bold leading-snug text-white drop-shadow-md"
                            >
                                {item.name}
                            </h3>
                        </div>
                    )}
                </div>

                {/* Content area inside card */}
                <div className="flex flex-col gap-2 p-4 md:p-5">
                    {/* Title - visible on mobile for maps, always visible on desktop */}
                    <h3
                        style={{ fontFamily: 'var(--font-merriweather)' }}
                        className={`${hikingMapUrl ? 'block' : 'hidden md:block'} text-base lg:text-[1.05rem] font-bold leading-tight text-gray-900 dark:text-gray-50 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200`}
                    >
                        {item.name}
                    </h3>

                    {/* Short description */}
                    <p
                        className="text-[13px] md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: item.shortInfoHtml }}
                    />

                    {/* Meta badges — price, open-now, trail duration/difficulty, best time */}
                    {visibleBadges.length > 0 && (
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
                                        <Icon weight="duotone" className="h-3 w-3 flex-shrink-0" />
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
