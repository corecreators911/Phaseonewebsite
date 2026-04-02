---
name: performance
description: Audit and optimize performance for this React + GSAP + Three.js + Lenis site. Use this skill when the user asks to optimize, speed up, reduce lag, fix jank, improve Lighthouse scores, or audit bundle size. Do NOT remove animations or visual features — optimize how they run.
---

This skill audits and optimizes performance for a Vite + React 18 + GSAP + ScrollTrigger + Lenis + Three.js site. The goal is smooth 60fps animations and fast load times without removing any visual features or animations.

## Ground Rules
- Never remove or bypass animations. Optimize how they run.
- Never touch `vite.config.ts` (vendor chunks already manually split).
- Never add extra `ScrollTrigger.refresh()` calls — App handles this.
- Never simplify the Lenis + GSAP RAF integration in `App.tsx`.
- Always check `useReducedMotion()` is in place before any animation block.

## Audit Checklist — Run Through These First

### GSAP & ScrollTrigger
- [ ] Are ScrollTrigger instances being killed in `useEffect` cleanup? (`return () => trigger.kill()`)
- [ ] Are GSAP timelines being killed on unmount? (`return () => tl.kill()`)
- [ ] Are there redundant `ScrollTrigger.refresh()` calls outside of `App.tsx`? Remove them.
- [ ] Are `gsap.set()` calls used for initial states instead of CSS? (faster)
- [ ] Are animations using `will-change: transform` only where needed, not globally?
- [ ] Are ScrollTrigger markers left on in production? Remove `markers: true`.

### Three.js
- [ ] Is the renderer's `antialias` disabled on mobile? (significant GPU cost)
- [ ] Is the animation loop (`requestAnimationFrame`) cancelled on component unmount?
- [ ] Is the renderer disposed on unmount? (`renderer.dispose()`)
- [ ] Are textures disposed when no longer needed?
- [ ] Is `renderer.setPixelRatio` capped? (`Math.min(window.devicePixelRatio, 2)`)
- [ ] Is the canvas resizing on window resize with a debounce?

### Lenis
- [ ] Is Lenis destroyed on route change before re-init? Check `App.tsx`.
- [ ] Is Lenis RAF running inside GSAP ticker only (not a separate `requestAnimationFrame`)?

### React
- [ ] Are heavy components (Three.js canvas, archive grids) wrapped in `React.lazy()` + `Suspense`?
- [ ] Are animation-heavy sections memoized with `React.memo` where props are stable?
- [ ] Are event listeners (resize, scroll) cleaned up in `useEffect` returns?
- [ ] Are images using `loading="lazy"` and explicit `width`/`height` attributes?

### Bundle & Load
- [ ] Run `pnpm build` and check chunk sizes. Anything unexpected over 200KB outside vendor chunks?
- [ ] Are assets in `/public` that could be inlined or lazy-loaded?
- [ ] Are Google Fonts loaded with `display=swap`?

## Optimization Patterns to Apply

**GSAP cleanup pattern:**
```ts
useEffect(() => {
  const ctx = gsap.context(() => {
    // all gsap code here
  }, containerRef);
  return () => ctx.revert();
}, []);
```

**Three.js pixel ratio cap:**
```ts
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

**Lazy load heavy route:**
```ts
const ProjectsArchive = React.lazy(() => import('./pages/ProjectsArchive'));
```

**Debounced resize:**
```ts
const onResize = debounce(() => { /* resize logic */ }, 150);
window.addEventListener('resize', onResize);
return () => window.removeEventListener('resize', onResize);
```

## Output Format
When auditing, report findings as:
1. Critical (causes jank or memory leaks) — fix immediately
2. Important (affects Lighthouse or load time) — fix this session
3. Minor (nice to have) — note for later

Always explain what the fix does and why it helps. Never make multiple changes in one go — fix one category, confirm, then proceed.