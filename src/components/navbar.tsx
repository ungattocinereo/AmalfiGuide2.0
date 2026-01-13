"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Globe, ArrowsInSimple, ArrowsOutSimple, CaretDown } from "@phosphor-icons/react";
import { useLayout } from "@/components/layout-context";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    const { setTheme, theme } = useTheme();
    const { isAllExpanded, toggleAllExpanded } = useLayout();
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
                        className="rounded-full h-8 w-8 sm:h-9 sm:w-9 bg-white/30 dark:bg-white/10 hover:bg-white/50 dark:hover:bg-white/20 backdrop-blur-sm border border-white/20 shadow-sm transition-all duration-200 ease-out text-gray-900 dark:text-white hover:scale-105 active:scale-95"
                        title={isAllExpanded ? "Collapse All" : "Expand All"}
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-full h-8 sm:h-9 px-2 sm:px-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 gap-1 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50 transition-all duration-150 ease-out"
                            >
                                <span className="hidden sm:inline text-sm font-semibold">English</span>
                                <span className="text-sm sm:text-base">🇬🇧</span>
                                <CaretDown weight="bold" className="h-3 w-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl min-w-[140px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150">
                            <DropdownMenuItem className="gap-2 cursor-pointer transition-colors duration-100"><span>English</span> 🇬🇧</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer transition-colors duration-100"><span>Italiano</span> 🇮🇹</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer transition-colors duration-100"><span>Español</span> 🇪🇸</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer transition-colors duration-100"><span>Français</span> 🇫🇷</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer transition-colors duration-100"><span>Deutsch</span> 🇩🇪</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8 sm:h-9 sm:w-9 text-gray-700 dark:text-gray-200 transition-all duration-150 ease-out hover:scale-105 active:scale-95"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        <div className="relative w-4 h-4 sm:w-5 sm:h-5">
                            {mounted && theme === "dark" ? (
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
