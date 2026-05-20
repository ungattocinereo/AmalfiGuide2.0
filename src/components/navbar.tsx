"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronDown,
    faDownLeftAndUpRightToCenter,
    faMoon,
    faSun,
    faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "next-themes";
import { useLayout } from "@/components/layout-context";
import { useLanguage, LANGUAGES } from "@/components/language-context";
import Image from "next/image";
import { Logo } from "@/components/logo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pillBase =
    "pointer-events-auto h-11 md:h-12 rounded-full " +
    "bg-white/75 dark:bg-[#1A0A00]/70 backdrop-blur-xl " +
    "border border-white/60 dark:border-white/10 " +
    "shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] " +
    "flex items-center text-gray-900 dark:text-[#FDF6F0]/85 " +
    "active:scale-95 transition-[transform,background,border-color] duration-150 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F43600]/50 " +
    "hover:bg-white/85 dark:hover:bg-[#1A0A00]/80";

export function Navbar() {
    const { isAllExpanded, toggleAllExpanded } = useLayout();
    const { language, setLanguage, t } = useLanguage();
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => { setMounted(true); }, []);
    const isDark = mounted && resolvedTheme === "dark";

    const expandLabel = isAllExpanded ? t("navbar.collapseAll") : t("navbar.expandAll");
    const themeLabel = isDark ? t("navbar.lightMode") : t("navbar.darkMode");
    const textPill = `${pillBase} gap-2 px-3 md:px-4`;
    const iconPill = `${pillBase} w-11 md:w-12 justify-center`;

    return (
        <div
            className="fixed inset-x-0 top-0 z-50 pointer-events-none
                       pt-[max(0.75rem,env(safe-area-inset-top))]
                       px-3 md:px-6
                       flex items-center justify-between gap-2"
        >
            {/* Logo pill */}
            <div className={`${pillBase} pl-1.5 pr-3 md:pr-4 gap-2`}>
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 shadow-[0_2px_8px_rgba(244,54,0,0.2)]">
                    <Image
                        src="/images/icon-512x512.png"
                        alt="Amalfi.Day"
                        width={32}
                        height={32}
                        priority
                        className="w-full h-full object-cover"
                    />
                </div>
                <Logo className="h-[15px] md:h-[17px] w-auto flex-shrink-0 hidden min-[380px]:block text-gray-900 dark:text-[#FDF6F0]/85" />
            </div>

            {/* Actions cluster */}
            <div className="flex items-center gap-2 pointer-events-auto">
                {/* Language pill */}
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <button type="button" className={textPill} aria-label={t("navbar.language")}>
                            <span className="text-lg leading-none">{LANGUAGES[language].flag}</span>
                            <span className="hidden md:inline text-sm font-medium uppercase tracking-wide">
                                {language}
                            </span>
                            <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3 opacity-50" />
                        </button>
                    </DropdownMenuTrigger>
                    <LanguageDropdownContent setLanguage={setLanguage} />
                </DropdownMenu>

                {/* Expand / collapse pill */}
                <button
                    type="button"
                    onClick={toggleAllExpanded}
                    className={textPill}
                    aria-label={expandLabel}
                    title={expandLabel}
                >
                    {isAllExpanded ? (
                        <FontAwesomeIcon icon={faDownLeftAndUpRightToCenter} className="h-4 w-4" />
                    ) : (
                        <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} className="h-4 w-4" />
                    )}
                    <span className="hidden md:inline text-sm font-medium whitespace-nowrap">{expandLabel}</span>
                </button>

                {/* Theme toggle pill */}
                <button
                    type="button"
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    className={iconPill}
                    aria-label={themeLabel}
                    title={themeLabel}
                >
                    {isDark ? (
                        <FontAwesomeIcon icon={faSun} className="h-4 w-4" />
                    ) : (
                        <FontAwesomeIcon icon={faMoon} className="h-4 w-4" />
                    )}
                </button>
            </div>
        </div>
    );
}

function LanguageDropdownContent({
    setLanguage,
}: {
    setLanguage: (lang: "en" | "it" | "es" | "fr" | "de" | "ru") => void;
}) {
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
            className="rounded-2xl min-w-[180px] p-1.5 border shadow-[0_16px_48px_rgba(0,0,0,0.18)]
                       bg-white/95 dark:bg-[#1A0A00]/95 backdrop-blur-2xl
                       border-white/60 dark:border-white/10
                       animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
        >
            {langs.map((l) => (
                <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className="gap-3 cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150
                               text-gray-800 dark:text-[#FDF6F0]/85
                               hover:bg-[#F43600]/10 hover:text-[#E54800]
                               dark:hover:bg-[#F43600]/15 dark:hover:text-[#FF6B3D]
                               focus:bg-[#F43600]/10 focus:text-[#E54800]
                               dark:focus:bg-[#F43600]/15 dark:focus:text-[#FF6B3D]"
                >
                    <span className="text-lg">{l.flag}</span>
                    <span>{l.name}</span>
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    );
}
