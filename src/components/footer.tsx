"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    InstagramLogo,
    FacebookLogo,
    XLogo,
    Airplane,
    MapTrifold,
    Download,
    HouseLine,
    House,
    Signpost,
    Star,
    Car,
    Umbrella,
    Newspaper,
    Envelope,
    BookmarkSimple,
} from "@phosphor-icons/react";
import { useLanguage } from "@/components/language-context";

type FooterLink = {
    label: string;
    href: string;
    external?: boolean;
    icon?: string;
    spacer?: boolean;
    action?: "bookmark";
};

const MAIN_SITE = "https://amalfi.day";

const footerLinks: Record<string, FooterLink[]> = {
    transport: [
        { label: "footer.ferryTimetables", href: "https://cnr.pw/ferry", external: true, icon: "download" },
        { label: "footer.busTimetables", href: "https://cnr.pw/bus", external: true, icon: "download" },
        { label: "footer.airportShuttle", href: `${MAIN_SITE}/how-to-get`, external: true, icon: "airplane" },
        { label: "footer.allPublicTransport", href: `${MAIN_SITE}/timetables`, external: true, icon: "map" },
    ],
    apartments: [
        { label: "footer.gregsGuide", href: "https://guide.amalfi.day", external: true, icon: "signpost" },
        { label: "footer.apartmentOverview", href: `${MAIN_SITE}/apartments`, external: true, icon: "house-heart" },
        { label: "footer.booking", href: "https://www.booking.com/hotel/it/cristallpont-amalfi-day.html", external: true, icon: "booking" },
        { label: "footer.airbnb", href: "https://airbnb.com/p/atrani", external: true, icon: "house" },
    ],
    info: [
        { label: "footer.whatToDo", href: `${MAIN_SITE}/experience`, external: true, icon: "star" },
        { label: "footer.parkingTips", href: `${MAIN_SITE}/parking`, external: true, icon: "parking" },
        { label: "footer.beachReview", href: `${MAIN_SITE}/beaches`, external: true, icon: "umbrella" },
        { label: "footer.motoRoads", href: `${MAIN_SITE}/moto`, external: true, icon: "map" },
    ],
    blog: [
        { label: "footer.amalfiNews", href: `${MAIN_SITE}/blog`, external: true, icon: "newspaper" },
        { label: "footer.contactUs", href: `${MAIN_SITE}/contact`, external: true, icon: "envelope" },
        { label: "", href: "#", spacer: true },
        { label: "footer.addToBookmarks", href: "#bookmark", icon: "bookmark", action: "bookmark" as const },
    ],
};

const socialLinks = [
    { label: "Instagram", href: "https://instagram.com/amalfi.day", icon: InstagramLogo, hoverClass: "hover:bg-[#e1306c] hover:border-transparent hover:text-white" },
    { label: "Facebook", href: "https://facebook.com/amalfi.day", icon: FacebookLogo, hoverClass: "hover:bg-[#1877f2] hover:border-transparent hover:text-white" },
    { label: "Twitter", href: "https://twitter.com/amalfiday", icon: XLogo, hoverClass: "hover:bg-[#1d9bf0] hover:border-transparent hover:text-white" },
];

function LinkIcon({ icon, className }: { icon: string; className?: string }) {
    const props = { size: 16, weight: "regular" as const, className };
    switch (icon) {
        case "download": return <Download {...props} />;
        case "airplane": return <Airplane {...props} />;
        case "map": return <MapTrifold {...props} />;
        case "signpost": return <Signpost {...props} />;
        case "house-heart": return <HouseLine {...props} />;
        case "house": return <House {...props} />;
        case "star": return <Star {...props} />;
        case "parking": return <Car {...props} />;
        case "umbrella": return <Umbrella {...props} />;
        case "newspaper": return <Newspaper {...props} />;
        case "envelope": return <Envelope {...props} />;
        case "bookmark": return <BookmarkSimple {...props} />;
        case "booking": return (
            <img
                src="/brand/booking.svg"
                alt=""
                aria-hidden="true"
                className="w-4 h-4 object-contain inline-block dark:invert dark:opacity-70"
                loading="lazy"
            />
        );
        default: return null;
    }
}

