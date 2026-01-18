"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <section className="relative w-full min-h-[100dvh] overflow-hidden bg-[#E64900]">
            {/* Layer 1: Shadow - above background, only renders when main image is loaded */}
            {imageLoaded && (
                <div className="absolute inset-0 flex items-start justify-center pt-[15vh] sm:pt-[12vh] md:items-center md:pt-0 z-[1]">
                    <motion.div
                        className="absolute w-[200%] md:w-[140%] lg:w-[120%] aspect-[1456/816]"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/flag-shadow-orange-2.webp"
                            alt=""
                            className="w-full h-full object-contain"
                        />
                    </motion.div>
                </div>
            )}

            {/* Layer 2: Yellow sun gradient - less blur on mobile */}
            <motion.div
                className="absolute -top-[25vw] -left-[20vw] md:-top-[10vw] md:-left-[5vw] w-[75vw] h-[75vw] md:w-[50vw] md:h-[50vw] rounded-full pointer-events-none z-[2] blur-[40px] md:blur-[80px] transition-all duration-300 ease-out"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                style={{
                    background: "radial-gradient(circle, #E8E405 0%, rgba(232, 228, 5, 0.6) 30%, transparent 70%)",
                }}
            />

            {/* Layer 3: Flag color - on top */}
            <div className="absolute inset-0 flex items-start justify-center pt-[15vh] sm:pt-[12vh] md:items-center md:pt-0 z-[3]">
                <motion.div
                    className="absolute w-[200%] md:w-[140%] lg:w-[120%] aspect-[1456/816]"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <Image
                        src="/images/flag-color.webp"
                        alt="Amalfi Coast with Italian flag"
                        fill
                        className="object-contain"
                        priority
                        onLoad={() => setImageLoaded(true)}
                    />
                </motion.div>
            </div>

            {/* Logo - SVG - behind flag, lower on mobile */}
            <motion.div
                className="absolute top-[12%] md:top-[12%] left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-[6%] lg:right-[10%] z-[2]"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/images/guide-logo.svg"
                    alt="guide. AMALFI.DAY"
                    className="h-[8rem] md:h-[10rem] lg:h-[12rem] w-auto"
                />
            </motion.div>

            {/* Transport bar */}
            <motion.div
                className="absolute bottom-[30%] left-1/2 -translate-x-1/2 md:left-auto md:-translate-x-1/2 md:right-[5%] lg:right-[8%] md:bottom-[10%] z-20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
            >
                <div className="bg-white/20 backdrop-blur-xl rounded-full px-5 py-3 md:px-8 md:py-4 flex items-center gap-6 md:gap-8 shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-white/30 hover:-translate-y-1 transition-transform duration-200">
                    {/* Timetables label */}
                    <span className="text-white text-xs md:text-sm font-medium tracking-wide pr-2 border-r border-white/30">
                        Timetables:
                    </span>

                    {/* Bus */}
                    <a
                        href="https://cnr.pw/bus"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 text-white hover:text-white/80 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 6v6"/>
                            <path d="M15 6v6"/>
                            <path d="M2 12h19.6"/>
                            <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
                            <circle cx="7" cy="18" r="2"/>
                            <path d="M9 18h5"/>
                            <circle cx="16" cy="18" r="2"/>
                        </svg>
                        <span className="text-[8px] md:text-[9px] uppercase tracking-wider font-medium opacity-70">Bus</span>
                    </a>

                    {/* Ferry */}
                    <a
                        href="https://cnr.pw/ferry"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 text-white hover:text-white/80 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                            <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
                            <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/>
                            <path d="M12 10v4"/>
                            <path d="M12 2v3"/>
                        </svg>
                        <span className="text-[8px] md:text-[9px] uppercase tracking-wider font-medium opacity-70">Ferry</span>
                    </a>

                    {/* Airport */}
                    <a
                        href="https://cnr.pw/shuttle"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 text-white hover:text-white/80 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
                        </svg>
                        <span className="text-[8px] md:text-[9px] uppercase tracking-wider font-medium opacity-70">Airport</span>
                    </a>
                </div>
            </motion.div>

            {/* Description text */}
            <motion.div
                className="absolute bottom-[6%] md:bottom-[12%] left-4 right-4 md:left-[5%] md:right-auto md:max-w-[320px] lg:max-w-[380px] text-center md:text-left z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
            >
                <div className="bg-white/15 backdrop-blur-xl rounded-2xl px-4 py-3 md:px-5 md:py-4 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                    <p className="text-white text-sm md:text-base leading-relaxed">
                        This is your "Amalfi in a Pocket" Plan your perfect Amalfi Coast day with
                        ready-to-use ideas for walks, swims, moto rides, and food stops—complete
                        with clear directions, offline-friendly maps, and simplified transport
                        timings so moving around stays effortless.
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
