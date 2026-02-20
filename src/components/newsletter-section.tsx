"use client";

import React from "react";
import { motion } from "framer-motion";
import { NewsletterForm } from "@/components/newsletter-form";
import { useLanguage } from "@/components/language-context";

const ease = [0.16, 1, 0.3, 1] as const;

export function NewsletterSection() {
    const { t } = useLanguage();

    return (
        <section className="relative overflow-hidden bg-[#FDF6F0] dark:bg-[#1A0A00] transition-colors duration-500">
            {/* Warm radial gradients */}
            <div
                className="absolute inset-0 z-0 pointer-events-none dark:opacity-100 opacity-60"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 60% at 0% 100%, rgba(244,54,0,0.08) 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 100% 0%, rgba(244,54,0,0.05) 0%, transparent 55%)",
                }}
            />

            {/* Fine grain texture */}
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-[0.025] dark:opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: "180px",
                }}
            />

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F43600]/15 dark:via-[#F43600]/20 to-transparent" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, ease }}
                className="relative z-[1] max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16 md:py-20"
            >
                <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16 lg:gap-24">
                    {/* Left — editorial copy */}
                    <div className="flex-1 min-w-0 md:max-w-[420px]">
                        <motion.div
                            className="flex items-center gap-3 mb-4"
                            initial={{ opacity: 0, x: -16 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease, delay: 0.15 }}
                        >
                            <span className="w-6 h-0.5 bg-[#F43600] rounded-sm block" />
                            <span className="font-sans text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-[#F43600]">
                                Newsletter
                            </span>
                        </motion.div>

                        <motion.h2
                            style={{ fontFamily: "var(--font-merriweather)" }}
                            className="text-[#1A0A00] dark:text-[#FDF6F0] text-xl sm:text-2xl md:text-[1.7rem] font-bold leading-snug tracking-tight transition-colors duration-500"
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease, delay: 0.25 }}
                        >
                            {t("newsletter.cta")}
                        </motion.h2>
                    </div>

                    {/* Right — form */}
                    <motion.div
                        className="flex-1 min-w-0 md:max-w-[460px]"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease, delay: 0.35 }}
                    >
                        <NewsletterForm />
                    </motion.div>
                </div>
            </motion.div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F43600]/10 to-transparent" />
        </section>
    );
}
