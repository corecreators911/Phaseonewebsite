import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { Preloader } from "./components/Preloader";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Footer } from "./components/Footer";
import { CustomCursor } from "./components/CustomCursor";
import { ScrollProgress } from "./components/ScrollProgress";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useReducedMotion } from "../lib/useReducedMotion";

// Static imports to prevent Vite dev-server chunk load errors on first navigation
import { ProjectsArchive } from "./pages/ProjectsArchive";
import { ProjectDetail } from "./pages/ProjectDetail";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const location = useLocation();
  const isHomeRoute = location.pathname === "/";
  const [loading, setLoading] = useState(
    () => !prefersReducedMotion && isHomeRoute
  );
  const lenisRef = useRef<Lenis | null>(null);
  const prevPathnameRef = useRef(location.pathname);
  // Flag set by useLayoutEffect (runs first), read by useEffect (runs second)
  const isCrossRouteRef = useRef(false);
  // Tracks which _nonce has already been processed to prevent self-cancellation
  const processedNonceRef = useRef<number | null>(null);

  const [showBlackScreen, setShowBlackScreen] = useState(false);
  const routeTimerRef = useRef<NodeJS.Timeout>();
  const refreshTimerRef = useRef<NodeJS.Timeout>();
  const safetyTimerRef = useRef<NodeJS.Timeout>();

  // Clear all outstanding timers on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (routeTimerRef.current) clearTimeout(routeTimerRef.current);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  }, []);

  // Scroll restoration to manual and force scroll top on initial mount
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Scroll reset on route change — runs synchronously before paint.
  useLayoutEffect(() => {
    const isRouteChange = prevPathnameRef.current !== location.pathname;
    const hasSection = !!(location.state as any)?.scrollTo;
    prevPathnameRef.current = location.pathname;
    isCrossRouteRef.current = isRouteChange;

    if (isRouteChange) {
      // Show black screen on every route change immediately without transition
      setShowBlackScreen(true);
      if (routeTimerRef.current) clearTimeout(routeTimerRef.current);
      routeTimerRef.current = setTimeout(() => {
        setShowBlackScreen(false);
      }, 700);

      // Safety: force-dismiss overlay if it somehow gets stuck
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = setTimeout(() => {
        setShowBlackScreen(false);
      }, 1500);

      if (!hasSection) {
        // No hash — normal scroll reset to top
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
        }
      }

      // Refresh ScrollTrigger after new page mounts
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 400);
    }
  }, [location.pathname, location.state]);

  useEffect(() => {
    if (loading) return;

    const refreshId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    if (prefersReducedMotion) {
      return () => clearTimeout(refreshId);
    }

    const lenis = new Lenis();
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      clearTimeout(refreshId);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [loading, prefersReducedMotion]);



  /** Helper: get the navbar height for scroll offset */
  const getNavOffset = () => {
    const header = document.querySelector("header");
    return header ? header.offsetHeight : 72;
  };

  /** Helper: calculate absolute scroll-Y for a target element */
  const calcTargetY = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const pt = parseInt(getComputedStyle(el).paddingTop, 10) || 0;
    return Math.max(0, rect.top + scrollY - getNavOffset() + pt);
  };

  useEffect(() => {
    const scrollTo = (location.state as any)?.scrollTo;
    if (loading || !scrollTo) return;

    // Guard with nonce to prevent re-processing the same scroll request.
    // Using a ref instead of navigate(replace) avoids triggering a re-render
    // that would cause this effect's own cleanup to cancel pending timers.
    const nonce = (location.state as any)?._nonce ?? 0;
    if (processedNonceRef.current === nonce) return;
    processedNonceRef.current = nonce;

    const sectionId = scrollTo;
    const isCrossRoute = isCrossRouteRef.current;
    let cancelled = false;
    let attempts = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const checkAndScroll = () => {
      if (cancelled) return;

      const target = document.getElementById(sectionId);
      if (!target) {
        if (attempts < 30) {
          attempts++;
          timers.push(setTimeout(checkAndScroll, 100));
        }
        return;
      }

      if (isCrossRoute) {
        // Cross-route: wait until after the 700ms black screen AND the 400ms
        // ScrollTrigger.refresh() have both completed. At 850ms GSAP pin-spacers
        // are guaranteed settled so calcTargetY returns the correct position.
        timers.push(setTimeout(() => {
          if (cancelled) return;
          const fresh = document.getElementById(sectionId);
          if (!fresh) return;
          ScrollTrigger.refresh(true);
          requestAnimationFrame(() => {
            if (cancelled) return;
            const targetY = calcTargetY(fresh);
            if (lenisRef.current) {
              lenisRef.current.scrollTo(targetY, { immediate: true });
            } else {
              window.scrollTo({ top: targetY, behavior: "instant" });
            }
          });
        }, 850));
      } else {
        // Same-route: smooth scroll with Lenis.
        const pt = parseInt(getComputedStyle(target).paddingTop, 10) || 0;
        const offset = -getNavOffset() + pt;
        if (lenisRef.current && !prefersReducedMotion) {
          lenisRef.current.scrollTo(target, { offset, duration: 1.2 });
        } else {
          const targetY = calcTargetY(target);
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
      }
    };

    checkAndScroll();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [loading, location.state, location.pathname, prefersReducedMotion]);

  return (
    <div className="bg-black text-white min-h-screen w-full selection:bg-[#8C0B0C] selection:text-white md:cursor-none overflow-x-hidden" style={{ fontFamily: "var(--font-family-sans)" }}>
      {/* Page Transition Overlay */}
      <div 
        className={`fixed inset-0 z-[9999] bg-black pointer-events-none ${
          showBlackScreen ? "opacity-100 transition-none" : "opacity-0 transition-opacity duration-[800ms] ease-in-out"
        }`} 
      />
      
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-6 focus:left-6 focus:z-[200] focus:px-6 focus:py-3 focus:bg-black/90 focus:border focus:border-[#8C0B0C]/50 focus:text-white focus:rounded-full focus:text-[11px] focus:font-bold focus:uppercase focus:tracking-[0.2em] focus:shadow-[0_0_15px_rgba(140,11,12,0.3)] focus:outline-none focus:ring-1 focus:ring-[#8C0B0C]/30 focus:backdrop-blur-md transition-all">Skip to content</a>
      {loading ? (
        <Preloader onComplete={() => setLoading(false)} />
      ) : (
        <>
          <ErrorBoundary fallback={null} resetKey={location.pathname}>
            <CustomCursor />
          </ErrorBoundary>
          <ErrorBoundary fallback={null} resetKey={location.pathname}>
            <ScrollProgress />
          </ErrorBoundary>
          <ErrorBoundary fallback={null} resetKey={location.pathname}>
            <Navbar />
          </ErrorBoundary>
          <main id="main-content">
            <ErrorBoundary
              resetKey={`${location.pathname}${location.search}`}
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-black text-neutral-500 text-sm font-mono">
                  Something went wrong. Please refresh the page.
                </div>
              }
            >
              <Routes>
                <Route index element={<Home />} />
                <Route path="projects" element={<ProjectsArchive />} />
                <Route path="projects/:id" element={<ProjectDetail />} />
              </Routes>
            </ErrorBoundary>
          </main>
          <ErrorBoundary fallback={null} resetKey={location.pathname}>
            <Footer />
          </ErrorBoundary>
        </>
      )}
    </div>
  );
}
