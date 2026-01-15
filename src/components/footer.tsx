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
            {/* First Footer - Dark Grey with Links */}
            <footer className="py-12 md:py-16 px-6 md:px-8 bg-gray-800 dark:bg-gray-900 text-gray-200">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Add to Homescreen */}
                        <div className="flex items-start gap-3 group">
                            <DeviceMobile
                                size={24}
                                weight="duotone"
                                className="text-orange-500 flex-shrink-0 mt-0.5"
                            />
                            <div>
                                <h3 className="font-semibold text-white mb-1">Add to Homescreen</h3>
                                <p className="text-sm text-gray-400">
                                    Install this guide for quick access
                                </p>
                            </div>
                        </div>

                        {/* Airport Shuttle */}
                        <a
                            href="https://www.pintourbus.com/napoli-amalfi-bus/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 group hover:bg-gray-700 dark:hover:bg-gray-800 p-3 -m-3 rounded-lg transition-colors duration-150"
                        >
                            <Bus
                                size={24}
                                weight="duotone"
                                className="text-orange-500 flex-shrink-0 mt-0.5"
                            />
                            <div>
                                <h3 className="font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors">
                                    Airport Shuttle
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Direct bus from Naples to Amalfi
                                </p>
                            </div>
                        </a>

                        {/* Moto Bike Trails */}
                        <a
                            href="https://amalfi.day/amalfi-coast-on-the-moto/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 group hover:bg-gray-700 dark:hover:bg-gray-800 p-3 -m-3 rounded-lg transition-colors duration-150"
                        >
                            <Motorcycle
                                size={24}
                                weight="duotone"
                                className="text-orange-500 flex-shrink-0 mt-0.5"
                            />
                            <div>
                                <h3 className="font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors">
                                    Moto Bike Trails
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Gregory's favorite scooter routes
                                </p>
                            </div>
                        </a>

                        {/* Beach Review */}
                        <a
                            href="https://amalfi.day/beaches-in-amalfi/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 group hover:bg-gray-700 dark:hover:bg-gray-800 p-3 -m-3 rounded-lg transition-colors duration-150"
                        >
                            <Umbrella
                                size={24}
                                weight="duotone"
                                className="text-orange-500 flex-shrink-0 mt-0.5"
                            />
                            <div>
                                <h3 className="font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors">
                                    Beach Review
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Complete guide to Amalfi beaches
                                </p>
                            </div>
                        </a>

                        {/* All Public Transport */}
                        <a
                            href="https://amalfi.day/timetables/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 group hover:bg-gray-700 dark:hover:bg-gray-800 p-3 -m-3 rounded-lg transition-colors duration-150"
                        >
                            <Train
                                size={24}
                                weight="duotone"
                                className="text-orange-500 flex-shrink-0 mt-0.5"
                            />
                            <div>
                                <h3 className="font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors">
                                    All Public Transport
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Curated timetables for buses & ferries
                                </p>
                            </div>
                        </a>
                    </div>
                </motion.div>
            </footer>

            {/* Second Footer - Copyright & Social */}
            <footer className="py-8 px-6 md:px-8 bg-gray-950 text-gray-400">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Copyright */}
                    <p className="text-center mb-6 text-gray-500 text-sm md:text-base">
                        © 2014-2026 Gregory Day // Amalfi.Day web project. All Rights reserved.
                    </p>

                    {/* Links */}
                    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm">
                        <a
                            href="#"
                            className="flex items-center gap-2 hover:text-white transition-colors duration-150"
                        >
                            <ShieldCheck size={18} weight="duotone" />
                            <span>Privacy</span>
                        </a>

                        <a
                            href="mailto:hello@amalfi.day"
                            className="flex items-center gap-2 hover:text-white transition-colors duration-150"
                        >
                            <EnvelopeSimple size={18} weight="duotone" />
                            <span>Send us a message</span>
                        </a>

                        <a
                            href="https://instagram.com/amalfi.day"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-white transition-colors duration-150"
                        >
                            <InstagramLogo size={18} weight="duotone" />
                            <span>Instagram</span>
                        </a>

                        <a
                            href="https://facebook.com/amalfi.day"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-white transition-colors duration-150"
                        >
                            <FacebookLogo size={18} weight="duotone" />
                            <span>Facebook</span>
                        </a>
                    </div>
                </motion.div>
            </footer>
        </>
    );
}
