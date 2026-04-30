# CLAUDE.md
VFX company portfolio & showcase site. Conversion-focused, visually heavy, dark aesthetic.
Built with React + GSAP + Three.js. Deployed on Netlify (migrated from Vercel).

---

## Recent Major Changes
- **Services section** — accordion of 7 VFX service categories on the Home page (`#services` anchor), not a standalone route
- **Crew section** — separate team grid component (`Crew.tsx`) with 5 crew members, rendered below Services on the Home page
- **Showreel section** — fullscreen ScrollTrigger pin with scrub, magnetic button, and video modal
- **Contact form** — added with react-hook-form; no backend yet
- **ShaderBackground** — Three.js Perlin/simplex noise shader with mouse tracking and IntersectionObserver pause-when-offscreen
- **SectionDivider** — decorative inter-section divider component
- **char-reveal animation** — standardised GSAP stagger heading reveal used across all sections
- **lucide-react** — added as icon library (used in Navbar, Hero, Footer, Contact, PreviewNotice)

---

## Current Status
- [x] Hero section
- [x] About section
- [x] Projects grid
- [x] Navigation fixes
- [x] Services section (accordion of VFX categories on Home page at `#services`; no standalone route)
- [x] Crew section (team grid on Home page)
- [x] Showreel section (fullscreen pin + Vimeo modal)
- [x] Contact form — frontend complete (react-hook-form; no backend yet)
- [x] Real project data — 7 real projects with client, year, and award data
- [ ] Contact form backend (currently simulates submit with 1.5s delay, no API call)
- [ ] Remaining placeholder content (images, copy in some sections)

---

## Commands
```bash
pnpm dev      # Start dev server (Vite)
pnpm build    # Production build → dist/
```
No test runner. No lint script. TypeScript strict mode is the primary safety net.

---

## Tech Stack
- React 18 + TypeScript (strict) via Vite 6
- Tailwind CSS 4 — CSS-first, `@theme inline` in `src/styles/theme.css`. No `tailwind.config.js`
- GSAP + ScrollTrigger — scroll-driven animations
- Lenis — smooth scroll, integrated into GSAP's RAF ticker
- Motion (`motion/react`) — navbar, mobile menu, modal AnimatePresence, Services accordion expand/collapse, PreviewNotice entrance/exit, one-shot entrance fades
- Three.js — WebGL shader background (`ShaderBackground.tsx`; Perlin/simplex noise, mouse tracking)
- React Router DOM v7
- lucide-react — icon library
- react-hook-form — form state (Contact form)
- pnpm (flat lockfile with overrides)
- sharp — devDependency for image processing in the build pipeline

---

## Architecture

### Routing
`src/main.tsx` → BrowserRouter. `src/app/App.tsx` owns: Lenis instance, GSAP ScrollTrigger lifecycle, 700ms page transition overlay, cross-route scroll logic, and Preloader (first `/` visit only).

Routes: `/` → Home | `/projects` → ProjectsArchive | `/projects/:id` → ProjectDetail

`ProjectsArchive` and `ProjectDetail` are lazy-loaded via `React.lazy()` wrapped in `<Suspense fallback={null}>`.

### Navigation & Scroll
Navbar uses `navigate(path, { state: { scrollTo: sectionId, _nonce: Date.now() } })`.
**Do not refactor or simplify this pattern.** The nonce and 3-pass correction (0ms / 400ms / 800ms) are intentional — they handle GSAP pin-spacer settling timing.

### Data
`src/data/projects.ts` is the single source of truth for all project data. To add a project, append to the `Project[]` array — no other file needs changing.
Helpers: `getProjectBySlug(slug)`, `getFeaturedProjects()` (returns all projects).

`src/data/servicesData.ts` is the single source of truth for `Services.tsx` — 7 categories, 31 individual services. To add a service, append to the relevant category's `services[]` array.

### File Structure
- `src/app/components/` — shared UI:
  - `Hero`, `Navbar`, `Footer`, `About`, `Projects` — core sections
  - `Services` — accordion of 7 VFX service categories (Home page, `#services`)
  - `Crew` — 5-member team grid (Home page, rendered below Services)
  - `Showreel` — fullscreen pin section with video modal and magnetic button
  - `Contact` — contact form (react-hook-form; frontend only)
  - `ShaderBackground` — Three.js WebGL shader, lazy-loaded inside Hero
  - `SectionDivider` — decorative inter-section divider
  - `PreviewNotice` — "Coming Soon" modal, used by Footer
  - `Preloader`, `CustomCursor`, `ScrollProgress`, `ErrorBoundary` — UI chrome
  - `figma/ImageWithFallback` — image with graceful error fallback
