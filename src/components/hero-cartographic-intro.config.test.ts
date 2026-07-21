import { describe, expect, it } from "vitest";
import {
  HERO_INTRO_DURATION_SECONDS,
  HERO_INTRO_TIMINGS,
} from "./hero-cartographic-intro.config";

describe("Hero cartographic intro timing", () => {
  it("uses finite phases that finish within the intro duration", () => {
    for (const timing of Object.values(HERO_INTRO_TIMINGS)) {
      expect(Number.isFinite(timing.delay)).toBe(true);
      expect(Number.isFinite(timing.duration)).toBe(true);
      expect(timing.delay).toBeGreaterThanOrEqual(0);
      expect(timing.duration).toBeGreaterThan(0);
      expect(timing.delay + timing.duration).toBeLessThanOrEqual(
        HERO_INTRO_DURATION_SECONDS,
      );
      expect(timing.repeat).toBe(0);
    }
  });
});
