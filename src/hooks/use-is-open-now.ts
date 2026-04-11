"use client";

import { useCallback, useSyncExternalStore } from "react";
import { isOpenNow } from "@/lib/opening-hours";

const getServerSnapshot = (): boolean | null => null;

/**
 * Returns whether a place is currently open based on its hours string.
 * Uses useSyncExternalStore so SSR renders `null` and the client rehydrates
 * with the real value without any hydration mismatch, then refreshes every
 * minute so the badge stays accurate.
 */
export function useIsOpenNow(hours: string | undefined): boolean | null {
    const subscribe = useCallback(
        (onChange: () => void) => {
            if (!hours) return () => {};
            const interval = setInterval(onChange, 60_000);
            return () => clearInterval(interval);
        },
        [hours],
    );

    const getSnapshot = useCallback(
        (): boolean | null => (hours ? isOpenNow(hours) : null),
        [hours],
    );

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
