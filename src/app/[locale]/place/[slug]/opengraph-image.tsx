import { ImageResponse } from "next/og";
import { findPlaceBySlug } from "@/lib/markdown-parser";
import type { Language } from "@/lib/i18n/types";

export const runtime = "nodejs";
export const alt = "Amalfi.Day place card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Intentionally no generateStaticParams — the OG cards are rendered on demand
// and cached at the edge. Pre-rendering 168 PNGs per build blew past Vercel's
// free-tier upload quota; dynamic generation is both lighter and fresher.

/**
 * Editorial OG card: brand-colored gradient background + category kicker +
 * place name + tagline + brand footer. Photo-less by design because next/og's
 * satori renderer rejects our WebP source images — a typographic card is
 * distinctive, fast, and never fails a build.
 */
export default async function OgImage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const place = findPlaceBySlug(locale as Language, slug);
    if (!place) {
        return new ImageResponse(
            (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        background: "#1a0a00",
                    }}
                />
            ),
            size,
        );
    }

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    position: "relative",
                    backgroundColor: "#1a0a00",
                    backgroundImage:
                        "radial-gradient(ellipse 90% 70% at 10% 100%, rgba(244,54,0,0.35) 0%, rgba(244,54,0,0) 65%), radial-gradient(ellipse 70% 60% at 100% 0%, rgba(244,54,0,0.12) 0%, rgba(244,54,0,0) 60%)",
                    color: "#FDF6F0",
                    fontFamily: "serif",
                }}
            >

                {/* Top-left brand bar */}
                <div
                    style={{
                        position: "absolute",
                        top: 56,
                        left: 72,
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                    }}
                >
                    <div
                        style={{
                            width: 56,
                            height: 4,
                            background: "#F43600",
                            borderRadius: 2,
                        }}
                    />
                    <div
                        style={{
                            fontFamily: "sans-serif",
                            fontSize: 22,
                            fontWeight: 700,
                            letterSpacing: 5,
                            textTransform: "uppercase",
                            color: "#F43600",
                        }}
                    >
                        {place.category}
                    </div>
                </div>

                {/* Place name — dominant */}
                <div
                    style={{
                        position: "absolute",
                        top: 160,
                        left: 72,
                        right: 72,
                        bottom: 220,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            fontSize: place.name.length > 32 ? 76 : 96,
                            fontWeight: 700,
                            lineHeight: 1.02,
                            letterSpacing: -2,
                            color: "#FDF6F0",
                            display: "flex",
                            flexWrap: "wrap",
                        }}
                    >
                        {place.name}
                    </div>
                </div>

                {/* Tagline */}
                {place.tagline && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 128,
                            left: 72,
                            right: 72,
                            fontSize: 32,
                            fontStyle: "italic",
                            color: "rgba(253, 246, 240, 0.72)",
                            display: "flex",
                            lineHeight: 1.3,
                        }}
                    >
                        {place.tagline}
                    </div>
                )}

                {/* Divider */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 80,
                        left: 72,
                        right: 72,
                        height: 1,
                        background: "rgba(253, 246, 240, 0.18)",
                    }}
                />

                {/* Footer brand */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 40,
                        left: 72,
                        right: 72,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontFamily: "sans-serif",
                        fontSize: 18,
                        fontWeight: 700,
                        letterSpacing: 6,
                        textTransform: "uppercase",
                    }}
                >
                    <div style={{ color: "#FDF6F0" }}>GUIDE · AMALFI.DAY</div>
                    <div style={{ color: "rgba(253, 246, 240, 0.55)" }}>
                        ATRANI · AMALFI COAST
                    </div>
                </div>
            </div>
        ),
        size,
    );
}
