import React, { useEffect, useRef } from "react";

export const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const hasScrolled = useRef(false);

  useEffect(() => {
    const bar = barRef.current;
    const container = containerRef.current;
    if (!bar || !container) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);

      if (!hasScrolled.current && scrollTop > 1) {
        hasScrolled.current = true;
        container.style.opacity = "1";
      } else if (hasScrolled.current && scrollTop <= 1) {
        hasScrolled.current = false;
        container.style.opacity = "0";
      }

      bar.style.height = `${progress * 100}%`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed right-0 top-0 bottom-0 z-[200] w-[2px] pointer-events-none hidden md:block"
      style={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-white/[0.03]" />
      <div
        ref={barRef}
        className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#8C0B0C] via-[#8C0B0C] to-[#ff3333]"
        style={{ height: "0%" }}
      />
    </div>
  );
};
