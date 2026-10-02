"use client";

import { ArrowRight } from "lucide-react";
import { ViewTransition } from "react";
import Link from "next/link";
import { useReveal } from "@/components/reveal";
import { tiltHandlers } from "@/components/tilt";
import { AppIcon } from "@/components/app-icon";
import { IconSwap } from "@/components/icon-swap";
import { STATUS_LABEL, getPriceLabel, type App } from "@/lib/apps";

export function AppCard({ app, delay = 0, size = "md" }: { app: App; delay?: number; size?: "md" | "lg" }) {
  const [ref, revealProps] = useReveal<HTMLDivElement>(delay);
  const lg = size === "lg";

  const className = `tilt group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-ink text-paper ${
    lg ? "min-h-[min(62vh,600px)] p-9 md:p-12" : "min-h-[400px] p-8 md:p-9"
  }`;

  const body = (
    <>
      <div
        aria-hidden="true"
        className="tilt-layer pointer-events-none absolute rounded-full opacity-55 blur-[46px]"
        style={{ width: 280, height: 280, top: -70, right: -70, background: app.glow[0], "--depth": -30 } as React.CSSProperties}
      />
      <div
        aria-hidden="true"
        className="tilt-layer pointer-events-none absolute rounded-full opacity-40 blur-[50px]"
        style={{ width: 200, height: 200, bottom: -50, left: "18%", background: app.glow[1], "--depth": -20 } as React.CSSProperties}
      />
      <div aria-hidden="true" className="tilt-glare" />

      <div className="relative z-2 flex items-start justify-between">
        <ViewTransition name={`app-icon-${app.slug}`}>
          <div
            className={`tilt-layer transition-[scale,rotate] duration-500 group-hover:-rotate-6 group-hover:scale-110 ${lg ? "h-28 w-28 md:h-32 md:w-32" : "h-20 w-20"}`}
            style={{ "--depth": 24, transitionTimingFunction: "var(--spring)" } as React.CSSProperties}
          >
            <AppIcon app={app} className="h-full w-full" sizes={lg ? "128px" : "80px"} />
          </div>
        </ViewTransition>
        <StatusSticker status={app.status} />
      </div>

      <div className={lg ? "mt-auto" : ""}>
        <ViewTransition name={`app-title-${app.slug}`}>
          <h3
            className={`relative z-2 font-display font-extrabold tracking-tight ${
              lg ? "text-6xl md:text-[7vw] md:leading-[0.9]" : "mt-6 text-4xl"
            }`}
          >
            {app.name}
          </h3>
        </ViewTransition>
        <p className={`relative z-2 mt-1 font-serif text-[rgba(244,242,234,0.7)] ${lg ? "text-2xl md:text-3xl" : "text-xl"}`}>
          <em>{app.kind.toLowerCase()}</em>
        </p>
        <p className={`relative z-2 mt-4 text-[rgba(244,242,234,0.72)] ${lg ? "max-w-120 text-lg" : "max-w-105 text-[15px]"}`}>
          {app.tagline}
        </p>
      </div>

      <div className={`relative z-2 flex items-end justify-between gap-4 pt-8 ${lg ? "" : "mt-auto"}`}>
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(244,242,234,0.55)]">
          {app.platforms.join(" + ")}
          <span className="mx-2 opacity-40">·</span>
          {getPriceLabel(app)}
        </span>
        {app.status === "coming-soon" && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `mailto:hello@66labs.dev?subject=${encodeURIComponent(`Tell me when ${app.name} launches`)}`;
            }}
            className="relative z-10 hidden cursor-pointer font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(244,242,234,0.75)] underline decoration-[rgba(244,242,234,0.35)] underline-offset-4 hover:text-paper hover:decoration-paper sm:inline"
          >
            Notify me
          </button>
        )}
        <span className="flex h-11.5 w-11.5 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line-invert transition-colors duration-300 group-hover:bg-paper group-hover:text-ink">
          <IconSwap icon={ArrowRight} direction="right" />
        </span>
      </div>
    </>
  );

  return (
    <div ref={ref} className={`${revealProps.className} h-full [perspective:1100px]`} style={revealProps.style}>
      <Link
        href={`/apps/${app.slug}`}
        {...tiltHandlers}
        transitionTypes={["nav-forward"]}
        data-cursor="Open"
        data-cursor-color={app.accent}
        className={className}
      >
        {body}
      </Link>
    </div>
  );
}

