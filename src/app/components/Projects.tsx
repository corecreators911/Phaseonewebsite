import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "../../lib/utils";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowUpRight, ExternalLink } from "lucide-react";

const PROJECTS = [
  {
    id: "01",
    title: "Project\nAlpha",
    category: "CGI & Animation",
    image: "https://images.unsplash.com/photo-1755963969538-00dfa22a7c0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZnV0dXJpc3RpYyUyMGNpdHlzY2FwZSUyMGNpbmVtYXRpY3xlbnwxfHx8fDE3NzI5NTQ2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    client: "Netflix",
    year: "2025",
    awards: "VES Award Winner",
  },
  {
    id: "02",
    title: "Neon\nEchoes",
    category: "Environment Design",
    image: "https://images.unsplash.com/photo-1604069843247-cf22574f237e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBkYXJrJTIwY29ycmlkb3IlMjBjaW5lbWF0aWN8ZW58MXx8fHwxNzcyOTU0NzkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    client: "Warner Bros",
    year: "2025",
    awards: "BAFTA Nominated",
  },
  {
    id: "03",
    title: "Abyssal\nPlain",
    category: "Simulation & VFX",
    image: "https://images.unsplash.com/photo-1728391180319-42d0b114e010?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcndhdGVyJTIwZGFyayUyMGNpbmVtYXRpYyUyMGRlZXAlMjBvY2VhbnxlbnwxfHx8fDE3NzI5NTQ3ODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    client: "Sony Pictures",
    year: "2024",
    awards: "Academy Award Shortlist",
  },
  {
    id: "04",
    title: "Star\nDust",
    category: "Virtual Production",
    image: "https://images.unsplash.com/photo-1538430564773-c50dbabcec87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjByZWQlMjBzbW9rZSUyMGF0bW9zcGhlcmljfGVufDF8fHx8MTc3Mjk1NDY3MXww&ixlib=rb-4.1.0&q=80&w=1080",
    client: "A24",
    year: "2024",
    awards: "Cannes Selection",
  },
];

export const Projects = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading char animation
      if (headingRef.current) {
        const chars = headingRef.current.querySelectorAll(".char-reveal");
        gsap.fromTo(
          chars,
          { y: "100%", opacity: 0 },
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

      // Cards stagger with parallax
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        const image = card.querySelector(".project-image");

        gsap.fromTo(
          card,
          { opacity: 0, y: 120, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Parallax on image
        if (image) {
          gsap.fromTo(
            image,
            { y: "-15%" },
            {
              y: "15%",
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full bg-neutral-950 py-16 md:py-24 px-6 overflow-hidden scroll-mt-24"
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-[#8C0B0C]" />
              <span className="text-[10px] md:text-[11px] font-mono text-[#8C0B0C] uppercase tracking-[0.3em]">
                Portfolio
              </span>
            </div>
            <div ref={headingRef} className="overflow-hidden">
              <h2 className="flex flex-wrap">
                {"SELECTED WORKS".split("").map((char, i) => (
                  <span
                    key={i}
                    className={`char-reveal inline-block text-[10vw] md:text-[6vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-700 uppercase ${char === " " ? "w-[0.3em]" : ""}`}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </h2>
            </div>
          </div>
          <button
            className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors"
            data-cursor-hover
          >
            <span>View Full Archive</span>
            <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#8C0B0C]/50 group-hover:bg-[#8C0B0C]/10 transition-all duration-500">
              <ExternalLink className="w-3 h-3" />
            </div>
          </button>
        </div>

        {/* Projects Grid - Asymmetric */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {PROJECTS.map((project, idx) => {
            const isHovered = hoveredIndex === idx;
            const isAnotherHovered = hoveredIndex !== null && hoveredIndex !== idx;

            // Alternate between wide and narrow
            const isWide = idx % 3 === 0;
            const colSpan = isWide ? "md:col-span-7" : "md:col-span-5";
            // Offset even items
            const offsetClass = idx === 1 || idx === 3 ? "md:mt-16" : "";

            return (
              <div
                key={project.id}
                ref={(el) => (cardsRef.current[idx] = el)}
                className={cn(
                  colSpan,
                  offsetClass,
                  "group relative overflow-hidden rounded-xl bg-neutral-900 cursor-none transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
                  isAnotherHovered
                    ? "opacity-30 blur-[2px] scale-[0.99]"
                    : "opacity-100 blur-none scale-100"
                )}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                data-cursor-project
                data-cursor-text="VIEW"
              >
                {/* Image container with parallax */}
                <div className="relative aspect-[16/10] md:aspect-[16/11] overflow-hidden">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="project-image absolute inset-[-15%] w-[130%] h-[130%] object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(140,11,12,0.4)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Ring border */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.06] group-hover:ring-[#8C0B0C]/30 transition-colors duration-700 rounded-xl" />

                  {/* Top bar - ID + Awards */}
                  <div className="absolute top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-start">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      {project.id} / {project.year}
                    </span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 delay-100">
                      <div className="h-1 w-1 rounded-full bg-[#8C0B0C]" />
                      <span className="text-[9px] font-mono text-[#8C0B0C] uppercase tracking-[0.2em]">
                        {project.awards}
                      </span>
                    </div>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
                    {/* Client + arrow */}
                    <div className="mb-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                        {project.client}
                      </span>
                      <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-[#8C0B0C] transition-colors duration-500">
                        <ArrowUpRight className="text-white w-4 h-4" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white leading-[0.9] whitespace-pre-line transition-transform duration-700 translate-y-2 group-hover:translate-y-0">
                      {project.title}
                    </h3>

                    {/* Category */}
                    <div className="mt-3 overflow-hidden">
                      <p className="text-[10px] md:text-xs font-mono tracking-[0.15em] uppercase text-white/60 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150 translate-y-4 group-hover:translate-y-0">
                        {project.category}
                      </p>
                    </div>
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
