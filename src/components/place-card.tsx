"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PlaceItem } from "@/lib/markdown-parser";
import { getImageForPlace, getHikingMapUrl } from "@/lib/place-images";

interface PlaceCardProps {
    item: PlaceItem;
    layoutId: string;
    onClick: () => void;
    aspectRatio?: string;
}

export function PlaceCard({ item, layoutId, onClick, aspectRatio }: PlaceCardProps) {
    const imageUrl = getImageForPlace(item.name);
    const hikingMapUrl = getHikingMapUrl(item.name);

    return (
        <motion.div
            layoutId={layoutId}
            onClick={onClick}
            className="group relative w-full cursor-pointer flex flex-col gap-4"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {/* Image/Map Container */}
            <div className={`relative ${aspectRatio || "aspect-[4/5] md:aspect-[4/3]"} w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-md group-hover:shadow-xl transition-shadow duration-300`}>
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
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                )}
                {/* Category Badge - Modern pill style */}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest text-gray-900 dark:text-white border border-black/5 dark:border-white/10 shadow-sm">
                    {item.category}
                </div>
            </div>

            {/* Content Below */}
            <div className="flex flex-col gap-1.5 px-1">
                <motion.h3 style={{ fontFamily: 'var(--font-libre-baskerville)' }} className="text-base md:text-lg font-bold leading-tight text-gray-900 dark:text-gray-50 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                    {item.name}
                </motion.h3>
                <motion.p className="text-sm text-gray-500 dark:text-gray-400 leading-[1.6]">
                    {item.shortInfo}
                </motion.p>
            </div>
        </motion.div>
    );
}
