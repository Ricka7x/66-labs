"use client";

import { useEffect, useRef } from "react";
import { OrientKicker } from "@/components/orient-kicker";
import { AppCard, NextAppCard } from "@/components/app-card";
import { SplitReveal } from "@/components/split-reveal";
import { clamp, pinProgress, prefersReducedMotion } from "@/lib/motion";
import type { App } from "@/lib/apps";

/**
 * The shelf. On wide screens the section pins and vertical scroll drives the
 * cards sideways, with a slow outline word behind them and a live counter.
 * Narrow screens (and reduced motion) get a plain stacked grid.
 */
export function AppShowcase({ apps }: { apps: App[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const total = apps.length + 1;

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const wide = window.matchMedia("(min-width: 768px)");
    let distance = 0;
    let raf = 0;

    function layout() {
      if (!wide.matches || prefersReducedMotion()) {
        section!.style.height = "";
        track!.style.transform = "";
        distance = 0;
        return;
      }
      distance = Math.max(0, track!.scrollWidth - window.innerWidth);
      section!.style.height = `${window.innerHeight + distance}px`;
      update();
    }

    function update() {
      raf = 0;
      if (!distance) return;
      const p = pinProgress(section!);
      track!.style.transform = `translate3d(${-p * distance}px,0,0)`;
      if (ghostRef.current) ghostRef.current.style.transform = `translate3d(${-p * distance * 0.35}px,0,0)`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;

      // Cards settle as they reach the middle of the viewport and lean as they leave it.
      const vw = window.innerWidth;
      let nearest = 0;
      let nearestOff = Infinity;
      track!.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel, i) => {
        const r = panel.getBoundingClientRect();
        const off = clamp((r.left + r.width / 2 - vw / 2) / vw, -1, 1);
        if (Math.abs(off) < nearestOff) {
          nearestOff = Math.abs(off);
          nearest = i;
        }
        panel.style.transform = `rotate(${off * 2.5}deg) scale(${1 - Math.abs(off) * 0.08})`;
        panel.style.opacity = `${1 - Math.max(0, Math.abs(off) - 0.55) * 1.4}`;
      });
      if (countRef.current) countRef.current.textContent = String(nearest + 1).padStart(2, "0");
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(track);
    wide.addEventListener("change", layout);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", layout);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wide.removeEventListener("change", layout);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", layout);
    };
  }, [total]);

  return (
    <section id="apps" ref={sectionRef} className="relative scroll-mt-0">
      <div className="flex flex-col overflow-hidden py-24 md:sticky md:top-0 md:h-dvh md:justify-center md:py-0">
        <div
          ref={ghostRef}
          aria-hidden="true"
          className="ghost-word pointer-events-none absolute left-0 top-1/2 hidden -translate-y-1/2 whitespace-nowrap font-display text-[26vw] font-extrabold leading-none tracking-tight md:block"
        >
          the shelf, the shelf
        </div>

        <div className="relative mx-auto mb-10 flex w-full max-w-[1280px] flex-wrap items-end justify-between gap-5 px-5 md:px-14">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">
              <OrientKicker>The shelf</OrientKicker>
            </span>
            <SplitReveal as="h2" className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-6xl">
              Pick your _fix._
            </SplitReveal>
          </div>
          <div className="hidden items-center gap-4 font-mono text-xs text-ink-soft md:flex">
            <span>
              <span ref={countRef}>01</span> / {String(total).padStart(2, "0")}
            </span>
            <span className="relative h-px w-40 overflow-hidden bg-line">
              <span ref={barRef} className="absolute inset-0 origin-left [transform:scaleX(0)] bg-ink" />
            </span>
            <span>scroll →</span>
          </div>
        </div>

        <div
          ref={trackRef}
          className="relative grid grid-cols-1 gap-5 px-5 will-change-transform md:flex md:w-max md:gap-8 md:px-14"
        >
          {apps.map((a, i) => (
            <div key={a.slug} data-panel className="md:w-[min(64vw,900px)]">
              <AppCard app={a} size="lg" delay={i * 0.06} />
            </div>
          ))}
          <div data-panel className="md:w-[min(40vw,520px)]">
            <NextAppCard number={total} size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
