import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import logoImg from "@/assets/Official Logo.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { Marquee } from "./Marquee";
import { PreviewNotice } from "./PreviewNotice";

const NAV_COLS = [
  {
    title: "Navigation",
    links: ["Home", "Showreel", "Services", "Projects", "About", "Contact"],
  },
  {
    title: "Services",
    links: ["VFX", "CFX", "Animation", "Lighting", "Production", "Administration"],
  },
  {
    title: "Studio",
    links: ["Careers", "Culture", "Press Kit", "Blog", "Privacy", "Terms"],
  },
];

const SOCIALS = [
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
];

export const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bigTextRef = useRef<HTMLDivElement>(null);
  const [previewNotice, setPreviewNotice] = useState<{ title: string; message: string } | null>(null);
  const closePreview = useCallback(() => setPreviewNotice(null), []);
  const navigate = useNavigate();

  useLayoutEffect(() => {
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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, isPlaceholder: boolean, linkText: string) => {
    if (isPlaceholder) {
      e.preventDefault();
      setPreviewNotice({
        title: "Coming Soon",
        message: `The ${linkText} page is still being developed and will be available in the final version.`,
      });
      return;
    }
  };

  return (
    <>
    <footer
      ref={containerRef}
      className="relative w-full bg-[#030303] overflow-hidden"
    >
      {/* CTA Marquee Band */}
      <div className="border-t border-b border-white/[0.04] py-4 sm:py-6">
        <Marquee speed={40} className="">
          <div className="flex items-center gap-8 sm:gap-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="contents">
                <span className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-[0.1em] text-neutral-700 whitespace-nowrap">
                  Let's Work Together
                </span>
                <span className="text-[#8C0B0C] text-xl">&#10038;</span>
              </span>
            ))}
          </div>
        </Marquee>
      </div>

      {/* Main footer content */}
      <div className="w-full px-4 md:px-[5%] py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-4 flex flex-col gap-4 sm:gap-6 lg:border-r lg:border-white/[0.04] lg:pr-8">
            <Link to="/" onClick={(e) => { e.preventDefault(); navigate("/", { state: { scrollTo: "home", _nonce: Date.now() }, replace: false }); }} className="flex items-center gap-3 group" data-cursor-hover>
              <div className="h-10 sm:h-12 w-auto flex items-center justify-center transition-colors duration-500 overflow-hidden">
                <img src={logoImg} alt="Phase One VFX" className="h-full w-auto object-contain" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-[0.15em] uppercase transition-colors duration-300">
                  <span className="text-[#8C0B0C] text-lg font-bold tracking-[0.15em] uppercase">Phase One</span>
                  <span className="ml-2 text-white text-lg font-bold tracking-[0.15em] uppercase group-hover:text-neutral-300">VFX</span>
                </span>
                <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-600 mt-0.5">
                  Next Era Visual Effects
                </p>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-sm mt-2">
              A full-spectrum VFX studio delivering uncompromising visual fidelity for film, episodic, and commercial content worldwide.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-4">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setPreviewNotice({
                      title: "Coming Soon",
                      message: "Official social media profiles will be linked in the final version.",
                    });
                  }}
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
            <div key={col.title} className="col-span-1 lg:col-span-2">
              <h4 className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-neutral-500 mb-4 sm:mb-6">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2 sm:gap-3">
                {col.links.map((link) => {
                  const isPlaceholder = col.title === "Studio";
                  const sectionId = col.title === "Services"
                    ? "services"
                    : link.toLowerCase().replace(/\s+/g, "-");
                  return (
                  <li key={link}>
                    <Link
                      to="/"
                      onClick={(e) => {
                        handleLinkClick(e, isPlaceholder, link);
                        if (!isPlaceholder) {
                          e.preventDefault();
                          navigate("/", { state: { scrollTo: sectionId, _nonce: Date.now() }, replace: false });
                        }
                      }}
                      className="text-xs sm:text-sm text-neutral-600 hover:text-white hover:pl-2 transition-all duration-300 block"
                      data-cursor-hover
                    >
                      {link}
                    </Link>
                  </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Back to top */}
          <div className="col-span-1 sm:col-span-1 lg:col-span-2 flex flex-col items-start sm:items-end lg:justify-between">
            <button
              onClick={scrollToTop}
              className="group flex flex-col items-center gap-3 self-start sm:self-end"
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
      <div ref={bigTextRef} className="border-t border-[#8C0B0C]/20 pt-6 sm:pt-8 pb-3 sm:pb-4 relative overflow-hidden">
        {/* Subtle glow behind the text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-1/2 bg-[#8C0B0C]/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="w-full px-4 md:px-[5%] relative z-10">
          <div className="flex flex-wrap justify-center">
            {"PHASE ONE VFX".split("").map((char, i) => (
              <span
                key={i}
                className={`footer-char inline-block text-[12vw] sm:text-[13vw] md:text-[10vw] font-black tracking-tighter uppercase leading-none ${
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
        <div className="w-full px-4 md:px-[5%] py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-neutral-700 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Phase One VFX. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <a href="#privacy" onClick={(e) => { e.preventDefault(); setPreviewNotice({ title: "Coming Soon", message: "Legal documentation is being finalized and will be available in the final version." }); }} className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-neutral-700 hover:text-[#8C0B0C] transition-colors" data-cursor-hover>
              Privacy Policy
            </a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); setPreviewNotice({ title: "Coming Soon", message: "Legal documentation is being finalized and will be available in the final version." }); }} className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-neutral-700 hover:text-[#8C0B0C] transition-colors" data-cursor-hover>
              Terms of Service
            </a>
            <a href="#cookies" onClick={(e) => { e.preventDefault(); setPreviewNotice({ title: "Coming Soon", message: "Legal documentation is being finalized and will be available in the final version." }); }} className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-neutral-700 hover:text-[#8C0B0C] transition-colors" data-cursor-hover>
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>

      <PreviewNotice
        isOpen={previewNotice !== null}
        onClose={closePreview}
        title={previewNotice?.title}
        message={previewNotice?.message}
      />
    </>
  );
};
