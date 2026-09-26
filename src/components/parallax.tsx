"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/** Translates its children vertically as the page scrolls, GPU-safe (transform only). */
export function Parallax({
  children,
  speed = 0.25,
  className = "",
  style,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let active = false;

    function update() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2;
      const offset = (center - vh / 2) * speed;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
      raf = requestAnimationFrame(update);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !active) {
          active = true;
          raf = requestAnimationFrame(update);
        } else if (!entry.isIntersecting && active) {
          active = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "25% 0px 25% 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform", ...style }}>
      {children}
    </div>
  );
}
