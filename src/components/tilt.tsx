import type { PointerEvent as ReactPointerEvent } from "react";

/**
 * Pointer-driven 3D tilt + spotlight. Spread onto any element with the `tilt`
 * class. Writes CSS custom properties only (--px/--py as -0.5…0.5, --mx/--my
 * as %, --hover); the `.tilt` rules in globals.css turn them into transforms
 * and the glare, so there's no React re-render per move.
 */
export const tiltHandlers = {
  onPointerMove(e: ReactPointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--px", `${px - 0.5}`);
    el.style.setProperty("--py", `${py - 0.5}`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--hover", "1");
  },
  onPointerLeave(e: ReactPointerEvent<HTMLElement>) {
    const el = e.currentTarget;
    el.style.setProperty("--px", "0");
    el.style.setProperty("--py", "0");
    el.style.setProperty("--hover", "0");
  },
};
