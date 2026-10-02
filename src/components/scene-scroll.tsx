"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { clamp, easeInOutCubic, pinProgress } from "@/lib/motion";

const LINES: { text: string; emphasis?: string; in: [number, number]; out: [number, number] }[] = [
  { text: "Every day, something makes you mutter at your screen.", emphasis: "mutter", in: [0, 0.06], out: [0.24, 0.32] },
  { text: "We can't stand it either.", in: [0.3, 0.36], out: [0.52, 0.6] },
  { text: "So we fix it. Then we ship it.", emphasis: "ship", in: [0.58, 0.65], out: [0.97, 1] },
];

const COLORS = ["var(--blue)", "var(--coral)", "var(--violet)", "var(--lime)"];
const COLS = 5;
const ROWS = 3;
const TILE_COUNT = COLS * ROWS;

interface Tile {
  dx: number;
  dy: number;
  rot: number;
  delay: number;
  duration: number;
  color: string;
}

function makeTiles(): Tile[] {
  return Array.from({ length: TILE_COUNT }, (_, i) => ({
    dx: (Math.random() - 0.5) * 2 * (110 + Math.random() * 120),
    dy: (Math.random() - 0.5) * 2 * (50 + Math.random() * 70),
    rot: (Math.random() - 0.5) * 70,
    delay: (i / TILE_COUNT) * 0.5 + Math.random() * 0.06,
    duration: 0.26 + Math.random() * 0.08,
    color: COLORS[i % COLORS.length],
  }));
}

function bandOpacity(p: number, [inStart, inEnd]: [number, number], [outStart, outEnd]: [number, number]) {
  if (p <= inStart || p >= outEnd) return 0;
  if (p < inEnd) return clamp((p - inStart) / (inEnd - inStart));
  if (p > outStart) return clamp((outEnd - p) / (outEnd - outStart));
  return 1;
}

/**
 * One pinned beat: a scattered field of tiles settles into a clean grid,
 * each picking up a brand color as it locks into place, while three lines
 * of copy cross-fade over the same scroll range. The studio's actual
 * annoyance-to-shipped-app loop, dramatized instead of declared.
 */
export function SceneScroll() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const tiles = useMemo(makeTiles, []);

  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;

    function update() {
      raf = 0;
      const el = wrapRef.current;
      if (!el) return;
      const p = pinProgress(el);

      tiles.forEach((tile, i) => {
        const node = tileRefs.current[i];
        if (!node) return;
        const local = easeInOutCubic(clamp((p - tile.delay) / tile.duration));
        const scatter = 1 - local;
        node.style.transform = `translate3d(${tile.dx * scatter}px, ${tile.dy * scatter}px, 0) rotate(${tile.rot * scatter}deg) scale(${0.55 + 0.45 * local})`;
        node.style.opacity = `${0.3 + 0.7 * local}`;
        node.style.backgroundColor = `color-mix(in oklab, ${tile.color} ${Math.round(local * 100)}%, var(--ink-soft))`;
      });

      LINES.forEach((line, i) => {
        const node = lineRefs.current[i];
        if (node) node.style.opacity = `${bandOpacity(p, line.in, line.out)}`;
      });

      if (glowRef.current) glowRef.current.style.opacity = `${clamp(p / 0.85) * 0.35}`;
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
  }, [reduceMotion, tiles]);

  if (reduceMotion) {
    return (
      <section className="bg-paper px-5 py-24 text-center md:px-14">
        <div className="mx-auto grid max-w-xs grid-cols-5 gap-2 opacity-90 md:max-w-sm">
          {tiles.map((tile, i) => (
            <div key={i} className="aspect-square rounded-xl" style={{ background: tile.color }} />
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-lg space-y-3">
          {LINES.map((line) => (
            <p key={line.text} className="font-display text-2xl font-extrabold tracking-tight">
              {line.emphasis
                ? line.text.split(line.emphasis).map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && <em>{line.emphasis}</em>}
                    </span>
                  ))
                : line.text}
            </p>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div ref={wrapRef} style={{ height: "280vh" }} className="relative bg-paper">
      <div className="sticky top-0 flex h-dvh flex-col items-center justify-center overflow-hidden px-6">
        <div ref={glowRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-0 blur-[110px]" style={{ background: "radial-gradient(circle at 50% 58%, var(--blue) 0%, transparent 62%)" }} />

        <div className="relative z-10 grid h-24 max-w-90 place-items-center text-center md:h-28 md:max-w-2xl">
          {LINES.map((line, i) => (
            <div
              key={line.text}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className="col-start-1 row-start-1 font-display text-xl font-extrabold leading-tight tracking-tight text-ink opacity-0 md:text-4xl"
            >
              {line.emphasis
                ? line.text.split(line.emphasis).map((part, j, arr) => (
                    <span key={j}>
                      {part}
                      {j < arr.length - 1 && <em>{line.emphasis}</em>}
                    </span>
                  ))
                : line.text}
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-16 grid gap-3 md:mt-20 md:gap-4" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
          {tiles.map((tile, i) => (
            <div
              key={i}
              ref={(el) => {
                tileRefs.current[i] = el;
              }}
              className="h-10 w-10 rounded-xl will-change-transform md:h-14 md:w-14"
              style={{ background: "var(--ink-soft)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
