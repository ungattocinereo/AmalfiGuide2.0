"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-context";
import { useLayout } from "@/components/layout-context";
import { useTheme } from "next-themes";
import { getBlurDataURL } from "@/lib/blur-data.generated";
import { ContextWidget } from "@/components/context-widget";

const ease = [0.16, 1, 0.3, 1] as const;

// English defaults so the hero never shows raw translation keys before fetch completes
const defaults: Record<string, string> = {
    "hero.kicker": "Curated local guide",
    "hero.headingLine1": "",
    "hero.headingAccent": "Amalfi,",
    "hero.headingLine3a": "Right in Your",
    "hero.headingLine3b": "Pocket",
    "hero.description": "Ready-to-use ideas for walks, swims, moto rides, and food stops — with clear directions, offline maps, and simplified transport timings.",
    "hero.bus": "Bus",
    "hero.ferry": "Ferry",
    "hero.airport": "Airport",
    "hero.explore": "Explore",
    "hero.locationBadge": "Atrani, Amalfi Coast",
    "hero.verticalText": "Amalfi Coast, Italy",
};

export function Hero() {
    const { t: _t } = useLanguage();
    const { isAllExpanded } = useLayout();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => { setMounted(true); }, []);
    const isDark = mounted && resolvedTheme === "dark";
    const heroBlur = getBlurDataURL("/images/hero.webp");
    const t = (key: string) => {
        const val = _t(key);
        return val === key ? (defaults[key] ?? key) : val;
    };

    // ===== COMPACT HERO (when collapsed) =====
    if (!isAllExpanded) {
        return (
            <motion.section
                className="relative w-full bg-[#1A0A00] overflow-hidden
                           pt-[max(4.5rem,calc(env(safe-area-inset-top)+3.75rem))]"
                initial={false}
                animate={{ height: "auto" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Warm gradient overlay */}
                <div className="absolute inset-0 z-0 pointer-events-none"
                     style={{
                         background: "radial-gradient(ellipse 80% 60% at 0% 100%, rgba(244,54,0,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 100% 0%, rgba(244,54,0,0.06) 0%, transparent 60%)",
                     }}
                />

                {/* Compact content — below the fixed navbar */}
                <div className="relative z-[2] flex items-center gap-4 px-5 md:px-8 py-4 md:py-5">
                    {/* App icon */}
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-[9px] md:rounded-[11px] overflow-hidden flex-shrink-0 shadow-[0_4px_20px_rgba(244,54,0,0.3)]">
                        <Image
                            src="/images/icon-512x512.png"
                            alt="Amalfi.Day"
                            width={40}
                            height={40}
                            priority
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Compact heading */}
                    <div className="flex-1 min-w-0">
                        <h1
                            style={{ fontFamily: 'var(--font-merriweather)' }}
                            className="font-bold text-[#FDF6F0] text-lg md:text-xl leading-tight tracking-tight truncate"
                        >
                            {t('hero.headingLine1') && <>{t('hero.headingLine1')}{" "}</>}
                            <span className="text-[#F43600] italic font-normal">{t('hero.headingAccent')}</span>{" "}
                            <span className="font-normal text-[#FDF6F0]/60">{t('hero.headingLine3a')}</span>{" "}
                            {t('hero.headingLine3b')}
                        </h1>
                    </div>

                    {/* Location badge inline */}
                    <div className={`hidden md:flex items-center gap-2 py-[6px] px-3 rounded-full font-sans text-[0.65rem] font-semibold tracking-[0.02em] flex-shrink-0
                                    ${isDark
                                        ? "bg-white/[0.06] border border-white/[0.08] text-[#FDF6F0]/70"
                                        : "bg-white/[0.06] border border-white/[0.08] text-[#FDF6F0]/70"
                                    }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F43600" className="w-3 h-3 flex-shrink-0">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        {t('hero.locationBadge')}
                    </div>
                </div>
            </motion.section>
        );
    }

    // ===== FULL HERO (expanded) =====
    return (
        <section className="relative w-full h-dvh min-h-[640px] grid grid-cols-1 grid-rows-[auto_1fr] md:grid-cols-2 md:grid-rows-1 overflow-hidden gap-0">

            {/* Thin vertical divider between panels (desktop only) */}
            <motion.div
                className="hidden md:block absolute z-10 left-1/2 top-0 bottom-0 w-px transition-opacity duration-700"
                style={{
                    background: isDark
                        ? "linear-gradient(to bottom, transparent 5%, rgba(244,54,0,0.25) 30%, rgba(244,54,0,0.25) 70%, transparent 95%)"
                        : "linear-gradient(to bottom, transparent 5%, rgba(244,54,0,0.15) 30%, rgba(244,54,0,0.15) 70%, transparent 95%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
            />

            {/* ===== LEFT PANEL — Dark editorial ===== */}
            <div className="relative bg-[#1A0A00] flex flex-col justify-between overflow-hidden z-[1] order-2 md:order-1
                            px-[clamp(1.5rem,4vw,4rem)]
                            pt-[max(4.5rem,calc(env(safe-area-inset-top)+3.75rem),clamp(4.5rem,5vh,5rem))]
                            pb-[clamp(1.2rem,4vw,4rem)]">

                {/* Warm gradient overlays */}
                <div className="absolute inset-0 z-0 pointer-events-none"
                     style={{
                         background: "radial-gradient(ellipse 80% 60% at 0% 100%, rgba(244,54,0,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 100% 0%, rgba(244,54,0,0.06) 0%, transparent 60%)",
                     }}
                />

                {/* Fine grain texture */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
                     style={{
                         backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                         backgroundSize: "180px",
                     }}
                />

                {/* Brand cluster */}
                <motion.div
                    className="relative z-[2] flex items-center gap-4 mb-4 md:mb-0"
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease, delay: 0.3 }}
                >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-[11px] md:rounded-[13px] overflow-hidden flex-shrink-0 shadow-[0_4px_20px_rgba(244,54,0,0.3)]">
                        <Image
                            src="/images/icon-512x512.png"
                            alt="Amalfi.Day"
                            width={48}
                            height={48}
                            priority
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="h-[33px] md:h-[42px] opacity-90">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/guide-logo.svg"
                            alt="guide. AMALFI.DAY"
                            width={120}
                            height={33}
                            className="h-full w-auto block"
                        />
                    </div>
                </motion.div>

                {/* Copy block — center vertically on desktop */}
                <div className="relative z-[2] flex-1 flex flex-col justify-center py-0 md:py-8">
                    {/* Kicker */}
                    <motion.div
                        className="font-sans text-[0.65rem] md:text-[0.7rem] font-semibold tracking-[0.3em] uppercase text-[#F43600] mb-3 md:mb-5 flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease, delay: 0.5 }}
                    >
                        <span className="w-5 md:w-8 h-0.5 bg-[#F43600] rounded-sm block" />
                        {t('hero.kicker')}
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        style={{ fontFamily: 'var(--font-merriweather)' }}
                        className="font-bold text-[#FDF6F0] leading-[1.05] tracking-tight
                                   text-[clamp(1.8rem,8vw,2.6rem)] md:text-[clamp(2.8rem,5.5vw,5rem)] lg:text-[5.2rem]"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease, delay: 0.6 }}
                    >
                        {t('hero.headingLine1') && <span className="block">{t('hero.headingLine1')}</span>}
                        <span className="block">
                            <span className="text-[#F43600] italic font-normal">{t('hero.headingAccent')}</span>
                        </span>
                        <span className="block">
                            <span className="font-normal text-[#FDF6F0]/60">{t('hero.headingLine3a')}</span>{" "}
                            {t('hero.headingLine3b')}
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        className="font-sans text-[0.82rem] md:text-[0.95rem] leading-relaxed text-[#FDF6F0]/55 max-w-none md:max-w-[380px] mt-4 md:mt-6"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease, delay: 0.9 }}
                    >
                        {t('hero.description')}
                    </motion.p>

                    {/* Real-time context — sunset, weather, hiking suitability */}
                    <motion.div
                        className="mt-4 md:mt-5"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease, delay: 1.0 }}
                    >
                        <ContextWidget />
                    </motion.div>
                </div>

                {/* Bottom row: Transport pills + scroll CTA */}
                <motion.div
                    className="relative z-[2] flex items-center justify-between gap-5 pt-4 md:pt-0"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease, delay: 1.1 }}
                >
                    <div className="flex gap-[6px] md:gap-2">
                        {/* Bus */}
                        <a
                            href="https://cnr.pw/bus"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-[5px] md:gap-[7px] py-[7px] px-3 md:px-[14px] bg-white/[0.06] border border-white/[0.08] rounded-full
                                       text-[#FDF6F0]/65 font-sans text-[0.62rem] md:text-[0.7rem] font-medium tracking-[0.04em] uppercase whitespace-nowrap
                                       hover:bg-[#F43600]/15 hover:border-[#F43600]/30 hover:text-[#FF6B3D] hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[13px] h-[13px] md:w-[15px] md:h-[15px] flex-shrink-0">
                                <path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/>
                                <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
                                <circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>
                            </svg>
                            <span>{t('hero.bus')}</span>
                        </a>

                        {/* Ferry */}
                        <a
                            href="https://cnr.pw/ferry"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-[5px] md:gap-[7px] py-[7px] px-3 md:px-[14px] bg-white/[0.06] border border-white/[0.08] rounded-full
                                       text-[#FDF6F0]/65 font-sans text-[0.62rem] md:text-[0.7rem] font-medium tracking-[0.04em] uppercase whitespace-nowrap
                                       hover:bg-[#F43600]/15 hover:border-[#F43600]/30 hover:text-[#FF6B3D] hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[13px] h-[13px] md:w-[15px] md:h-[15px] flex-shrink-0">
                                <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                                <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
                                <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/>
                                <path d="M12 10v4"/><path d="M12 2v3"/>
                            </svg>
                            <span>{t('hero.ferry')}</span>
                        </a>

                        {/* Airport */}
                        <a
                            href="https://cnr.pw/shuttle"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-[5px] md:gap-[7px] py-[7px] px-3 md:px-[14px] bg-white/[0.06] border border-white/[0.08] rounded-full
                                       text-[#FDF6F0]/65 font-sans text-[0.62rem] md:text-[0.7rem] font-medium tracking-[0.04em] uppercase whitespace-nowrap
                                       hover:bg-[#F43600]/15 hover:border-[#F43600]/30 hover:text-[#FF6B3D] hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[13px] h-[13px] md:w-[15px] md:h-[15px] flex-shrink-0">
                                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
                            </svg>
                            <span>{t('hero.airport')}</span>
                        </a>
                    </div>

                    {/* Scroll CTA — desktop only */}
                    <div className="hidden lg:flex items-center gap-2.5 text-[#FDF6F0]/35 font-sans text-[0.6rem] font-semibold tracking-[0.25em] uppercase">
                        <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#FDF6F0]/30 animate-pulse" />
                        {t('hero.explore')}
                    </div>
                </motion.div>
            </div>

            {/* ===== RIGHT PANEL — Illustration showcase ===== */}
            <div className={`relative flex items-end justify-center overflow-hidden order-1 md:order-2
                            md:h-auto transition-colors duration-700 ease-out
                            ${isDark ? "bg-[#0D0604]" : "bg-[#FDF6F0]"}`}>

                {/* Soft warm radial — shifts to ember glow in dark */}
                <div className="absolute w-[120%] h-[120%] -top-[10%] -left-[10%] z-0 pointer-events-none transition-opacity duration-700"
                     style={{
                         background: isDark
                             ? "radial-gradient(ellipse at 40% 60%, rgba(244,54,0,0.14) 0%, transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(244,54,0,0.06) 0%, transparent 50%)"
                             : "radial-gradient(ellipse at 40% 50%, rgba(244,54,0,0.07) 0%, transparent 65%)",
                     }}
                />

                {/* Subtle vignette in dark mode */}
                {isDark && (
                    <div className="absolute inset-0 z-0 pointer-events-none"
                         style={{
                             background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)",
                         }}
                    />
                )}

                {/* Decorative circle */}
                <motion.div
                    className={`absolute z-[1] rounded-full border pointer-events-none
                               w-[85%] aspect-square md:w-[50vw] md:min-w-[600px] md:max-w-[740px] md:aspect-square md:h-auto
                               bottom-[-15%] left-1/2 -translate-x-1/2 transition-colors duration-700
                               ${isDark ? "border-[#F43600]/20" : "border-[#F43600]/10"}`}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease, delay: 0.4 }}
                    style={{ transformOrigin: "center center" }}
                >
                    {/* Outer ring */}
                    <div className={`absolute -inset-[30px] rounded-full border transition-colors duration-700
                                    ${isDark ? "border-[#F43600]/10" : "border-[#F43600]/5"}`} />
                </motion.div>

                {/* Accent dots — desktop only, brighter in dark mode */}
                <motion.div
                    className={`hidden md:block absolute z-[3] w-3 h-3 rounded-full bg-[#F43600] bottom-[28%] left-[10%] transition-shadow duration-700
                               ${isDark ? "shadow-[0_0_28px_rgba(244,54,0,0.6)]" : "shadow-[0_0_20px_rgba(244,54,0,0.4)]"}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 1.4 }}
                />
                <motion.div
                    className={`hidden md:block absolute z-[3] w-[7px] h-[7px] rounded-full bg-[#F43600] bottom-[40%] left-[6%] transition-shadow duration-700
                               ${isDark ? "shadow-[0_0_18px_rgba(244,54,0,0.5)]" : "shadow-[0_0_12px_rgba(244,54,0,0.3)]"}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 1.55 }}
                />

                {/* Watercolor illustration — deeper shadow in dark mode */}
                <motion.div
                    className="relative z-[2] flex-shrink-0 -mb-[2px]
                               w-[70vw] max-w-[340px] md:w-[42vw] md:min-w-[520px] md:max-w-[640px]
                               transition-[filter] duration-700"
                    style={{
                        filter: isDark
                            ? "drop-shadow(0 24px 64px rgba(244,54,0,0.12)) drop-shadow(0 8px 24px rgba(0,0,0,0.4))"
                            : "drop-shadow(0 24px 48px rgba(26,10,0,0.15)) drop-shadow(0 8px 16px rgba(26,10,0,0.1))",
                    }}
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1.2, ease, delay: 0.5 }}
                >
                    <Image
                        src="/images/hero.webp"
                        alt="Watercolor illustration of Atrani, Amalfi Coast"
                        width={640}
                        height={800}
                        priority
                        sizes="(max-width: 768px) 70vw, 640px"
                        placeholder={heroBlur ? "blur" : "empty"}
                        blurDataURL={heroBlur}
                        className="w-full h-auto block"
                    />
                </motion.div>

                {/* Location badge — dark variant with glassy dark bg */}
                <motion.div
                    className={`absolute z-[5] bottom-[8%] md:bottom-[8%] right-[4%] md:right-[8%]
                               flex items-center gap-2 py-[7px] px-3 md:py-[10px] md:px-[18px]
                               rounded-full font-sans text-[0.62rem] md:text-[0.75rem] font-semibold tracking-[0.02em]
                               transition-all duration-700
                               ${isDark
                                   ? "bg-[#1A0A00]/80 backdrop-blur-md border border-[#F43600]/20 text-[#FDF6F0]/85 shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_16px_rgba(244,54,0,0.08)]"
                                   : "bg-white text-[#3D2415] shadow-[0_8px_32px_rgba(26,10,0,0.08),0_2px_8px_rgba(26,10,0,0.04)]"
                               }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease, delay: 1.3 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F43600" className="w-3.5 h-3.5 flex-shrink-0">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    {t('hero.locationBadge')}
                </motion.div>

                {/* Vertical text — desktop only */}
                <motion.div
                    className={`hidden md:block absolute z-[5] right-[2.5%] top-1/2 -translate-y-1/2 rotate-180
                               font-sans text-[0.55rem] font-semibold tracking-[0.35em] uppercase transition-colors duration-700
                               ${isDark ? "text-[#FDF6F0]/10" : "text-[#1A0A00]/15"}`}
                    style={{ writingMode: "vertical-lr" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                >
                    {t('hero.verticalText')}
                </motion.div>
            </div>

        </section>
    );
}
