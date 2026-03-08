import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowUpRight } from "lucide-react";

const SERVICES = [
  {
    id: "01",
    title: "Visual Effects",
    desc: "High-end compositing, CGI integration, and photorealistic simulations for feature films and episodic content.",
    image: "https://images.unsplash.com/photo-1621744965770-ad507bed097c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXN1YWwlMjBlZmZlY3RzJTIwY29tcG9zaXRpbmclMjBzdHVkaW8lMjBkYXJrfGVufDF8fHx8MTc3Mjk1NDY2OXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "02",
    title: "CGI & 3D",
    desc: "Detailed 3D modeling, texturing, lighting, and rendering pipelines powering photoreal digital assets.",
    image: "https://images.unsplash.com/photo-1761197641747-2803ee4145ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDR0klMjAzRCUyMHJlbmRlcmluZyUyMGRhcmslMjBzdHVkaW98ZW58MXx8fHwxNzcyOTU0NjY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "03",
    title: "Compositing",
    desc: "Seamless multi-layer integration of live-action plates with CG elements across complex environments.",
    image: "https://images.unsplash.com/photo-1612239145541-6a150f2c97dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBleHBsb3Npb24lMjBmaXJlJTIwZGFyayUyMFZGWHxlbnwxfHx8fDE3NzI5NTQ2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "04",
    title: "Motion Design",
    desc: "Dynamic title sequences, heads-up displays, and animated typography for film and broadcast.",
    image: "https://images.unsplash.com/photo-1764258560214-71d5f28852d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3Rpb24lMjBncmFwaGljcyUyMGRhcmslMjBhYnN0cmFjdCUyMG5lb258ZW58MXx8fHwxNzcyOTU0NjY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "05",
    title: "Simulation",
    desc: "Fluid dynamics, pyro, destruction, cloth, and particle systems at cinema-grade fidelity.",
    image: "https://images.unsplash.com/photo-1771792997478-64931eafa9a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0aWNsZSUyMHNpbXVsYXRpb24lMjBmbHVpZCUyMGRhcmslMjBhYnN0cmFjdHxlbnwxfHx8fDE3NzI5NTQ2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "06",
    title: "Virtual Production",
    desc: "In-camera VFX with real-time rendering, LED volume pipelines, and on-set supervision.",
    image: "https://images.unsplash.com/photo-1678483789476-14cd5debd709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwcHJvZHVjdGlvbiUyMExFRCUyMHZvbHVtZSUyMHN0YWdlfGVufDF8fHx8MTc3Mjk1NDY2OHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
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

      // Service items stagger
      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Follow mouse for image reveal
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (imageContainerRef.current) {
      gsap.to(imageContainerRef.current, {
        x: mousePos.x - 160,
        y: mousePos.y - 100,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  }, [mousePos]);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative w-full bg-black py-16 md:py-24 px-6 scroll-mt-24 overflow-hidden"
    >
      {/* Floating image that follows cursor */}
      <div
        ref={imageContainerRef}
        className="fixed top-0 left-0 z-50 pointer-events-none will-change-transform hidden md:block"
        style={{ opacity: activeIndex !== null ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        <div className="relative w-80 h-48 overflow-hidden rounded-lg shadow-2xl">
          {SERVICES.map((service, i) => (
            <div
              key={service.id}
              className="absolute inset-0 transition-opacity duration-500"
              style={{ opacity: activeIndex === i ? 1 : 0 }}
            >
              <ImageWithFallback
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          ))}
          {/* Red accent line */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#8C0B0C] via-[#8C0B0C]/50 to-transparent" />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] w-12 bg-[#8C0B0C]" />
          <span className="text-[10px] md:text-[11px] font-mono text-[#8C0B0C] uppercase tracking-[0.3em]">
            What We Do
          </span>
        </div>

        {/* Heading with char reveal */}
        <div ref={headingRef} className="mb-16 md:mb-24 overflow-hidden">
          <h2 className="flex flex-wrap">
            {"CAPABILITIES".split("").map((char, i) => (
              <span
                key={i}
                className="char-reveal inline-block text-[12vw] md:text-[8vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-700 uppercase"
              >
                {char}
              </span>
            ))}
          </h2>
        </div>

        {/* Interactive service list */}
        <div className="flex flex-col">
          {SERVICES.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => (itemsRef.current[index] = el)}
              className="group relative border-t border-white/[0.06] last:border-b last:border-white/[0.06] cursor-none"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              data-cursor-project
              data-cursor-text="EXPLORE"
            >
              <div className="relative flex items-center justify-between py-8 md:py-10 px-2 md:px-4 transition-all duration-500 group-hover:pl-6 md:group-hover:pl-10">
                {/* Red line that appears on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#8C0B0C] origin-top scale-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-y-100" />

                {/* Left side - number + title */}
                <div className="flex items-baseline gap-6 md:gap-10">
                  <span className="text-xs md:text-sm font-mono text-neutral-600 group-hover:text-[#8C0B0C] transition-colors duration-500 tabular-nums">
                    {service.id}
                  </span>
                  <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter uppercase text-neutral-400 group-hover:text-white transition-colors duration-500">
                    {service.title}
                  </h3>
                </div>

                {/* Right side - description + arrow */}
                <div className="hidden md:flex items-center gap-8">
                  <p className="max-w-xs text-sm text-neutral-600 group-hover:text-neutral-400 transition-colors duration-500 text-right">
                    {service.desc}
                  </p>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#8C0B0C]/50 group-hover:bg-[#8C0B0C]/10 transition-all duration-500 overflow-hidden">
                    <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-[#8C0B0C] transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Mobile description */}
                <div className="md:hidden flex items-center">
                  <ArrowUpRight className="w-5 h-5 text-neutral-600 group-hover:text-[#8C0B0C] transition-colors" />
                </div>

                {/* Hover background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#8C0B0C]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stats bar */}
        <div className="mt-16 md:mt-24 flex flex-wrap items-center justify-between gap-8 py-8 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#8C0B0C] animate-pulse" />
            <span className="text-[10px] md:text-[11px] font-mono text-neutral-500 uppercase tracking-[0.3em]">
              Full-Spectrum Studio
            </span>
          </div>
          <div className="flex items-center gap-8 md:gap-16">
            {[
              { label: "Disciplines", value: "06" },
              { label: "Artists", value: "80+" },
              { label: "Countries", value: "12" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-lg md:text-xl font-bold text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-[0.2em]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
