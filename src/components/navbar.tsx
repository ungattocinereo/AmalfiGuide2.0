"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Globe, ArrowsInSimple, ArrowsOutSimple, CaretDown } from "@phosphor-icons/react";
import { useLayout } from "@/components/layout-context";
import { useLanguage, LANGUAGES } from "@/components/language-context";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuArrow,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    const { setTheme, resolvedTheme } = useTheme();
    const { isAllExpanded, toggleAllExpanded } = useLayout();
    const { language, setLanguage, t } = useLanguage();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
            <nav className="w-full max-w-sm sm:max-w-xl md:max-w-2xl px-3 sm:px-4 py-2 bg-white/70 dark:bg-black/70 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/30 rounded-full flex items-center justify-between transition-all duration-200 ease-out">

                {/* Left: Logo */}
                <Logo className="h-[21px] w-auto flex-shrink-0 text-gray-900 dark:text-white transition-transform duration-200 hover:scale-105" />

                {/* Right: All action buttons with equal spacing */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Collapse/Expand Action */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleAllExpanded}
                        className="rounded-full h-8 w-8 sm:h-9 sm:w-9 bg-white/20 dark:bg-white/10 hover:bg-white/40 dark:hover:bg-white/20 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-200 ease-out text-gray-900 dark:text-white hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                        title={isAllExpanded ? t("navbar.collapseAll") : t("navbar.expandAll")}
                    >
                        <div className="transition-transform duration-200">
                            {isAllExpanded ? (
                                <ArrowsInSimple weight="bold" className="h-4 w-4" />
                            ) : (
                                <ArrowsOutSimple weight="bold" className="h-4 w-4" />
                            )}
                        </div>
                    </Button>

                    {/* Language Dropdown */}
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-full h-8 sm:h-9 px-3 sm:px-4 bg-white/20 dark:bg-white/10 hover:bg-white/40 dark:hover:bg-white/20 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] gap-2 text-gray-900 dark:text-white transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-0.5"
                            >
                                <span className="hidden sm:inline text-sm font-semibold">{LANGUAGES[language].nativeName}</span>
                                <span className="text-base sm:text-lg">{LANGUAGES[language].flag}</span>
                                <CaretDown weight="bold" className="h-3 w-3 opacity-60" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" sideOffset={12} className="rounded-2xl min-w-[180px] p-2 bg-white/70 dark:bg-black/70 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.2)] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                            <DropdownMenuArrow className="fill-white/70 dark:fill-black/70" />
                            <DropdownMenuItem onClick={() => setLanguage('en')} className="gap-3 cursor-pointer rounded-xl px-4 py-3 text-base font-medium hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-150"><span className="text-xl">🇬🇧</span><span>English</span></DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage('it')} className="gap-3 cursor-pointer rounded-xl px-4 py-3 text-base font-medium hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-150"><span className="text-xl">🇮🇹</span><span>Italiano</span></DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage('es')} className="gap-3 cursor-pointer rounded-xl px-4 py-3 text-base font-medium hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-150"><span className="text-xl">🇪🇸</span><span>Español</span></DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage('fr')} className="gap-3 cursor-pointer rounded-xl px-4 py-3 text-base font-medium hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-150"><span className="text-xl">🇫🇷</span><span>Français</span></DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage('de')} className="gap-3 cursor-pointer rounded-xl px-4 py-3 text-base font-medium hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-150"><span className="text-xl">🇩🇪</span><span>Deutsch</span></DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage('ru')} className="gap-3 cursor-pointer rounded-xl px-4 py-3 text-base font-medium hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-150"><span className="text-xl">🇷🇺</span><span>Русский</span></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8 sm:h-9 sm:w-9 bg-white/20 dark:bg-white/10 hover:bg-white/40 dark:hover:bg-white/20 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] text-gray-900 dark:text-white transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    >
                        <div className="relative w-4 h-4 sm:w-5 sm:h-5">
                            {mounted && resolvedTheme === "dark" ? (
                                <Moon weight="fill" className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200" />
                            ) : (
                                <Sun weight="fill" className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200" />
                            )}
                        </div>
                    </Button>
                </div>
            </nav>
        </div>
    );
}
