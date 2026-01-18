"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    DeviceMobile,
    Bus,
    Motorcycle,
    Umbrella,
    Train,
    EnvelopeSimple,
    InstagramLogo,
    FacebookLogo,
    ShieldCheck,
} from "@phosphor-icons/react";

export function Footer() {
    return (
        <>
            {/* Main Footer */}
            <footer className="py-12 md:py-16 px-6 md:px-8 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
                        {/* Left Column - Logo & Tagline */}
                        <div className="flex flex-col items-center md:items-start">
                            <img
                                src="/img/amalfi-day-logo-with-circle.svg"
                                alt="Amalfi.Day"
                                className="h-16 w-auto mb-4 dark:invert dark:opacity-90"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 tracking-wide text-center md:text-left">
                                Your friendly website in Amalfi Coast by Greg
                            </p>
                        </div>

                        {/* Middle Column - Quick Links */}
                        <div className="flex flex-col gap-1 md:gap-3 items-center md:items-start">
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                                Explore
                            </h4>
                            <a
                                href="https://www.pintourbus.com/napoli-amalfi-bus/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center md:justify-start gap-3 py-3 md:py-0 w-full text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-150"
                            >
                                <Bus size={22} className="md:size-[18px] text-gray-400 group-hover:text-orange-500 transition-colors" weight="duotone" />
                                <span className="text-base md:text-sm font-medium">Airport Shuttle</span>
                            </a>
                            <a
                                href="https://amalfi.day/amalfi-coast-on-the-moto/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center md:justify-start gap-3 py-3 md:py-0 w-full text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-150"
                            >
                                <Motorcycle size={22} className="md:size-[18px] text-gray-400 group-hover:text-orange-500 transition-colors" weight="duotone" />
                                <span className="text-base md:text-sm font-medium">Moto Bike Trails</span>
                            </a>
                            <a
                                href="https://amalfi.day/beaches-in-amalfi/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center md:justify-start gap-3 py-3 md:py-0 w-full text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-150"
                            >
                                <Umbrella size={22} className="md:size-[18px] text-gray-400 group-hover:text-orange-500 transition-colors" weight="duotone" />
                                <span className="text-base md:text-sm font-medium">Beach Review</span>
                            </a>
                            <a
                                href="https://amalfi.day/timetables/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center md:justify-start gap-3 py-3 md:py-0 w-full text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-150"
                            >
                                <Train size={22} className="md:size-[18px] text-gray-400 group-hover:text-orange-500 transition-colors" weight="duotone" />
                                <span className="text-base md:text-sm font-medium">Public Transport</span>
                            </a>
                        </div>

                        {/* Right Column - Connect */}
                        <div className="flex flex-col gap-1 md:gap-3 items-center md:items-start">
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                                Connect
                            </h4>
                            <a
                                href="mailto:hello@amalfi.day"
                                className="group flex items-center justify-center md:justify-start gap-3 py-3 md:py-0 w-full text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-150"
                            >
                                <EnvelopeSimple size={22} className="md:size-[18px] text-gray-400 group-hover:text-orange-500 transition-colors" weight="duotone" />
                                <span className="text-base md:text-sm font-medium">hello@amalfi.day</span>
                            </a>
                            <a
                                href="https://instagram.com/amalfi.day"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center md:justify-start gap-3 py-3 md:py-0 w-full text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-150"
                            >
                                <InstagramLogo size={22} className="md:size-[18px] text-gray-400 group-hover:text-orange-500 transition-colors" weight="duotone" />
                                <span className="text-base md:text-sm font-medium">Instagram</span>
                            </a>
                            <a
                                href="https://facebook.com/amalfi.day"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center md:justify-start gap-3 py-3 md:py-0 w-full text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-150"
                            >
                                <FacebookLogo size={22} className="md:size-[18px] text-gray-400 group-hover:text-orange-500 transition-colors" weight="duotone" />
                                <span className="text-base md:text-sm font-medium">Facebook</span>
                            </a>
                            <div className="flex items-center justify-center md:justify-start gap-3 py-3 md:py-0 w-full text-gray-500 dark:text-gray-400 mt-2">
                                <DeviceMobile size={22} className="md:size-[18px] text-gray-400" weight="duotone" />
                                <span className="text-base md:text-sm">Add to Homescreen</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </footer>

            {/* Bottom Footer - Copyright */}
            <footer className="py-6 px-6 md:px-8 bg-gray-200 dark:bg-gray-950 border-t border-gray-300 dark:border-gray-800">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4"
                >
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            © 2014-2026 Gregory Day // Amalfi.Day. All rights reserved.
                        </p>
                        <span className="hidden md:inline text-gray-400 dark:text-gray-600">·</span>
                        <p className="text-xs text-gray-400 dark:text-gray-600">
                            CristallPont S.R.L. / P.IVA: 06863730650
                        </p>
                    </div>
                    <a
                        href="#"
                        className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-150"
                    >
                        <ShieldCheck size={14} weight="duotone" />
                        <span>Privacy Policy</span>
                    </a>
                </motion.div>
            </footer>
        </>
    );
}
