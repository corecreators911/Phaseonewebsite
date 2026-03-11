import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import logoImg from "@/assets/a2e2c8a6ed7fae1fb56e5aa4277b6dad6f92533f.png";

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const textLinesRef = useRef<HTMLDivElement>(null);
  const overlayTopRef = useRef<HTMLDivElement>(null);
  const overlayBottomRef = useRef<HTMLDivElement>(null);
  const bottomInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // Animate percentage counter
    const percentObj = { value: 0 };
    tl.to(
      percentObj,
      {
        value: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: () => {
          if (percentRef.current) {
            percentRef.current.innerText = `${Math.round(percentObj.value).toString().padStart(3, "0")}`;
          }
        },
      },
      0
    );

    // Progress bar
    tl.to(
      progressRef.current,
      {
        width: "100%",
        duration: 2.5,
        ease: "power2.inOut",
      },
      0
    );

    // Glow pulse
    tl.to(
      glowRef.current,
      {
        opacity: 0.6,
        scale: 1.5,
        duration: 2.5,
        ease: "power2.inOut",
      },
      0
    );

    // Text lines animate
    if (textLinesRef.current) {
      const lines = textLinesRef.current.querySelectorAll(".line");
      tl.fromTo(
        lines,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" },
        0.3
      );
    }

    // Hide the counter/bottom info immediately when it hits 100
    tl.to(
      bottomInfoRef.current,
      { opacity: 0, y: 10, duration: 0.4, ease: "power2.inOut" },
      2.5
    );

    // Logo reveal
    tl.to(
      logoRef.current,
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "expo.out",
      },
      2.7
    );

    // Logo fade + split curtain exit
    tl.to(logoRef.current, {
      opacity: 0,
      scale: 1.15,
      filter: "blur(15px)",
      duration: 0.5,
      ease: "power2.in",
    }, 3.8);

    // Curtain split begins right as the logo is fading out
    tl.to(
      overlayTopRef.current,
      {
        y: "-100%",
        duration: 1,
        ease: "power4.inOut",
      },
      3.8
    );
    tl.to(
      overlayBottomRef.current,
      {
        y: "100%",
        duration: 1,
        ease: "power4.inOut",
      },
      3.8
    );

    // Final container fade
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    }, 4.4);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center text-white overflow-hidden"
    >
      {/* Split curtain panels */}
      <div
        ref={overlayTopRef}
        className="absolute top-0 left-0 right-0 h-[51%] bg-[#030303] z-20"
      />
      <div
        ref={overlayBottomRef}
        className="absolute bottom-0 left-0 right-0 h-[51%] bg-[#030303] z-20"
      />

      {/* Cinematic radial glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(140,11,12,0.2)_0%,rgba(0,0,0,0)_50%)] opacity-0 scale-90 z-10"
      />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-10 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

      {/* Logo */}
      <div className="relative flex flex-col items-center z-30">
        <img
          ref={logoRef}
          src={logoImg}
          alt="Phase One Logo"
          className="h-24 md:h-32 object-contain opacity-0 scale-95 drop-shadow-[0_0_30px_rgba(140,11,12,0.5)] blur-sm"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* Bottom loading info */}
      <div ref={bottomInfoRef} className="absolute bottom-12 md:bottom-16 left-0 right-0 px-8 md:px-16 z-30">
        <div className="max-w-lg mx-auto">
          {/* System text lines */}
          <div ref={textLinesRef} className="flex justify-between items-end mb-4">
            <div className="flex flex-col gap-1">
              <span className="line opacity-0 text-[9px] font-mono uppercase tracking-[0.3em] text-white/20">
                Phase One VFX
              </span>
              <span className="line opacity-0 text-[9px] font-mono uppercase tracking-[0.3em] text-white/20">
                Initializing Pipeline...
              </span>
            </div>
            <div
              ref={percentRef}
              className="line opacity-0 text-3xl md:text-4xl font-black tracking-tighter text-white/80 tabular-nums font-mono"
            >
              000
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-[1px] w-full bg-white/[0.06]">
            <div
              ref={progressRef}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8C0B0C]/50 via-[#8C0B0C] to-white/80 shadow-[0_0_20px_rgba(140,11,12,0.8)]"
              style={{ width: "0%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
