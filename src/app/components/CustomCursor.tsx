import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

export const CustomCursor = () => {
  const prefersReducedMotion = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const dotInner = dot.firstElementChild as HTMLElement;
    const ringInner = ring.firstElementChild as HTMLElement;
    if (!dotInner || !ringInner) return;

    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;

    gsap.set(dot, { x: startX, y: startY });
    gsap.set(ring, { x: startX, y: startY });

    // quickTo for both elements — dot snaps fast, ring lags for lerp feel
    const xToDot = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    };

    const handleMouseEnter = () => {
      gsap.to(dotInner, {
        backgroundColor: "#ffffff",
        boxShadow: "0 0 10px rgba(255,255,255,0.5)",
        duration: 0.25,
        ease: "power2.out",
      });
      gsap.to(ringInner, {
        borderColor: "rgba(140,11,12,0.7)",
        backgroundColor: "rgba(140,11,12,0.06)",
        duration: 0.25,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(dotInner, {
        backgroundColor: "#8C0B0C",
        boxShadow: "0 0 10px rgba(140,11,12,0.8)",
        duration: 0.25,
        ease: "power2.out",
      });
      gsap.to(ringInner, {
        borderColor: "rgba(255,255,255,0.2)",
        backgroundColor: "transparent",
        duration: 0.25,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const setupListeners = () => {
      const els = document.querySelectorAll("a, button, [data-cursor-hover], select");
      els.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    setupListeners();

    // Debounce MutationObserver — accordion opens / form state changes trigger DOM mutations;
    // without debounce this re-queries and rebinds on every single mutation.
    let debounceTimer: ReturnType<typeof setTimeout>;
    const debouncedSetup = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(setupListeners, 200);
    };

    const observer = new MutationObserver(debouncedSetup);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      const els = document.querySelectorAll("a, button, [data-cursor-hover], select");
      els.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [prefersReducedMotion]);

  // Hide custom cursor entirely for reduced-motion users
  if (prefersReducedMotion) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[99999] pointer-events-none hidden md:block"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div
          className="h-[7px] w-[7px] rounded-full bg-[#8C0B0C]"
          style={{ boxShadow: "0 0 10px rgba(140,11,12,0.8)" }}
        />
      </div>

      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[99998] pointer-events-none hidden md:block"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div className="h-9 w-9 rounded-full border border-white/20" />
      </div>
    </>
  );
};
