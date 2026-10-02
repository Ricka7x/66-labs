"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clamp, prefersReducedMotion } from "@/lib/motion";

/**
 * Small eyebrow label that starts rotated on its side (like a spine label)
 * and untwists flat as it scrolls up through the bottom third of the
 * viewport, scrubbed directly to scroll position. Settles well before the
 * heading below it arrives so it reads as a hinge, not a distraction.
 */
export function OrientKicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;

    function update() {
      raf = 0;
      const r = el!.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 at the bottom edge of the viewport, 1 once the label has risen to 60% up the screen.
      const t = clamp(1 - (r.top - vh * 0.4) / (vh * 0.45));
      const angle = (1 - t) * -90;
      const x = (1 - t) * -18;
      el!.style.transform = `translate3d(${x}px,0,0) rotate(${angle}deg)`;
      el!.style.opacity = String(0.35 + t * 0.65);
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <span
      ref={ref}
      className={`inline-block origin-left will-change-transform ${className}`}
      style={{ transform: "rotate(-90deg) translate3d(-18px,0,0)" }}
    >
      {children}
    </span>
  );
}
