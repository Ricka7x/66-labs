"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduceMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    document.documentElement.classList.add("has-cursor");

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let seen = false;
    let raf = 0;

    function onMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      if (!seen) {
        seen = true;
        rx = mx;
        ry = my;
        document.documentElement.classList.add("cursor-active");
      }
      if (dot) dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    }

    function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ring) ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    }

    function onEnter(e: Event) {
      const el = e.currentTarget as HTMLElement;
      ring?.classList.add("big");
      if (label) label.textContent = el.getAttribute("data-cursor") || "";
      const c = el.getAttribute("data-cursor-color");
      if (c && ring) {
        ring.style.background = c;
        ring.style.borderColor = c;
      }
    }

    function onLeave() {
      ring?.classList.remove("big");
      if (ring) {
        ring.style.background = "";
        ring.style.borderColor = "";
      }
    }

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    // Delegate to any element with data-cursor, including ones added later
    const observer = new MutationObserver(bindTargets);
    function bindTargets() {
      document.querySelectorAll<HTMLElement>("[data-cursor]").forEach((el) => {
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = "true";
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    }
    bindTargets();
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.documentElement.classList.remove("has-cursor", "cursor-active");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cur-dot" aria-hidden="true" />
      <div ref={ringRef} className="cur-ring" aria-hidden="true">
        <span ref={labelRef} className="cur-label" />
      </div>
    </>
  );
}
