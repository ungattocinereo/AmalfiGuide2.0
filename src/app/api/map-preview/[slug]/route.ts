import { NextRequest, NextResponse } from "next/server";
import { getMapboxStaticPreviewUrl, routeAssets } from "@/lib/place-routes";

const CACHE_SECONDS = 30 * 24 * 60 * 60;

type RouteContext = {
    params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
    const { slug } = await context.params;
    const route = routeAssets.find((candidate) => candidate.slug === slug);
    if (!route) return new NextResponse("Map preview not found", { status: 404 });

    const size = request.nextUrl.searchParams.get("size") === "compact" ? "compact" : "wide";
    const mapboxUrl = getMapboxStaticPreviewUrl(route, size);
    if (!mapboxUrl) return new NextResponse("Map preview is not configured", { status: 503 });

    const upstream = await fetch(mapboxUrl, {
        next: { revalidate: CACHE_SECONDS },
    });
    if (!upstream.ok) return new NextResponse("Map preview is temporarily unavailable", { status: 502 });

    return new NextResponse(await upstream.arrayBuffer(), {
        headers: {
            "Cache-Control": `public, max-age=86400, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
            "Content-Type": upstream.headers.get("content-type") ?? "image/png",
        },
    });
}
