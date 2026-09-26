"use client";

import { useEffect, useRef } from "react";
import { easeOutExpo } from "@/lib/motion";
import { lockScroll } from "@/components/smooth-scroll";

const COUNT_MS = 1300;

/**
 * First-visit-per-session intro: a counter runs 00 → 66, then the panel lifts
 * away on a curved edge. The `intro` class is set by the inline script in
 * layout.tsx before paint, so returning visitors never see a flash of it.
 * Everything that animates "on arrival" keys off `html.intro-done`.
 */
export function IntroLoader() {
  const panelRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("intro")) {
      html.classList.add("intro-done");
      return;
    }

    try {
      sessionStorage.setItem("66-intro", "1");
    } catch {}
    lockScroll(true);

    const start = performance.now();
    let raf = 0;
    const timers: number[] = [];

    function tick(now: number) {
      const t = Math.min(1, (now - start) / COUNT_MS);
      if (countRef.current) countRef.current.textContent = String(Math.round(easeOutExpo(t) * 66)).padStart(2, "0");
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        panelRef.current?.classList.add("leaving");
        // Let the hero start rising while the panel is still lifting off it.
        timers.push(window.setTimeout(() => html.classList.add("intro-done"), 280));
        timers.push(
          window.setTimeout(() => {
            html.classList.remove("intro");
            lockScroll(false);
          }, 1000),
        );
      }
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div ref={panelRef} className="intro-panel" aria-hidden="true">
      <div className="flex w-full items-end justify-between px-5 pb-8 md:px-14 md:pb-12">
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-[rgba(244,242,234,0.5)]">
          66 studio: loading the shelf
        </span>
        <span ref={countRef} className="font-display text-[28vw] font-extrabold leading-[0.8] tracking-tight md:text-[18vw]">
          00
        </span>
      </div>
    </div>
  );
}
