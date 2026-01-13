"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 100]);
    const opacity = useTransform(scrollY, [0, 250], [1, 0]);
    const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

    return (
        <div ref={containerRef} className="relative h-[100dvh] w-full overflow-hidden bg-orange-400">
            {/* Background Image with Parallax */}
            <motion.div
                style={{ y, scale }}
                className="absolute inset-0 z-0 h-[110%] w-full origin-center"
            >
                <Image
                    src="/images/hero.webp"
                    alt="Amalfi Coast"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
            </motion.div>

            {/* Hero Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                <motion.h1
                    style={{ opacity }}
                    className="font-serif font-black text-white leading-none tracking-tighter drop-shadow-lg"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Clamped font size roughly: min 4rem, preferred 15vw, max 12rem */}
                    <span className="block text-[clamp(4rem,15vw,10rem)]">AMALFI</span>
                    <span className="block text-[clamp(3.5rem,13vw,9rem)]">GUIDE</span>
                </motion.h1>
                <motion.p
                    style={{ opacity }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-4 text-white text-lg sm:text-2xl font-medium drop-shadow-md max-w-lg"
                >
                    The essential guide to the divine coast.
                </motion.p>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
                <span className="text-sm uppercase tracking-widest font-medium">Explore</span>
                <div className="w-[1px] h-10 bg-white/60 animate-scroll-bounce" />
            </motion.div>
        </div>
    );
}
