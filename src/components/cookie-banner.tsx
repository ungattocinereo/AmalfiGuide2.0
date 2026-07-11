"use client";

import React, { useEffect, useCallback, useSyncExternalStore } from "react";
import { useLanguage } from "@/components/language-context";

const CONSENT_KEY = "cookie-consent";
export const OPEN_COOKIE_BANNER_EVENT = "amalfi-day:open-cookie-banner";

type ConsentValue = "accepted" | "declined";

function getStoredConsent(): ConsentValue | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(CONSENT_KEY) as ConsentValue | null;
}

function subscribe(callback: () => void) {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
}

/**
 * Simple cookie consent banner compliant with Italian/EU cookie law.
 * Integrates with Google Tag Manager Consent Mode v2.
 *
 * TODO: Replace with iubenda cookie banner for full Garante Italia compliance.
 * iubenda provides pre-approved templates and handles Cookie Policy generation.
 * See: https://www.iubenda.com/en/cookie-solution
 */
export function CookieBanner() {
    const { t } = useLanguage();
    const storedConsent = useSyncExternalStore(subscribe, getStoredConsent, () => null);
    const [forceVisible, setForceVisible] = React.useState(false);
    const visible = storedConsent === null || forceVisible;

    const updateConsent = useCallback((value: ConsentValue) => {
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
            window.gtag("consent", "update", {
                analytics_storage: value === "accepted" ? "granted" : "denied",
                ad_storage: "denied",
                ad_user_data: "denied",
                ad_personalization: "denied",
            });
        }
    }, []);

    // Apply stored consent on mount
    useEffect(() => {
        if (storedConsent) {
            updateConsent(storedConsent);
        }
    }, [storedConsent, updateConsent]);

    useEffect(() => {
        function openCookieBanner() {
            setForceVisible(true);
        }

        window.addEventListener(OPEN_COOKIE_BANNER_EVENT, openCookieBanner);
        return () => window.removeEventListener(OPEN_COOKIE_BANNER_EVENT, openCookieBanner);
    }, []);

    function handleAccept() {
        localStorage.setItem(CONSENT_KEY, "accepted");
        updateConsent("accepted");
        setForceVisible(false);
        // Force re-render via storage event
        window.dispatchEvent(new Event("storage"));
    }

    function handleDecline() {
        localStorage.setItem(CONSENT_KEY, "declined");
        updateConsent("declined");
        setForceVisible(false);
        window.dispatchEvent(new Event("storage"));
    }

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-label="Cookie consent"
            className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-in slide-in-from-bottom duration-300 sm:left-auto sm:w-[min(28rem,calc(100vw-2rem))] sm:p-5"
        >
            <div className="mx-auto flex max-w-2xl flex-col items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900 sm:p-5">
                <p className="text-sm text-gray-600 dark:text-gray-300 flex-1 leading-relaxed">
                    {t("cookie.message")}{" "}
                    <a
                        href="https://amalfi.day/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 dark:text-orange-400 underline underline-offset-2"
                    >
                        {t("cookie.privacyLink")}
                    </a>.
                </p>
                <div className="flex w-full justify-end gap-2">
                    <button
                        onClick={handleDecline}
                        className="px-3.5 py-1.5 text-sm rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        {t("cookie.decline")}
                    </button>
                    <button
                        onClick={handleAccept}
                        className="rounded-full bg-[#c93400] px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#a82b00]"
                    >
                        {t("cookie.accept")}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Extend Window type for gtag
declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}
