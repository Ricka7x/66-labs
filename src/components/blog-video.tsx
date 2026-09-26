"use client";

import { useEffect, useRef } from "react";

/** Inline demo video for posts. Autoplaying ones loop silently and only play while on screen. */
export function BlogVideo({ src, autoPlay = false }: { src: string; autoPlay?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const poster = src.replace(/\.(mp4|webm)$/, "-poster.webp");

  useEffect(() => {
    const video = ref.current;
    if (!video || !autoPlay) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) void video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, [autoPlay]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      controls
      muted={autoPlay}
      loop={autoPlay}
      playsInline
      preload={autoPlay ? "auto" : "metadata"}
      className="my-10 w-full rounded-[18px] border border-line bg-ink"
    />
  );
}
