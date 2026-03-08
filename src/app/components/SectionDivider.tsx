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
    <div className={`w-full px-6 py-2 ${className}`}>
      <div className="container mx-auto max-w-7xl relative">
        {/* HUD detail left */}
        <div className="absolute left-0 -top-4 flex flex-col gap-1 opacity-20">
          <div className="h-1 w-1 bg-white rounded-full" />
          <div className="h-1 w-1 bg-[#8C0B0C] rounded-full" />
        </div>
        
        <div
          ref={lineRef}
          className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#8C0B0C]/40 to-transparent origin-center shadow-[0_0_15px_rgba(140,11,12,0.2)]"
          style={{ transform: "scaleX(0)" }}
        />

        {/* HUD detail right */}
        <div className="absolute right-0 -top-4 flex flex-col items-end gap-1 opacity-20">
          <div className="h-1 w-1 bg-white rounded-full" />
          <div className="h-1 w-1 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};
