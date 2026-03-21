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

  // Scroll restoration to manual and force scroll top on initial mount
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Clear hash on initial load
  useEffect(() => {
    if (window.location.hash) {
      navigate(window.location.pathname, { replace: true });
    }
  }, [navigate]);

  // Scroll reset on route change — runs synchronously before paint.
  // IMPORTANT: When there's a hash in the URL we skip the scroll-to-0
  // because the hash scroll effect handles positioning. Scrolling to 0
  // first would cause a visible flash of the hero section.
  useLayoutEffect(() => {
    const hasHash = !!location.hash;
    const isRouteChange = prevPathnameRef.current !== location.pathname;
    prevPathnameRef.current = location.pathname;
    // Store for the hash scroll useEffect which runs after this
    isCrossRouteRef.current = isRouteChange;

    if (isRouteChange) {
      // Show black screen on every route change immediately without transition
      setShowBlackScreen(true);
      if (routeTimerRef.current) clearTimeout(routeTimerRef.current);
      routeTimerRef.current = setTimeout(() => {
        setShowBlackScreen(false);
      }, 700);

      if (!hasHash) {
        // No hash — normal scroll reset to top
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        if (lenisRef.current) {
          lenisRef.current.stop();
          lenisRef.current.scrollTo(0, { immediate: true });
          
          // Force layout measure before restarting lenis
          requestAnimationFrame(() => {
            if (lenisRef.current) {
              if (typeof lenisRef.current.resize === "function") {
                lenisRef.current.resize();
              }
              lenisRef.current.start();
            }
          });
        }
      } else {
        // Cross-route with hash (e.g. /projects → /#departments):
        // Don't scroll to 0 — leave Lenis stopped so it doesn't interfere.
        // The hash scroll effect will handle positioning.
        if (lenisRef.current) {
          lenisRef.current.stop();
        }
      }

      // Refresh ScrollTrigger after new page's useLayoutEffect hooks have registered their triggers.
      // 400ms gives child components time to mount and register their pin-spacer triggers.
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 400);

      // Removed cleanup function so subsequent re-renders in < 700ms 
      // (like a rapid hash update) do not cancel the black screen dismissal!
    }
  }, [location.pathname, location.hash]);

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



  // Hash-based scroll: handles both same-route hash changes (e.g. scrolling on
  // the home page) and cross-route transitions (e.g. /projects → /#departments).
  //
  // Strategy:
  //   Same-route: Smooth-scroll to the target using Lenis (elements already mounted).
  //   Cross-route: Wait for mount + pin-spacers, instantly jump near the target to
  //               avoid hero flash, then smooth-scroll the final approach.
  useEffect(() => {
    if (loading || !location.hash) return;

    const sectionId = location.hash.slice(1);
    // Read the flag set by useLayoutEffect (which already ran this cycle)
    const isCrossRoute = isCrossRouteRef.current;
    let cancelled = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 30;
    const POLL_INTERVAL = 80;

    const performScroll = () => {
      if (cancelled) return;
      attempts++;

      const target = document.getElementById(sectionId);
      if (!target) {
        if (attempts < MAX_ATTEMPTS) {
          setTimeout(performScroll, POLL_INTERVAL);
        }
        return;
      }

      // Ensure ScrollTrigger positions are up-to-date (pin-spacers measured)
      ScrollTrigger.refresh(true);

      // Double-rAF to guarantee the browser has fully composited after refresh
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled) return;

          const navOffset = 80;
          const rect = target.getBoundingClientRect();
          const scrollY = window.scrollY || document.documentElement.scrollTop;
          const scrollTarget = Math.max(0, rect.top + scrollY - navOffset);

          if (lenisRef.current && !prefersReducedMotion) {
            if (isCrossRoute) {
              // Cross-route: instantly jump to ~200px above the target to avoid
              // showing the hero, then smooth-scroll the last stretch.
              const jumpTo = Math.max(0, scrollTarget - 200);
              window.scrollTo({ top: jumpTo, behavior: "auto" });
              lenisRef.current.scrollTo(jumpTo, { immediate: true });
            }

            // Force layout measure before restarting lenis
            if (typeof lenisRef.current.resize === "function") {
              lenisRef.current.resize();
            }
            // Now smooth-scroll to the exact target position
            lenisRef.current.start();
            lenisRef.current.scrollTo(scrollTarget, {
              duration: isCrossRoute ? 0.8 : 1.2,
            });
          } else {
            // Reduced-motion or no Lenis — instant jump
            window.scrollTo({ top: scrollTarget, behavior: "auto" });
            if (lenisRef.current) {
              lenisRef.current.scrollTo(scrollTarget, { immediate: true });
              if (typeof lenisRef.current.resize === "function") {
                lenisRef.current.resize();
              }
              lenisRef.current.start();
            }
          }
        });
      });
    };

    // Same-route: elements are already mounted, scroll after a short delay
    // Cross-route: wait for mount + pin-spacer layout to stabilize
    const delay = isCrossRoute ? 700 : 100;
    const startTimer = setTimeout(performScroll, delay);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
    };
  }, [loading, location.hash, location.pathname, prefersReducedMotion]);

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
              resetKey={`${location.pathname}${location.hash}`}
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
