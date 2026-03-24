import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { Preloader } from "./components/Preloader";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { FilmGrain } from "./components/FilmGrain";
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
  const navigate = useNavigate();
  const isHomeRoute = location.pathname === "/";
  const [loading, setLoading] = useState(
    () => !prefersReducedMotion && isHomeRoute
  );
  const lenisRef = useRef<Lenis | null>(null);
  const prevPathnameRef = useRef(location.pathname);
  // Flag set by useLayoutEffect (runs first), read by useEffect (runs second)
  const isCrossRouteRef = useRef(false);

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

  // Clear section param on initial page load / refresh (not on in-app navigation)
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    const params = new URLSearchParams(location.search);
    if (params.has("section")) {
      navigate(location.pathname, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll reset on route change — runs synchronously before paint.
  useLayoutEffect(() => {
    const isRouteChange = prevPathnameRef.current !== location.pathname;
    const sectionParam = new URLSearchParams(location.search).get("section");
    const hasSection = !!sectionParam;
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
  }, [location.pathname, location.search]);

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
    return header ? header.offsetHeight + 8 : 72;
  };

  /** Helper: calculate absolute scroll-Y for a target element */
  const calcTargetY = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    return Math.max(0, rect.top + scrollY - getNavOffset());
  };

  // Section-based scroll: handles both same-route and cross-route transitions.
  useEffect(() => {
    const sectionParam = new URLSearchParams(location.search).get("section");
    if (loading || !sectionParam) return;

    const sectionId = sectionParam;
    const isCrossRoute = isCrossRouteRef.current;
    let cancelled = false;
    let attempts = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const scrollToTarget = (target: HTMLElement, immediate: boolean) => {
      ScrollTrigger.refresh(true);
      const targetY = calcTargetY(target);
      window.scrollTo({ top: targetY, behavior: "instant" });
      if (lenisRef.current) {
        lenisRef.current.scrollTo(targetY, { immediate: true });
      }
    };

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
        // Cross-route: page is rendering under the black overlay (700ms).
        // Wait for GSAP pin-spacers to initialize, then scroll once.
        // Initial scroll immediately (rough position)
        scrollToTarget(target, true);

        // Correction after GSAP pin-spacers are set up (~400ms)
        timers.push(setTimeout(() => {
          if (cancelled) return;
          scrollToTarget(target, true);
        }, 400));

        // Final correction after black screen fades (~750ms)
        timers.push(setTimeout(() => {
          if (cancelled) return;
          scrollToTarget(target, true);
        }, 750));
      } else {
        // Same-route: Smooth scroll.
        const offset = -getNavOffset();
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
  }, [loading, location.search, location.pathname, prefersReducedMotion]);

  return (
    <div className="bg-black text-white min-h-screen w-full selection:bg-[#8C0B0C] selection:text-white md:cursor-none overflow-x-hidden" style={{ fontFamily: "var(--font-family-sans)" }}>
      {/* Page Transition Overlay */}
      <div 
        className={`fixed inset-0 z-[9999] bg-black pointer-events-none ${
          showBlackScreen ? "opacity-100 transition-none" : "opacity-0 transition-opacity duration-[800ms] ease-in-out"
        }`} 
      />
      
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-6 focus:left-6 focus:z-[200] focus:px-6 focus:py-3 focus:bg-black/90 focus:border focus:border-[#8C0B0C]/50 focus:text-white focus:rounded-full focus:text-[11px] focus:font-bold focus:uppercase focus:tracking-[0.2em] focus:shadow-[0_0_15px_rgba(140,11,12,0.3)] focus:outline-none focus:ring-1 focus:ring-[#8C0B0C]/30 focus:backdrop-blur-md transition-all">Skip to content</a>
      <FilmGrain />
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
