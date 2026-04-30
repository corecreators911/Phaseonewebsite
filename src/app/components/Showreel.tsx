import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Volume2, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { magneticHandlers } from "@/lib/constants";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

export const Showreel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const playBtnRef = useRef<HTMLButtonElement>(null);
  const textRevealRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [isHoveringPlay, setIsHoveringPlay] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // Close on ESC key
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isModalOpen, closeModal]);

  // useLayoutEffect is CRITICAL here: GSAP's `pin: true` wraps the element in a
  // `.pin-spacer` div that React doesn't know about. useLayoutEffect cleanup runs
  // synchronously before React removes DOM nodes, giving ctx.revert() a chance to
  // unwrap the pin-spacer first. useEffect cleanup runs too late (after DOM removal
  // attempt), leaving the pinned element stuck on screen across route changes.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // Scale up when scrolling into view
      gsap.fromTo(
        videoRef.current,
        { scale: 0.5, clipPath: "inset(0% round 60px)", opacity: 0, filter: "brightness(0)" },
        {
          scale: 1,
          clipPath: "inset(0% round 0px)",
          opacity: 1,
          filter: "brightness(1)",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        }
      );

      // Pin and scale down timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%",
          pin: true,
          pinSpacing: true,
          scrub: true,
        }
      });

      // Stay full size for the first half of the pin
      tl.to(videoRef.current, {
        scale: 1,
        clipPath: "inset(0% round 0px)",
        opacity: 1,
        filter: "brightness(1)",
        duration: 1,
        ease: "none"
      });

      // Scale down during the second half of the pin
      tl.to(videoRef.current, {
        scale: 0.85,
        clipPath: "inset(0% round 40px)",
        opacity: 0.3,
        filter: "brightness(0.3)",
        duration: 1,
        ease: "none"
      });

      // Text reveal from bottom
      if (textRevealRef.current) {
        const words = textRevealRef.current.querySelectorAll(".word-reveal");
        gsap.fromTo(
          words,
          { y: "110%", opacity: 0, rotationX: -90 },
          {
            y: "0%",
            opacity: 1,
            rotationX: 0,
            duration: 1.2,
            stagger: 0.06,
            ease: "power4.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Magnetic play button
      const btn = playBtnRef.current;
      if (btn) {
        // Cache rect on mouseenter — avoids getBoundingClientRect() reflow on every mousemove
        let btnRect = btn.getBoundingClientRect();

        const handleBtnEnter = () => {
          btnRect = btn.getBoundingClientRect();
        };
        const handleMouseMove = (e: MouseEvent) => {
          const x = (e.clientX - btnRect.left - btnRect.width / 2) * 0.4;
          const y = (e.clientY - btnRect.top - btnRect.height / 2) * 0.4;
          gsap.to(btn, { x, y, duration: 0.6, ease: "power3.out" });
        };

        const handleMouseLeave = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
        };

        const handleResize = () => {
          btnRect = btn.getBoundingClientRect();
        };

        btn.addEventListener("mouseenter", handleBtnEnter);
        btn.addEventListener("mousemove", handleMouseMove);
        btn.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("resize", handleResize, { passive: true });

        magneticHandlers.set(btn, { handleBtnEnter, handleMouseMove, handleMouseLeave, handleResize });
      }

      // Required: pin-spacer injection changes document height; other ScrollTriggers
      // need to recalculate. App's automatic 400ms refresh runs too late for this pin.
      ScrollTrigger.refresh(true);
    }, containerRef);

    return () => {
      ctx.revert();
      const btn = playBtnRef.current;
      if (btn) {
        const handlers = magneticHandlers.get(btn);
        if (handlers) {
          btn.removeEventListener("mouseenter", handlers.handleBtnEnter);
          btn.removeEventListener("mousemove", handlers.handleMouseMove);
          btn.removeEventListener("mouseleave", handlers.handleMouseLeave);
          window.removeEventListener("resize", handlers.handleResize);
          magneticHandlers.delete(btn);
        }
      }
    };
  }, [prefersReducedMotion]);

  return (
    <>
      <section
        id="showreel"
        ref={containerRef}
        className="relative z-10 w-full h-screen bg-black scroll-mt-24"
      >
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <div
            ref={videoRef}
            className="relative w-full h-full overflow-hidden will-change-transform bg-black"
          >
            {/* Hardcoded thumbnail from Vimeo oEmbed API (vimeo.com/api/oembed.json?url=https://vimeo.com/1187215201); size upscaled from returned 295x166 */}
            <ImageWithFallback
              src="https://i.vimeocdn.com/video/2151134813-9932fbd91908e878ff2ec043af3ae3de1bd6011fc37aa75948f2898943496858-d_1280x720?region=us"
              alt="Showreel Thumbnail"
              width={1280}
              height={720}
              className="w-full h-full object-cover opacity-70"
            />

            {/* Cinematic overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />

            {/* Anamorphic lens lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[20%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8C0B0C]/20 to-transparent" />
              <div className="absolute bottom-[20%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8C0B0C]/20 to-transparent" />
            </div>

            {/* Magnetic play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                ref={playBtnRef}
                type="button"
                aria-label="Play showreel"
                className="relative cursor-pointer will-change-transform bg-transparent border-none p-0"
                onMouseEnter={() => setIsHoveringPlay(true)}
                onMouseLeave={() => setIsHoveringPlay(false)}
                onClick={() => setIsModalOpen(true)}
                data-cursor-hover
              >
                {/* Outer ring pulse */}
                <div
                  className={`absolute inset-[-20px] rounded-full border border-[#8C0B0C]/30 transition-all duration-700 ${isHoveringPlay ? "scale-125 opacity-0" : "scale-100 opacity-100"
                    }`}
                />
                <div
                  className={`absolute inset-[-10px] rounded-full border border-white/10 transition-all duration-500 ${isHoveringPlay ? "scale-110 border-[#8C0B0C]/40" : "scale-100"
                    }`}
                />

                <div
                  className={`relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center transition-all duration-700 ${isHoveringPlay
                    ? "bg-[#8C0B0C] shadow-[0_0_80px_rgba(140,11,12,0.6)]"
                    : "bg-white/5 backdrop-blur-xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                    }`}
                >
                  <Play
                    className={`ml-1 sm:ml-1.5 transition-all duration-500 ${isHoveringPlay ? "text-white scale-110" : "text-white/90"
                      }`}
                    size={24}
                    fill="currentColor"
                  />
                </div>
              </button>
            </div>

            {/* HUD info - top left */}
            <div className="absolute top-6 left-6 md:top-12 md:left-12 flex items-center gap-3 mt-12 ml-4">
              <div className="h-1.5 w-1.5 rounded-full bg-[#8C0B0C] animate-pulse shadow-[0_0_8px_rgba(140,11,12,1)]" />
              <span className="text-[9px] md:text-[10px] font-mono text-neutral-500 uppercase tracking-[0.3em]">
                REC 00:02:47:18
              </span>
            </div>

            {/* HUD info - top right */}
            <div className="absolute top-6 right-6 md:top-12 md:right-12 flex items-center gap-3 mt-12 mr-4">
              <Volume2 className="w-3 h-3 text-neutral-500" />
              <span className="text-[9px] md:text-[10px] font-mono text-neutral-500 uppercase tracking-[0.3em]">
                4K / 24fps / LOG
              </span>
            </div>

            {/* Bottom text reveal */}
            <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-12">
              <div ref={textRevealRef} className="flex flex-col gap-1.5 sm:gap-2">
                <div className="overflow-hidden">
                  <div className="flex items-baseline gap-3 sm:gap-4">
                    <span className="word-reveal inline-block text-[9px] sm:text-[10px] md:text-xs font-mono text-[#8C0B0C] uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                      Personal_Reel_2026
                    </span>
                    <span className="word-reveal inline-block w-8 sm:w-12 h-[1px] bg-[#8C0B0C]/50 self-center" />
                  </div>
                </div>
                <div className="overflow-hidden">
                  <h2 className="flex flex-wrap gap-x-1.5 sm:gap-x-3 md:gap-x-4">
                    {"SHOWREEL".split("").map((letter, i) => (
                      <span
                        key={i}
                        className="word-reveal inline-block text-3xl sm:text-5xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter text-white"
                        style={{ lineHeight: 0.85 }}
                      >
                        {letter}
                      </span>
                    ))}
                  </h2>
                </div>
                <div className="overflow-hidden mt-1 sm:mt-2">
                  <p className="word-reveal text-[8px] sm:text-[10px] md:text-xs font-mono text-neutral-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] max-w-xs sm:max-w-sm">
                    Visual Effects & 3D Animation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showreel Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/95 backdrop-blur-xl"
            onClick={closeModal}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 md:top-10 md:right-10 z-10 h-12 w-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:border-[#8C0B0C]/50 hover:bg-[#8C0B0C]/10 transition-all duration-300"
              aria-label="Close showreel"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Modal content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
              className="relative w-[90vw] max-w-5xl aspect-video rounded-2xl overflow-hidden border border-white/[0.06] bg-neutral-950"
              onClick={(e) => e.stopPropagation()}
              data-cursor-hide
            >
              <iframe
                src="https://player.vimeo.com/video/1187215201?autoplay=1"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Phase One VFX Showreel 2026"
              />

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-10 h-10 border-l border-t border-[#8C0B0C]/30" />
              <div className="absolute top-0 right-0 w-10 h-10 border-r border-t border-[#8C0B0C]/30" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-l border-b border-[#8C0B0C]/30" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-r border-b border-[#8C0B0C]/30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
