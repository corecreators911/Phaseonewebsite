import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const dotInner = dot.firstElementChild as HTMLElement;
    const ringInner = ring.firstElementChild as HTMLElement;
    if (!dotInner || !ringInner) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    const speed = 0.12;
    let rafId: number;

    gsap.set(dot, { x: pos.x, y: pos.y });
    gsap.set(ring, { x: pos.x, y: pos.y });

    const xToDot = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      xToDot(e.clientX);
      yToDot(e.clientY);
    };

    const tick = () => {
      pos.x += (mouse.x - pos.x) * speed;
      pos.y += (mouse.y - pos.y) * speed;
      gsap.set(ring, { x: pos.x, y: pos.y });
      rafId = requestAnimationFrame(tick);
    };

    // Hover in: dot turns white, ring border turns crimson — no size change
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

    // Hover out: back to default red dot + faint white ring
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

    window.addEventListener("mousemove", handleMouseMove);
    rafId = requestAnimationFrame(tick);

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

    const observer = new MutationObserver(setupListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      const els = document.querySelectorAll("a, button, [data-cursor-hover], select");
      els.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Dot — snaps instantly to pointer */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[10000] pointer-events-none hidden md:block"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div
          className="h-[7px] w-[7px] rounded-full bg-[#8C0B0C]"
          style={{ boxShadow: "0 0 10px rgba(140,11,12,0.8)" }}
        />
      </div>

      {/* Follower ring — lags behind with lerp */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div className="h-9 w-9 rounded-full border border-white/20" />
      </div>
    </>
  );
};
