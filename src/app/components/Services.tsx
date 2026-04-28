import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { servicesData } from "@/data/servicesData";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";

export const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

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

  const toggle = (category: string) => {
    setOpenCategory((prev) => (prev === category ? null : category));
  };

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative w-full bg-black py-8 sm:py-12 md:py-16 scroll-mt-24"
    >
      <div className="w-full px-4 md:px-[5%]">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-[1px] w-12 bg-[#8C0B0C]" />
          <span
            className="text-[11px] md:text-[13px] font-mono text-[#8C0B0C] uppercase tracking-[0.35em]"
            style={{ textShadow: "0 0 10px rgba(140,11,12,0.55)" }}
          >
            What We Do
          </span>
        </div>

        {/* Heading with char reveal */}
        <div ref={headingRef} className="mb-10 sm:mb-14 md:mb-20 overflow-hidden">
          <h2 className="flex flex-wrap">
            {"SERVICES".split("").map((char, i) => (
              <span
                key={i}
                className="char-reveal inline-block text-[10vw] sm:text-[11vw] md:text-[7vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-600 uppercase"
              >
                {char}
              </span>
            ))}
          </h2>
        </div>

        {/* Accordion */}
        <div className="border-t border-white/[0.08]">
          {servicesData.map((item) => {
            const isOpen = openCategory === item.category;
            return (
              <div key={item.category}>
                {/* Trigger row */}
                <button
                  className={cn(
                    "group w-full flex items-center justify-between gap-4 py-4 sm:py-5 px-1 min-h-[48px]",
                    "border-b border-white/[0.08] transition-colors duration-300",
                    "hover:bg-white/[0.02]",
                    isOpen && "border-[#8C0B0C]/30"
                  )}
                  onClick={() => toggle(item.category)}
                  aria-expanded={isOpen}
                >
                  <span
                    className={cn(
                      "font-mono text-sm sm:text-base uppercase tracking-[0.15em] transition-colors duration-300 text-left",
                      isOpen ? "text-[#8C0B0C]" : "text-neutral-300 group-hover:text-white"
                    )}
                  >
                    {item.category}
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "shrink-0 transition-all duration-500",
                      isOpen ? "text-[#8C0B0C] rotate-180" : "text-neutral-500 group-hover:text-neutral-300"
                    )}
                  />
                </button>

                {/* Expanded panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={item.category}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 py-5 sm:py-6">
                        {item.services.map((service) => (
                          <div
                            key={service.name}
                            className="group/card bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 sm:p-5 transition-all duration-300 hover:bg-white/[0.05] hover:border-[#8C0B0C]/20"
                          >
                            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.12em] text-white mb-2">
                              {service.name}
                            </p>
                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                              {service.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
