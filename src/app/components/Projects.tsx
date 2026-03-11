import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "../../lib/utils";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowUpRight, ExternalLink } from "lucide-react";

// ScrollTrigger is registered once globally in App.tsx

const PROJECTS = [
  {
    id: "01",
    title: "Project Alpha",
    category: "CGI & Animation",
    image:
      "https://images.unsplash.com/photo-1710348891996-a78568aa3623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBkYXJrJTIwc2NpLWZpJTIwdmZ4JTIwcHJvZHVjdGlvbnxlbnwxfHx8fDE3NzI5NjgwOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    client: "Netflix",
    year: "2025",
    awards: "VES Award Winner",
    size: "large", // col-span-7
  },
  {
    id: "02",
    title: "Neon Echoes",
    category: "Environment Design",
    image:
      "https://images.unsplash.com/photo-1645780404253-e9c1e46d1450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbm9pciUyMGNpdHklMjBuaWdodCUyMGNpbmVtYXRpY3xlbnwxfHx8fDE3NzI5NjgwOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    client: "Warner Bros",
    year: "2025",
    awards: "BAFTA Nominated",
    size: "small", // col-span-5
  },
  {
    id: "03",
    title: "Abyssal Plain",
    category: "Simulation & VFX",
    image:
      "https://images.unsplash.com/photo-1682957205538-7ba9957b01a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwb2NlYW4lMjBkYXJrJTIwdW5kZXJ3YXRlciUyMGNpbmVtYXRpY3xlbnwxfHx8fDE3NzI5NjgwOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    client: "Sony Pictures",
    year: "2024",
    awards: "Academy Award Shortlist",
    size: "small", // col-span-5
  },
  {
    id: "04",
    title: "Star Dust",
    category: "Virtual Production",
    image:
      "https://images.unsplash.com/photo-1719820390502-e0823fcc739d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY29zbW9zJTIwZ2FsYXh5JTIwc3BhY2UlMjBjaW5lbWF0aWMlMjBtb29keXxlbnwxfHx8fDE3NzI5NjgwOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    client: "A24",
    year: "2024",
    awards: "Cannes Selection",
    size: "large", // col-span-7
  },
];

export const Projects = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
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
              start: "top 85%",
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
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full bg-black py-8 sm:py-12 md:py-16 px-4 sm:px-6 scroll-mt-24"
    >
      {/* Subtle dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* ── Header ── */}
        <div className="mb-10 sm:mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-[#8C0B0C]" />
              <span className="text-[10px] md:text-[11px] font-mono text-[#8C0B0C] uppercase tracking-[0.3em]">
                Portfolio
              </span>
            </div>
            <div ref={headingRef} className="overflow-hidden">
              <h2 className="flex flex-wrap gap-y-0">
                {"SELECTED WORKS".split("").map((char, i) => (
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
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors duration-300"
            data-cursor-hover
          >
            <span>View Full Archive</span>
            <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#8C0B0C]/60 group-hover:bg-[#8C0B0C]/10 transition-all duration-500">
              <ExternalLink className="w-3 h-3" />
            </div>
          </button>
        </div>

        {/* ── Projects Grid ── */}
        {/*
          Layout:
            Row 1 → [Project 0: 7 cols] [Project 1: 5 cols]
            Row 2 → [Project 2: 5 cols] [Project 3: 7 cols]
          Both rows same height — no vertical offset, no aspect-ratio tricks.
        */}
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
                  "group relative rounded-xl overflow-hidden bg-neutral-900",
                  // Unified card height — responsive
                  "h-[280px] sm:h-[340px] md:h-[480px]",
                  // Subtle dim on sibling hover
                  "transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
                  isOtherHovered
                    ? "opacity-40 scale-[0.985]"
                    : "opacity-100 scale-100"
                )}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                data-cursor-hover
              >
                {/* ── Image ── fills card, subtle scale on hover */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover scale-[1.04] group-hover:scale-[1.09] transition-transform duration-[2s] ease-[cubic-bezier(0.19,1,0.22,1)]"
                  />
                </div>

                {/* ── Gradient overlays ── */}
                {/* Base darkening gradient from bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10 transition-opacity duration-700" />
                {/* Hover: crimson bloom from bottom-left */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(140,11,12,0.45)_0%,transparent_55%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                {/* Inner border */}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.05] group-hover:ring-[#8C0B0C]/25 rounded-xl transition-colors duration-700" />

                {/* ── Top row: ID / Year + Award ── */}
                <div className="absolute top-0 left-0 right-0 px-4 sm:px-6 md:px-7 pt-4 sm:pt-6 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.28em] opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-1 group-hover:translate-y-0">
                    {project.id} — {project.year}
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75 -translate-y-1 group-hover:translate-y-0">
                    <div className="h-[5px] w-[5px] rounded-full bg-[#8C0B0C]" />
                    <span className="text-[9px] font-mono text-[#8C0B0C] uppercase tracking-[0.2em]">
                      {project.awards}
                    </span>
                  </div>
                </div>

                {/* ── Bottom content ── */}
                <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 md:px-7 pb-4 sm:pb-6 md:pb-7">
                  {/* Client row + VIEW arrow */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/50 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      {project.client}
                    </span>

                    {/* VIEW arrow badge — replaces the bloated cursor effect */}
                    <div
                      className={cn(
                        "flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-500",
                        "border-white/10 bg-white/5 opacity-0 translate-y-2",
                        "group-hover:opacity-100 group-hover:translate-y-0 group-hover:border-[#8C0B0C]/50 group-hover:bg-[#8C0B0C]/15"
                      )}
                    >
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/80">
                        View
                      </span>
                      <ArrowUpRight className="w-3 h-3 text-white/80" />
                    </div>
                  </div>

                  {/* Project title */}
                  <h3
                    className={cn(
                      "font-black uppercase tracking-tighter text-white leading-[0.92] transition-transform duration-700",
                      "translate-y-1 group-hover:translate-y-0",
                      isLarge
                        ? "text-[clamp(1.5rem,4vw,3.5rem)]"
                        : "text-[clamp(1.3rem,3.2vw,2.8rem)]"
                    )}
                  >
                    {project.title}
                  </h3>

                  {/* Category */}
                  <p className="mt-2.5 text-[10px] md:text-[11px] font-mono tracking-[0.14em] uppercase text-white/45 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-3 group-hover:translate-y-0">
                    {project.category}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom counter ── */}
        <div className="mt-6 md:mt-8 flex items-center justify-between">
          <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.25em]">
            Showing 04 of 28 projects
          </p>
          <div className="h-[1px] flex-1 mx-8 bg-gradient-to-r from-neutral-800 to-transparent" />
          <div className="flex gap-1.5">
            {PROJECTS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-[2px] rounded-full transition-all duration-300",
                  hoveredIndex === i
                    ? "w-6 bg-[#8C0B0C]"
                    : "w-2 bg-neutral-700"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};