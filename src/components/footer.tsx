"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    InstagramLogo,
    FacebookLogo,
    XLogo,
    Airplane,
    MapTrifold,
    Download,
    Star,
    Car,
    Umbrella,
    Newspaper,
    Envelope,
} from "@phosphor-icons/react";
import { useLanguage } from "@/components/language-context";

type FooterLink = {
    label: string;
    href: string;
    external?: boolean;
    icon?: string;
};

const MAIN_SITE = "https://amalfi.day";

const footerLinks: Record<string, FooterLink[]> = {
    transport: [
        { label: "footer.ferryTimetables", href: "https://cnr.pw/ferry", external: true, icon: "download" },
        { label: "footer.busTimetables", href: "https://cnr.pw/bus", external: true, icon: "download" },
        { label: "footer.airportShuttle", href: `${MAIN_SITE}/how-to-get`, external: true, icon: "airplane" },
        { label: "footer.allPublicTransport", href: `${MAIN_SITE}/timetables`, external: true, icon: "map" },
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
    ],
};

const socialLinks = [
    { label: "Instagram", href: "https://instagram.com/amalfi.day", icon: InstagramLogo, hoverClass: "hover:bg-[#e1306c] hover:border-transparent hover:text-white" },
    { label: "Facebook", href: "https://facebook.com/amalfi.day", icon: FacebookLogo, hoverClass: "hover:bg-[#1877f2] hover:border-transparent hover:text-white" },
    { label: "Twitter", href: "https://twitter.com/amalfiday", icon: XLogo, hoverClass: "hover:bg-[#1d9bf0] hover:border-transparent hover:text-white" },
];

function LinkIcon({ icon, className }: { icon: string; className?: string }) {
    const props = { size: 18, weight: "regular" as const, className };
    switch (icon) {
        case "download": return <Download {...props} />;
        case "airplane": return <Airplane {...props} />;
        case "map": return <MapTrifold {...props} />;
        case "star": return <Star {...props} />;
        case "parking": return <Car {...props} />;
        case "umbrella": return <Umbrella {...props} />;
        case "newspaper": return <Newspaper {...props} />;
        case "envelope": return <Envelope {...props} />;
        default: return null;
    }
}

function FooterColumn({ links }: { links: FooterLink[] }) {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col gap-1 sm:gap-1.5">
            {links.map((item, i) => (
                <a
                    key={i}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-3 text-gray-700 dark:text-gray-300 text-[1.05rem] sm:text-base font-medium border-b border-gray-200 dark:border-gray-700/50 py-3 sm:py-2.5 min-h-[44px] hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-150 touch-manipulation"
                >
                    {item.icon && (
                        <LinkIcon
                            icon={item.icon}
                            className="text-gray-400 dark:text-gray-500 shrink-0 group-hover:text-orange-500 transition-colors duration-150"
                        />
                    )}
                    <span>{t(item.label)}</span>
                </a>
            ))}
        </div>
    );
}

export function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            {/* Main footer content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-10 sm:pb-12"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(3,1fr)] gap-8 lg:gap-6">
                    {/* Brand column */}
                    <div className="flex flex-col items-center sm:items-start">
                        <div className="mb-5">
                            <Image
                                className="h-14 sm:h-14 w-auto max-w-[240px] object-contain block dark:hidden"
                                src="/brand/logo-color-black.svg"
                                alt="Amalfi.Day"
                                width={240}
                                height={56}
                                unoptimized
                            />
                            <Image
                                className="h-14 sm:h-14 w-auto max-w-[240px] object-contain hidden dark:block"
                                src="/brand/logo-color-white.svg"
                                alt="Amalfi.Day"
                                width={240}
                                height={56}
                                unoptimized
                            />
                        </div>
                        <div className="flex gap-2.5">
                            {socialLinks.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
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
                    <FooterColumn links={footerLinks.info} />
                    <FooterColumn links={footerLinks.blog} />
                </div>
            </motion.div>

            {/* Bottom bar */}
            <div className="border-t border-gray-200/80 dark:border-gray-800/80">
                <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4">
                    <div className="flex flex-col gap-3 text-[0.72rem] text-gray-400 dark:text-gray-500 leading-relaxed">
                        {/* Top row — legal + policies */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <span>
                                © 2014–{new Date().getFullYear()} CristallPont S.R.L. · P.IVA 06863730650 · Atrani (SA), Italy
                            </span>
                            <div className="flex items-center gap-0 flex-wrap">
                                <a
                                    href={`${MAIN_SITE}/privacy`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {t("footer.privacyPolicy")}
                                </a>
                                <span className="mx-1.5 text-gray-300 dark:text-gray-700" aria-hidden="true">&middot;</span>
                                <a
                                    href={`${MAIN_SITE}/terms`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {t("footer.terms")}
                                </a>
                                <span className="mx-1.5 text-gray-300 dark:text-gray-700" aria-hidden="true">&middot;</span>
                                <a
                                    href="mailto:hello@amalfi.day"
                                    className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    hello@amalfi.day
                                </a>
                            </div>
                        </div>

                        {/* Bottom row — designer credit in monospace */}
                        <div className="text-center sm:text-left">
                            <span className="font-mono text-[0.68rem] tracking-wide text-gray-300 dark:text-gray-600">
                                Design & Development Gregory &lsquo;<a
                                    className="hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                                    href="https://cinereo.it"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >Cinereo</a>&rsquo; Day
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
