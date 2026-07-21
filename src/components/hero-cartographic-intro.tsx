"use client";

import { motion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { HERO_INTRO_TIMINGS } from "@/components/hero-cartographic-intro.config";

type HeroCartographicIntroProps = {
    isDark: boolean;
};

const contours = [
    { d: "M 118 470 A 254 254 0 1 1 606 410", desktopOnly: false },
    { d: "M 94 430 A 292 292 0 0 1 646 216", desktopOnly: false },
    { d: "M 164 514 A 220 220 0 0 0 532 130", desktopOnly: true },
] as const;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onStoreChange: () => void) {
    const mediaQuery = window.matchMedia(reducedMotionQuery);
    mediaQuery.addEventListener("change", onStoreChange);

    return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
    return window.matchMedia(reducedMotionQuery).matches;
}

function getReducedMotionServerSnapshot() {
    return false;
}

const transition = (phase: keyof typeof HERO_INTRO_TIMINGS, delayOffset = 0) => ({
    ...HERO_INTRO_TIMINGS[phase],
    delay: HERO_INTRO_TIMINGS[phase].delay + delayOffset,
    ease: [0.16, 1, 0.3, 1] as const,
});

export function HeroCartographicIntro({ isDark }: HeroCartographicIntroProps) {
    const isReduced = useSyncExternalStore(
        subscribeToReducedMotion,
        getReducedMotionSnapshot,
        getReducedMotionServerSnapshot,
    );
    const line = isDark ? "#FF7A4D" : "#A94827";
    const secondaryLine = isDark ? "#F7D7C7" : "#6A3A27";
    const settledOpacity = isDark ? 0.22 : 0.13;
    const phaseTransition = (
        phase: keyof typeof HERO_INTRO_TIMINGS,
        delayOffset = 0,
    ) => (isReduced ? { duration: 0 } : transition(phase, delayOffset));

    return (
        <div
            data-testid="hero-cartographic-intro"
            data-motion={isReduced ? "reduced" : "full"}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        >
            <motion.div
                data-detail="glow"
                className="absolute bottom-[4%] left-[20%] h-[48%] w-[62%] rounded-full blur-2xl"
                style={{
                    background: isDark
                        ? "radial-gradient(circle, rgba(244,54,0,0.17), transparent 68%)"
                        : "radial-gradient(circle, rgba(244,96,45,0.12), transparent 68%)",
                }}
                initial={isReduced ? false : { opacity: 0, scale: 0.72 }}
                animate={
                    isReduced
                        ? { opacity: 0, scale: 1 }
                        : { opacity: [0, 0.62, 0.12], scale: [0.72, 1.06, 1] }
                }
                transition={phaseTransition("atmosphere")}
            />

            <svg
                viewBox="0 0 720 760"
                preserveAspectRatio="xMidYMid meet"
                focusable="false"
                className="absolute inset-0 h-full w-full"
            >
                <g fill="none" strokeLinecap="round">
                    {contours.map((contour, index) => (
                        <motion.path
                            key={contour.d}
                            data-detail="contour"
                            d={contour.d}
                            className={contour.desktopOnly ? "hidden md:block" : undefined}
                            stroke={index === 1 ? secondaryLine : line}
                            strokeWidth={index === 0 ? 1.15 : 0.8}
                            strokeDasharray={index === 0 ? "10 8" : "5 12"}
                            initial={isReduced ? false : { opacity: 0, pathLength: 0 }}
                            animate={{ opacity: settledOpacity, pathLength: 1 }}
                            transition={phaseTransition("contours", index * 0.08)}
                        />
                    ))}

                    <motion.path
                        data-detail="route"
                        d="M 70 544 C 176 456 280 530 358 422 C 440 310 532 366 660 242"
                        className="hidden md:block"
                        stroke={line}
                        strokeWidth="1.1"
                        strokeDasharray="3 11"
                        initial={isReduced ? false : { opacity: 0, pathLength: 0 }}
                        animate={{ opacity: isDark ? 0.34 : 0.21, pathLength: 1 }}
                        transition={phaseTransition("route")}
                    />
                    <motion.path
                        data-detail="route"
                        d="M 82 526 C 178 460 250 512 332 426"
                        className="md:hidden"
                        stroke={line}
                        strokeWidth="1.1"
                        strokeDasharray="3 11"
                        initial={isReduced ? false : { opacity: 0, pathLength: 0 }}
                        animate={{ opacity: isDark ? 0.34 : 0.21, pathLength: 1 }}
                        transition={phaseTransition("route")}
                    />

                    <motion.g
                        data-detail="crosshair"
                        stroke={secondaryLine}
                        initial={isReduced ? false : { opacity: 0, scale: 0.8 }}
                        animate={{ opacity: isDark ? 0.28 : 0.17, scale: 1 }}
                        transition={phaseTransition("route", 0.12)}
                        style={{ transformOrigin: "142px 360px" }}
                    >
                        <circle cx="142" cy="360" r="11" />
                        <path d="M 122 360 H 162 M 142 340 V 380" />
                    </motion.g>
                    <motion.g
                        data-detail="crosshair"
                        className="hidden md:block"
                        stroke={secondaryLine}
                        initial={isReduced ? false : { opacity: 0, scale: 0.8 }}
                        animate={{ opacity: isDark ? 0.24 : 0.14, scale: 1 }}
                        transition={phaseTransition("route", 0.22)}
                        style={{ transformOrigin: "604px 322px" }}
                    >
                        <circle cx="604" cy="322" r="8" />
                        <path d="M 590 322 H 618 M 604 308 V 336" />
                    </motion.g>

                    <motion.g
                        data-detail="coordinates"
                        className="hidden md:block"
                        stroke={secondaryLine}
                        initial={isReduced ? false : { opacity: 0 }}
                        animate={{ opacity: isDark ? 0.21 : 0.12 }}
                        transition={phaseTransition("route", 0.3)}
                    >
                        <path d="M 566 174 v 14 M 576 178 v 10 M 586 174 v 14" />
                        <path d="M 118 486 h 14 M 122 496 h 10 M 118 506 h 14" />
                    </motion.g>

                    <motion.path
                        data-detail="trail"
                        d="M 176 448 C 216 414 252 408 286 420"
                        stroke={line}
                        strokeWidth="2"
                        initial={isReduced ? false : { opacity: 0, pathLength: 0 }}
                        animate={
                            isReduced
                                ? { opacity: 0, pathLength: 1 }
                                : { opacity: [0, 0.36, 0], pathLength: 1 }
                        }
                        transition={phaseTransition("signals", 0.08)}
                    />
                </g>

                <motion.g
                    data-detail="signal"
                    initial={isReduced ? false : { opacity: 0, x: -18, y: 12, scale: 0.55 }}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    transition={phaseTransition("signals")}
                    style={{ transformOrigin: "176px 448px" }}
                >
                    <circle cx="176" cy="448" r="12" fill="#F43600" opacity="0.12" />
                    <circle cx="176" cy="448" r="4.5" fill="#F43600" />
                </motion.g>
                <motion.g
                    data-detail="signal"
                    initial={isReduced ? false : { opacity: 0, x: 16, y: -10, scale: 0.55 }}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    transition={phaseTransition("signals", 0.18)}
                    style={{ transformOrigin: "566px 286px" }}
                >
                    <circle cx="566" cy="286" r="10" fill="#F43600" opacity="0.1" />
                    <circle cx="566" cy="286" r="3.5" fill="#F43600" />
                </motion.g>
                <motion.g
                    data-detail="signal"
                    className="hidden md:block"
                    initial={isReduced ? false : { opacity: 0, x: -12, y: -14, scale: 0.55 }}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    transition={phaseTransition("signals", 0.3)}
                    style={{ transformOrigin: "112px 300px" }}
                >
                    <circle cx="112" cy="300" r="8" fill="#F43600" opacity="0.1" />
                    <circle cx="112" cy="300" r="3" fill="#F43600" />
                </motion.g>
            </svg>

            <motion.div
                data-detail="highlight"
                className="absolute -bottom-[12%] -left-[36%] h-[118%] w-[22%] rotate-[18deg] blur-2xl"
                style={{
                    background:
                        "linear-gradient(90deg, transparent, rgba(255,165,120,0.24), transparent)",
                }}
                initial={isReduced ? false : { opacity: 0, x: "0%" }}
                animate={
                    isReduced
                        ? { opacity: 0, x: "720%" }
                        : { opacity: [0, 0.42, 0], x: ["0%", "360%", "720%"] }
                }
                transition={phaseTransition("settle")}
            />
        </div>
    );
}
