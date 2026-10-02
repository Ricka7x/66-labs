"use client";

import { useEffect, useRef, type CSSProperties, type ElementType } from "react";
import { clamp, prefersReducedMotion } from "@/lib/motion";

/**
 * Long-form paragraph that brightens word by word as it scrolls through the
 * middle of the viewport, scrubbed to scroll position (not a one-shot
 * reveal): dim, unread text ahead of the scroll position, full ink behind
 * it, like a highlighter moving down the page.
 */
export function ScrubText({
  children,
  as: Tag = "p",
  className = "",
}: {
  children: string;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const words = children.split(/\s+/);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    const spans = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-sw]"));
    let raf = 0;

    function update() {
      raf = 0;
      const r = root!.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress through the block as it crosses the viewport's middle 55%.
      const start = vh * 0.78;
      const end = vh * 0.3;
      const total = r.height + (start - end);
      const p = clamp((start - r.top) / total);
      const n = spans.length;
      spans.forEach((s, i) => {
        const t = clamp((p * n - i) * 2.2);
        s.style.opacity = String(0.3 + t * 0.7);
      });
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
    <Tag ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} data-sw style={{ opacity: 0.3, transition: "opacity 0.05s linear" } as CSSProperties}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
