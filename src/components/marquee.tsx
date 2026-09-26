"use client";

import { useEffect, useRef } from "react";
import { lerp, prefersReducedMotion, scrollState } from "@/lib/motion";

/**
 * Endless ticker that answers to the scroll: fling the page and it speeds up,
 * leans into the direction of travel, and flips direction when you scroll back up.
 */
export function Marquee({ items, className = "bg-ink text-paper" }: { items: string[]; className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;

    let x = 0;
    let dir = 1;
    let skew = 0;
    let raf = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(track);

    function frame() {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const v = scrollState.velocity;
      if (Math.abs(v) > 0.5) dir = Math.sign(v);
      const half = track!.scrollWidth / 2;
      x -= (0.6 + Math.min(Math.abs(v) * 0.35, 14)) * dir;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      skew = lerp(skew, Math.max(-12, Math.min(12, -v * 0.6)), 0.12);
      track!.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`;
    }
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const group = (
    <span className="inline-flex items-center">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-5.5 px-5.5 font-display text-xl font-extrabold uppercase tracking-tight md:text-3xl"
        >
          {i % 2 ? <em className="normal-case">{item.toLowerCase()}</em> : item}
          <i aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-coral not-italic md:h-2 md:w-2" />
        </span>
      ))}
    </span>
  );

  return (
    <div className={`overflow-hidden whitespace-nowrap py-4 md:py-5 ${className}`} aria-hidden="true">
      <div ref={trackRef} className="inline-flex w-max will-change-transform">
        {group}
        {group}
      </div>
    </div>
  );
}
