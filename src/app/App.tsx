import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { Preloader } from "./components/Preloader";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { FilmGrain } from "./components/FilmGrain";
import { Footer } from "./components/Footer";
import { Showreel } from "./components/Showreel";
import { Departments } from "./components/Departments";
import { Projects } from "./components/Projects";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
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

    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const refreshId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshId);
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, [loading]);

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
          </main>
          <Footer />
        </ErrorBoundary>
      )}
    </div>
  );
}