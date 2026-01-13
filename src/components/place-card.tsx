"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PlaceItem } from "@/lib/markdown-parser";

interface PlaceCardProps {
    item: PlaceItem;
    layoutId: string;
    onClick: () => void;
}

// Hiking trail map embed URLs - these show the full hiking routes
const hikingMapUrls: Record<string, string> = {
    "valle delle ferriere": "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d3022.8!2d14.5905091!3d40.6474753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e2!4m5!1s0x133b9584b1db6fcb%3A0xea66729bda2b48d1!2sAmalfi%20Cathedral%2C%20Piazza%20Duomo%2C%20Amalfi%2C%20SA!3m2!1d40.6344504!2d14.6029926!4m5!1s0x133b9591ea123699%3A0xd774b54699b4d8d0!2sValle%20delle%20Ferriere%2C%20Scala%2C%20SA!3m2!1d40.6481158!2d14.5904097!5e1!3m2!1sen!2sit!4v1704000000000!5m2!1sen!2sit",
    "torre dello ziro": "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d6047.5!2d14.6011143!3d40.638841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e2!4m5!1s0x133b95a8e2219069%3A0xb6fe52d5ce1da27e!2sAtrani%2C%20SA!3m2!1d40.6357929!2d14.6086202!4m5!1s0x133b95aed05d7e25%3A0x68bb8e9be7ca9fcd!2sTorre%20dello%20Ziro%2C%20Via%20Valle%20delle%20Ferriere%2C%20Pontone%2C%20SA!3m2!1d40.636001!2d14.6056483!5e1!3m2!1sen!2sit!4v1704000000000!5m2!1sen!2sit",
    "path of the gods": "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d12000!2d14.4952531!3d40.6282869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e2!4m5!1s0x133b96f31ac1ff29%3A0x2585f5135deae698!2sBomerano%20di%20Agerola%2C%20Piazza%20Paolo%20Capasso%2C%20Pianillo!3m2!1d40.6300326!2d14.5403955!4m5!1s0x133b97111597403f%3A0x2609e120cedd79b1!2sNocelle%2C%20SA!3m2!1d40.6293425!2d14.503268!5e1!3m2!1sen!2sit!4v1704000000000!5m2!1sen!2sit",
    "the lemon path": "https://www.google.com/maps/embed?pb=!1m34!1m12!1m3!1d6000!2d14.6241806!3d40.6508666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m19!3e2!4m5!1s0x133b9544093c35a3%3A0x35b98a06ca815918!2sInsigne%20Collegiata%20Santuario%20Parrocchia%20S.%20Maria%20a%20Mare%2C%20Maiori%20SA!3m2!1d40.6500664!2d14.6412516!4m5!1s0x133b956bebcba8a7%3A0x5aa8b541228b1cfc!2sSentiero%20dei%20Limoni%2C%20Via%20Torre%2C%20Minori%2C%20SA!3m2!1d40.6495665!2d14.6308877!4m5!1s0x133b956c24ec6179%3A0x88e2537289534845!2sVia%20Vescovado%2C%20Minori%20SA!3m2!1d40.6504393!2d14.627709!5e1!3m2!1sen!2sit!4v1704000000000!5m2!1sen!2sit",
};

// Get hiking map URL if this is a hiking trail
const getHikingMapUrl = (name: string): string | null => {
    const n = name.toLowerCase();
    for (const [key, url] of Object.entries(hikingMapUrls)) {
        if (n.includes(key) || key.includes(n.replace("sentiero degli dei", "path of the gods").replace("sentiero dei limoni", "the lemon path"))) {
            return url;
        }
    }
    // Additional matching for Italian names
    if (n.includes("sentiero degli dei")) return hikingMapUrls["path of the gods"];
    if (n.includes("sentiero dei limoni")) return hikingMapUrls["the lemon path"];
    return null;
};

// Basic slugify for matching filenames
const getImageForPlace = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes("square")) return "/images/atrani_square.png";
    if (n.includes("castiglione")) return "/images/castiglione_beach.png";
    if (n.includes("waterfall") && n.includes("atrani")) return "/images/atrani_waterfall.png";
    if (n.includes("bando")) return "/images/santa_maria_del_bando.png";
    if (n.includes("palme")) return "/images/le_palme.png";
    if (n.includes("paranza")) return "/images/a_paranza.png";
    // Fallbacks or TODOs for missing images
    return "/images/hero.webp";
};

export function PlaceCard({ item, layoutId, onClick }: PlaceCardProps) {
    const imageUrl = getImageForPlace(item.name);
    const hikingMapUrl = getHikingMapUrl(item.name);

    return (
        <motion.div
            layoutId={layoutId}
            onClick={onClick}
            className="group relative w-full cursor-pointer flex flex-col gap-3"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {/* Image/Map Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-md group-hover:shadow-xl transition-shadow duration-300">
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
            <div className="flex flex-col gap-1 px-0.5">
                <motion.h3 className="font-serif text-lg font-bold leading-tight text-gray-900 dark:text-gray-50 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                    {item.name}
                </motion.h3>
                <motion.p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {item.shortInfo}
                </motion.p>
            </div>
        </motion.div>
    );
}
