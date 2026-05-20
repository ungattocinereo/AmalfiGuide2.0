"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Map as MapboxMap } from "mapbox-gl";
import type { RouteAsset } from "@/lib/place-routes";
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

                map.on("error", () => {
                    if (!cancelled) setStatus("error");
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
            ? t("routeMap.previewOnly")
            : status === "error"
                ? t("routeMap.mapUnavailable")
                : t("routeMap.loading");

    return (
        <div className="absolute inset-0 overflow-hidden bg-stone-100 dark:bg-amalfi-espresso-soft">
            <Image
                src={route.previewImageUrl}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-cover transition-opacity duration-300 ${status === "ready" ? "opacity-0" : "opacity-100"}`}
                aria-hidden="true"
            />
            <div
                ref={containerRef}
                className={`h-full w-full transition-opacity duration-300 ${status === "ready" ? "opacity-100" : "opacity-0"}`}
                aria-label={route.title}
            />
            {status !== "ready" && (
                <div className="absolute inset-x-4 bottom-4 z-10 rounded-lg bg-black/60 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                    {fallbackLabel}
                </div>
            )}
        </div>
    );
}
