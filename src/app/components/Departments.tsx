import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Alex Mercer",
    role: "Lead",
    image: "https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMG1hbnxlbnwxfHx8fDE3NzI4OTEyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Senior Artist",
    image: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc3Mjg3OTE1OXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    name: "Jordan Hayes",
    role: "Technical Director",
    image: "https://images.unsplash.com/photo-1595745688820-1a8bca9dd00f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHBvcnRyYWl0JTIwcGVyc29ufGVufDF8fHx8MTc3Mjk1ODk2NHww&ixlib=rb-4.1.0&q=80&w=1080",
  }
];

const DEPARTMENTS = [
  {
    id: "01",
    title: "VFX",
    desc: "Our VFX department is specialized in high-end compositing, CGI integration, and photorealistic simulations for feature films and episodic content. We bring the impossible to life with seamless integration.",
    team: TEAM_MEMBERS,
  },
  {
    id: "02",
    title: "CFX",
    desc: "The CFX team focuses on intricate character FX, including dynamic hair, cloth, and muscle simulations, ensuring realistic movement and physics for every digital actor.",
    team: TEAM_MEMBERS,
  },
  {
    id: "03",
    title: "Animation",
    desc: "Our Animation team breathes life into characters and creatures. With a deep understanding of weight, timing, and emotion, we deliver industry-leading keyframe and motion capture animation.",
    team: TEAM_MEMBERS,
  },
  {
    id: "04",
    title: "Lighting",
    desc: "The Lighting department sets the mood and tone for every shot, using advanced techniques to ensure digital elements perfectly match live-action plates or create fully realized CG environments.",
    team: TEAM_MEMBERS,
  },
  {
    id: "05",
    title: "Production",
    desc: "Our Production team coordinates pipelines, schedules, and resources across all departments, ensuring that creative vision is delivered on time and at the highest possible quality.",
    team: TEAM_MEMBERS,
  },
  {
    id: "06",
    title: "Administration",
    desc: "The Administration team handles the vital day-to-day operations, supporting our artists and staff so they can focus entirely on creating groundbreaking visual effects.",
    team: TEAM_MEMBERS,
  },
];

export const Departments = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);

    // Debounce ScrollTrigger refresh — cancel any pending refresh first
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
  };

  return (
    <section
      id="departments"
      ref={containerRef}
      className="relative w-full bg-black py-12 md:py-16 px-6 scroll-mt-24 overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] w-12 bg-[#8C0B0C]" />
          <span className="text-[10px] md:text-[11px] font-mono text-[#8C0B0C] uppercase tracking-[0.3em]">
            The Team Behind The Magic
          </span>
        </div>

        {/* Heading with char reveal */}
        <div ref={headingRef} className="mb-16 md:mb-24 overflow-hidden">
          <h2 className="flex flex-wrap">
            {"DEPARTMENTS".split("").map((char, i) => (
              <span
                key={i}
                className="char-reveal inline-block text-[12vw] md:text-[8vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-700 uppercase"
              >
                {char}
              </span>
            ))}
          </h2>
        </div>

        {/* Accordion list */}
        <div className="flex flex-col">
          {DEPARTMENTS.map((dept, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div
                key={dept.id}
                className="group relative border-t border-white/[0.06] last:border-b last:border-white/[0.06]"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full relative flex items-center justify-between py-8 md:py-10 px-2 md:px-4 text-left transition-all duration-500 hover:bg-white/[0.02]"
                >
                  {/* Left side - number + title */}
                  <div className="flex items-baseline gap-6 md:gap-10">
                    <span className={`text-xs md:text-sm font-mono transition-colors duration-500 tabular-nums ${isOpen ? "text-[#8C0B0C]" : "text-neutral-600 group-hover:text-neutral-400"}`}>
                      {dept.id}
                    </span>
                    <h3 className={`text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter uppercase transition-colors duration-500 ${isOpen ? "text-white" : "text-neutral-400 group-hover:text-neutral-300"}`}>
                      {dept.title}
                    </h3>
                  </div>

                  <div className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 overflow-hidden ${isOpen ? "border-[#8C0B0C]/50 bg-[#8C0B0C]/10" : "border-white/10 group-hover:border-white/30"}`}>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${isOpen ? "text-[#8C0B0C] rotate-180" : "text-neutral-600 group-hover:text-neutral-400"}`} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-2 md:px-4 pb-10 pt-2 md:pl-24">
                        <p className="max-w-3xl text-sm md:text-base text-neutral-400 leading-relaxed mb-10">
                          {dept.desc}
                        </p>
                        
                        <div className="space-y-6">
                          <h4 className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em]">Key Members</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {dept.team.map((member) => (
                              <div key={member.id} className="group/member flex flex-col gap-3">
                                <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/5 bg-white/5">
                                  <ImageWithFallback 
                                    src={member.image} 
                                    alt={member.name} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/member:scale-105 filter grayscale hover:grayscale-0"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                </div>
                                <div>
                                  <h5 className="text-sm font-bold text-white tracking-tight">{member.name}</h5>
                                  <p className="text-[10px] font-mono text-[#8C0B0C] uppercase tracking-wider mt-1">{member.role}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
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