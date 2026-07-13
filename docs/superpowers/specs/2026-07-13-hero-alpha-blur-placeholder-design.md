# Hero alpha blur placeholder design

## Problem

The Hero illustration is a transparent WebP. Its generated blur placeholder is
currently encoded as JPEG, which replaces transparent pixels with black. During
the first image-loading frame, `next/image` displays that JPEG and creates a
short black flash behind the illustration.

## Chosen design

Make the shared blur-data generator alpha-aware:

- inspect each source image before encoding its 8×8 placeholder;
- encode sources with an alpha channel as PNG data URLs;
- keep opaque sources as JPEG data URLs at the existing quality;
- regenerate `src/lib/blur-data.generated.ts` through the existing
  `npm run generate:blur` command;
- leave the Hero component, theme backgrounds, preload priority, and animation
  timings unchanged.

PNG is used for transparent placeholders because it preserves alpha reliably in
all supported browsers. At 8×8 pixels, its additional size is negligible.

## Data flow

`public/images/hero.webp` → metadata check → 8×8 transparent PNG data URL →
`getBlurDataURL()` → `next/image` blur placeholder → the existing Hero panel
background remains visible until the full WebP finishes loading.

Opaque guide images continue through the existing JPEG path.

## Verification

1. Add a regression test that decodes the generated Hero placeholder and
   confirms it has an alpha channel.
2. Run the test before implementation and confirm it fails on the JPEG output.
3. Update the generator, regenerate the data file, and confirm the test passes.
4. Run lint, the complete unit suite, and the production build/E2E suite.
5. Inspect the first Hero frame with the full image request delayed and confirm
   that no black matte appears.

## Scope

No visual redesign, copy change, theme change, or unrelated image-processing
change is included.
