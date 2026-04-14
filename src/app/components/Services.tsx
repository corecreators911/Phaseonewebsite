import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useReducedMotion } from "@/lib/useReducedMotion";

const CREW = [
  {
    id: 1,
    name: "Rishik Bansal",
    roles: ["VFX Supe", "VFX Compositing"],
    image: "/crew/rishik-bansal.webp",
  },
  {
    id: 2,
    name: "Shasidhar Javvaji",
    roles: ["VFX Supe", "FX", "CFX", "3D Generalist"],
    image: "/crew/shasidhar-javvaji.webp",
  },
  {
    id: 3,
    name: "Sahib Dewan",
    roles: ["Project Coord", "VFX Editor"],
    image: "/crew/sahib-dewan.webp",
  },
  {
    id: 4,
    name: "Gurjass Singh Malhotra",
    roles: ["Production Supe", "Editor"],
    image: "/crew/gurjass-malhotra.webp",
  },
  {
    id: 5,
    name: "Atharv Gohil",
    roles: ["Animation Supe", "3D"],
    image: "/crew/atharv-gohil.webp",
  },
];

export const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        if (headingRef.current)
          gsap.set(headingRef.current.querySelectorAll(".char-reveal"), { y: "0%", opacity: 1 });
        return;
      }
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
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative w-full bg-black py-8 sm:py-12 md:py-16 scroll-mt-24 overflow-hidden"
    >
      <div className="w-full px-4 md:px-[5%] relative z-10">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-[1px] w-12 bg-[#8C0B0C]" />
          <span
            className="text-[11px] md:text-[13px] font-mono text-[#8C0B0C] uppercase tracking-[0.35em]"
            style={{ textShadow: "0 0 10px rgba(140,11,12,0.55)" }}
          >
            The Team Behind The Magic
          </span>
        </div>

        {/* Heading with char reveal */}
        <div ref={headingRef} className="mb-6 sm:mb-8 md:mb-10 overflow-hidden">
          <h2 className="flex flex-wrap">
            {"CREW".split("").map((char, i) => (
              <span
                key={i}
                className="char-reveal inline-block text-[10vw] sm:text-[12vw] md:text-[8vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-700 uppercase"
              >
                {char}
              </span>
            ))}
          </h2>
        </div>

        {/* Crew grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 md:gap-6">
          {CREW.map((member) => (
            <div key={member.id} className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-white/5">
              <ImageWithFallback
                src={member.image}
                alt={member.name}
                width={400}
                height={533}
                className="w-full h-full object-cover filter grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
              {/* Bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-2xl font-bold text-white leading-tight tracking-tight">
                  {member.name}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {member.roles.map((role) => (
                    <span
                      key={role}
                      className="text-[10px] tracking-widest uppercase border border-white/20 bg-white/5 px-2 py-0.5 rounded-full text-neutral-300"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
