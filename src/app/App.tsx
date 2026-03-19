import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
  const isHomeRoute = location.pathname === "/";
  const [loading, setLoading] = useState(
    () => !prefersReducedMotion && isHomeRoute
  );
  const lenisRef = useRef<Lenis | null>(null);

  // Scroll reset on route change — runs synchronously before paint
  useLayoutEffect(() => {
    // Force scroll to top on every route change
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Reset Lenis smooth scroll position
    if (lenisRef.current) {
      lenisRef.current.stop();
      lenisRef.current.scrollTo(0, { immediate: true });
      lenisRef.current.start();
    }

    // Refresh ScrollTrigger after new page's useLayoutEffect hooks have registered their triggers
    const refreshId = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 250);

    return () => clearTimeout(refreshId);
  }, [location.pathname]);

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



  useEffect(() => {
    if (loading || !location.hash) return;

    // Wait 400ms so ScrollTrigger.refresh(true) at 250ms has finished
    // rebuilding pin-spacers — otherwise section offsets are wrong
    const id = setTimeout(() => {
      ScrollTrigger.refresh();
      const sectionId = location.hash.slice(1);
      const target = document.getElementById(sectionId);
      if (!target) return;

      // The showreel section uses pin:true which wraps it in a pin-spacer.
      // We need to scroll to the pin trigger's start position, not the
      // element's raw offsetTop, to land at the *beginning* of the section.
      const showreelTrigger =
        sectionId === "showreel"
          ? ScrollTrigger.getAll().find(
              (st) =>
                st.pin &&
                st.trigger instanceof HTMLElement &&
                st.trigger.id === "showreel"
            )
          : null;

      // Compute the real scroll position via getBoundingClientRect which
      // correctly accounts for any pin-spacer height injected by ScrollTrigger
      const navOffset = 80;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const targetTop = target.getBoundingClientRect().top + scrollY - navOffset;

      if (lenisRef.current && !prefersReducedMotion) {
        if (showreelTrigger) {
          lenisRef.current.scrollTo(showreelTrigger.start, { duration: 1.1 });
        } else {
          lenisRef.current.scrollTo(targetTop, { duration: 1.1 });
        }
      } else {
        if (showreelTrigger) {
          window.scrollTo({ top: showreelTrigger.start, behavior: "auto" });
        } else {
          window.scrollTo({ top: targetTop, behavior: "auto" });
        }
      }
    }, 400);

    return () => clearTimeout(id);
  }, [loading, location.hash, location.pathname, prefersReducedMotion]);

  return (
    <div className="bg-black text-white min-h-screen w-full selection:bg-[#8C0B0C] selection:text-white md:cursor-none overflow-x-hidden" style={{ fontFamily: "var(--font-family-sans)" }}>
      
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
