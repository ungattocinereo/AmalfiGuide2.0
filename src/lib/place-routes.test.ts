import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { getRouteForPlace, routeAssets } from "./place-routes";

describe("route assets", () => {
  it("defines complete downloadable assets for every hiking route", () => {
    expect(routeAssets.map((route) => route.slug)).toEqual([
      "valle-delle-ferriere",
      "torre-dello-ziro",
      "path-of-the-gods",
      "the-lemon-path",
    ]);

    for (const route of routeAssets) {
      for (const url of [
        route.geoJsonUrl,
        route.gpxUrl,
        route.kmlUrl,
        route.kmzUrl,
        route.previewImages.compact,
        route.previewImages.wide,
      ]) {
        expect(existsSync(join(process.cwd(), "public", url.replace(/^\//, "")))).toBe(true);
      }
      expect(route.previewImages.compact).toMatch(/\/route-previews\/.+-compact-[a-f0-9]{12}\.webp$/);
      expect(route.previewImages.wide).toMatch(/\/route-previews\/.+-wide-[a-f0-9]{12}\.webp$/);
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
