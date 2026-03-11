import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SectionDividerProps {
  className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ className = "" }) => {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: lineRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className={`w-full px-4 sm:px-6 py-2 sm:py-3 ${className}`}>
      <div className="container mx-auto max-w-7xl relative flex items-center gap-3">
        {/* HUD dot left */}
        <div className="h-[3px] w-[3px] rounded-full bg-[#8C0B0C] opacity-40 flex-shrink-0" />

        <div
          ref={lineRef}
          className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#8C0B0C]/35 to-transparent origin-center shadow-[0_0_12px_rgba(140,11,12,0.15)]"
          style={{ transform: "scaleX(0)" }}
        />

        {/* HUD dot right */}
        <div className="h-[3px] w-[3px] rounded-full bg-white/20 opacity-40 flex-shrink-0" />
      </div>
    </div>
  );
};