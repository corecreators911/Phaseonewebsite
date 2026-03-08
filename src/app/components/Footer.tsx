import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import logoImg from "figma:asset/a2e2c8a6ed7fae1fb56e5aa4277b6dad6f92533f.png";
import { Marquee } from "./Marquee";

const NAV_COLS = [
  {
    title: "Navigation",
    links: ["Home", "Showreel", "Departments", "Projects", "About", "Contact"],
  },
  {
    title: "Departments",
    links: ["VFX", "CFX", "Animation", "Lighting", "Production", "Administration"],
  },
  {
    title: "Studio",
    links: ["Careers", "Culture", "Press Kit", "Blog", "Privacy", "Terms"],
  },
];

const SOCIALS = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bigTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Big text reveal — fade + small lift (not y:"100%" which creates blank space)
      if (bigTextRef.current) {
        const chars = bigTextRef.current.querySelectorAll(".footer-char");
        gsap.fromTo(
          chars,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            stagger: 0.03,
            ease: "power4.out",
            scrollTrigger: {
              trigger: bigTextRef.current,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={containerRef}
      className="relative w-full bg-[#030303] overflow-hidden"
    >
      {/* CTA Marquee Band */}
      <div className="border-t border-b border-white/[0.04] py-6">
        <Marquee speed={40} className="">
          <div className="flex items-center gap-12 px-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="contents">
                <span className="text-lg md:text-xl font-bold uppercase tracking-[0.1em] text-neutral-700 whitespace-nowrap">
                  Let's Work Together
                </span>
                <span className="text-[#8C0B0C] text-xl">&#10038;</span>
              </span>
            ))}
          </div>
        </Marquee>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <a href="#home" className="flex items-center gap-3 group" data-cursor-hover>
              <div className="h-12 w-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-[#8C0B0C]/50 transition-colors duration-500">
                <img src={logoImg} alt="Phase One" className="h-6 w-6 object-contain" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-[0.15em] uppercase text-white">
                  Phase <span className="text-[#8C0B0C]">One</span>
                </span>
                <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-600 mt-0.5">
                  Next Era Visual Effects
                </p>
              </div>
            </a>

            <p className="text-sm text-neutral-600 leading-relaxed max-w-sm mt-2">
              A full-spectrum VFX studio delivering uncompromising visual fidelity for film, episodic, and commercial content worldwide.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-4">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="group h-10 w-10 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center hover:border-[#8C0B0C]/50 hover:bg-[#8C0B0C]/10 transition-all duration-300"
                  data-cursor-hover
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          {NAV_COLS.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 mb-6">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-neutral-600 hover:text-white hover:pl-2 transition-all duration-300"
                      data-cursor-hover
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Back to top */}
          <div className="md:col-span-2 flex md:flex-col md:items-end md:justify-between">
            <button
              onClick={scrollToTop}
              className="group flex flex-col items-center gap-3 self-start md:self-end"
              data-cursor-hover
            >
              <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#8C0B0C]/50 group-hover:bg-[#8C0B0C]/10 group-hover:-translate-y-1 transition-all duration-500">
                <ArrowUp className="w-5 h-5 text-neutral-500 group-hover:text-[#8C0B0C] transition-colors" />
              </div>
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-600 group-hover:text-neutral-400 transition-colors">
                Back to top
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Giant text at bottom */}
      <div ref={bigTextRef} className="border-t border-[#8C0B0C]/20 pt-8 pb-4 relative overflow-hidden">
        {/* Subtle glow behind the text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-1/2 bg-[#8C0B0C]/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="container mx-auto max-w-7xl px-6 relative z-10">
          <div className="flex flex-wrap justify-center">
            {"PHASE ONE".split("").map((char, i) => (
              <span
                key={i}
                className={`footer-char inline-block text-[18vw] md:text-[14vw] font-black tracking-tighter uppercase leading-none ${
                  char === " " ? "w-[0.2em]" : ""
                }`}
                style={{
                  backgroundImage: "linear-gradient(180deg, #333333 0%, #050505 100%)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(140, 11, 12, 0.8)",
                  textShadow: "0 10px 40px rgba(140, 11, 12, 0.4)"
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.04]">
        <div className="container mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-700">
            &copy; {new Date().getFullYear()} Phase One VFX. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-700 hover:text-[#8C0B0C] transition-colors" data-cursor-hover>
              Privacy Policy
            </a>
            <a href="#" className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-700 hover:text-[#8C0B0C] transition-colors" data-cursor-hover>
              Terms of Service
            </a>
            <a href="#" className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-700 hover:text-[#8C0B0C] transition-colors" data-cursor-hover>
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};