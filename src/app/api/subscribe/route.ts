import { NextResponse } from "next/server";

export const runtime = "nodejs";

const GHOST_URL = process.env.GHOST_URL ?? "https://amalfi.day/blog";
const GHOST_NEWSLETTER = process.env.GHOST_NEWSLETTER ?? "Amalfi Day News";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FORM_DWELL_MS = 1500;
const RATE_LIMIT_WINDOW_MS = 10_000;

const rateLimitMap = new Map<string, number>();

async function fetchIntegrityToken(): Promise<string | null> {
    try {
        const res = await fetch(`${GHOST_URL}/members/api/integrity-token/`, {
            headers: { Accept: "text/plain" },
        });
        if (!res.ok) return null;
        const text = (await res.text()).trim();
        return text || null;
    } catch {
        return null;
    }
}

function getClientIp(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]!.trim();
    return req.headers.get("x-real-ip") ?? "unknown";
}

function fail(error: string, status = 400) {
    return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
    let payload: { email?: unknown; hp?: unknown; t?: unknown };
    try {
        payload = await req.json();
    } catch {
        return fail("Invalid request", 400);
    }

    const email = typeof payload.email === "string" ? payload.email.trim() : "";
    const hp = typeof payload.hp === "string" ? payload.hp : "";
    const loadedAt = typeof payload.t === "number" ? payload.t : 0;

    // Honeypot or instant-submit → pretend success, drop silently.
    if (hp.length > 0 || Date.now() - loadedAt < MIN_FORM_DWELL_MS) {
        return NextResponse.json({ ok: true });
    }

    if (!EMAIL_RE.test(email)) {
        return fail("Please enter a valid email address.", 400);
    }

    const ip = getClientIp(req);
    const now = Date.now();
    const last = rateLimitMap.get(ip) ?? 0;
    if (now - last < RATE_LIMIT_WINDOW_MS) {
        return fail("Too many attempts. Please wait a few seconds.", 429);
    }
    rateLimitMap.set(ip, now);
    if (rateLimitMap.size > 1000) {
        for (const [key, ts] of rateLimitMap) {
            if (now - ts > RATE_LIMIT_WINDOW_MS) rateLimitMap.delete(key);
        }
    }

    try {
        const integrityToken = await fetchIntegrityToken();

        const ghostPayload: Record<string, unknown> = {
            email,
            emailType: "signup",
            labels: [],
            name: "",
            newsletters: [{ name: GHOST_NEWSLETTER }],
        };
        if (integrityToken) ghostPayload.integrityToken = integrityToken;

        const ghostRes = await fetch(`${GHOST_URL}/members/api/send-magic-link/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ghostPayload),
        });

        if (ghostRes.ok) {
            return NextResponse.json({ ok: true });
        }

        let ghostError = "Subscription failed. Please try again.";
        try {
            const body = await ghostRes.json();
            const msg = body?.errors?.[0]?.message;
            if (typeof msg === "string" && msg.length > 0 && msg.length < 200) {
                ghostError = msg;
            }
        } catch {
            /* ignore */
        }
        return fail(ghostError, ghostRes.status === 429 ? 429 : 400);
    } catch {
        return fail("Subscription service unavailable. Please try again later.", 502);
    }
}
