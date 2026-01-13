"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlaceItem } from "@/lib/markdown-parser";

interface PlaceDetailsProps {
    item: PlaceItem;
    layoutId: string;
    onClose: () => void;
}

// Hiking trail map embed URLs - these show the full hiking routes
const hikingMapUrls: Record<string, string> = {
    "valle delle ferriere": "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d12088.04!2d14.6!3e2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e2!4m5!1s0x133b95f4dde3bb8d%3A0x4f4c4!2sValle+delle+Ferriere%2C+84011+Amalfi+SA!3m2!1d40.6332!2d14.6103!4m5!1s0x133b95c5a621fb95%3A0x!2sAmalfi%2C+SA!3m2!1d40.6340!2d14.6027!5e0!3m2!1sen!2sit!4v1",
    "torre dello ziro": "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d6044.2!2d14.6!3e2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e2!4m5!1s0x133b95c5a621fb95%3A0x!2sAtrani%2C+SA!3m2!1d40.6363!2d14.6089!4m5!1s0x133b9!2sTorre+dello+Ziro!3m2!1d40.6400!2d14.6100!5e0!3m2!1sen!2sit!4v1",
    "path of the gods": "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d24176.0!2d14.5!3e2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e2!4m5!1s0x133b97!2sBomerano%2C+Agerola!3m2!1d40.6394!2d14.5247!4m5!1s0x133b95!2sNocelle%2C+Positano!3m2!1d40.6202!2d14.4897!5e0!3m2!1sen!2sit!4v1",
    "the lemon path": "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d6044.0!2d14.6!3e2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e2!4m5!1s0x133b9!2sChiesa+Madre+di+Santa+Maria+Maddalena%2C+Atrani!3m2!1d40.6361!2d14.6073!4m5!1s0x133b95!2sVia+Vescovado%2C+84010+Minori+SA!3m2!1d40.6497!2d14.6269!5e0!3m2!1sen!2sit!4v1",
};

// Get hiking map URL if this is a hiking trail
const getHikingMapUrl = (name: string): string | null => {
    const n = name.toLowerCase();
    for (const [key, url] of Object.entries(hikingMapUrls)) {
        if (n.includes(key)) return url;
    }
    // Handle Italian names
    if (n.includes("sentiero degli dei")) return hikingMapUrls["path of the gods"];
    if (n.includes("sentiero dei limoni")) return hikingMapUrls["the lemon path"];
    return null;
};

// Basic mapping (duplicated for speed, should be shared util)
const getImageForPlace = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes("square")) return "/images/atrani_square.png";
    if (n.includes("castiglione")) return "/images/castiglione_beach.png";
    if (n.includes("waterfall") && n.includes("atrani")) return "/images/atrani_waterfall.png";
    if (n.includes("bando")) return "/images/santa_maria_del_bando.png";
    if (n.includes("palme")) return "/images/le_palme.png";
    if (n.includes("paranza")) return "/images/a_paranza.png";
    return "/images/hero.webp";
};

export function PlaceDetails({ item, layoutId, onClose }: PlaceDetailsProps) {
    const imageUrl = getImageForPlace(item.name);
    const hikingMapUrl = getHikingMapUrl(item.name);

    // Lock body scroll and handle Escape key
    useEffect(() => {
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    // Stop propagation on content to allow backdrop click to close
    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col md:flex-row bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl cursor-zoom-out"
            onClick={onClose}
        >
            {/* Visual Section: Mobile Top 1/4, Desktop Right 1/2 */}
            <motion.div
                layoutId={layoutId}
                className="relative w-full h-[35vh] md:h-full md:w-1/2 md:order-2 cursor-zoom-out overflow-hidden"
                onClick={onClose}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {hikingMapUrl ? (
                    <iframe
                        src={hikingMapUrl}
                        className="absolute inset-0 w-full h-full border-0 hiking-map"
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
                        className="object-cover"
                        priority
                    />
                )}
                {/* Close Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition-all duration-150 hover:scale-105 active:scale-95"
                >
                    <X className="h-5 w-5" />
                </Button>

                {/* Mobile Title Overlay */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:hidden"
                >
                    <h2 className="text-3xl font-serif font-bold text-white">{item.name}</h2>
                    <p className="text-orange-300 font-bold uppercase text-sm tracking-wide">{item.category}</p>
                </motion.div>
            </motion.div>

            {/* Content Section: Scrollable */}
            <motion.div
                className="flex-1 overflow-y-auto p-6 md:p-12 md:w-1/2 md:order-1 relative cursor-auto"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                onClick={handleContentClick}
            >
                <div className="max-w-xl mx-auto space-y-8 min-h-full flex flex-col justify-center">
                    <div className="hidden md:block">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className="text-gray-400 font-bold uppercase tracking-wider mb-2 text-xs"
                        >
                            {item.category}
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="text-5xl lg:text-6xl font-serif font-black text-gray-900 dark:text-gray-50 mb-5 leading-tight"
                        >
                            {item.name}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            className="text-xl lg:text-2xl text-gray-500 dark:text-gray-400 italic font-serif leading-relaxed"
                        >
                            {item.tagline}
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.3 }}
                        className="prose dark:prose-invert prose-lg prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:font-light prose-p:leading-loose"
                    >
                        <p>{item.details}</p>
                    </motion.div>

                    {/* Links Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="pt-6 space-y-4"
                    >
                        {item.links.map((link: { label: string; url: string }, i: number) => {
                            let Icon = ExternalLink;
                            if (link.label.toLowerCase().includes("google") || link.label.toLowerCase().includes("map")) Icon = MapPin;

                            return (
                                <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-5 py-2 hover:translate-x-1 transition-transform duration-200 ease-out"
                                >
                                    <div className="h-11 w-11 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-all duration-200">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-orange-500 transition-colors duration-150">{link.label}</span>
                                        <span className="text-lg font-medium text-gray-900 dark:text-white">
                                            View Location
                                        </span>
                                    </div>
                                </a>
                            );
                        })}
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}
