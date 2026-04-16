"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useDragControls, useReducedMotion } from "framer-motion";
import { X, MapPin, ArrowSquareOut, StarHalf, MapTrifold, Clock, Timer, Receipt, Mountains as MountainIcon, Sun, Ruler, CaretLeft, CaretRight, ArrowLeft, ShareNetwork } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import type { PlaceItem } from "@/lib/markdown-parser";
import { getImageForPlace, getHikingMapUrl } from "@/lib/place-images";
import { getBlurDataURL } from "@/lib/blur-data.generated";
import { useLanguage } from "@/components/language-context";
import { useIsOpenNow } from "@/hooks/use-is-open-now";
import { getPlaceGallery } from "@/lib/place-gallery";

interface PlaceDetailsProps {
    item: PlaceItem;
    layoutId: string;
    /** Called when the user dismisses a modal. Ignored in page mode. */
    onClose?: () => void;
    /** "modal" = fixed overlay with drag-to-close (default); "page" = normal page block. */
    mode?: "modal" | "page";
}

const translateLookup = (t: (key: string) => string, namespace: string, raw: string): string => {
    const key = `${namespace}.${raw.trim().toLowerCase()}`;
    const translated = t(key);
    return translated === key ? raw : translated;
};

export function PlaceDetails({ item, layoutId, onClose, mode = "modal" }: PlaceDetailsProps) {
    const isModal = mode === "modal";
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

    const [shareToast, setShareToast] = useState<string | null>(null);
    const handleShare = useCallback(async () => {
        if (typeof window === "undefined") return;
        const shareUrl = window.location.href;
        const shareData: ShareData = {
            title: item.name,
            text: item.tagline || item.shortInfo,
            url: shareUrl,
        };
        if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
            try {
                await navigator.share(shareData);
                return;
            } catch {
                // User cancelled or share failed — fall through to copy-to-clipboard fallback.
            }
        }
        try {
            await navigator.clipboard.writeText(shareUrl);
            setShareToast(t("placeDetails.linkCopied"));
            setTimeout(() => setShareToast(null), 2200);
        } catch {
            // Clipboard also failed — silently skip; user can copy from URL bar.
        }
    }, [item.name, item.tagline, item.shortInfo, t]);

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

    // Body scroll lock — synchronous (before paint) to prevent a flash of the
    // page scrollbar behind the modal as it mounts.
    useLayoutEffect(() => {
        if (!isModal || typeof document === "undefined") return;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isModal]);

    // Modal-only concerns: focus management, keyboard (Escape + Tab trap).
    // In page mode none of this applies — the user is on a real page.
    useEffect(() => {
        if (!isModal) return;
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
                onClose?.();
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
            window.removeEventListener("keydown", handleKeyDown);
            previouslyFocused?.focus?.();
        };
    }, [onClose, isModal]);

    // Stop propagation on content to allow backdrop click to close (modal only).
    const handleContentClick = (e: React.MouseEvent) => {
        if (isModal) e.stopPropagation();
    };

    const rootProps = isModal
        ? {
            role: "dialog" as const,
            "aria-modal": true,
            "aria-labelledby": "place-details-title",
            initial: prefersReducedMotion ? false : { opacity: 0 },
            animate: { opacity: 1, y: 0 },
            exit: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 32 },
            transition: { duration: prefersReducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] as const },
            drag: prefersReducedMotion ? (false as const) : ("y" as const),
            dragListener: false,
            dragControls,
            dragConstraints: { top: 0, bottom: 600 },
            dragElastic: { top: 0, bottom: 0.35 },
            onDragEnd: (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
                if (info.offset.y > 120 || info.velocity.y > 500) onClose?.();
            },
            className: "fixed inset-0 z-50 bg-white dark:bg-gray-950 overflow-hidden",
            style: { touchAction: "pan-y" as const },
        }
        : {
            "aria-labelledby": "place-details-title",
            className: "relative w-full flex flex-col md:flex-row bg-white dark:bg-gray-950 md:min-h-[calc(100dvh-88px)]",
        };

    const visualSection = (
        <motion.div
            layoutId={isModal ? layoutId : undefined}
            className={`relative w-full ${isModal ? "h-[60dvh] md:h-screen md:sticky md:top-0 md:self-start cursor-zoom-out" : "h-[50vh] md:h-auto md:sticky md:top-0 md:self-start md:min-h-[calc(100dvh-88px)]"} md:w-1/2 md:order-2 overflow-hidden flex-shrink-0`}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={isModal ? onClose : undefined}
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

            {/* Back button for page mode (inside image, top-left) */}
            {!isModal && (
                <Link
                    href="/"
                    aria-label={t("placeDetails.backToGuide")}
                    className="absolute top-4 left-4 z-50 inline-flex items-center gap-2 pl-2 pr-3.5 h-11 rounded-full bg-black/35 hover:bg-black/55 active:bg-black/65 text-white backdrop-blur-md transition-all duration-150 active:scale-95 touch-manipulation font-sans text-xs font-semibold uppercase tracking-wider"
                >
                    <ArrowLeft size={18} weight="bold" />
                    <span>{t("placeDetails.backToGuide")}</span>
                </Link>
            )}

            {/* Share button for page mode (inside image) */}
            {!isModal && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleShare();
                    }}
                    aria-label={t("placeDetails.share")}
                    className="absolute top-4 right-4 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 active:bg-black/60 text-white backdrop-blur-md transition-all duration-150 active:scale-90 touch-manipulation"
                >
                    <ShareNetwork size={20} weight="bold" />
                </button>
            )}

            {/* Toast for clipboard fallback (page mode) */}
            {!isModal && shareToast && (
                <div
                    role="status"
                    aria-live="polite"
                    className="absolute top-[4.75rem] right-4 z-50 px-4 py-2 rounded-full bg-black/80 text-white text-xs font-semibold tracking-wide backdrop-blur-md shadow-lg"
                >
                    {shareToast}
                </div>
            )}
        </motion.div>
    );

    const contentSection = (
        <motion.div
            className={`relative w-full flex-1 flex flex-col px-6 pt-2 pb-8 md:px-12 md:pt-12 md:pb-12 md:w-1/2 md:order-1 cursor-auto ${isModal ? "pb-[max(2rem,env(safe-area-inset-bottom))]" : ""}`}
            initial={isModal ? { opacity: 0, x: -30 } : false}
            animate={isModal ? { opacity: 1, x: 0 } : undefined}
            exit={isModal ? { opacity: 0, x: -20 } : undefined}
            transition={isModal ? { duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] } : undefined}
            onClick={handleContentClick}
        >
            {/* Pull indicator — drag handle to close on mobile (modal only) */}
            {isModal && (
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
            )}

            <div className="max-w-xl mx-auto w-full space-y-6 md:space-y-8">
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
    );

    if (!isModal) {
        return (
            <motion.div ref={modalRef} {...rootProps}>
                {visualSection}
                {contentSection}
            </motion.div>
        );
    }

    return (
        <motion.div ref={modalRef} {...rootProps}>
            {/* Scroll container — single overflow-y-auto wraps both columns so image scrolls with content on mobile */}
            <div
                className="absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain flex flex-col md:flex-row md:min-h-screen"
                style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
            >
                {visualSection}
                {contentSection}
            </div>

            {/* Safe-area spacer for notch (fixed, independent of scroll) */}
            <div className="fixed top-0 inset-x-0 z-[55] pointer-events-none" style={{ height: 'env(safe-area-inset-top)' }} />

            {/* Close button — fixed, always visible after scrolling past image */}
            <button
                ref={closeButtonRef}
                onClick={(e) => {
                    e.stopPropagation();
                    onClose?.();
                }}
                aria-label={t("placeDetails.close")}
                className="fixed top-4 right-4 z-[60] w-12 h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 active:bg-black/60 text-white backdrop-blur-md transition-all duration-150 active:scale-90 touch-manipulation"
                style={{ top: 'max(1rem, env(safe-area-inset-top))' } as React.CSSProperties}
            >
                <X size={22} weight="bold" />
            </button>

            {/* Share button — fixed, to the left of close */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                }}
                aria-label={t("placeDetails.share")}
                className="fixed top-4 right-[4.5rem] z-[60] w-12 h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 active:bg-black/60 text-white backdrop-blur-md transition-all duration-150 active:scale-90 touch-manipulation"
                style={{ top: 'max(1rem, env(safe-area-inset-top))' } as React.CSSProperties}
            >
                <ShareNetwork size={20} weight="bold" />
            </button>

            {/* Toast for clipboard fallback */}
            {shareToast && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed top-[4.75rem] right-4 z-[60] px-4 py-2 rounded-full bg-black/80 text-white text-xs font-semibold tracking-wide backdrop-blur-md shadow-lg"
                    style={{ top: 'calc(max(1rem, env(safe-area-inset-top)) + 3.75rem)' } as React.CSSProperties}
                >
                    {shareToast}
                </div>
            )}
        </motion.div>
    );
}
