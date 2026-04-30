import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ArrowDownRight } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomUIRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Scroll indicator: fades out first — it's done its job
      if (bottomUIRef.current) {
        gsap.to(bottomUIRef.current, {
          opacity: 0,
          y: -24,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "18% top",
            scrub: true,
          },
        });
      }

      // Badge: entrance then scroll-driven fade — GSAP owns this element entirely.
      // immediateRender: false on the scroll tween prevents it from capturing
      // opacity:0 as its "from" before the entrance animation has run.
      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { opacity: 0, scale: 0.9, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, delay: 1.0, ease: "power2.out" }
        );
        gsap.fromTo(
          badgeRef.current,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "22% top",
              scrub: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden bg-black"
      style={{ background: "radial-gradient(ellipse at center, rgba(140,11,12,0.15) 0%, #000000 70%)" }}
    >
      {/* Full-bleed video background */}
      <div
        className="pointer-events-none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "hidden", zIndex: 0 }}
      >
        {/* No filter, scale, or opacity degradation on this element — quality is clean */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        >
          <source src="/hero-reel/hero-reel.webm" type="video/webm" />
          <source src="/hero-reel/hero-reel.mp4" type="video/mp4" />
        </video>
        {/* Dark scrim — keeps HUD elements legible */}
        <div className="absolute inset-0 z-[1]" style={{ background: "rgba(0,0,0,0.08)" }} />
      </div>

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
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
        className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-end p-4 sm:p-6 md:p-12 pb-[10vh] md:pb-12"
      >
        {/* SYS_RENDER_001 — top-left, absolutely positioned to match pill's left offset */}
        <div className="hidden md:flex flex-col gap-1.5 overflow-hidden absolute top-44 left-[5%] z-[2]">
          <span className="text-[9px] sm:text-[10px] md:text-[11px] font-mono text-neutral-500 uppercase tracking-[0.2em] sm:tracking-[0.3em]">SYS_RENDER_001</span>
        </div>

        {/* EST. 2026 — top-right, absolutely positioned to match scroll indicator's right offset */}
        <div className="hidden md:flex flex-col items-end gap-1.5 absolute top-44 right-[5%] z-[2]">
          <span className="text-[9px] sm:text-[10px] md:text-[11px] font-mono text-neutral-500 uppercase tracking-[0.2em] sm:tracking-[0.3em]">EST. 2026</span>
          <div className="flex gap-1.5 mt-1">
            <span className="h-1 w-4 bg-[#8C0B0C] rounded-full animate-pulse" />
            <span className="h-1 w-1 bg-neutral-700 rounded-full" />
            <span className="h-1 w-1 bg-neutral-700 rounded-full" />
          </div>
        </div>

        {/* Bottom UI — scroll indicator, ref'd for scroll-driven fade */}
        <div
          ref={bottomUIRef}
          className="flex flex-col md:flex-row justify-end items-center md:items-end w-full px-4 md:px-[5%] gap-6 sm:gap-10 md:gap-0 pointer-events-auto"
        >
          <a href="#" onClick={(e) => {
            e.preventDefault();
            navigate("/", { state: { scrollTo: "showreel", _nonce: Date.now() }, replace: false });
          }} className="group flex flex-col md:flex-row items-center gap-3 sm:gap-4 cursor-pointer">
            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-mono text-neutral-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] group-hover:text-white transition-colors duration-300">
              Scroll to explore
            </span>
            <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center group-hover:border-[#8C0B0C]/60 group-hover:bg-[#8C0B0C]/10 group-hover:shadow-[0_0_25px_rgba(140,11,12,0.3)] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]">
              <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 group-hover:text-[#8C0B0C] transition-colors duration-300 group-hover:scale-110" />
            </div>
          </a>
        </div>
      </motion.div>

      {/* "Visual Effects & Animation" pill — bottom-left, baseline-aligned with scroll indicator */}
      <div
        ref={badgeRef}
        className="absolute z-20 pointer-events-none bottom-[10vh] md:bottom-12 left-4 md:left-[5%]"
        style={{ opacity: 0 }}
      >
        <div className="flex items-center gap-2 sm:gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-3 sm:px-5 py-1.5 sm:py-2 shadow-2xl">
          <div className="h-1.5 w-1.5 rounded-full bg-[#8C0B0C] animate-pulse shadow-[0_0_10px_rgba(140,11,12,1)]" />
          <p className="text-[8px] sm:text-[9px] md:text-[10px] font-mono tracking-[0.15em] sm:tracking-[0.25em] text-white uppercase font-medium">
            Visual Effects & Animation
          </p>
        </div>
      </div>

    </section>
  );
};
