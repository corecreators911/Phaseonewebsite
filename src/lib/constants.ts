/**
 * Shared noise / grain SVG data-URIs used across the site.
 * Keeps the identical base-64 strings in one place so changes propagate everywhere.
 */

/** Tiny 4×4 white-dot pattern – used for subtle grain overlays (Hero, Preloader). */
export const NOISE_DOT_SVG =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==";

/** feTurbulence fractal-noise pattern – used for the full-screen FilmGrain overlay. */
export const NOISE_TURBULENCE_SVG =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

/** Handler record stored in a WeakMap for magnetic-button cleanup (typed alternative to `(el as any)._handlers`). */
export interface MagneticHandlerRecord {
  handleBtnEnter: () => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseLeave: () => void;
  handleResize: () => void;
}

/** WeakMap that associates an HTMLElement with its magnetic-button event handlers. */
export const magneticHandlers = new WeakMap<HTMLElement, MagneticHandlerRecord>();
