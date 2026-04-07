import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useReducedMotion } from "../../lib/useReducedMotion";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  speed = 50,
  direction = "left",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    // Show content statically when user prefers reduced motion
    if (prefersReducedMotion) return;

    const contentWidth = inner.scrollWidth / 2;
    const duration = contentWidth / speed;
    const startX = direction === "left" ? 0 : -contentWidth;

    gsap.set(inner, { x: startX, force3D: true });

    const tween = gsap.to(inner, {
      x: direction === "left" ? -contentWidth : 0,
      duration,
      ease: "none",
      repeat: -1,
      force3D: true,
      modifiers: {
        x: gsap.utils.unitize(gsap.utils.wrap(-contentWidth, 0)),
      },
    });

    return () => {
      tween.kill();
    };
  }, [speed, direction, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden whitespace-nowrap ${className}`}
    >
      <div ref={innerRef} className="inline-flex will-change-transform">
        {children}
        {children}
      </div>
    </div>
  );
};