- `src/app/pages/` — route-level pages (Home, ProjectsArchive, ProjectDetail)
  - Home.tsx renders: `Hero → SectionDivider → Services → Crew → Projects → Showreel → About → Contact`
- `src/lib/` — `cn()` utility (clsx + tailwind-merge), `useReducedMotion` hook, `constants.ts` (magneticHandlers WeakMap)

Always use `cn()` from `src/lib/utils.ts` for conditional classes. Use `@/` alias for all imports.

---

## Animation Rules
- **Always** check `useReducedMotion()` before any GSAP or Lenis animation. When true: skip smooth scroll init, skip intro animations.
- GSAP + ScrollTrigger = scroll-driven animations. Motion (`motion/react`) = navbar visibility, mobile menu `AnimatePresence`, modal `AnimatePresence`, Services accordion expand/collapse, and one-shot entrance fades. Don't use Motion for scroll-driven effects.
- Don't add extra `ScrollTrigger.refresh()` calls — App handles this automatically 400ms after route transitions. **Exception:** the `ScrollTrigger.refresh(true)` at the end of the `gsap.context()` in `Showreel.tsx` is intentional and must not be removed — pin-spacer injection changes document height and requires an immediate hard recalculate that the App's 400ms deferred refresh cannot cover.
- All UI chrome (Navbar, Footer, CustomCursor, ScrollProgress) must be wrapped in `<ErrorBoundary fallback={null}>`. Keep this pattern for any new chrome.

### Established Animation Patterns
- **char-reveal** — standard heading reveal: GSAP `fromTo` on `.char-reveal` spans, stagger 0.03–0.04s, `ease: "power4.out"`, triggered by `ScrollTrigger` `toggleActions`. Used in Hero, About, Services, Contact, Footer, Projects.
- **word scrub** — body text reveal: per-word opacity driven by `ScrollTrigger scrub: 1`. Used in About.
- **stat counter** — numeric count-up via GSAP object interpolation with `onUpdate`; `once: true`. Used in About.
- **fullscreen pin + scrub** — `ScrollTrigger pin: true, scrub: true` with scale/clip-path. Used in Showreel.
- **magnetic button** — GSAP `quickTo` cursor follow; bounding rect cached on `mouseenter` to avoid layout thrash. Used in Showreel.
- **staggered card entrance** — `gsap.fromTo` opacity/y with 0.15s stagger (desktop only). Includes a 3s safety timeout (`gsap.set`) that forces visibility if ScrollTrigger fails to fire. Used in Projects, ProjectsArchive.
- **accordion expand/collapse** — motion/react `AnimatePresence` with height + opacity transitions on panel mount/unmount. Used in Services.
- **preloader timeline** — GSAP master timeline: percentage counter, progress bar glow, text lines, logo reveal, split-curtain exit (~4.4s). Calls `onComplete()` immediately when `useReducedMotion()` is true. Used in Preloader.

---

## Styling Rules
- Dark-only site. `<html class="dark">`. No light mode.
- Brand accent: `#8C0B0C` — use as direct hex or Tailwind bracket notation (`text-[#8C0B0C]`, `bg-[#8C0B0C]/10`). Never convert to a named CSS variable.
- Fonts: Inter (sans), JetBrains Mono (mono), Montserrat (display/navbar), Barlow Condensed (weights 300, 700) — loaded via Google Fonts in `index.html`.
- Custom properties live in `src/styles/theme.css`.
- Tailwind utilities only. No new custom CSS unless absolutely necessary.

---

## Behaviour Rules
- Read existing files before writing any code.
- Prefer editing over rewriting whole files.
- Do not re-read files already read in the session.
- Be concise in output. No sycophantic openers or closing fluff.
- Keep solutions simple and direct — no over-engineering.
- When unsure about intent, ask one short clarifying question before proceeding.
- User instructions always override this file.

---

## Do Not Touch Without Being Asked
- Lenis init and GSAP ticker integration in `App.tsx`
- Scroll-to-section logic and nonce pattern in Navbar
- Vendor chunk splitting in `vite.config.ts`
- `chunkSizeWarningLimit` (raised intentionally for Three.js)
- `.env` — never read, edit, or commit secrets