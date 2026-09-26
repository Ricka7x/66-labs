"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AppIcon } from "@/components/app-icon";
import { clamp, easeOutExpo, prefersReducedMotion } from "@/lib/motion";
import type { App, AppVideo as Video } from "@/lib/apps";

/**
 * A screen recording in a Mac-window frame. Plays muted on loop only while on
 * screen, click to pause, with a live progress bar. `featured` also scales the
 * frame up out of the page as it scrolls into view.
 */
export function AppVideo({
  video,
  accent,
  featured = false,
}: {
  video: Video;
  accent: string;
  featured?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [paused, setPaused] = useState(true);
  // Pausing by hand should stick even when the video scrolls out and back in.
  const userPaused = useRef(false);

  // Play only while visible (and never on its own under reduced motion).
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !reduced && !userPaused.current) void el.play().catch(() => {});
        else if (!e.isIntersecting) el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Progress bar, driven off the element's clock rather than timeupdate's ~4 Hz.
  useEffect(() => {
    let raf = 0;
    function frame() {
      const el = videoRef.current;
      if (el && barRef.current && el.duration) barRef.current.style.transform = `scaleX(${el.currentTime / el.duration})`;
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Featured: grow from 86% with a rounder frame as it enters the viewport.
  useEffect(() => {
    const frame = frameRef.current;
    if (!featured || !frame || prefersReducedMotion()) return;
    let raf = 0;
    function update() {
      raf = 0;
      const r = frame!.getBoundingClientRect();
      const t = easeOutExpo(clamp((window.innerHeight - r.top) / (window.innerHeight * 0.9)));
      frame!.style.transform = `scale(${0.86 + 0.14 * t})`;
      frame!.style.borderRadius = `${40 - 18 * t}px`;
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
  }, [featured]);

  function toggle() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      userPaused.current = false;
      void el.play();
    } else {
      userPaused.current = true;
      el.pause();
    }
  }

  return (
    <figure className="group/video">
      <div
        ref={frameRef}
        className="relative origin-top overflow-hidden rounded-[22px] bg-ink shadow-[0_40px_80px_-30px_rgba(11,11,10,0.55)] ring-1 ring-line-invert will-change-transform"
      >
        <WindowBar title={video.title} />
        <div className="relative" style={{ aspectRatio: video.aspect }}>
          <video
            ref={videoRef}
            poster={`${video.src}-poster.webp`}
            muted
            loop
            playsInline
            preload={featured ? "auto" : "metadata"}
            onPlay={() => setPaused(false)}
            onPause={() => setPaused(true)}
            onClick={toggle}
            data-cursor={paused ? "Play" : "Pause"}
            data-cursor-color={accent}
            aria-label={`${video.title}: demo video`}
            className="absolute inset-0 h-full w-full cursor-pointer object-cover"
          >
            <source src={`${video.src}.webm`} type="video/webm" />
            <source src={`${video.src}.mp4`} type="video/mp4" />
          </video>

          {/* Big play button while paused */}
          <button
            type="button"
            onClick={toggle}
            aria-label={paused ? `Play ${video.title}` : `Pause ${video.title}`}
            className={`absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-2xl text-ink shadow-xl transition-[opacity,scale] duration-500 ${
              paused ? "scale-100 opacity-100" : "pointer-events-none scale-50 opacity-0"
            }`}
            style={{ background: "var(--paper)", transitionTimingFunction: "var(--spring)" }}
          >
            <span aria-hidden="true" className="ml-1">
              ▶
            </span>
          </button>

          {/* Control pill */}
          <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-full bg-ink/70 px-3 py-2 text-paper opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover/video:opacity-100 focus-within:opacity-100">
            <button
              type="button"
              onClick={toggle}
              aria-label={paused ? "Play" : "Pause"}
              className="flex h-6 w-6 items-center justify-center font-mono text-[11px]"
            >
              {paused ? "▶" : "❚❚"}
            </button>
            <span className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-white/20">
              <span
                ref={barRef}
                className="absolute inset-0 origin-left [transform:scaleX(0)]"
                style={{ background: accent }}
              />
            </span>
          </div>
        </div>
      </div>
      {/* The featured video's caption is rendered by the page, below the ink band. */}
      {video.caption && !featured && (
        <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display text-lg font-extrabold tracking-tight">{video.title}</span>
          <span className="text-[15px] text-ink-soft">{video.caption}</span>
        </figcaption>
      )}
    </figure>
  );
}

function WindowBar({ title }: { title: string }) {
  return (
    <div className="relative flex h-9 items-center border-b border-line-invert bg-[#161614] px-4">
      <span className="flex gap-1.5" aria-hidden="true">
        <i className="h-3 w-3 rounded-full bg-[#ff5f57] not-italic" />
        <i className="h-3 w-3 rounded-full bg-[#febc2e] not-italic" />
        <i className="h-3 w-3 rounded-full bg-[#28c840] not-italic" />
      </span>
      <span className="absolute inset-x-0 text-center font-mono text-[10.5px] uppercase tracking-[0.12em] text-[rgba(244,242,234,0.45)]">
        {title}
      </span>
    </div>
  );
}

/** Same frame for apps whose demo hasn't been recorded yet. */
export function VideoPlaceholder({ app }: { app: Pick<App, "slug" | "name" | "iconFullBleed" | "accent" | "glow"> }) {
  return (
    <figure>
      <div className="relative overflow-hidden rounded-[22px] bg-ink ring-1 ring-line-invert">
        <WindowBar title={`${app.name}: demo`} />
        <div className="relative flex aspect-[16/9] flex-col items-center justify-center gap-6 overflow-hidden">
          <div
            aria-hidden="true"
            className="blob absolute h-[60%] w-[40%] opacity-40 blur-[70px]"
            style={{ background: app.glow[0] } as CSSProperties}
          />
          <div
            aria-hidden="true"
            className="blob absolute right-[15%] bottom-[5%] h-[40%] w-[30%] opacity-30 blur-[70px]"
            style={{ background: app.glow[1], animationDelay: "-5s" } as CSSProperties}
          />
          <div className="relative h-24 w-24 animate-[bob_4s_ease-in-out_infinite] md:h-32 md:w-32">
            <AppIcon app={app} className="h-full w-full" sizes="128px" />
          </div>
          <span className="relative inline-flex items-center gap-2 rounded-full border border-line-invert px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[rgba(244,242,234,0.7)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: app.accent }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: app.accent }} />
            </span>
            Demo video on the way
          </span>
        </div>
      </div>
    </figure>
  );
}
