"use client";

import React, { useEffect, useState } from "react";
import SunCalc from "suncalc";
import { Sun, Thermometer, Path as PathIcon } from "@phosphor-icons/react";
import { useLanguage } from "@/components/language-context";

// Atrani coordinates — the heart of the guide.
const ATRANI_LAT = 40.6356;
const ATRANI_LON = 14.6086;

type WeatherSnapshot = {
    temperatureC: number;
    weatherCode: number;
};

// Open-Meteo "weather_code" → broad categories we care about.
// Reference: https://open-meteo.com/en/docs (WMO weather interpretation)
const isRainy = (code: number) => (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
const isStorm = (code: number) => code >= 95 && code <= 99;
const isSnow = (code: number) => (code >= 71 && code <= 77) || code === 85 || code === 86;

const formatTime = (date: Date, locale: string): string =>
    date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false });

export function ContextWidget() {
    const { t, language } = useLanguage();
    const [sunset, setSunset] = useState<Date | null>(null);
    const [weather, setWeather] = useState<WeatherSnapshot | null>(null);

    useEffect(() => {
        let cancelled = false;
        const controller = new AbortController();

        // Compute sunset via microtask so the setState lands post-render (satisfies
        // react-hooks/set-state-in-effect while still showing the value almost instantly).
        Promise.resolve().then(() => {
            if (cancelled) return;
            setSunset(SunCalc.getTimes(new Date(), ATRANI_LAT, ATRANI_LON).sunset);
        });

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${ATRANI_LAT}&longitude=${ATRANI_LON}&current=temperature_2m,weather_code&timezone=auto`;
        fetch(url, { signal: controller.signal })
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (cancelled || !data?.current) return;
                setWeather({
                    temperatureC: Math.round(data.current.temperature_2m),
                    weatherCode: data.current.weather_code,
                });
            })
            .catch(() => {
                // Silent degrade — widget still shows sunset without weather.
            });

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, []);

    if (!sunset) return null;

    const goodForHiking =
        weather !== null &&
        weather.temperatureC >= 15 &&
        weather.temperatureC <= 28 &&
        !isRainy(weather.weatherCode) &&
        !isStorm(weather.weatherCode) &&
        !isSnow(weather.weatherCode);

    return (
        <div
            className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-sans text-[0.68rem] md:text-[0.72rem] font-medium tracking-[0.02em] text-[#FDF6F0]/70"
            aria-label={t("contextWidget.label")}
        >
            <span className="inline-flex items-center gap-1.5">
                <Sun weight="duotone" size={14} className="text-[#F43600]" />
                <span className="uppercase text-[#FDF6F0]/50 tracking-[0.12em]">{t("contextWidget.sunset")}</span>
                <span className="text-[#FDF6F0]">{formatTime(sunset, language)}</span>
            </span>
            {weather && (
                <span className="inline-flex items-center gap-1.5">
                    <Thermometer weight="duotone" size={14} className="text-[#F43600]" />
                    <span className="text-[#FDF6F0]">{weather.temperatureC}°C</span>
                </span>
            )}
            {goodForHiking && (
                <span className="inline-flex items-center gap-1.5 py-[3px] px-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-200">
                    <PathIcon weight="duotone" size={12} />
                    <span className="uppercase tracking-[0.08em] text-[0.62rem]">{t("contextWidget.goodForHiking")}</span>
                </span>
            )}
        </div>
    );
}
