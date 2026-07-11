import { afterEach, describe, expect, it } from "vitest";
import { getMapboxStaticPreviewUrl, getRouteForPlace } from "./place-routes";

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
});
