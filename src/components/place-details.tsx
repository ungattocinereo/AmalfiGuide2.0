"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, MapPin, ArrowSquareOut, StarHalf, MapTrifold } from "@phosphor-icons/react";
import type { PlaceItem } from "@/lib/markdown-parser";
import { getImageForPlace, getHikingMapUrl } from "@/lib/place-images";
import { getBlurDataURL } from "@/lib/blur-data.generated";
import { useLanguage } from "@/components/language-context";

interface PlaceDetailsProps {
    item: PlaceItem;
    layoutId: string;
    onClose: () => void;
}

export function PlaceDetails({ item, layoutId, onClose }: PlaceDetailsProps) {
    const { t } = useLanguage();
    const imageUrl = getImageForPlace(item.name);
    const hikingMapUrl = getHikingMapUrl(item.name);
    const blurDataURL = getBlurDataURL(imageUrl);

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
            className="fixed inset-0 z-50 flex flex-col md:flex-row bg-white dark:bg-gray-950 cursor-zoom-out"
            onClick={onClose}
            style={{ overscrollBehavior: "contain" }}
        >
            {/* Visual Section: Mobile Top, Desktop Right Half */}
            <motion.div
                layoutId={layoutId}
                className="relative w-full h-[45vh] md:h-full md:w-1/2 md:order-2 cursor-zoom-out overflow-hidden flex-shrink-0"
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
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority
                        placeholder={blurDataURL ? "blur" : "empty"}
                        blurDataURL={blurDataURL}
                    />
                )}

                {/* Gradient overlay for visual flow into content (mobile) */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent md:hidden pointer-events-none" />

                {/* Close Button - proper 48px touch target */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    aria-label="Close"
                    className="absolute top-4 right-4 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 active:bg-black/60 text-white backdrop-blur-md transition-all duration-150 active:scale-90 touch-manipulation"
                >
                    <X size={22} weight="bold" />
                </button>

                {/* Safe area for notch */}
                <div className="absolute top-0 inset-x-0" style={{ height: 'env(safe-area-inset-top)' }} />
            </motion.div>

            {/* Content Section: Scrollable */}
            <motion.div
                className="flex-1 overflow-y-auto px-6 pt-2 pb-8 md:px-12 md:pt-12 md:pb-12 md:w-1/2 md:order-1 relative cursor-auto"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                onClick={handleContentClick}
                style={{ overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
            >
                {/* Pull indicator (mobile only) */}
                <div className="flex justify-center py-3 md:hidden">
                    <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                </div>

                <div className="max-w-xl mx-auto space-y-6 md:space-y-8 md:min-h-full md:flex md:flex-col md:justify-center">
                    <div>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className="text-orange-500 dark:text-orange-400 font-bold uppercase tracking-wider mb-2 text-xs"
                        >
                            {item.category}
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            style={{ fontFamily: 'var(--font-merriweather)', textWrap: 'balance' } as React.CSSProperties}
                            className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-3 md:mb-5 leading-tight"
                        >
                            {item.name}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            style={{ fontFamily: 'var(--font-merriweather)' }}
                            className="text-base md:text-lg lg:text-xl text-gray-500 dark:text-gray-400 italic leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: item.taglineHtml }}
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.3 }}
                        className="prose dark:prose-invert prose-base md:prose-lg prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-[1.8]"
                        dangerouslySetInnerHTML={{ __html: item.detailsHtml }}
                    />

                    {/* Links Section - larger touch targets */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="pt-4 space-y-2"
                    >
                        {item.links.map((link: { label: string; url: string }, i: number) => {
                            // Determine link type
                            const isGoogleMaps = link.label.toLowerCase().includes("google") ||
                                                 link.label.toLowerCase().includes("view location") ||
                                                 (link.url.includes("maps.") && !link.url.includes("tripadvisor"));
                            const isTripAdvisor = link.url.includes("tripadvisor");
                            const isHikeLink = link.label.toLowerCase().includes("hike");

                            // Extract TripAdvisor rating from label like "4.5/5 | 250+ Reviews"
                            const tripAdvisorMatch = link.label.match(/(\d+\.?\d*\/\d+)\s*\|\s*(.+)/);

                            // Determine superscript text
                            let superscriptText = link.label;
                            if (isGoogleMaps) {
                                superscriptText = t("placeDetails.googleMaps");
                            } else if (isTripAdvisor && tripAdvisorMatch) {
                                superscriptText = tripAdvisorMatch[0];
                            } else if (isTripAdvisor) {
                                superscriptText = t("placeDetails.tripAdvisor");
                            }

                            // Determine link text
                            let linkText = t("placeDetails.view");
                            if (isGoogleMaps) {
                                linkText = t("placeDetails.viewLocation");
                            } else if (isTripAdvisor) {
                                linkText = t("placeDetails.viewOnTripAdvisor");
                            } else if (isHikeLink) {
                                linkText = t("placeDetails.viewHikeMap");
                            }

                            return (
                                <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-4 py-3 px-4 -mx-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200 min-h-[52px] touch-manipulation"
                                >
                                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex-shrink-0 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/50 transition-colors duration-200">
                                        {isGoogleMaps ? (
                                            <MapPin size={22} weight="duotone" />
                                        ) : isTripAdvisor ? (
                                            <StarHalf size={22} weight="duotone" />
                                        ) : isHikeLink ? (
                                            <MapTrifold size={22} weight="duotone" />
                                        ) : (
                                            <ArrowSquareOut size={22} weight="duotone" />
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-orange-500 transition-colors duration-150">
                                            {superscriptText}
                                        </span>
                                        <span className="text-base font-medium text-gray-900 dark:text-white truncate">
                                            {linkText}
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
