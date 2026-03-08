import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const ScrollProgress = () => {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!progressRef.current) return;

    gsap.to(progressRef.current, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });
  }, []);

  return (
    <div className="fixed right-0 top-0 bottom-0 z-[90] w-[2px] pointer-events-none hidden md:block">
      <div className="absolute inset-0 bg-white/[0.03]" />
      <div
        ref={progressRef}
        className="absolute top-0 left-0 w-full h-full origin-top bg-gradient-to-b from-[#8C0B0C] via-[#8C0B0C] to-[#ff3333] shadow-[0_0_8px_rgba(140,11,12,0.6)]"
        style={{ transform: "scaleY(0)" }}
      />
    </div>
  );
};
