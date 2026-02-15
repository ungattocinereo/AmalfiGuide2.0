"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, ArrowsInSimple, ArrowsOutSimple, CaretDown } from "@phosphor-icons/react";
import { useLayout } from "@/components/layout-context";
import { useLanguage, LANGUAGES } from "@/components/language-context";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    const { setTheme, resolvedTheme } = useTheme();
    const { isAllExpanded, toggleAllExpanded } = useLayout();
    const { language, setLanguage, t } = useLanguage();
    const [mounted, setMounted] = React.useState(false);
    const [scrolled, setScrolled] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Observe the hero section to toggle navbar state
    useEffect(() => {
        const heroEl = document.querySelector("section");
        if (!heroEl) return;

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                // When hero is NOT intersecting (scrolled past), show compact bar
                setScrolled(!entry.isIntersecting);
            },
            { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
        );

        observerRef.current.observe(heroEl);
        return () => observerRef.current?.disconnect();
    }, [isAllExpanded]);

    // Shared button styles
    const overlayBtnClass =
        "rounded-full h-9 w-9 backdrop-blur-md border transition-all duration-200 ease-out active:scale-90 " +
        (resolvedTheme === "dark"
            ? "bg-white/[0.07] border-white/[0.1] text-[#FDF6F0]/70 hover:bg-[#F43600]/15 hover:border-[#F43600]/30 hover:text-[#FF6B3D] shadow-[0_2px_12px_rgba(0,0,0,0.2)]"
            : "bg-white/15 border-white/20 text-[#3D2415]/80 hover:bg-white/30 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
        );

    const compactBtnClass =
        "rounded-full h-8 w-8 transition-all duration-200 ease-out active:scale-90 " +
        "bg-white/[0.07] border border-white/[0.08] text-[#FDF6F0]/70 " +
        "hover:bg-[#F43600]/15 hover:border-[#F43600]/30 hover:text-[#FF6B3D]";

    const btnClass = scrolled ? compactBtnClass : overlayBtnClass;

    // In compact mode, always show the compact bar (not overlay buttons)
    const showCompactBar = scrolled || !isAllExpanded;

    return (
        <>
            {/* ===== COMPACT BAR — appears on scroll OR in compact mode ===== */}
            <div
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    showCompactBar
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-full opacity-0 pointer-events-none"
                }`}
            >
                <nav className="w-full px-4 sm:px-6 h-11 bg-[#1A0A00]/92 backdrop-blur-xl border-b border-[#F43600]/15 flex items-center justify-between">
                    {/* App icon + Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-[7px] overflow-hidden flex-shrink-0 shadow-[0_2px_10px_rgba(244,54,0,0.25)]">
                            <Image
                                src="/images/icon-512x512.png"
                                alt="Amalfi.Day"
                                width={28}
                                height={28}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <Logo className="h-[17px] w-auto flex-shrink-0 text-[#FDF6F0]/80" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Expand/Collapse */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleAllExpanded}
                            className={`${compactBtnClass} w-auto px-2.5 gap-1.5`}
                            title={isAllExpanded ? t("navbar.collapseAll") : t("navbar.expandAll")}
                            aria-label={isAllExpanded ? t("navbar.collapseAll") : t("navbar.expandAll")}
                        >
                            {isAllExpanded ? (
                                <ArrowsInSimple weight="bold" className="h-3.5 w-3.5" />
                            ) : (
                                <ArrowsOutSimple weight="bold" className="h-3.5 w-3.5" />
                            )}
                            <span className="text-xs font-medium">{isAllExpanded ? t("navbar.collapseAll") : t("navbar.expandAll")}</span>
                        </Button>

                        {/* Language */}
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`${compactBtnClass} w-auto px-2.5 gap-1.5`}
                                    aria-label={t("navbar.language")}
                                >
                                    <span className="text-base leading-none">{LANGUAGES[language].flag}</span>
                                    <span className="text-xs font-medium">{t("navbar.language")}</span>
                                    <CaretDown weight="bold" className="h-2.5 w-2.5 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <LanguageDropdownContent setLanguage={setLanguage} variant="dark" />
                        </DropdownMenu>

                        {/* Theme */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={compactBtnClass}
                            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                            aria-label={resolvedTheme === "dark" ? t("navbar.lightMode") : t("navbar.darkMode")}
                        >
                            {mounted && resolvedTheme === "dark" ? (
                                <Moon weight="fill" className="h-3.5 w-3.5" />
                            ) : (
                                <Sun weight="fill" className="h-3.5 w-3.5" />
                            )}
                        </Button>
                    </div>
                </nav>
            </div>

            {/* ===== OVERLAY BUTTONS — visible on hero only in expanded mode ===== */}
            <div
                className={`fixed top-0 right-0 z-50 p-4 flex items-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    showCompactBar
                        ? "opacity-0 pointer-events-none -translate-y-4"
                        : "opacity-100 translate-y-0"
                }`}
            >
                {/* Expand/Collapse */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleAllExpanded}
                    className={`${overlayBtnClass} w-auto px-3 gap-1.5`}
                    title={isAllExpanded ? t("navbar.collapseAll") : t("navbar.expandAll")}
                    aria-label={isAllExpanded ? t("navbar.collapseAll") : t("navbar.expandAll")}
                >
                    {isAllExpanded ? (
                        <ArrowsInSimple weight="bold" className="h-4 w-4" />
                    ) : (
                        <ArrowsOutSimple weight="bold" className="h-4 w-4" />
                    )}
                    <span className="text-xs font-medium">{isAllExpanded ? t("navbar.collapseAll") : t("navbar.expandAll")}</span>
                </Button>

                {/* Language */}
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`${overlayBtnClass} w-auto px-3 gap-1.5`}
                            aria-label={t("navbar.language")}
                        >
                            <span className="text-lg leading-none">{LANGUAGES[language].flag}</span>
                            <span className="text-sm font-medium">{t("navbar.language")}</span>
                            <CaretDown weight="bold" className="h-3 w-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <LanguageDropdownContent setLanguage={setLanguage} variant="light" />
                </DropdownMenu>

                {/* Theme */}
                <Button
                    variant="ghost"
                    size="icon"
                    className={overlayBtnClass}
                    onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    aria-label={resolvedTheme === "dark" ? t("navbar.lightMode") : t("navbar.darkMode")}
                >
                    {mounted && resolvedTheme === "dark" ? (
                        <Moon weight="fill" className="h-4 w-4" />
                    ) : (
                        <Sun weight="fill" className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </>
    );
}

// Extracted dropdown content to avoid duplication
function LanguageDropdownContent({
    setLanguage,
    variant,
}: {
    setLanguage: (lang: "en" | "it" | "es" | "fr" | "de" | "ru") => void;
    variant: "dark" | "light";
}) {
    const bgClass =
        variant === "dark"
            ? "bg-[#1A0A00]/95 backdrop-blur-xl border-[#F43600]/15"
            : "bg-white/80 backdrop-blur-2xl border-white/30";

    const itemClass =
        variant === "dark"
            ? "text-[#FDF6F0]/80 hover:bg-[#F43600]/15 hover:text-[#FF6B3D]"
            : "text-[#3D2415] hover:bg-[#F43600]/10 hover:text-[#E54800]";

    const langs = [
        { code: "en" as const, flag: "\u{1F1EC}\u{1F1E7}", name: "English" },
        { code: "it" as const, flag: "\u{1F1EE}\u{1F1F9}", name: "Italiano" },
        { code: "es" as const, flag: "\u{1F1EA}\u{1F1F8}", name: "Espa\u00f1ol" },
        { code: "fr" as const, flag: "\u{1F1EB}\u{1F1F7}", name: "Fran\u00e7ais" },
        { code: "de" as const, flag: "\u{1F1E9}\u{1F1EA}", name: "Deutsch" },
        { code: "ru" as const, flag: "\u{1F1F7}\u{1F1FA}", name: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439" },
    ];

    return (
        <DropdownMenuContent
            align="end"
            sideOffset={8}
            className={`rounded-2xl min-w-[160px] p-1.5 border shadow-[0_16px_48px_rgba(0,0,0,0.25)] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200 ${bgClass}`}
        >
            {langs.map((l) => (
                <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`gap-3 cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${itemClass}`}
                >
                    <span className="text-lg">{l.flag}</span>
                    <span>{l.name}</span>
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    );
}
