import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const pos = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };
    const speed = 0.15;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "none",
      });
    };

    const tick = () => {
      pos.x += (mouse.x - pos.x) * speed;
      pos.y += (mouse.y - pos.y) * speed;

      gsap.set(follower, {
        x: pos.x,
        y: pos.y,
      });

      requestAnimationFrame(tick);
    };

    // Scale up on interactive elements
    const handleMouseEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const isProject = target.hasAttribute("data-cursor-project");
      
      gsap.to(follower, { 
        scale: isProject ? 4.5 : 2.5, 
        opacity: isProject ? 0.9 : 0.15, 
        backgroundColor: isProject ? "#8C0B0C" : "transparent",
        borderColor: isProject ? "transparent" : "rgba(255, 255, 255, 0.2)",
        duration: 0.4, 
        ease: "power3.out" 
      });
      gsap.to(cursor, { scale: 0.5, opacity: 0, duration: 0.4, ease: "power3.out" });
      
      if (isProject) {
        const text = target.getAttribute("data-cursor-text") || "VIEW";
        const label = document.createElement("div");
        label.className = "cursor-label absolute inset-0 flex items-center justify-center text-[10px] font-black tracking-tighter text-white uppercase";
        label.innerText = text;
        follower.appendChild(label);
        gsap.fromTo(label, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.3, delay: 0.1 });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(follower, { 
        scale: 1, 
        opacity: 0.3, 
        backgroundColor: "transparent",
        borderColor: "rgba(255, 255, 255, 0.2)",
        duration: 0.4, 
        ease: "power3.out" 
      });
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" });
      
      const labels = follower.querySelectorAll(".cursor-label");
      labels.forEach(l => {
        gsap.to(l, { opacity: 0, scale: 0.5, duration: 0.2, onComplete: () => l.remove() });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    requestAnimationFrame(tick);

    // Listen for interactive elements
    const setupListeners = () => {
      const interactiveEls = document.querySelectorAll("a, button, [data-cursor-hover], [data-cursor-project]");
      interactiveEls.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    setupListeners();

    // Re-observe for dynamically added elements
    const observer = new MutationObserver(() => {
      setupListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      const interactiveEls = document.querySelectorAll("a, button, [data-cursor-hover], [data-cursor-project]");
      interactiveEls.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Dot cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[10000] pointer-events-none hidden md:block"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div className="h-2 w-2 rounded-full bg-[#8C0B0C] shadow-[0_0_10px_rgba(140,11,12,0.8)]" />
      </div>
      {/* Follower ring */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div className="h-10 w-10 rounded-full border border-white/20 opacity-30 mix-blend-difference" />
      </div>
    </>
  );
};