export function StatusSticker({ status, className = "" }: { status: App["status"]; className?: string }) {
  const live = status === "available";
  return (
    <span
      className={`inline-flex rotate-3 items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] shadow-[2px_2px_0_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:rotate-[-4deg] group-hover:scale-105 ${
        live ? "bg-lime text-ink" : "bg-paper text-ink"
      } ${className}`}
      style={{ transitionTimingFunction: "var(--spring)" }}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${live ? "animate-pulse bg-ink" : "bg-coral"}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}

/** Compact horizontal card for embedding an app inside a blog post. */
export function AppStrip({ app }: { app: App }) {
  return (
    <div className="[perspective:1100px]">
      <Link
        href={`/apps/${app.slug}`}
        {...tiltHandlers}
        transitionTypes={["nav-forward"]}
        data-cursor="Open"
        data-cursor-color={app.accent}
        className="tilt group relative flex items-center gap-5 overflow-hidden rounded-[20px] bg-ink p-5 text-paper no-underline md:gap-6 md:p-6"
      >
        <div
          aria-hidden="true"
          className="tilt-layer pointer-events-none absolute rounded-full opacity-50 blur-[40px]"
          style={{ width: 200, height: 200, top: -80, right: -40, background: app.glow[0], "--depth": -20 } as React.CSSProperties}
        />
        <div aria-hidden="true" className="tilt-glare" />
        <div
          className="tilt-layer relative z-2 h-16 w-16 shrink-0 transition-[scale,rotate] duration-500 group-hover:-rotate-6 group-hover:scale-110 md:h-20 md:w-20"
          style={{ "--depth": 16, transitionTimingFunction: "var(--spring)" } as React.CSSProperties}
        >
          <AppIcon app={app} className="h-full w-full" sizes="80px" />
        </div>
        <div className="relative z-2 min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <span className="font-display text-2xl font-extrabold tracking-tight">{app.name}</span>
            <em className="font-serif text-lg text-[rgba(244,242,234,0.65)]">{app.kind.toLowerCase()}</em>
          </div>
          <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-[rgba(244,242,234,0.7)]">{app.tagline}</p>
          <span className="mt-2 block font-mono text-[10.5px] uppercase tracking-[0.1em] text-[rgba(244,242,234,0.5)]">
            {STATUS_LABEL[app.status]} · {app.platforms.join(" + ")} · {app.pricing.free}
          </span>
        </div>
        <span className="relative z-2 hidden h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line-invert transition-colors duration-300 group-hover:bg-paper group-hover:text-ink sm:flex">
          <IconSwap icon={ArrowRight} direction="right" />
        </span>
      </Link>
    </div>
  );
}

/** Dashed placeholder that keeps the shelf honest about what's next */
export function NextAppCard({ number, delay = 0, size = "md" }: { number: number; delay?: number; size?: "md" | "lg" }) {
  const [ref, revealProps] = useReveal<HTMLDivElement>(delay);
  return (
    <div
      ref={ref}
      className={`${revealProps.className} next-card group relative flex h-full flex-col justify-between overflow-hidden rounded-[22px] border-2 border-dashed border-line p-8 md:p-9 ${
        size === "lg" ? "min-h-[min(62vh,600px)]" : "min-h-[400px]"
      }`}
      style={revealProps.style}
    >
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">
        App no. {String(number).padStart(2, "0")}
      </span>
      <div aria-hidden="true" className="next-card-q font-display font-extrabold leading-none tracking-tight text-ink/10">
        ?
      </div>
      <div>
        <p className="max-w-80 text-[15px] text-ink-soft">
          <em className="text-2xl text-ink">On the workbench.</em>
          <br />
          Something small for an annoyance we can&apos;t stop noticing. Got one? Tell us.
        </p>
        <span className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
          </span>
          Building
        </span>
      </div>
    </div>
  );
}
