"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

export function useReveal<T extends HTMLElement>(
  delay = 0,
): [RefObject<T | null>, { className: string; style: CSSProperties }] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const active = reduced || inView;

  return [
    ref,
    {
      className: `reveal${active ? " in" : ""}`,
      style: { "--d": `${delay}s` } as CSSProperties,
    },
  ];
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [ref, revealProps] = useReveal<HTMLDivElement>(delay);
  return (
    <div ref={ref} className={`${revealProps.className} ${className}`} style={revealProps.style}>
      {children}
    </div>
  );
}
