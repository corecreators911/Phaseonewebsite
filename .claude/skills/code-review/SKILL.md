---
name: code-review
description: Review code for quality, correctness, and consistency before considering any task done. Use this skill when the user asks to review, check, audit, or QA any code changes — or invoke it automatically before declaring a task complete.
---

This skill reviews code written for this React + TypeScript + GSAP + Lenis + Three.js project. The goal is catching bugs, inconsistencies, and regressions before they reach the client.

## When to Invoke
- Before declaring any task complete
- After writing a new component or section
- After refactoring existing code
- When the user says "review this", "check this", "looks good?"

## Review Checklist

### Correctness
- [ ] Does the code actually do what was asked?
- [ ] Are there any TypeScript errors or `any` types introduced?
- [ ] Are all `useEffect` dependencies arrays correct and complete?
- [ ] Are there any potential null/undefined runtime errors?

### Animation Safety
- [ ] Is `useReducedMotion()` checked before any GSAP or Lenis animation?
- [ ] Are GSAP contexts or timelines cleaned up on unmount?
- [ ] Is Three.js renderer and animation loop disposed on unmount?
- [ ] Are there any duplicate `ScrollTrigger.refresh()` calls added?
- [ ] Has the Lenis + GSAP ticker integration in `App.tsx` been left untouched?
- [ ] Has the scroll-to-section nonce pattern in Navbar been left untouched?

### Conventions
- [ ] Is `cn()` from `src/lib/utils.ts` used for all conditional class merging?
- [ ] Are all imports using the `@/` alias?
- [ ] Are components functional with hooks (no class components)?
- [ ] Is `#8C0B0C` used directly as hex/inline — not converted to a Tailwind variable?
- [ ] Is the site still dark-only? No light mode styles added?
- [ ] Are new UI chrome elements wrapped in `<ErrorBoundary fallback={null}>`?

### Data & Structure
- [ ] If project data was changed, was it only in `src/data/projects.ts`?
- [ ] Are new components placed in the correct folder (`components/` vs `pages/`)?

### Security & Safety
- [ ] No `.env` variables exposed or logged to console?
- [ ] No `console.log` statements left in production-bound code?
- [ ] No hardcoded sensitive values (API keys, tokens)?

### Copy & Content
- [ ] Does any new copy match the tone? (Cinematic, confident, minimal)
- [ ] Are banned words avoided? (cutting-edge, innovative, seamless, leverage, delve, elevate)
- [ ] Are CTAs action-first and direct?

## Output Format
Report as:
- ✅ Looks good: [what passed]
- ⚠️ Minor issue: [what + one-line fix]
- ❌ Fix required: [what + why + how to fix]

Be direct. No padding. If everything passes, say so in one line and move on.