import React, { useRef, useEffect } from "react";
import gsap from "gsap";

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

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const contentWidth = inner.scrollWidth / 2;
    const duration = contentWidth / speed;

    gsap.set(inner, { x: direction === "left" ? 0 : -contentWidth });

    const tween = gsap.to(inner, {
      x: direction === "left" ? -contentWidth : 0,
      duration,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, [speed, direction]);

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
