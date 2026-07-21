import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { getBlurDataURL } from "./blur-data.generated";

describe("generated blur placeholders", () => {
  it("preserves the Hero illustration alpha channel", async () => {
    const placeholder = getBlurDataURL("/images/hero.webp");
    expect(placeholder).toBeDefined();
    expect(placeholder).toMatch(/^data:image\/png;base64,/);

    const encoded = placeholder!.split(",", 2)[1];
    const metadata = await sharp(Buffer.from(encoded, "base64")).metadata();
    expect(metadata.hasAlpha).toBe(true);
  });
});
