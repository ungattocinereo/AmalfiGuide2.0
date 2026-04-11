export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type TimeInterval = { open: string; close: string };

export type WeeklyHours = Record<DayKey, TimeInterval[] | "closed">;

const DAYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const ABBREV_TO_KEY: Record<string, DayKey> = {
    mon: "mon", mo: "mon", monday: "mon",
    tue: "tue", tu: "tue", tues: "tue", tuesday: "tue",
    wed: "wed", we: "wed", weds: "wed", wednesday: "wed",
    thu: "thu", th: "thu", thur: "thu", thurs: "thu", thursday: "thu",
    fri: "fri", fr: "fri", friday: "fri",
    sat: "sat", sa: "sat", saturday: "sat",
    sun: "sun", su: "sun", sunday: "sun",
};

const emptyWeek = (): WeeklyHours => ({
    mon: "closed", tue: "closed", wed: "closed", thu: "closed",
    fri: "closed", sat: "closed", sun: "closed",
});

const parseDayToken = (token: string): DayKey | null => {
    const key = ABBREV_TO_KEY[token.toLowerCase()];
    return key ?? null;
};

const parseDayRange = (raw: string): DayKey[] => {
    const normalized = raw.trim().toLowerCase();
    if (normalized === "daily" || normalized === "every day") return [...DAYS];
    const parts = normalized.split(/[–-]/).map((s) => s.trim());
    if (parts.length === 2) {
        const start = parseDayToken(parts[0]);
        const end = parseDayToken(parts[1]);
        if (start && end) {
            const startIdx = DAYS.indexOf(start);
            const endIdx = DAYS.indexOf(end);
            if (startIdx <= endIdx) return DAYS.slice(startIdx, endIdx + 1);
            return [...DAYS.slice(startIdx), ...DAYS.slice(0, endIdx + 1)];
        }
    }
    const single = parseDayToken(normalized);
    return single ? [single] : [];
};

const parseInterval = (raw: string): TimeInterval | null => {
    const match = raw.trim().match(/(\d{1,2})[:.](\d{2})\s*[–-]\s*(\d{1,2})[:.](\d{2})/);
    if (!match) return null;
    const open = `${match[1].padStart(2, "0")}:${match[2]}`;
    const close = `${match[3].padStart(2, "0")}:${match[4]}`;
    return { open, close };
};

/**
 * Parse a human-written opening-hours string into a structured weekly schedule.
 *
 * Supported shapes:
 *   "Daily 08:00-23:00"
 *   "Mon-Sun 08:00-23:00"
 *   "Mon-Fri 09:00-18:00, Sat 10:00-16:00"
 *   "Mon-Sat 08:00-13:00, 16:00-20:00"  (same day range with two intervals on second clause)
 *   "Closed Mon"
 *
 * Unparseable clauses are silently ignored — we prefer "unknown" over crashing.
 */
export function parseOpeningHours(input: string): WeeklyHours {
    const week = emptyWeek();
    if (!input) return week;

    let carryDays: DayKey[] = [];

    for (const rawClause of input.split(",")) {
        const clause = rawClause.trim();
        if (!clause) continue;

        if (/^closed\b/i.test(clause)) {
            const rest = clause.replace(/^closed\s*/i, "").trim();
            const targets = rest ? parseDayRange(rest) : [...DAYS];
            for (const d of targets) week[d] = "closed";
            continue;
        }

        const intervalOnlyMatch = clause.match(/^(\d{1,2}[:.]\d{2}\s*[–-]\s*\d{1,2}[:.]\d{2})$/);
        if (intervalOnlyMatch && carryDays.length > 0) {
            const interval = parseInterval(clause);
            if (interval) {
                for (const d of carryDays) {
                    const existing = week[d];
                    if (existing === "closed") week[d] = [interval];
                    else existing.push(interval);
                }
            }
            continue;
        }

        const splitMatch = clause.match(/^(.+?)\s+(\d{1,2}[:.]\d{2}\s*[–-]\s*\d{1,2}[:.]\d{2})\s*$/);
        if (!splitMatch) continue;
        const daysPart = splitMatch[1];
        const intervalPart = splitMatch[2];
        const days = parseDayRange(daysPart);
        const interval = parseInterval(intervalPart);
        if (days.length === 0 || !interval) continue;
        for (const d of days) {
            const existing = week[d];
            if (existing === "closed") week[d] = [interval];
            else existing.push(interval);
        }
        carryDays = days;
    }

    return week;
}

/**
 * Is the place open at a given moment? Handles intervals that cross midnight
 * (e.g. 19:00–01:00) by also checking the previous day's late intervals.
 */
export function isOpenAt(week: WeeklyHours, when: Date = new Date()): boolean {
    const jsDay = when.getDay(); // 0 = Sun
    const todayKey = DAYS[(jsDay + 6) % 7]; // shift so Mon = 0
    const prevKey = DAYS[(jsDay + 5) % 7];
    const minutesNow = when.getHours() * 60 + when.getMinutes();

    const todayIntervals = week[todayKey];
    if (todayIntervals !== "closed") {
        for (const iv of todayIntervals) {
            const openMin = toMinutes(iv.open);
            let closeMin = toMinutes(iv.close);
            if (closeMin <= openMin) closeMin = 24 * 60; // treat as end-of-day
            if (minutesNow >= openMin && minutesNow < closeMin) return true;
        }
    }

    // Handle carry-over from previous day (e.g. 21:00–02:00 yesterday → open at 01:30 today)
    const prevIntervals = week[prevKey];
    if (prevIntervals !== "closed") {
        for (const iv of prevIntervals) {
            const openMin = toMinutes(iv.open);
            const closeMin = toMinutes(iv.close);
            if (closeMin <= openMin) {
                // Crosses midnight
                if (minutesNow < closeMin) return true;
            }
        }
    }

    return false;
}

const toMinutes = (hhmm: string): number => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
};

/** Convenience: parse + check in one call. Returns null if hours string is empty. */
export function isOpenNow(hours: string | undefined, when: Date = new Date()): boolean | null {
    if (!hours) return null;
    return isOpenAt(parseOpeningHours(hours), when);
}