function FooterColumn({ links }: { links: FooterLink[] }) {
    const { t } = useLanguage();

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        alert("Press Ctrl+D (Windows) or \u2318+D (Mac) to bookmark this page.");
    };

    return (
        <div className="flex flex-col gap-3 sm:gap-2">
            {links.map((item, i) => {
                if ("spacer" in item && item.spacer) {
                    return <span key={i} className="h-2" aria-hidden="true" />;
                }
                return (
                    <a
                        key={i}
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noreferrer" : undefined}
                        onClick={item.action === "bookmark" ? handleBookmark : undefined}
                        className="group flex items-center gap-2 text-gray-700 dark:text-gray-300 text-[1.1rem] sm:text-[0.95rem] font-medium border-b border-gray-200 dark:border-gray-700/50 pb-2 sm:pb-1.5 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-150"
                    >
                        {item.icon && (
                            <LinkIcon
                                icon={item.icon}
                                className="text-gray-400 dark:text-gray-500 shrink-0"
                            />
                        )}
                        <span>{t(item.label)}</span>
                    </a>
                );
            })}
        </div>
    );
}

export function Footer() {
    const { t } = useLanguage();

    return (
        <>
            {/* Main Footer */}
            <footer className="pt-12 sm:pt-16 pb-0 px-5 sm:px-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,1fr)] gap-8 lg:gap-6">
                        {/* Brand column */}
                        <div className="flex flex-col items-center sm:items-start">
                            <div className="mb-5">
                                <img
                                    className="h-14 sm:h-14 w-auto max-w-[240px] object-contain block dark:hidden"
                                    src="/brand/logo-color-black.svg"
                                    alt="Amalfi.Day"
                                    loading="lazy"
                                />
                                <img
                                    className="h-14 sm:h-14 w-auto max-w-[240px] object-contain hidden dark:block"
                                    src="/brand/logo-color-white.svg"
                                    alt="Amalfi.Day"
                                    loading="lazy"
                                />
                            </div>
                            <div className="flex gap-2.5">
                                {socialLinks.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={item.label}
                                        className={`w-11 h-11 rounded-full border border-gray-300 dark:border-gray-600 inline-flex items-center justify-center text-gray-600 dark:text-gray-300 transition-all duration-200 hover:-translate-y-0.5 ${item.hoverClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500`}
                                    >
                                        <item.icon size={18} weight="regular" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Link columns */}
                        <FooterColumn links={footerLinks.transport} />
                        <FooterColumn links={footerLinks.apartments} />
                        <FooterColumn links={footerLinks.info} />
                        <FooterColumn links={footerLinks.blog} />
                    </div>
                </motion.div>

                {/* Bottom bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="max-w-6xl mx-auto mt-10 sm:mt-12 py-5 border-t border-gray-200 dark:border-gray-700/50 text-[0.82rem] text-gray-500 dark:text-gray-500"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-wrap">
                        <span>
                            © 2014–{new Date().getFullYear()} CristallPont S.R.L. / P.IVA: 06863730650
                        </span>
                        <div className="flex items-center gap-2.5 sm:ml-auto sm:text-right flex-wrap">
                            <a
                                href={`${MAIN_SITE}/privacy`}
                                target="_blank"
                                rel="noreferrer"
                                className="underline underline-offset-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            >
                                {t("footer.privacyPolicy")}
                            </a>
                            <span className="hidden sm:inline text-gray-400 dark:text-gray-600" aria-hidden="true">•</span>
                            <span className="font-mono tracking-wide text-[0.82rem] sm:mt-0 mt-2">
                                Design & Development Gregory &lsquo;<a
                                    className="underline underline-offset-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                    href="https://cinereo.it"
                                    target="_blank"
                                    rel="noreferrer"
                                >Cinereo</a>&rsquo; Day
                            </span>
                        </div>
                    </div>
                </motion.div>
            </footer>
        </>
    );
}
