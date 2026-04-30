import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useReducedMotion } from "@/lib/useReducedMotion";

const STATS = [
  { value: 150, suffix: "+", label: "Projects Delivered" },
  { value: 32, suffix: "", label: "Awards Won" },
  { value: 80, suffix: "+", label: "Artists Worldwide" },
  { value: 8, suffix: "", label: "Years of Excellence" },
];

export const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        if (headingRef.current)
          gsap.set(headingRef.current.querySelectorAll(".char-reveal"), { y: "0%", opacity: 1 });
        if (textRef.current)
          gsap.set(textRef.current.querySelectorAll(".word"), { opacity: 1 });
        if (imageRef.current)
          gsap.set(imageRef.current, { opacity: 1, y: 0 });
        if (statsRef.current) {
          statsRef.current.querySelectorAll(".stat-value").forEach((el, i) => {
            (el as HTMLElement).innerText = STATS[i].value.toString();
          });
        }
        return;
      }
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
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Word-by-word text reveal with opacity scrub — single ScrollTrigger instead of one per word
      if (textRef.current) {
        const words = textRef.current.querySelectorAll(".word");
        gsap.fromTo(
          words,
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: "none",
            stagger: { each: 0.3, from: "start" },
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 95%",
              end: "bottom 60%",
              scrub: 1,
            },
          }
        );
      }

      // Image parallax + reveal
      if (imageRef.current) {
        const img = imageRef.current.querySelector("img");
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: imageRef.current,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          }
        );

        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.08 },
            {
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: imageRef.current,
                start: "top 95%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }

      // Stats counter animation
      if (statsRef.current) {
        const statEls = statsRef.current.querySelectorAll(".stat-value");
        statEls.forEach((el, i) => {
          const target = STATS[i].value;
          const obj = { value: 0 };

          gsap.to(obj, {
            value: target,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              (el as HTMLElement).innerText = Math.round(obj.value).toString();
            },
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              toggleActions: "play none none none",
              once: true,
            },
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const paragraphText =
    "We are a collective of digital artists, technologists, and filmmakers dedicated to pushing the boundaries of visual storytelling. From concept to final frame, we craft immersive worlds and impossible realities for the world's most demanding creators. Every pixel, every frame, every render — engineered to perfection.";

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full bg-black py-8 sm:py-12 md:py-16 overflow-hidden scroll-mt-24"
    >
      {/* Background subtle elements */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute top-0 left-[50%] w-[1px] h-full bg-white" />
      </div>

      <div className="w-full px-4 md:px-[5%]">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] w-12 bg-[#8C0B0C]" />
          <span className="text-[11px] md:text-[13px] font-mono text-[#8C0B0C] uppercase tracking-[0.35em]" style={{ textShadow: "0 0 10px rgba(140,11,12,0.55)" }}>
            Work Culture
          </span>
        </div>

        {/* Heading */}
        <div ref={headingRef} className="overflow-hidden mb-10 sm:mb-16 md:mb-24">
          <h2 className="flex flex-wrap">
            {"ABOUT US".split("").map((char, i) => (
              <span
                key={i}
                className={`char-reveal inline-block text-[10vw] sm:text-[11vw] md:text-[8vw] font-black leading-none tracking-tighter uppercase ${char === " " ? "w-[0.3em]" : ""
                  }`}
                style={{
                  WebkitTextStroke: "1px rgba(255,255,255,0.45)",
                  color: "transparent",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Image column */}
          <div className="lg:col-span-5 order-2 lg:order-1 lg:sticky lg:top-32">
            <div
              ref={imageRef}
              className="relative group overflow-hidden rounded-xl"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <ImageWithFallback
                  src="/about-us/about%20us.webp"
                  alt="Studio"
                  width={540}
                  height={720}
                  className="w-full h-full object-cover object-[65%_50%] grayscale contrast-110 brightness-75 transition-all duration-[1.5s] group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100"
                />
              </div>
              {/* Overlay frame */}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.06] group-hover:ring-[#8C0B0C]/20 transition-colors duration-700 rounded-xl" />

              {/* Badge on image */}
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 sm:gap-0">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                  <p className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-neutral-400">
                    Est. 2026 — India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text column */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            {/* Word-by-word text reveal */}
            <div ref={textRef} className="mb-10 sm:mb-16">
              <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed tracking-tight flex flex-wrap gap-x-[0.25em] sm:gap-x-[0.3em]">
                {paragraphText.split(" ").map((word, i) => (
                  <span key={i} className="word inline-block text-white">
                    {word}
                  </span>
                ))}
              </p>
            </div>

            {/* Animated Stats */}
            <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 py-8 sm:py-10 border-t border-b border-white/[0.06]">
              {STATS.map((stat, i) => (
                <div key={stat.label} className="group flex flex-col gap-1.5 sm:gap-2">
                  <div className="flex items-baseline">
                    <span className="stat-value text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight group-hover:text-[#8C0B0C] transition-colors duration-500">
                      0
                    </span>
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#8C0B0C]">
                      {stat.suffix}
                    </span>
                  </div>
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-neutral-500 group-hover:text-neutral-300 transition-colors">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Philosophy quote */}
            <div className="mt-8 sm:mt-12 flex gap-4 sm:gap-6">
              <div className="w-[2px] bg-gradient-to-b from-[#8C0B0C] to-transparent flex-shrink-0" />
              <blockquote className="text-xs sm:text-sm md:text-base text-neutral-500 italic leading-relaxed">
                "We don't just create visual effects — we architect realities. Every frame is a canvas, every project a universe waiting to be born."
                <span className="block mt-3 text-[10px] font-mono not-italic uppercase tracking-[0.2em] text-[#8C0B0C]">
                  — Creative Director
                </span>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
