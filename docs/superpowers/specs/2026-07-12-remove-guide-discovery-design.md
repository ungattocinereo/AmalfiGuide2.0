# Remove guide discovery controls

## Goal

Remove search, category filtering, and the “open now” mode completely. The guide must always render its full set of sections and places.

## Scope

- Remove the discovery panel from the guide interface.
- Remove URL-driven filtering through `q`, `section`, and `open` parameters.
- Remove the discovery component, filtering utility, related translations, and their dedicated tests.
- Update end-to-end tests so they verify the full guide and normal place-card navigation without relying on search.

## Preserved behavior

- Place cards remain real links and continue opening accessible modal details on a primary click.
- Back navigation, keyboard controls, locale routes, offline support, accessibility improvements, and performance optimizations remain unchanged.
- Opening-hours display remains available inside place details; only the “open now” filtering control is removed.

## Validation

- No search box, category selector, “open now” checkbox, results counter, or reset button is rendered.
- Query parameters do not alter the visible guide content.
- Unit tests, desktop/mobile end-to-end tests, linting, and the production build pass.
