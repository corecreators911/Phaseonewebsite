# GitHub Copilot Instructions
VFX company portfolio & showcase site. Conversion-focused, visually heavy, dark aesthetic.
Built with React + GSAP + Three.js. Deployed on Netlify.

---

## CRITICAL — Read Before Any Code

- Read the relevant existing file(s) before writing any code.
- Prefer editing over rewriting whole files.
- When unsure about intent, ask one short clarifying question before proceeding.
- User instructions always override this file.
- Keep solutions simple and direct — no over-engineering.

---

## Do Not Touch Without Being Explicitly Asked
- Lenis init and GSAP ticker integration in `App.tsx`
- Scroll-to-section logic and nonce pattern in `Navbar`
- Vendor chunk splitting in `vite.config.ts`
- `chunkSizeWarningLimit` in `vite.config.ts`
- `.env` — never read, edit, or commit secrets
- `package.json` — do not add or remove dependencies without being asked

---

## Tech Stack
- React 18 + TypeScript (strict) via Vite 6
- Tailwind CSS 4 — CSS-first, `@theme inline` in `src/styles/theme.css`. No `tailwind.config.js`
- GSAP + ScrollTrigger — scroll-driven animations
- Lenis — smooth scroll, integrated into GSAP's RAF ticker
- Motion (`motion/react`) — navbar, mobile menu, modal AnimatePresence, Services accordion, PreviewNotice
- Three.js — WebGL shader background (`ShaderBackground.tsx`)
- React Router DOM v7
- lucide-react — icon library
- react-hook-form — Contact form state
- pnpm (flat lockfile with overrides)

Always use `cn()` from `src/lib/utils.ts` for conditional classes.
Always use `@/` alias for all imports.

---

## Architecture

### Routing
`src/main.tsx` → BrowserRouter. `src/app/App.tsx` owns: Lenis instance, GSAP ScrollTrigger lifecycle, 700ms page transition overlay, cross-route scroll logic, and Preloader.

Routes: `/` → Home | `/projects` → ProjectsArchive | `/projects/:id` → ProjectDetail

### Navigation & Scroll
Navbar uses `navigate(path, { state: { scrollTo: sectionId, _nonce: Date.now() } })`.
**Do not refactor or simplify this pattern.** The nonce and 3-pass correction (0ms / 400ms / 800ms) are intentional.

### Data
- `src/data/projects.ts` — single source of truth for all project data.
- `src/data/servicesData.ts` — single source of truth for Services accordion (7 categories, 31 services).

### Home Page Section Order
`Hero → SectionDivider → Services → Crew → Projects → Showreel → About → Contact`

### File Structure
- `src/app/components/` — all shared UI components
- `src/app/pages/` — route-level pages (Home, ProjectsArchive, ProjectDetail)
- `src/lib/` — `cn()` utility, `useReducedMotion` hook, `constants.ts`

---

## Animation Rules
- **Always** check `useReducedMotion()` before any GSAP or Lenis animation.
- GSAP + ScrollTrigger = scroll-driven animations only.
- Motion (`motion/react`) = component entrance fades, AnimatePresence, accordion. Never for scroll-driven effects.
- Do not add extra `ScrollTrigger.refresh()` calls. App handles this 400ms after route transitions.
- **Exception:** `ScrollTrigger.refresh(true)` at end of `gsap.context()` in `Showreel.tsx` is intentional — do not remove.

---

## Styling Rules
- Dark-only site. `<html class="dark">`. No light mode. Ever.
- Brand accent: `#8C0B0C` — use as direct hex only (`text-[#8C0B0C]`, `bg-[#8C0B0C]/10`). Never convert to a CSS variable.
- Fonts: Inter, JetBrains Mono, Montserrat, Barlow Condensed — loaded via Google Fonts in `index.html`.
- Tailwind utilities only. No new custom CSS unless absolutely necessary.
- All UI chrome (Navbar, Footer, CustomCursor, ScrollProgress) must stay wrapped in `<ErrorBoundary fallback={null}>`.

---

## Banned Words (Copy/Content)
Never use these words anywhere in UI copy or comments:
cutting-edge, innovative, seamless, leverage, delve, elevate
