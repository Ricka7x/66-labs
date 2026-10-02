"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppIcon } from "@/components/app-icon";
import { prefersReducedMotion } from "@/lib/motion";
import type { App } from "@/lib/apps";

type Sticker = Pick<App, "slug" | "name" | "iconFullBleed">;

// Resting spots as fractions of the hero, desktop vs. narrow screens.
// Room for up to five on wide screens and three on phones; extra apps simply don't get a sticker
// (the shelf below lists every app).
const SPOTS_WIDE = [
  { x: 0.8, y: 0.28, r: -8 },
  { x: 0.87, y: 0.44, r: 10 },
  { x: 0.7, y: 0.56, r: 4 },
  { x: 0.9, y: 0.16, r: -12 },
  { x: 0.84, y: 0.7, r: 7 },
];
// On phones the stickers get their own strip above the marquee; y is px up from the hero's bottom.
const SPOTS_NARROW = [
  { x: 0.2, y: 200, r: -8 },
  { x: 0.5, y: 225, r: 10 },
  { x: 0.8, y: 195, r: 4 },
];

/**
 * The app icons as physical stickers: they bob idly, and can be grabbed and
 * thrown around the hero, they keep momentum, spin with speed and bounce off
 * the edges. Purely decorative (the shelf below has the real links).
 */
export function HeroStickers({ apps: all }: { apps: Sticker[] }) {
  // Memoized: a fresh array each render would re-run the physics setup and snap stickers home mid-drag.
  const apps = useMemo(() => all.slice(0, SPOTS_WIDE.length), [all]);
  const boxRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const reduced = prefersReducedMotion();

    const bodies = apps.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, r: 0, vr: 0, size: 0, drag: false, px: 0, py: 0, t0: 0 }));
    let W = 0;
    let H = 0;

    function place() {
      const rect = box!.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const narrow = W < 768;
      const spots = narrow ? SPOTS_NARROW : SPOTS_WIDE;
      bodies.forEach((b, i) => {
        const el = els.current[i];
        if (el) el.style.display = i < spots.length ? "" : "none";
        const spot = spots[Math.min(i, spots.length - 1)];
        b.size = els.current[i]?.offsetWidth ?? 120;
        b.x = spot.x * W - b.size / 2;
        b.y = narrow ? H - spot.y : spot.y * H - b.size / 2;
        b.r = spot.r;
        b.vx = b.vy = b.vr = 0;
      });
    }
    place();

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(box);
    const start = performance.now();
    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = (now - start) / 1000;
      bodies.forEach((b, i) => {
        const el = els.current[i];
        if (!el) return;
        if (!b.drag) {
          b.x += b.vx;
          b.y += b.vy;
          b.r += b.vr;
          b.vx *= 0.94;
          b.vy *= 0.94;
          b.vr *= 0.92;
          const max = { x: W - b.size, y: H - b.size };
          if (b.x < 0 || b.x > max.x) {
            b.x = Math.max(0, Math.min(max.x, b.x));
            b.vx *= -0.65;
            b.vr += b.vy * 0.2;
          }
          if (b.y < 0 || b.y > max.y) {
            b.y = Math.max(0, Math.min(max.y, b.y));
            b.vy *= -0.65;
            b.vr -= b.vx * 0.2;
          }
        }
        const bob = reduced || b.drag ? 0 : Math.sin(t * 1.3 + i * 2.1) * 7;
        el.style.transform = `translate3d(${b.x}px, ${b.y + bob}px, 0) rotate(${b.r}deg) scale(${b.drag ? 1.08 : 1})`;
      });
    }
    raf = requestAnimationFrame(frame);

    const cleanups = els.current.map((el, i) => {
      if (!el || reduced) return () => {};
      const b = bodies[i];
      let ox = 0;
      let oy = 0;
      function down(e: PointerEvent) {
        e.preventDefault(); // no text selection while dragging
        el!.setPointerCapture(e.pointerId);
        b.drag = true;
        ox = e.clientX - b.x;
        oy = e.clientY - b.y;
        b.px = e.clientX;
        b.py = e.clientY;
        b.t0 = performance.now();
        el!.style.zIndex = "5";
        document.getSelection()?.removeAllRanges();
        setTouched(true);
      }
      function move(e: PointerEvent) {
        if (!b.drag) return;
        const now = performance.now();
        const dt = Math.max(1, now - b.t0) / 16.7;
        b.vx = (e.clientX - b.px) / dt;
        b.vy = (e.clientY - b.py) / dt;
        b.px = e.clientX;
        b.py = e.clientY;
        b.t0 = now;
        b.x = e.clientX - ox;
        b.y = e.clientY - oy;
        b.r += b.vx * 0.25;
      }
      function up() {
        b.drag = false;
        b.vr = b.vx * 0.4;
        el!.style.zIndex = "";
      }
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      return () => {
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
      };
    });

    const ro = new ResizeObserver(place);
    ro.observe(box);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      cleanups.forEach((c) => c());
    };
  }, [apps]);

  return (
    <div ref={boxRef} className="pointer-events-none absolute inset-0 z-3" aria-hidden="true">
      {apps.map((a, i) => (
        <div
          key={a.slug}
          ref={(el) => {
            els.current[i] = el;
          }}
          className="sticker pointer-events-auto absolute left-0 top-0 cursor-grab touch-none select-none active:cursor-grabbing"
          style={{ "--i": i } as React.CSSProperties}
        >
          <div className="sticker-inner h-24 w-24 md:h-36 md:w-36">
            <AppIcon app={a} className="h-full w-full" sizes="(min-width: 768px) 144px, 96px" preload />
          </div>
          <span className="mt-2 block text-center font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
            {a.name}
          </span>
        </div>
      ))}
      <span
        className={`sticker-hint pointer-events-none absolute right-[21%] top-[12%] hidden font-sans text-xl text-ink-soft transition-opacity duration-500 md:block ${
          touched ? "opacity-0" : ""
        }`}
      >
        <em>psst, you can throw these</em>
        <svg viewBox="0 0 60 40" className="ml-auto mt-1 h-8 w-12" fill="none" aria-hidden="true">
          <path d="M4 4c18 1 36 6 48 26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M44 28l8 2 0-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}
