# Footer cleanup and hiking maps production release

## Goal

Remove the `Photo spots` link from the guide footer, verify that every mapped route in `Hiking & Nature` renders correctly, and promote the complete current `dev` branch to production as release `v1.12.0`.

## Interface change

- Remove only the footer item whose destination is `https://amalfi.day/photolocations`.
- Preserve the remaining information links, their order, icons, translations, and responsive layout.
- The unused `footer.photoSpots` message is removed from all six locale files.

## Hiking map verification

The following route-backed places must be checked:

- Path of the Gods
- The Lemon Path
- Torre dello Ziro
- Valle delle Ferriere

For every route:

- the card must render a Mapbox static preview without falling back to the regular place image;
- opening the place must render the interactive Mapbox canvas and route line without a loading or unavailable message;
- the route GeoJSON, GPX, KML, and KMZ assets must return successful responses;
- the page must not produce Mapbox or route-loading console errors.

Desktop and mobile layouts are verified. Route matching remains locale-aware through the existing translated match terms; no unrelated map redesign is included.

## Validation and release

1. Add regression coverage for the removed footer destination and route matching/assets.
2. Run lint, unit tests, production build, and desktop/mobile end-to-end tests.
3. Verify all four maps against the production build in a real browser.
4. Push the change to `dev` and confirm its deployment checks succeed.
5. Fast-forward `main` to the verified `dev` commit and push `main`.
6. Publish GitHub release `v1.12.0`, which triggers the repository's production Vercel workflow.
7. Wait for the production workflow to finish, then verify `https://guide.amalfi.day` for the absent footer link and working hiking maps.

No force push, unrelated cleanup, or direct Vercel deployment outside the documented release workflow is permitted.
