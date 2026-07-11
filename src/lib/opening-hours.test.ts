import { afterEach, describe, expect, it } from "vitest";
import { isOpenNow } from "./opening-hours";

const originalTimezone = process.env.TZ;

afterEach(() => {
  process.env.TZ = originalTimezone;
});

describe("isOpenNow", () => {
  it("evaluates local opening hours in Europe/Rome, not the visitor timezone", () => {
    process.env.TZ = "UTC";
    const mondayAtOnePmInAtrani = new Date("2026-07-06T11:00:00Z");

    expect(isOpenNow("Mon 12:00-14:00", mondayAtOnePmInAtrani)).toBe(true);
  });
});
