"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AppIcon } from "@/components/app-icon";
import type { App, AppFeature } from "@/lib/apps";

/**
 * Scroll-driven feature tour. On wide screens the screenshot frame pins on the
 * right while feature copy scrolls past on the left; whichever feature crosses
 * the middle of the viewport takes the frame, revealing its screenshot with a
 * clip wipe. Narrow screens get each screenshot inline above its copy.
 */
export function FeatureShowcase({ app }: { app: Pick<App, "slug" | "name" | "iconFullBleed" | "accent" | "glow" | "features"> }) {
  const { features } = app;
  const [active, setActive] = useState(0);
  const blocks = useRef<(HTMLElement | null)[]>([]);
  const railRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      // A thin band across the middle of the viewport: the block crossing it is "current".
      { rootMargin: "-48% 0px -48% 0px" },
    );
    blocks.current.forEach((b) => b && io.observe(b));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (railRef.current) railRef.current.style.transform = `scaleY(${(active + 1) / features.length})`;
  }, [active, features.length]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
      {/* Copy column */}
      <div className="relative lg:pl-10">
        <span aria-hidden="true" className="absolute left-0 top-0 hidden h-full w-px bg-line lg:block">
          <span
            ref={railRef}
            className="absolute inset-0 origin-top transition-transform duration-700"
            style={{ background: app.accent, transform: "scaleY(0)", transitionTimingFunction: "var(--ease)" }}
          />
        </span>

        {features.map((f, i) => (
          <article
            key={f.title}
            ref={(el) => {
              blocks.current[i] = el;
            }}
            data-index={i}
            className={`feature-block flex flex-col justify-center py-10 transition-opacity duration-500 lg:min-h-[62vh] lg:py-0 ${
              i === active ? "lg:opacity-100" : "lg:opacity-25"
            }`}
          >
            {/* Inline screenshot on narrow screens */}
            <div className="mb-6 lg:hidden">
              <Shot feature={f} app={app} index={i} inline />
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink-soft">
              {pad(i + 1)} / {pad(features.length)}
            </span>
            <h3 className="mt-3 font-display text-3xl font-extrabold leading-[1.02] tracking-tight md:text-5xl">
              {f.title}
            </h3>
            {f.body && <p className="mt-4 max-w-[40ch] text-lg leading-relaxed text-ink-soft">{f.body}</p>}
          </article>
        ))}
      </div>

      {/* Pinned frame (wide screens) */}
      <div className="hidden lg:block">
        <div className="sticky top-[19vh]">
          <div className="relative aspect-[3/2] overflow-hidden rounded-[26px] bg-ink shadow-[0_40px_80px_-30px_rgba(11,11,10,0.5)] ring-1 ring-line">
            {features.map((f, i) => (
              <div
                key={f.title}
                aria-hidden={i !== active}
                className="feature-shot absolute inset-0"
                data-state={i === active ? "on" : i < active ? "past" : "next"}
              >
                <Shot feature={f} app={app} index={i} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft">
            <span>{features[active].title}</span>
            <span>
              {pad(active + 1)} / {pad(features.length)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Shot({
  feature,
  app,
  index,
  inline = false,
}: {
  feature: AppFeature;
  app: Pick<App, "slug" | "name" | "iconFullBleed" | "accent" | "glow">;
  index: number;
  inline?: boolean;
}) {
  const img = feature.image;

  if (img) {
    return inline ? (
      <div className="relative overflow-hidden rounded-[18px] ring-1 ring-line" style={{ aspectRatio: img.aspect }}>
        <Image src={img.src} alt={img.alt} fill sizes="100vw" className="object-cover" />
      </div>
    ) : (
      <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 700px, 100vw" className="object-cover" />
    );
  }

  // No screenshot yet: a card in the app's colors keeps the frame alive. The glows drift to a
  // different spot for each feature, so scrolling through still feels like the frame is changing.
  const spots = [
    ["18% 20%", "78% 80%"],
    ["75% 22%", "20% 78%"],
    ["50% 85%", "80% 18%"],
    ["20% 70%", "70% 30%"],
  ][index % 4];
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-ink text-paper ${
        inline ? "aspect-[3/2] rounded-[18px]" : "h-full w-full"
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(circle at ${spots[0]}, color-mix(in oklab, ${app.glow[0]} 55%, transparent), transparent 45%), radial-gradient(circle at ${spots[1]}, color-mix(in oklab, ${app.glow[1]} 45%, transparent), transparent 40%)`,
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.18em] -right-[0.04em] font-display text-[clamp(160px,22vw,320px)] font-extrabold leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(244,242,234,0.14)]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative flex max-w-[80%] flex-col items-center text-center">
        <div className="relative h-16 w-16 animate-[bob_5s_ease-in-out_infinite] md:h-20 md:w-20" style={{ animationDelay: `${-index * 0.7}s` }}>
          <AppIcon app={app} className="h-full w-full" sizes="80px" />
        </div>
        {/* Inline (phones) the title sits right below the card already, so the card shows just the icon. */}
        {!inline && (
          <span className="mt-6 font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            {feature.title}
          </span>
        )}
        {feature.body && !inline && (
          <em className="mt-3 block max-w-[34ch] font-serif text-xl leading-snug text-[rgba(244,242,234,0.65)]">
            {feature.body}
          </em>
        )}
      </div>
      <span className="absolute left-5 top-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[rgba(244,242,234,0.45)]">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: app.accent }} />
        Screenshot soon
      </span>
    </div>
  );
}
