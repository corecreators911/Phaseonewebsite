# CLAUDE.md
VFX company portfolio & showcase site. Conversion-focused, visually heavy, dark aesthetic.
Built with React + GSAP + Three.js. Deployed on Vercel.

---

## Current Status
- [x] Hero section
- [x] About section
- [x] Projects grid
- [x] Navigation fixes
- [ ] Services page
- [ ] Real client data swap (placeholders still in most sections)

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
- Motion (`motion/react`) — component-level animations only
- Three.js — WebGL shader background
- React Router DOM v7
- pnpm (flat lockfile with overrides)

---

## Architecture

### Routing
`src/main.tsx` → BrowserRouter. `src/app/App.tsx` owns: Lenis instance, GSAP ScrollTrigger lifecycle, 700ms page transition overlay, cross-route scroll logic, and Preloader (first `/` visit only).

Routes: `/` → Home | `/projects` → ProjectsArchive | `/projects/:id` → ProjectDetail

### Navigation & Scroll
Navbar uses `navigate(path, { state: { scrollTo: sectionId, _nonce: Date.now() } })`.
**Do not refactor or simplify this pattern.** The nonce and 3-pass correction (0ms / 400ms / 800ms) are intentional — they handle GSAP pin-spacer settling timing.

### Data
`src/data/projects.ts` is the single source of truth for all project data. To add a project, append to the `Project[]` array — no other file needs changing.
Helpers: `getProjectBySlug(slug)`, `getFeaturedProjects()` (first 4 items).

### File Structure
- `src/app/components/` — shared UI (Hero, Navbar, Footer, etc.)
- `src/app/pages/` — route-level pages
- `src/lib/` — `cn()` utility (clsx + tailwind-merge), `useReducedMotion` hook

Always use `cn()` from `src/lib/utils.ts` for conditional classes. Use `@/` alias for all imports.

---

## Animation Rules
- **Always** check `useReducedMotion()` before any GSAP or Lenis animation. When true: skip smooth scroll init, skip intro animations.
- GSAP + ScrollTrigger = scroll-driven animations. Motion (`motion/react`) = navbar visibility + mobile menu (`AnimatePresence`) only. Don't mix these roles.
- Don't add extra `ScrollTrigger.refresh()` calls — App handles this automatically 400ms after route transitions.
- All UI chrome (Navbar, Footer, CustomCursor, ScrollProgress) must be wrapped in `<ErrorBoundary fallback={null}>`. Keep this pattern for any new chrome.

---

## Styling Rules
- Dark-only site. `<html class="dark">`. No light mode.
- Brand accent: `#8C0B0C` — use as inline style or direct hex. Do not convert to a Tailwind variable.
- Fonts: Inter (sans), JetBrains Mono (mono) — loaded via Google Fonts in `index.html`.
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