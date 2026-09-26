"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { clamp, easeInOutCubic, pinProgress } from "@/lib/motion";

const SCENES = [
  {
    label: "Small.",
    sub: "One app, one job. It does that job brilliantly, then gets out of your way.",
    bg: "#f4f2ea",
    fg: "#0b0b0a",
    accent: "#1556db",
    origin: "50% 50%",
  },
  {
    label: "Native.",
    sub: "Swift and SwiftUI, built for the platform it runs on, not a website in an app costume.",
    bg: "#0b0b0a",
    fg: "#f4f2ea",
    accent: "#fe6445",
    origin: "20% 80%",
  },
  {
    label: "Fair.",
    sub: "Priced so anyone who needs the fix can actually have it.",
    bg: "#1556db",
    fg: "#f4f2ea",
    accent: "#c4f042",
    origin: "80% 20%",
  },
];

/**
 * Three pinned statements. Scroll grows each next scene out of a circle over
 * the last one, while the outgoing word shrinks back into the page and the
 * incoming one settles from oversize, all scrubbed directly by scroll.
 */
export function SceneScroll() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const words = useRef<(HTMLDivElement | null)[]>([]);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    const n = SCENES.length;

    function update() {
      raf = 0;
      const el = wrapRef.current;
      if (!el) return;
      const seg = pinProgress(el) * (n - 1);

      SCENES.forEach((s, i) => {
        const layer = layers.current[i];
        const word = words.current[i];
        const enter = i === 0 ? 1 : easeInOutCubic(clamp(seg - (i - 1)));
        const leave = i === n - 1 ? 0 : easeInOutCubic(clamp(seg - i));
        if (layer && i > 0) layer.style.clipPath = `circle(${enter * 150}% at ${s.origin})`;
        if (word) {
          const scale = (i === 0 ? 1 : 1.35 - 0.35 * enter) * (1 - 0.25 * leave);
          word.style.transform = `translateY(${leave * -12}vh) scale(${scale})`;
          word.style.opacity = `${1 - leave}`;
        }
        const dot = dots.current[i];
        if (dot) dot.style.transform = `scaleX(${clamp(seg - i + 1)})`;
      });
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <div className="flex flex-col gap-16 bg-ink px-5 py-24 text-paper md:px-14">
        {SCENES.map((s) => (
          <div key={s.label}>
            <h2 className="font-display text-5xl font-extrabold tracking-tight md:text-6xl">{s.label}</h2>
            <p className="mt-3 max-w-md opacity-70">{s.sub}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapRef} style={{ height: `${SCENES.length * 110}vh` }} className="relative">
      <div className="sticky top-0 h-dvh overflow-hidden">
        {SCENES.map((s, i) => (
          <div
            key={s.label}
            ref={(el) => {
              layers.current[i] = el;
            }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            style={{ background: s.bg, color: s.fg, clipPath: i === 0 ? undefined : `circle(0% at ${s.origin})` }}
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-60">
              {String(i + 1).padStart(2, "0")} / {String(SCENES.length).padStart(2, "0")}
            </span>
            <div
              ref={(el) => {
                words.current[i] = el;
              }}
              className="will-change-transform"
            >
              <h2 className="mt-6 font-display text-[19vw] font-extrabold leading-none tracking-tight md:text-[12vw]">
                {s.label.slice(0, -1)}
                <span style={{ color: s.accent }}>.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-md text-base opacity-75 md:text-lg">{s.sub}</p>
            </div>
          </div>
        ))}
        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex justify-center gap-2 mix-blend-difference">
          {SCENES.map((s, i) => (
            <span key={s.label} aria-hidden="true" className="relative h-1 w-10 overflow-hidden rounded-full bg-white/25">
              <span
                ref={(el) => {
                  dots.current[i] = el;
                }}
                className="absolute inset-0 origin-left [transform:scaleX(0)] bg-white"
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
