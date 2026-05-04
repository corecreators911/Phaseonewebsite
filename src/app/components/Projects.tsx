import { useRef, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { getFeaturedProjects } from "@/data/projects";

// The preview notice can still be kept if needed for other places, but we remove the modal from here.

export const Projects = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [offsetIndex, setOffsetIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  const PROJECTS = getFeaturedProjects();
  
  // Calculate max offset to prevent sliding too far
  // We want to show items without empty space at the end if possible, 
  // but for simplicity, we'll just bind the offset.
  // Assuming 6 items visible on desktop, max offset is total - 6.
  // To avoid negative maxOffset on small lists:
  const [itemsVisible, setItemsVisible] = useState(6);

  useLayoutEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth >= 1024) setItemsVisible(6);
      else if (window.innerWidth >= 768) setItemsVisible(4);
      else setItemsVisible(3);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const maxOffset = Math.max(0, PROJECTS.length - itemsVisible);

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
      if (window.innerWidth >= 768) {
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          gsap.fromTo(
            card,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              delay: (i % 2) * 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 95%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }
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
                Your Vision our Execution
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
              View Full Projects
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
            <div className="absolute inset-0 z-0 bg-[#8C0B0C] translate-y-[101%] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
          </button>
        </div>

        <div className="w-full overflow-hidden pb-8">
          <div 
            className="grid grid-cols-3 gap-2 md:flex md:transition-transform md:duration-[800ms] md:ease-[cubic-bezier(0.25,1,0.5,1)] max-md:!transform-none"
            style={{ 
              transform: `translateX(calc(-${offsetIndex} * (100% / ${itemsVisible})))`,
            }}
          >
            {PROJECTS.map((project, idx) => {
              const isHovered = hoveredIndex === idx;
              const isOtherHovered = hoveredIndex !== null && !isHovered;

              return (
                <div
                  key={project.id}
                  ref={(el) => (cardsRef.current[idx] = el)}
                  className={cn(
                    "w-full md:flex-none md:w-1/4 lg:w-1/6 md:px-2 lg:px-2.5",
                    "group relative cursor-pointer flex flex-col",
                    "transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
                    isOtherHovered
                      ? "md:opacity-40 md:scale-[0.985]"
                      : "opacity-100 scale-100"
                  )}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => navigate(`/projects/${project.projectId}`)}
                  data-cursor-hover
                >
                  <div className="relative w-full aspect-[3/4] rounded-lg md:rounded-xl overflow-hidden bg-neutral-900 mb-2 md:mb-4">
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <ImageWithFallback
                      src={project.thumbnailUrl}
                      alt={project.title}
                      width={400}
                      height={533}
                      className={cn(
                        "w-full h-full object-cover scale-[1.04] group-hover:scale-[1.09] transition-transform duration-[2s] ease-[cubic-bezier(0.19,1,0.22,1)]",
                        project.projectId === "project-car-chase"
                          ? "max-md:object-cover max-md:object-[60%_center] md:object-[63%_center]"
                          : project.projectId === "leo"
                          ? "object-[center_5%]"
                          : "object-center"
                      )}
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(140,11,12,0.45)_0%,transparent_55%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.05] group-hover:ring-[#8C0B0C]/25 rounded-xl transition-colors duration-700" />
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {maxOffset > 0 && (
          <div className="hidden md:flex items-center justify-end gap-3 mt-6">
            <button
              onClick={() => setOffsetIndex((prev) => Math.max(0, prev - 2))}
              disabled={offsetIndex === 0}
              className={cn(
                "p-3 sm:p-4 rounded-full border border-white/20 transition-all duration-300",
                offsetIndex === 0
                  ? "opacity-0 pointer-events-none"
                  : "hover:border-[#8C0B0C] hover:bg-[#8C0B0C]/10 cursor-pointer"
              )}
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
            <button
              onClick={() => setOffsetIndex((prev) => Math.min(maxOffset, prev + 2))}
              disabled={offsetIndex >= maxOffset}
              className={cn(
                "p-3 sm:p-4 rounded-full border border-white/20 transition-all duration-300",
                offsetIndex >= maxOffset
                  ? "opacity-0 pointer-events-none"
                  : "hover:border-[#8C0B0C] hover:bg-[#8C0B0C]/10 cursor-pointer"
              )}
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};