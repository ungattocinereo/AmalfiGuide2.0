"use client";

import React, { useState, useRef, useEffect } from "react";
import { CheckCircle, CircleNotch, ArrowRight } from "@phosphor-icons/react";
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
            <div className="flex items-center gap-2.5 py-3 animate-in fade-in duration-500 text-green-700 dark:text-green-400">
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
                    className="flex-1 min-w-0 px-4 py-2.5 text-sm rounded-full transition-colors focus:outline-none bg-white/80 dark:bg-white/[0.07] border border-[#1A0A00]/10 dark:border-white/[0.1] text-[#1A0A00] dark:text-[#FDF6F0] placeholder:text-[#1A0A00]/35 dark:placeholder:text-[#FDF6F0]/30 focus:border-[#F43600]/40 focus:bg-white dark:focus:bg-white/[0.09]"
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
                    className="px-5 py-2.5 text-sm font-medium rounded-full transition-all disabled:opacity-60 shrink-0 flex items-center justify-center gap-2 group bg-[#F43600] hover:bg-[#FF4D1A] text-white shadow-[0_2px_12px_rgba(244,54,0,0.15)] hover:shadow-[0_4px_20px_rgba(244,54,0,0.25)] dark:shadow-[0_4px_24px_rgba(244,54,0,0.25)] dark:hover:shadow-[0_6px_32px_rgba(244,54,0,0.35)]"
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
                <p className="mt-2.5 text-xs text-red-600 dark:text-red-400" role="alert">
                    {errorMsg}
                </p>
            )}
        </form>
    );
}
