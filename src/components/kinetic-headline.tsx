"use client";

import { useEffect, useRef } from "react";
import { hasFinePointer, lerp, prefersReducedMotion } from "@/lib/motion";

type Line = { text: string; serif?: boolean };

const RADIUS = 240;

/**
 * Hero headline. Characters rise out of a mask on arrival, then react to the
 * cursor: the grotesque line squeezes along Bricolage's width + weight axes
 * as the pointer passes over it; the serif line lifts and tilts.
 */
export function KineticHeadline({ lines, className = "" }: { lines: Line[]; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion() || !hasFinePointer()) return;

    const chars = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-k]"));
    const state = chars.map(() => 0);
    let centers: { x: number; y: number }[] = [];
    let mx = -9999;
    let my = -9999;
    let raf = 0;
    let running = false;

    function measure() {
      centers = chars.map((c) => {
        const r = c.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 + window.scrollY };
      });
    }

    function frame() {
      let moving = false;
      chars.forEach((c, i) => {
        const p = centers[i];
        const d = Math.hypot(mx - p.x, my + window.scrollY - p.y);
        const target = Math.max(0, 1 - d / RADIUS);
        const v = lerp(state[i], target, 0.14);
        if (Math.abs(v - target) > 0.001) moving = true;
        state[i] = v;
        // Transforms go on the mask wrapper so they never fight the CSS arrival animation on the char.
        const mask = c.parentElement!;
        if (c.dataset.k === "sans") {
          c.style.fontVariationSettings = `"wght" ${800 - 520 * v}, "wdth" ${100 - 25 * v}`;
          mask.style.transform = `translateY(${-8 * v}px)`;
        } else {
          mask.style.transform = `translateY(${-14 * v}px) rotate(${(i % 2 ? 1 : -1) * 8 * v}deg)`;
          c.style.color = v > 0.02 ? `color-mix(in oklab, var(--blue) ${Math.round(v * 100)}%, currentColor)` : "";
        }
      });
      if (moving) raf = requestAnimationFrame(frame);
      else running = false;
    }

    function onMove(e: PointerEvent) {
      mx = e.clientX;
      my = e.clientY;
      if (!running) {
        // Re-measure at the start of each run: cheap, and it picks up the end of the arrival animation.
        measure();
        running = true;
        raf = requestAnimationFrame(frame);
      }
    }
    function onLeave() {
      mx = my = -9999;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    }

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Characters are grouped per word (nowrap) so lines only ever break between words.
  let n = 0;
  const renderLine = (line: Line) =>
    line.text.split(" ").map((word, w, all) => (
      <span key={w} className="whitespace-nowrap">
        {[...word].map((ch, i) => (
          <Char key={i} ch={ch} i={n++} kind={line.serif ? "serif" : "sans"} />
        ))}
        {w < all.length - 1 && <span className="kchar-space"> </span>}
      </span>
    ));

  return (
    <h1 ref={ref} className={className} aria-label={lines.map((l) => l.text).join(" ")}>
      {lines.map((line) => (
        <span key={line.text} className="kline" aria-hidden="true">
          {line.serif ? <span className="accent-serif inline-block">{renderLine(line)}</span> : renderLine(line)}
        </span>
      ))}
    </h1>
  );
}

function Char({ ch, i, kind }: { ch: string; i: number; kind: "sans" | "serif" }) {
  return (
    <span className="kchar-mask">
      <span data-k={kind} className="kchar" style={{ "--i": i } as React.CSSProperties}>
        {ch}
      </span>
    </span>
  );
}
