"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    Camera, Umbrella, MapPin, Star, Church, Binoculars,
    Diamond, Tree, Mountains, Path, Users, ForkKnife,
    Sun, Storefront, Cookie, ShoppingBag, Basket,
    Compass, Coffee, UmbrellaSimple
} from "@phosphor-icons/react";
import type { PlaceItem } from "@/lib/markdown-parser";
import { getImageForPlace, getHikingMapUrl } from "@/lib/place-images";
import { getBlurDataURL } from "@/lib/blur-data.generated";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

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

interface PlaceCardProps {
    item: PlaceItem;
    layoutId: string;
    onClick: () => void;
    aspectRatio?: string;
    sizes?: string;
}

export function PlaceCard({ item, layoutId, onClick, aspectRatio, sizes }: PlaceCardProps) {
    const imageUrl = getImageForPlace(item.name);
    const hikingMapUrl = getHikingMapUrl(item.name);
    const blurDataURL = getBlurDataURL(imageUrl);
    const CategoryIcon = getCategoryIcon(item.category);

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
            aria-label={`View details for ${item.name}`}
        >
            {/* Card container — clean white card with border */}
            <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 group-hover:shadow-lg group-hover:border-gray-200 dark:group-hover:border-gray-700 transition-all duration-300 overflow-hidden">
                {/* Image container */}
                <div className={`relative ${aspectRatio || "aspect-[3/4] md:aspect-[4/3]"} w-full overflow-hidden bg-gray-100 dark:bg-gray-800`}>
                    {hikingMapUrl ? (
                        <iframe
                            src={hikingMapUrl}
                            className="map-embed"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Map of ${item.name}`}
                        />
                    ) : (
                        <Image
                            src={imageUrl}
                            alt={item.name}
                            fill
                            sizes={sizes || "(max-width: 768px) 50vw, 33vw"}
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            placeholder={blurDataURL ? "blur" : "empty"}
                            blurDataURL={blurDataURL}
                        />
                    )}

                    {/* Category pill — top-right over image */}
                    <div className="absolute top-2.5 right-2.5 md:top-3 md:right-3 flex items-center gap-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] uppercase font-bold tracking-wider text-gray-800 dark:text-white border border-black/5 dark:border-white/10 shadow-sm">
                        <CategoryIcon weight="duotone" className="h-3 w-3 text-orange-500 flex-shrink-0" />
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
                    <p className="text-[13px] md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                        {item.shortInfo}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
