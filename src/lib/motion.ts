export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Live scroll velocity, written by <SmoothScroll /> on every Lenis tick and read
 * by anything that wants to react to how hard the page is being flung
 * (marquee speed, skew). A plain mutable object: read it inside rAF loops,
 * never in render.
 */
export const scrollState = { velocity: 0 };

/** Client-only check shared by every effect that should bail for reduced motion or touch. */
export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Progress (0 → 1) of an element scrolling through the viewport while pinned: top hits 0 → bottom hits viewport bottom. */
export function pinProgress(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  return total > 0 ? clamp(-rect.top / total) : 0;
}
