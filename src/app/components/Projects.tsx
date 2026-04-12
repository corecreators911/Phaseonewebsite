import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "../../lib/utils";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowUpRight } from "lucide-react";
import { getFeaturedProjects } from "../../data/projects";

// The preview notice can still be kept if needed for other places, but we remove the modal from here.

export const Projects = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  const featured = getFeaturedProjects();
  const PROJECTS = featured.map((p, i) => ({
    ...p,
    size: i === 0 || i === 3 ? "large" : "small"
  }));
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      if (headingRef.current)
        gsap.set(headingRef.current.querySelectorAll(".char-reveal"), { y: "0%", opacity: 1 });
      cardsRef.current.forEach((card) => { if (card) gsap.set(card, { opacity: 1, y: 0 }); });
      return;
    }
    const ctx = gsap.context(() => {
      // Heading character animation
      if (headingRef.current) {
        const chars = headingRef.current.querySelectorAll(".char-reveal");
        gsap.fromTo(
          chars,
          { y: "110%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 1.2,
            stagger: 0.03,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Cards stagger entrance
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            delay: window.innerWidth < 768 ? 0 : (i % 2) * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    // Safety: if ScrollTrigger hasn't fired after 3s, force elements visible
    const safetyId = setTimeout(() => {
      if (containerRef.current) {
        const hiddenEls = containerRef.current.querySelectorAll(".char-reveal");
        hiddenEls.forEach((el) => {
          const style = getComputedStyle(el);
          if (Number(style.opacity) < 0.1) {
            gsap.set(el, { opacity: 1, y: 0, clearProps: "all" });
          }
        });
        cardsRef.current.forEach((card) => {
          if (!card) return;
          const style = getComputedStyle(card);
          if (Number(style.opacity) < 0.1) {
            gsap.set(card, { opacity: 1, y: 0, clearProps: "all" });
          }
        });
      }
    }, 3000);

    return () => {
      clearTimeout(safetyId);
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full bg-black py-8 sm:py-12 md:py-16 scroll-mt-24"
    >
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="w-full px-4 md:px-[5%] relative z-10">
        <div className="mb-10 sm:mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-[#8C0B0C]" />
              <span className="text-[11px] md:text-[13px] font-mono text-[#8C0B0C] uppercase tracking-[0.35em]" style={{ textShadow: "0 0 10px rgba(140,11,12,0.55)" }}>
                Portfolio
              </span>
            </div>
            <div ref={headingRef} className="overflow-hidden">
              <h2 className="flex flex-wrap gap-y-0">
                {"PROJECTS".split("").map((char, i) => (
                  <span
                    key={i}
                    className={cn(
                      "char-reveal inline-block text-[9vw] sm:text-[10vw] md:text-[5.5vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-600 uppercase",
                      char === " " ? "w-[0.28em]" : ""
                    )}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </h2>
            </div>
          </div>
          <button
            className="group relative overflow-hidden rounded-full border border-white/20 bg-transparent px-8 sm:px-12 py-4 sm:py-5 transition-all duration-500 hover:border-[#8C0B0C] hover:shadow-[0_0_40px_rgba(140,11,12,0.3)] cursor-pointer"
            data-cursor-hover
            onClick={() => navigate("/projects")}
          >
            <span className="relative z-10 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors">
              View Full Archive
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
            <div className="absolute inset-0 z-0 bg-[#8C0B0C] translate-y-[101%] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 md:gap-5">
          {PROJECTS.map((project, idx) => {
            const isLarge = project.size === "large";
            const colClass = isLarge ? "md:col-span-7" : "md:col-span-5";
            const isHovered = hoveredIndex === idx;
            const isOtherHovered = hoveredIndex !== null && !isHovered;

            return (
              <div
                key={project.id}
                ref={(el) => (cardsRef.current[idx] = el)}
                className={cn(
                  colClass,
                  "group relative rounded-xl overflow-hidden bg-neutral-900 cursor-pointer",
                  "h-[280px] sm:h-[340px] md:h-[480px]",
                  "transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
                  isOtherHovered
                    ? "opacity-40 scale-[0.985]"
                    : "opacity-100 scale-100"
                )}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => navigate(`/projects/${project.projectId}`)}
                data-cursor-hover
              >
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <ImageWithFallback
                    src={project.thumbnailUrl}
                    alt={project.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover scale-[1.04] group-hover:scale-[1.09] transition-transform duration-[2s] ease-[cubic-bezier(0.19,1,0.22,1)]"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(140,11,12,0.45)_0%,transparent_55%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.05] group-hover:ring-[#8C0B0C]/25 rounded-xl transition-colors duration-700" />

                <div className="absolute top-0 left-0 right-0 px-5 md:px-7 pt-4 sm:pt-6 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.28em] opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-1 group-hover:translate-y-0">
                    {project.id} - {project.year}
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75 -translate-y-1 group-hover:translate-y-0">
                    <div className="h-[5px] w-[5px] rounded-full bg-[#8C0B0C]" />
                    <span className="text-[9px] font-mono text-[#8C0B0C] uppercase tracking-[0.2em]">
                      {project.award}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 px-5 md:px-7 pb-4 sm:pb-6 md:pb-7">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/50 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      {project.client}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${project.projectId}`);
                      }}
                      className={cn(
                        "relative flex items-center gap-2 px-3 py-1.5 rounded-full overflow-hidden transition-all duration-500 translate-y-4 group-hover:translate-y-0",
                        "bg-[#8C0B0C] hover:bg-[#a60d0e]",
                        "opacity-0 group-hover:opacity-100",
                        "shadow-[0_0_15px_rgba(140,11,12,0.4)]"
                      )}
                    >
                      <span className="relative z-10 text-[9px] font-bold text-white uppercase tracking-[0.1em]">
                        View
                      </span>
                      <ArrowUpRight className="relative z-10 w-3 h-3 text-white" />
                    </button>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-[2rem] font-bold leading-[1.1] tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {project.title}
                  </h3>
                  <div className="mt-2 overflow-hidden h-0 group-hover:h-auto group-hover:mt-3 transition-all duration-500 hidden md:block">
                    <p className="text-sm text-neutral-400 font-medium tracking-wide">
                      {project.category}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
