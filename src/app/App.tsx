import React, { useEffect, useState, Suspense, lazy } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { Preloader } from "./components/Preloader";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { FilmGrain } from "./components/FilmGrain";
const Footer = lazy(() => import("./components/Footer").then(m => ({ default: m.Footer })));
const Showreel = lazy(() => import("./components/Showreel").then(m => ({ default: m.Showreel })));
const Departments = lazy(() => import("./components/Departments").then(m => ({ default: m.Departments })));
const Projects = lazy(() => import("./components/Projects").then(m => ({ default: m.Projects })));
const About = lazy(() => import("./components/About").then(m => ({ default: m.About })));
const Contact = lazy(() => import("./components/Contact").then(m => ({ default: m.Contact })));
import { CustomCursor } from "./components/CustomCursor";
import { ScrollProgress } from "./components/ScrollProgress";
import { SectionDivider } from "./components/SectionDivider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useReducedMotion } from "../lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

// Removed lenisEasing

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(() => !prefersReducedMotion);

  useEffect(() => {
    if (loading) return;

    // Always refresh ScrollTrigger calculations after the preloader exits
    const refreshId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // Skip smooth scrolling for users who prefer reduced motion
    if (prefersReducedMotion) {
      return () => clearTimeout(refreshId);
    }

    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      clearTimeout(refreshId);
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, [loading, prefersReducedMotion]);

  return (
    <div className="bg-black text-white min-h-screen selection:bg-[#8C0B0C] selection:text-white md:cursor-none overflow-x-hidden" style={{ fontFamily: "var(--font-family-sans)" }}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-6 focus:left-6 focus:z-[200] focus:px-6 focus:py-3 focus:bg-black/90 focus:border focus:border-[#8C0B0C]/50 focus:text-white focus:rounded-full focus:text-[11px] focus:font-bold focus:uppercase focus:tracking-[0.2em] focus:shadow-[0_0_15px_rgba(140,11,12,0.3)] focus:outline-none focus:ring-1 focus:ring-[#8C0B0C]/30 focus:backdrop-blur-md transition-all">Skip to content</a>
      <FilmGrain />
      {loading ? (
        <Preloader onComplete={() => setLoading(false)} />
      ) : (
        <ErrorBoundary>
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          <main id="main-content">
            <Hero />
            <Suspense fallback={null}>
              <SectionDivider />
              <Showreel />
              <SectionDivider />
              <Departments />
              <SectionDivider />
              <Projects />
              <SectionDivider />
              <About />
              <SectionDivider />
              <Contact />
            </Suspense>
          </main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}