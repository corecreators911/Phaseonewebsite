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

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after a short delay to ensure layout is ready
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, [loading]);

  return (
    <div className="bg-black text-white min-h-screen selection:bg-[#8C0B0C] selection:text-white cursor-none md:cursor-none" style={{ fontFamily: "var(--font-family-sans)" }}>
      <FilmGrain />
      {loading ? (
        <Preloader onComplete={() => setLoading(false)} />
      ) : (
        <>
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          <main>
            <Hero />
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
        </>
      )}
    </div>
  );
}