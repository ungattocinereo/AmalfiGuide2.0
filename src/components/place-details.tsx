"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useDragControls, useReducedMotion } from "framer-motion";
import { X, MapPin, ArrowSquareOut, StarHalf, MapTrifold, Clock, Timer, Receipt, Mountains as MountainIcon, Sun, Ruler, CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { PlaceItem } from "@/lib/markdown-parser";
import { getImageForPlace, getHikingMapUrl } from "@/lib/place-images";
import { getBlurDataURL } from "@/lib/blur-data.generated";
import { useLanguage } from "@/components/language-context";
import { useIsOpenNow } from "@/hooks/use-is-open-now";
import { getPlaceGallery } from "@/lib/place-gallery";

interface PlaceDetailsProps {
    item: PlaceItem;
    layoutId: string;
    onClose: () => void;
}

const translateLookup = (t: (key: string) => string, namespace: string, raw: string): string => {
    const key = `${namespace}.${raw.trim().toLowerCase()}`;
    const translated = t(key);
    return translated === key ? raw : translated;
};

export function PlaceDetails({ item, layoutId, onClose }: PlaceDetailsProps) {
    const { t } = useLanguage();
    const imageUrl = getImageForPlace(item.name);
    const hikingMapUrl = getHikingMapUrl(item.name);
    const blurDataURL = getBlurDataURL(imageUrl);
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const openNow = useIsOpenNow(item.hours);
    const prefersReducedMotion = useReducedMotion();
    const dragControls = useDragControls();

    const gallery = getPlaceGallery(item.name);
    const galleryImages = gallery.length > 1 ? gallery : [imageUrl];
    const [galleryIndex, setGalleryIndex] = useState(0);
    const hasMultiPhoto = galleryImages.length > 1;
    const currentImage = galleryImages[galleryIndex] ?? imageUrl;
    const goPrev = () => setGalleryIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
    const goNext = () => setGalleryIndex((i) => (i + 1) % galleryImages.length);

    const metaItems: Array<{ icon: typeof Clock; label: string; value: string; tone?: "positive" | "muted" }> = [];
    if (item.hours) {
        metaItems.push({
            icon: Clock,
            label: openNow === true ? t("meta.openNow") : openNow === false ? t("meta.closed") : t("meta.hoursLabel"),
            value: item.hours,
            tone: openNow === true ? "positive" : openNow === false ? "muted" : undefined,
        });
    }
    if (item.price) metaItems.push({ icon: Receipt, label: t("meta.priceLabel"), value: item.price });
    if (item.duration) metaItems.push({ icon: Timer, label: t("meta.durationLabel"), value: item.duration });
    if (item.difficulty) metaItems.push({ icon: MountainIcon, label: t("meta.difficultyLabel"), value: translateLookup(t, "meta.difficulty", item.difficulty) });
    if (item.distance) metaItems.push({ icon: Ruler, label: t("meta.distanceLabel"), value: item.distance });
    if (item.bestTime) metaItems.push({ icon: Sun, label: t("meta.bestTimeLabel"), value: translateLookup(t, "meta.bestTime", item.bestTime) });

    // Lock body scroll, manage focus, and handle keyboard (Escape + Tab trap)
    useEffect(() => {
        document.body.style.overflow = "hidden";
        const previouslyFocused = document.activeElement as HTMLElement | null;
        closeButtonRef.current?.focus();

        const getFocusable = (): HTMLElement[] => {
            if (!modalRef.current) return [];
            return Array.from(
                modalRef.current.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            ).filter((el) => !el.hasAttribute("aria-hidden"));
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }
            if (e.key === "Tab") {
                const focusable = getFocusable();
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                const active = document.activeElement as HTMLElement | null;
                if (e.shiftKey && active === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && active === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
            previouslyFocused?.focus?.();
        };
    }, [onClose]);

    // Stop propagation on content to allow backdrop click to close
    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="place-details-title"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 32 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            drag={prefersReducedMotion ? false : "y"}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 600 }}
            dragElastic={{ top: 0, bottom: 0.35 }}
            onDragEnd={(_, info) => {
                if (info.offset.y > 120 || info.velocity.y > 500) onClose();
            }}
            className="fixed inset-0 z-50 flex flex-col md:flex-row bg-white dark:bg-gray-950 cursor-zoom-out"
            onClick={onClose}
            style={{ overscrollBehavior: "contain", touchAction: "pan-y" }}
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
                    <>
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={currentImage}
                                initial={prefersReducedMotion ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
                                transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={currentImage}
                                    alt={item.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                    priority={galleryIndex === 0}
                                    placeholder={galleryIndex === 0 && blurDataURL ? "blur" : "empty"}
                                    blurDataURL={galleryIndex === 0 ? blurDataURL : undefined}
                                />
                            </motion.div>
                        </AnimatePresence>

                        {hasMultiPhoto && (
                            <>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                    aria-label={t("gallery.previous")}
                                    className="absolute top-1/2 left-3 -translate-y-1/2 z-40 w-11 h-11 flex items-center justify-center rounded-full bg-black/35 hover:bg-black/55 text-white backdrop-blur-md transition active:scale-90"
                                >
                                    <CaretLeft size={20} weight="bold" />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                                    aria-label={t("gallery.next")}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 z-40 w-11 h-11 flex items-center justify-center rounded-full bg-black/35 hover:bg-black/55 text-white backdrop-blur-md transition active:scale-90"
                                >
                                    <CaretRight size={20} weight="bold" />
                                </button>
                                <div className="absolute bottom-3 inset-x-0 z-40 flex items-center justify-center gap-1.5">
                                    {galleryImages.map((_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setGalleryIndex(i); }}
                                            aria-label={t("gallery.goTo") + ` ${i + 1}`}
                                            className={`h-1.5 rounded-full transition-all ${i === galleryIndex ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* Gradient overlay for visual flow into content (mobile) */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent md:hidden pointer-events-none" />

                {/* Close Button - proper 48px touch target */}
                <button
                    ref={closeButtonRef}
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
                {/* Pull indicator — drag handle to close on mobile */}
                <div
                    className="flex justify-center py-3 md:hidden cursor-grab active:cursor-grabbing touch-none"
                    onPointerDown={(e) => {
                        if (prefersReducedMotion) return;
                        dragControls.start(e);
                    }}
                    role="button"
                    tabIndex={-1}
                    aria-label={t("meta.swipeToClose")}
                >
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
                            id="place-details-title"
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

                    {metaItems.length > 0 && (
                        <motion.ul
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.32, duration: 0.3 }}
                            className="grid grid-cols-2 gap-x-4 gap-y-3 -mt-2"
                            aria-label={t("meta.sectionLabel")}
                        >
                            {metaItems.map((meta, i) => {
                                const Icon = meta.icon;
                                const toneRing =
                                    meta.tone === "positive"
                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                        : meta.tone === "muted"
                                            ? "bg-gray-100 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400"
                                            : "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400";
                                return (
                                    <li key={i} className="flex items-center gap-3">
                                        <span className={`h-9 w-9 flex items-center justify-center rounded-full flex-shrink-0 ${toneRing}`}>
                                            <Icon size={18} weight="duotone" />
                                        </span>
                                        <span className="flex flex-col min-w-0">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                                {meta.label}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                                                {meta.value}
                                            </span>
                                        </span>
                                    </li>
                                );
                            })}
                        </motion.ul>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.3 }}
                        className="prose dark:prose-invert prose-base md:prose-lg prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-[1.8] prose-p:my-8 md:prose-p:my-9 prose-p:first:mt-0 prose-p:last:mb-0"
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
