"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Map as MapboxMap } from "mapbox-gl";
import { getRouteStaticPreviewPath, type RouteAsset } from "@/lib/place-routes";
import { useLanguage } from "@/components/language-context";

type RouteGeoJson = {
    type: "FeatureCollection";
    features: Array<{
        type: "Feature";
        properties: Record<string, unknown>;
        geometry: {
            type: "LineString";
            coordinates: [number, number][];
        };
    }>;
};

interface MapboxRouteMapProps {
    route: RouteAsset;
}

export function MapboxRouteMap({ route }: MapboxRouteMapProps) {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [retryAttempt, setRetryAttempt] = useState(0);

    useEffect(() => {
        setStatus("loading");
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (!token) {
            setStatus("error");
            return;
        }

        let cancelled = false;
        let failed = false;
        let map: MapboxMap | null = null;
        const controller = new AbortController();
        let resizeTimer: number | null = null;
        let resizeFrame: number | null = null;
        const fail = () => {
            if (cancelled || failed) return;
            failed = true;
            controller.abort();
            window.clearTimeout(loadTimeout);
            if (resizeTimer !== null) window.clearTimeout(resizeTimer);
            if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
            map?.remove();
            map = null;
            setStatus("error");
        };
        const loadTimeout = window.setTimeout(fail, 20_000);

        async function loadMap() {
            try {
                const [mapboxglModule, geoJsonResponse] = await Promise.all([
                    import("mapbox-gl"),
                    fetch(route.geoJsonUrl, { signal: controller.signal }),
                ]);
                if (!geoJsonResponse.ok) throw new Error(`Failed to load ${route.geoJsonUrl}`);
                const geoJson = await geoJsonResponse.json() as RouteGeoJson;
                const coordinates = geoJson.features[0]?.geometry.coordinates ?? [];
                if (coordinates.length < 2) throw new Error(`Invalid route: ${route.geoJsonUrl}`);
                if (!containerRef.current || cancelled || failed) return;

                const mapboxgl = mapboxglModule.default;
                mapboxgl.accessToken = token;

                const bounds = coordinates.reduce(
                    (box, coord) => box.extend(coord),
                    new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]),
                );

                map = new mapboxgl.Map({
                    container: containerRef.current,
                    style: "mapbox://styles/mapbox/outdoors-v12",
                    center: coordinates[0],
                    zoom: 12,
                    attributionControl: false,
                });
                const activeMap = map;
                resizeFrame = window.requestAnimationFrame(() => activeMap.resize());
                resizeTimer = window.setTimeout(() => activeMap.resize(), 250);
                map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");
                map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");
                map.on("error", fail);

                map.on("load", () => {
                    if (cancelled || failed) return;
                    try {
                        activeMap.resize();
                        activeMap.addSource("route", {
                            type: "geojson",
                            data: geoJson,
                        } as unknown as Parameters<MapboxMap["addSource"]>[1]);
                        activeMap.addLayer({
                            id: "route-shadow",
                            type: "line",
                            source: "route",
                            layout: {
                                "line-cap": "round",
                                "line-join": "round",
                            },
                            paint: {
                                "line-color": "#3f1d0d",
                                "line-opacity": 0.32,
                                "line-width": 10,
                            },
                        });
                        activeMap.addLayer({
                            id: "route-line",
                            type: "line",
                            source: "route",
                            layout: {
                                "line-cap": "round",
                                "line-join": "round",
                            },
                            paint: {
                                "line-color": "#f97316",
                                "line-width": 5,
                            },
                        });
                        activeMap.fitBounds(bounds, { padding: 56, maxZoom: 14, duration: 0 });
                        window.clearTimeout(loadTimeout);
                        setStatus("ready");
                    } catch {
                        fail();
                    }
                });
            } catch (error) {
                if ((error as Error).name !== "AbortError") fail();
            }
        }

        loadMap();

        return () => {
            cancelled = true;
            controller.abort();
            window.clearTimeout(loadTimeout);
            if (resizeTimer !== null) window.clearTimeout(resizeTimer);
            if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
            map?.remove();
            map = null;
        };
    }, [route.geoJsonUrl, retryAttempt]);

    const staticPreviewUrl = getRouteStaticPreviewPath(route, "wide");

    return (
        <div className="absolute inset-0 overflow-hidden bg-stone-100 dark:bg-amalfi-espresso-soft">
            {status === "error" && staticPreviewUrl ? (
                <Image
                    src={staticPreviewUrl}
                    alt={`${route.title} route map preview`}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                />
            ) : status === "error" ? (
                <div
                    className="absolute inset-0 bg-[linear-gradient(135deg,rgba(251,146,60,0.12)_0%,rgba(255,255,255,0.92)_42%,rgba(20,83,45,0.13)_100%)] dark:bg-[linear-gradient(135deg,rgba(124,45,18,0.55)_0%,rgba(28,16,10,0.92)_48%,rgba(20,83,45,0.38)_100%)]"
                    aria-hidden="true"
                />
            ) : null}
            <div
                ref={containerRef}
                className={`h-full w-full transition-[filter,opacity] duration-300 dark:grayscale dark:saturate-0 dark:contrast-125 ${status === "error" ? "pointer-events-none opacity-0" : status === "loading" ? "pointer-events-none opacity-100" : "opacity-100"}`}
                aria-label={route.title}
            />
            {status !== "ready" && (
                <div className="absolute inset-x-4 bottom-4 z-10 flex items-center justify-center gap-3 rounded-lg bg-black/70 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md" role="status">
                    <span>{status === "error" ? t("routeMap.mapUnavailable") : t("routeMap.loading")}</span>
                    {status === "error" && (
                        <button
                            type="button"
                            onClick={() => setRetryAttempt((attempt) => attempt + 1)}
                            className="rounded-md border border-white/70 px-3 py-1.5 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            {t("routeMap.retry")}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
