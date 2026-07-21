export const HERO_INTRO_DURATION_SECONDS = 1.8;

export const HERO_INTRO_TIMINGS = {
  atmosphere: { delay: 0, duration: 0.45, repeat: 0 },
  contours: { delay: 0.15, duration: 1, repeat: 0 },
  route: { delay: 0.45, duration: 0.95, repeat: 0 },
  signals: { delay: 0.55, duration: 0.95, repeat: 0 },
  settle: { delay: 1.35, duration: 0.45, repeat: 0 },
} as const;

export type HeroIntroPhase = keyof typeof HERO_INTRO_TIMINGS;
export type HeroIntroTiming = (typeof HERO_INTRO_TIMINGS)[HeroIntroPhase];
