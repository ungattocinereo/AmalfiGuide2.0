# Hero Cartographic Intro Animation

## Goal

Replace the current simple circle-and-dot entrance on the Hero illustration panel with a single, polished cartographic reveal that feels specific to Amalfi.Day. The sequence should create a brief “wow” moment without competing with the guide content or leaving continuous motion behind.

## Direction

The visual language is an editorial coastal map rather than a generic particle effect. Fine circular contours, route fragments, coordinate ticks, and warm signal points assemble behind the watercolor illustration. The illustration remains the focal point and receives no shadow, blur placeholder, filter, or animated transform.

## Sequence

The complete entrance lasts approximately 1.8 seconds and runs once when the expanded Hero mounts.

1. **Atmosphere, 0–0.45 s**
   - A restrained warm radial glow expands behind the lower half of the illustration.
   - The glow is softer in light mode and ember-like in dark mode.
2. **Contours, 0.15–1.15 s**
   - Three thin, slightly offset SVG contour rings draw clockwise using `pathLength`, `strokeDasharray`, and `strokeDashoffset`.
   - Rings use different arc lengths and start angles so they do not read as a loading spinner.
3. **Route and coordinates, 0.45–1.4 s**
   - A short dotted route curve draws across the left/lower area behind the city.
   - Small coordinate ticks and two compact crosshair marks fade and scale into place.
4. **Signals, 0.55–1.5 s**
   - Three orange signal points appear in sequence along the contours and route.
   - Each point makes one short orbital movement and one restrained pulse, then stops.
   - A faint trailing segment follows the primary point and fades before the sequence ends.
5. **Settle, 1.35–1.8 s**
   - One soft highlight moves behind the city from lower-left toward upper-right and disappears.
   - Contours, route marks, and signal points settle into a low-contrast static composition.

No animation repeats after the settle phase.

## Composition and Layering

- All decorative motion lives in a dedicated `HeroCartographicIntro` component.
- The component is positioned inside the right Hero panel, behind the watercolor illustration and above the radial background.
- It is `pointer-events: none`, `aria-hidden`, and never affects layout.
- The existing watercolor image stays at its current size, position, and z-index.
- The location badge, vertical label, navigation, and content remain unchanged.
- The SVG uses a `viewBox` so the geometry scales without JavaScript layout measurement.

Layer order within the right panel:

1. panel background and radial atmosphere;
2. cartographic SVG and one-time glow;
3. decorative signal points;
4. watercolor illustration;
5. badge and vertical label.

## Responsive Behavior

### Desktop

- Three contour arcs.
- One dotted route curve.
- Three signal points, two crosshairs, and compact coordinate ticks.
- Full 1.8-second sequence.

### Mobile

- One primary contour and one partial secondary arc.
- Two signal points and one crosshair.
- Route detail is shortened to avoid visual crowding above the reduced illustration.
- Timing stays coordinated but the decorative density is lower.

## Theme Treatment

### Light mode

- Lines: warm espresso/orange at low opacity.
- Signals: Amalfi orange with a small warm halo.
- Glow: peach/terracotta, kept behind the illustration.

### Dark mode

- Lines: muted coral and warm cream at low opacity.
- Signals: slightly brighter orange with a restrained ember halo.
- Glow: deep terracotta with no black flood or image shadow.

## Motion and Accessibility

- Use Framer Motion, matching the existing Hero implementation.
- Read `useReducedMotion()` inside the animation component.
- With reduced motion enabled, render the final static composition immediately: no path drawing, orbital movement, pulse, or highlight sweep.
- Do not use infinite transitions, timers, canvas, requestAnimationFrame loops, or scroll listeners.
- Decorative SVG content is hidden from assistive technology.

## Performance Constraints

- Prefer SVG stroke and opacity animation; avoid large blur filters.
- Use at most one small CSS radial blur for the transient glow.
- Animate transform and opacity where possible.
- Keep the component self-contained so Hero copy and image rendering are unaffected.
- Do not reintroduce `drop-shadow`, `filter`, or a blur placeholder on the Hero image.

## Testing

- Unit-test the exported animation timing data to ensure every transition is finite and non-repeating.
- Browser-test that the cartographic layer is present and `aria-hidden`.
- Browser-test that the Hero image and its wrapper keep `filter: none` and the image keeps `background-image: none`.
- Browser-test the reduced-motion state to confirm the component renders its settled state without active animation.
- Run lint, unit tests, production build, and the complete Playwright suite.
- Perform visual checks at desktop and mobile widths in both light and dark themes.

## Out of Scope

- Animating the watercolor illustration itself.
- Continuous ambient loops after the intro.
- Changes to Hero copy, typography, layout, image dimensions, navigation, or badges.
- Sound, user interaction, scroll-based effects, or WebGL/canvas rendering.
