"use client";

import React, { useState, useRef, useEffect } from "react";
import { CheckCircle, CircleNotch, ArrowRight } from "@phosphor-icons/react";
import { useLanguage } from "@/components/language-context";

const SUBSCRIBE_URL = "https://amalfi.day/hooks/subscribe-amalfiday";

interface NewsletterFormProps {
    /** "dark" renders on the warm dark pre-footer; "light" (default) uses adaptive theme colors */
    variant?: "dark" | "light";
}

export function NewsletterForm({ variant = "light" }: NewsletterFormProps) {
    const { t } = useLanguage();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const loadedAt = useRef(0);
    useEffect(() => { loadedAt.current = Date.now(); }, []);
    const hpRef = useRef<HTMLInputElement>(null);

    const isDark = variant === "dark";

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
            <div className={`flex items-center gap-2.5 py-3 animate-in fade-in duration-500 ${
                isDark ? "text-green-400" : "text-green-600 dark:text-green-400"
            }`}>
                <CheckCircle size={20} weight="fill" />
                <span className="text-sm font-medium">{t("newsletter.success")}</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="w-full">
            <div className="flex gap-2 flex-col sm:flex-row">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("newsletter.placeholder")}
                    required
                    autoComplete="email"
                    aria-label="Email"
                    className={`flex-1 min-w-0 px-4 py-2.5 text-sm rounded-full transition-colors focus:outline-none ${
                        isDark
                            ? "bg-white/[0.07] border border-white/[0.1] text-[#FDF6F0] placeholder:text-[#FDF6F0]/30 focus:border-[#F43600]/40 focus:bg-white/[0.09]"
                            : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-orange-500 dark:focus:border-orange-400"
                    }`}
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
                    className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all disabled:opacity-60 shrink-0 flex items-center justify-center gap-2 group ${
                        isDark
                            ? "bg-[#F43600] hover:bg-[#FF4D1A] text-white shadow-[0_4px_24px_rgba(244,54,0,0.25)] hover:shadow-[0_6px_32px_rgba(244,54,0,0.35)]"
                            : "bg-orange-600 hover:bg-orange-700 text-white"
                    }`}
                >
                    {status === "loading" ? (
                        <CircleNotch size={16} className="animate-spin" />
                    ) : null}
                    {t("newsletter.subscribe")}
                    {status !== "loading" && (
                        <ArrowRight
                            size={14}
                            weight="bold"
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                    )}
                </button>
            </div>
            {status === "error" && errorMsg && (
                <p className={`mt-2.5 text-xs ${
                    isDark ? "text-red-400" : "text-red-500 dark:text-red-400"
                }`} role="alert">
                    {errorMsg}
                </p>
            )}
        </form>
    );
}
