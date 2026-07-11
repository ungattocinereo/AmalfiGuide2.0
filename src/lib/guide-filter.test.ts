import { describe, expect, it } from "vitest";
import type { CategorySection, PlaceItem } from "./markdown-parser";
import { filterGuideSections, normalizeGuideSearch } from "./guide-filter";

const place = (overrides: Partial<PlaceItem>): PlaceItem => ({
  name: "Mimì & Cocò",
  slug: "mimi-coco",
  category: "Local Market",
  tagline: "Sapori autentici",
  taglineHtml: "Sapori autentici",
  shortInfo: "A family grocery in Atrani",
  shortInfoHtml: "A family grocery in Atrani",
  details: "Local food and daily essentials",
  detailsHtml: "Local food and daily essentials",
  links: [],
  ...overrides,
});

const sections: CategorySection[] = [
  {
    title: "Gems of Atrani",
    description: "Hidden corners",
    descriptionHtml: "Hidden corners",
    items: [place({})],
  },
  {
    title: "Favourite Restaurants",
    description: "Local tables",
    descriptionHtml: "Local tables",
    items: [
      place({
        name: "Le Palme",
        slug: "le-palme",
        category: "Family Spot",
        tagline: "Seafood by the square",
        shortInfo: "Open for lunch and dinner",
        hours: "Mon-Sun 12:00-23:00",
      }),
    ],
  },
];

describe("normalizeGuideSearch", () => {
  it("matches user text without case or diacritics", () => {
    expect(normalizeGuideSearch("  MIMÌ & COCÒ  ")).toBe("mimi & coco");
  });
});

describe("filterGuideSections", () => {
  it("finds places using name, category, tagline, and short description", () => {
    expect(filterGuideSections(sections, { query: "autentici" })[0]?.items[0]?.slug).toBe("mimi-coco");
    expect(filterGuideSections(sections, { query: "family spot" })[0]?.items[0]?.slug).toBe("le-palme");
  });

  it("uses stable one-based section ids", () => {
    const result = filterGuideSections(sections, { section: "2" });
    expect(result.map((section) => section.title)).toEqual(["Favourite Restaurants"]);
  });

  it("can limit results to places open at the supplied time", () => {
    const result = filterGuideSections(
      sections,
      { openNow: true },
      new Date("2026-07-06T13:00:00+02:00"),
    );
    expect(result.flatMap((section) => section.items.map((item) => item.slug))).toEqual(["le-palme"]);
  });
});
