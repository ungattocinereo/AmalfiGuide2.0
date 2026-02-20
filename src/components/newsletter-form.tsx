"use client";

import React, { useState, useRef, useEffect } from "react";
import { Envelope, CheckCircle, CircleNotch } from "@phosphor-icons/react";
import { useLanguage } from "@/components/language-context";

const SUBSCRIBE_URL = "https://amalfi.day/hooks/subscribe-amalfiday";

export function NewsletterForm() {
    const { t } = useLanguage();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const loadedAt = useRef(0);
    useEffect(() => { loadedAt.current = Date.now(); }, []);
    const hpRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === "loading" || status === "success") return;

        setStatus("loading");
        setErrorMsg("");

        try {
            const res = await fetch(SUBSCRIBE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    hp: hpRef.current?.value || "",
                    t: loadedAt.current,
                }),
            });

            const data = await res.json();

            if (data.ok) {
                setStatus("success");
                setEmail("");
            } else {
                setStatus("error");
                setErrorMsg(data.error || t("newsletter.error"));
            }
        } catch {
            setStatus("error");
            setErrorMsg(t("newsletter.error"));
        }
    };

    if (status === "success") {
        return (
            <div className="flex items-center justify-center gap-2 py-3 text-green-600 dark:text-green-400 animate-in fade-in duration-500">
                <CheckCircle size={22} weight="fill" />
                <span className="text-sm font-medium">{t("newsletter.success")}</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="w-full">
            <div className="flex items-center gap-2 mb-3 text-gray-500 dark:text-gray-400">
                <Envelope size={16} weight="regular" className="shrink-0" />
                <span className="text-xs leading-snug">{t("newsletter.cta")}</span>
            </div>
            <div className="flex gap-2 flex-col sm:flex-row">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("newsletter.placeholder")}
                    required
                    autoComplete="email"
                    aria-label="Email"
                    className="flex-1 min-w-0 px-3.5 py-2 text-sm rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
                />
                {/* Honeypot */}
                <input
                    type="text"
                    name="website"
                    ref={hpRef}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] invisible"
                />
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-4 py-2 text-sm font-medium rounded-full bg-orange-600 hover:bg-orange-700 text-white transition-colors disabled:opacity-60 shrink-0 flex items-center justify-center gap-1.5"
                >
                    {status === "loading" ? (
                        <CircleNotch size={16} className="animate-spin" />
                    ) : null}
                    {t("newsletter.subscribe")}
                </button>
            </div>
            {status === "error" && errorMsg && (
                <p className="mt-2 text-xs text-red-500 dark:text-red-400" role="alert">
                    {errorMsg}
                </p>
            )}
        </form>
    );
}
