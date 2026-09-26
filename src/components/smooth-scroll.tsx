"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { prefersReducedMotion, scrollState } from "@/lib/motion";

let lenis: Lenis | null = null;

/** Inertia scrolling for the whole document, plus a thin progress bar pinned under the header. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ autoRaf: true, anchors: { offset: -72 }, lerp: 0.1 });
    const bar = document.getElementById("scroll-progress");
    const off = lenis.on("scroll", (l) => {
      scrollState.velocity = l.velocity;
      if (bar) bar.style.transform = `scaleX(${l.progress || 0})`;
    });
    return () => {
      off();
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // New page → start at the top without easing through the old page's scroll position.
  useEffect(() => {
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return (
    <div
      id="scroll-progress"
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-101 h-0.5 origin-left [transform:scaleX(0)] bg-coral"
    />
  );
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
}
