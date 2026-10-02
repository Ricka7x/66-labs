"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { clamp, easeOutExpo, hasFinePointer, lerp, prefersReducedMotion } from "@/lib/motion";

/** Counts up from zero the first time it scrolls into view. */
export function CountUp({ to, pad = 2, duration = 1400 }: { to: number; pad?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    el.textContent = "0".padStart(pad, "0");
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        el.textContent = String(Math.round(easeOutExpo(t) * to)).padStart(pad, "0");
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, pad, duration]);

  return <span ref={ref}>{String(to).padStart(pad, "0")}</span>;
}

/**
 * Like CountUp, but scrubbed directly to scroll position instead of firing
 * once: the number ticks up and down live as its container crosses the
 * middle band of the viewport, like a dial rather than a one-shot reveal.
 */
export function ScrubCount({ to, pad = 2 }: { to: number; pad?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const container = el?.closest("[data-scrub-group]") as HTMLElement | null;
    const target = container ?? el?.parentElement;
    if (!el || !target || prefersReducedMotion()) {
      if (el) el.textContent = String(to).padStart(pad, "0");
      return;
    }
    el.textContent = "0".padStart(pad, "0");
    let raf = 0;

    function update() {
      raf = 0;
      const r = target!.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 once the block's top reaches 80% down the screen, 1 once its center passes the middle.
      const t = clamp((vh * 0.8 - r.top) / (vh * 0.8 - vh * 0.45));
      el!.textContent = String(Math.round(easeOutExpo(t) * to)).padStart(pad, "0");
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
  }, [to, pad]);

  return <span ref={ref}>{String(to).padStart(pad, "0")}</span>;
}

/**
 * Letters roll up and are replaced by a copy from below on hover of the
 * nearest `.group`, the classic award-site link hover, CSS only.
 */
export function RollText({ children }: { children: string }) {
  return (
    <span className="roll" aria-label={children}>
      {[...children].map((ch, i) => (
        <span key={i} aria-hidden="true" className="roll-char" style={{ "--i": i } as CSSProperties} data-ch={ch}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

/** A soft color light that trails the pointer around its parent section. */
export function PointerGlow({ color, size = 520 }: { color: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent || prefersReducedMotion() || !hasFinePointer()) return;
    let tx = parent.clientWidth / 2;
    let ty = parent.clientHeight;
    let x = tx;
    let y = ty;
    let raf = 0;
    let running = false;

    function frame() {
      x = lerp(x, tx, 0.08);
      y = lerp(y, ty, 0.08);
      el!.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`;
      if (Math.abs(x - tx) + Math.abs(y - ty) > 0.5) raf = requestAnimationFrame(frame);
      else running = false;
    }
    function onMove(e: PointerEvent) {
      const r = parent!.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    }
    el.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`;
    parent.addEventListener("pointermove", onMove);
    return () => {
      parent.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [size]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 rounded-full opacity-45 blur-[40px]"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
        transform: `translate3d(calc(50vw - ${size / 2}px), 40%, 0)`,
      }}
    />
  );
}
