import React, { useEffect, useRef, Suspense, lazy } from "react";
import gsap from "gsap";
const ShaderBackground = lazy(() => import("./ShaderBackground").then(m => ({ default: m.ShaderBackground })));
import { ArrowDownRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";

const CRAFTING_CHARS = "CRAFTING".split("");
const LINE2_CHARS = "THE UNREAL".split("");

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Character-by-character stagger reveal — line 1 flows into line 2 seamlessly
      gsap.fromTo(
        ".hero-char",
        { y: "115%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1.5,
          stagger: 0.042,
          ease: "power4.out",
          delay: 0.5,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const avatars = [
    "https://images.unsplash.com/photo-1770896687186-895de50a4123?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBwb3J0cmFpdCUyMGRhcmslMjBwcm9maWxlfGVufDF8fHx8MTc3Mjk1NDEzOXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1630916079851-de145947bde3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBwb3J0cmFpdCUyMG5lb24lMjByZWR8ZW58MXx8fHwxNzcyOTU0MTQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1661613795419-8f7506266076?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBmYWNlJTIwZGFyayUyMGRyYW1hdGljfGVufDF8fHx8MTc3Mjk1NDE0N3ww&ixlib=rb-4.1.0&q=80&w=1080"
  ];

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Dynamic Background */}
      <Suspense fallback={null}>
        <ShaderBackground />
      </Suspense>

      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')" }} />

      {/* Parallax Grid Lines */}
      <div className="hidden md:block absolute inset-0 pointer-events-none z-0 opacity-[0.03]">
        <div className="absolute left-[10%] top-0 bottom-0 w-[1px] bg-white" />
        <div className="absolute right-[10%] top-0 bottom-0 w-[1px] bg-white" />
        <div className="absolute top-[20%] left-0 right-0 h-[1px] bg-white" />
        <div className="absolute bottom-[20%] left-0 right-0 h-[1px] bg-white" />
      </div>

      {/* Floating HUD / Overlay UI */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
        className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-end md:justify-between p-4 sm:p-6 md:p-12 pb-[10vh] md:pb-12"
      >
        {/* Top UI */}
        <div className="hidden md:flex justify-between items-start pt-32 w-full px-4 md:px-[5%]">
          <div className="flex flex-col gap-1.5 overflow-hidden">
            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-mono text-neutral-500 uppercase tracking-[0.2em] sm:tracking-[0.3em]">SYS_RENDER_001</span>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-mono text-[#8C0B0C] uppercase tracking-[0.15em] sm:tracking-[0.2em]">LND // LAX // NY</span>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-mono text-neutral-500 uppercase tracking-[0.2em] sm:tracking-[0.3em]">EST. 2018</span>
            <div className="flex gap-1.5 mt-1">
              <span className="h-1 w-4 bg-[#8C0B0C] rounded-full animate-pulse" />
              <span className="h-1 w-1 bg-neutral-700 rounded-full" />
              <span className="h-1 w-1 bg-neutral-700 rounded-full" />
            </div>
          </div>
        </div>

        {/* Bottom UI */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end w-full px-4 md:px-[5%] pb-6 sm:pb-8 gap-6 sm:gap-10 md:gap-0 pointer-events-auto">

          {/* Avatar Cluster & Trust Layer */}
          <div className="flex items-center gap-3 sm:gap-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1.5 sm:p-2 pr-5 sm:pr-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-colors hover:border-white/20 hover:bg-white/10 max-w-[95vw]">
            <div className="flex -space-x-2.5 sm:-space-x-3">
              {avatars.map((avatar, i) => {
                const names = ["Team member portrait", "Creative director portrait", "VFX artist portrait"];
                return (
                  <div key={i} className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full overflow-hidden border border-white/20 shadow-lg relative group cursor-pointer">
                    <ImageWithFallback src={avatar} alt={names[i]} className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110" loading="eager" decoding="sync" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                );
              })}
              <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full border border-white/20 bg-black/80 flex items-center justify-center relative z-10 shadow-lg">
                <span className="text-[8px] sm:text-[10px] md:text-xs font-bold text-white tracking-tighter">+2K</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white">Trusted By</span>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] font-mono text-[#8C0B0C] uppercase tracking-wider sm:tracking-widest mt-0.5">Industry Leaders</span>
            </div>
          </div>

          {/* Scroll Indicator */}
          <a href="#showreel" className="group flex flex-col md:flex-row items-center gap-3 sm:gap-4 cursor-pointer">
            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-mono text-neutral-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] group-hover:text-white transition-colors duration-300">
              Scroll to explore
            </span>
            <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center group-hover:border-[#8C0B0C]/60 group-hover:bg-[#8C0B0C]/10 group-hover:shadow-[0_0_25px_rgba(140,11,12,0.3)] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]">
              <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 group-hover:text-[#8C0B0C] transition-colors duration-300 group-hover:scale-110" />
            </div>
          </a>
        </div>
      </motion.div>

      {/* Main Cinematic Text — character-by-character curtain reveal */}
      <h1 className="relative z-10 flex flex-col items-center w-full px-2 sm:px-4 mix-blend-plus-lighter pointer-events-none select-none">

        {/* Screen reader text for SEO */}
        <span className="sr-only">CRAFTING THE UNREAL.</span>

        {/* Line 1: CRAFTING — outlined ghost type */}
        <div className="flex text-[13vw] sm:text-[15vw] md:text-[11.5vw] font-black tracking-tighter" aria-hidden="true">
          {CRAFTING_CHARS.map((char, i) => (
            <span key={i} className="overflow-hidden inline-block" style={{ lineHeight: 0.92 }}>
              <span
                className="hero-char inline-block transform-gpu text-transparent"
                style={{
                  WebkitTextStroke: "1px rgba(255,255,255,0.38)",
                  lineHeight: 0.92,
                  opacity: 0,
                }}
              >
                {char}
              </span>
            </span>
          ))}
        </div>

        {/* Line 2: THE UNREAL. — solid white + red accent dot */}
        <div className="flex text-[13vw] sm:text-[15vw] md:text-[11.5vw] font-black tracking-tighter" aria-hidden="true">
          {LINE2_CHARS.map((char, i) => {
            if (char === " ") {
              return (
                <span
                  key={i}
                  className="inline-block"
                  style={{ width: "0.18em", lineHeight: 0.92 }}
                />
              );
            }
            return (
              <span key={i} className="overflow-hidden inline-block" style={{ lineHeight: 0.92 }}>
                <span
                  className="hero-char inline-block transform-gpu text-white drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                  style={{ lineHeight: 0.92, opacity: 0 }}
                >
                  {char}
                </span>
              </span>
            );
          })}
          {/* Crimson dot */}
          <span className="overflow-hidden inline-block" style={{ lineHeight: 0.92 }}>
            <span
              className="hero-char inline-block transform-gpu text-[#8C0B0C] drop-shadow-[0_0_40px_rgba(140,11,12,0.8)]"
              style={{ lineHeight: 0.92, opacity: 0 }}
            >
              .
            </span>
          </span>
        </div>
      </h1>

      {/* "Visual Effects & Motion" badge — reliably below text, never overlapping */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
        className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        style={{ top: "calc(50% + 12vw)" }}
      >
        <div className="flex items-center gap-2 sm:gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-3 sm:px-5 py-1.5 sm:py-2 shadow-2xl">
          <div className="h-1.5 w-1.5 rounded-full bg-[#8C0B0C] animate-pulse shadow-[0_0_10px_rgba(140,11,12,1)]" />
          <p className="text-[8px] sm:text-[9px] md:text-[10px] font-mono tracking-[0.15em] sm:tracking-[0.25em] text-white uppercase font-medium">
            Visual Effects & Motion
          </p>
        </div>
      </motion.div>

    </section>
  );
};
