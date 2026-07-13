import { afterEach, describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { getMapboxStaticPreviewUrl, getRouteForPlace, routeAssets } from "./place-routes";

describe("getMapboxStaticPreviewUrl", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  });

  it("returns responsive previews without oversized retina dimensions", () => {
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN = "public-token";
    const route = getRouteForPlace("Path of the Gods");
    expect(route).not.toBeNull();

    const compact = getMapboxStaticPreviewUrl(route!, "compact");
    const wide = getMapboxStaticPreviewUrl(route!, "wide");

    expect(compact).toContain("/600x450?");
    expect(wide).toContain("/900x675?");
    expect(wide).not.toContain("@2x");
  });

  it("defines complete downloadable assets for every hiking route", () => {
    expect(routeAssets.map((route) => route.slug)).toEqual([
      "valle-delle-ferriere",
      "torre-dello-ziro",
      "path-of-the-gods",
      "the-lemon-path",
    ]);

    for (const route of routeAssets) {
      for (const url of [route.geoJsonUrl, route.gpxUrl, route.kmlUrl, route.kmzUrl]) {
        expect(existsSync(join(process.cwd(), "public", url.replace(/^\//, "")))).toBe(true);
      }
    }
  });

  it("matches hiking routes across localized place names", () => {
    expect(getRouteForPlace("Sentiero degli Dei")?.slug).toBe("path-of-the-gods");
    expect(getRouteForPlace("Sentier des Citrons")?.slug).toBe("the-lemon-path");
    expect(getRouteForPlace("Тропа богов")?.slug).toBe("path-of-the-gods");
    expect(getRouteForPlace("Torre dello Ziro")?.slug).toBe("torre-dello-ziro");
    expect(getRouteForPlace("Valle delle Ferriere")?.slug).toBe("valle-delle-ferriere");
  });
});
