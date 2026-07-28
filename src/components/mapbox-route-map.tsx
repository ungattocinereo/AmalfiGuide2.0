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
    const mapRef = useRef<MapboxMap | null>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "missing-token" | "error">("loading");

    useEffect(() => {
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (!token) {
            setStatus("missing-token");
            return;
        }

        let cancelled = false;
        const controller = new AbortController();
        let resizeTimer: number | null = null;

        async function loadMap() {
            try {
                const [mapboxglModule, geoJsonResponse] = await Promise.all([
                    import("mapbox-gl"),
                    fetch(route.geoJsonUrl, { signal: controller.signal }),
                ]);
                if (!geoJsonResponse.ok) throw new Error(`Failed to load ${route.geoJsonUrl}`);
                const geoJson = await geoJsonResponse.json() as RouteGeoJson;
                const coordinates = geoJson.features[0]?.geometry.coordinates ?? [];
                if (coordinates.length < 2 || !containerRef.current || cancelled) return;

                const mapboxgl = mapboxglModule.default;
                mapboxgl.accessToken = token;

                const bounds = coordinates.reduce(
                    (box, coord) => box.extend(coord),
                    new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]),
                );

                const map = new mapboxgl.Map({
                    container: containerRef.current,
                    style: "mapbox://styles/mapbox/outdoors-v12",
                    center: coordinates[0],
                    zoom: 12,
                    attributionControl: false,
                });
                mapRef.current = map;
                requestAnimationFrame(() => map.resize());
                resizeTimer = window.setTimeout(() => map.resize(), 250);
                map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");
                map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");

                map.on("load", () => {
                    if (cancelled) return;
                    map.resize();
                    map.addSource("route", {
                        type: "geojson",
                        data: geoJson,
                    } as unknown as Parameters<MapboxMap["addSource"]>[1]);
                    map.addLayer({
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
                    map.addLayer({
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
                    map.fitBounds(bounds, { padding: 56, maxZoom: 14, duration: 0 });
                    setStatus("ready");
                });
            } catch (error) {
                if (!cancelled && (error as Error).name !== "AbortError") setStatus("error");
            }
        }

        loadMap();

        return () => {
            cancelled = true;
            controller.abort();
            if (resizeTimer !== null) window.clearTimeout(resizeTimer);
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, [route.geoJsonUrl]);

    const fallbackLabel =
        status === "missing-token"
            ? t("routeMap.mapUnavailable")
            : status === "error"
                ? t("routeMap.mapUnavailable")
                : t("routeMap.loading");
    const staticPreviewUrl = getRouteStaticPreviewPath(route, "wide");

    return (
        <div className="absolute inset-0 overflow-hidden bg-stone-100 dark:bg-amalfi-espresso-soft">
            {status !== "ready" && staticPreviewUrl ? (
                <Image
                    src={staticPreviewUrl}
                    alt={`${route.title} route map preview`}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                />
            ) : status !== "ready" ? (
                <div
                    className="absolute inset-0 bg-[linear-gradient(135deg,rgba(251,146,60,0.12)_0%,rgba(255,255,255,0.92)_42%,rgba(20,83,45,0.13)_100%)] dark:bg-[linear-gradient(135deg,rgba(124,45,18,0.55)_0%,rgba(28,16,10,0.92)_48%,rgba(20,83,45,0.38)_100%)]"
                    aria-hidden="true"
                />
            ) : null}
            <div
                ref={containerRef}
                className={`h-full w-full transition-[filter,opacity] duration-300 dark:grayscale dark:saturate-0 dark:contrast-125 ${status === "ready" ? "opacity-100" : "opacity-0"}`}
                aria-label={route.title}
            />
            {status !== "ready" && !staticPreviewUrl && (
                <div className="absolute inset-x-4 bottom-4 z-10 rounded-lg bg-black/60 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                    {fallbackLabel}
                </div>
            )}
        </div>
    );
}
