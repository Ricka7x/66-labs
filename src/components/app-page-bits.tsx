"use client";

import type { ReactNode } from "react";
import { tiltHandlers } from "@/components/tilt";

/** Wraps any block in the pointer tilt + glare used by the app cards. */
export function TiltBox({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className="[perspective:1100px]">
      <div
        {...tiltHandlers}
        className={`tilt relative overflow-hidden ${className}`}
      >
        <div aria-hidden="true" className="tilt-glare" />
        {children}
      </div>
    </div>
  );
}

/** Text set around a circle that slowly turns, sits behind the app icon like a record label. */
export function OrbitText({ text, className = "" }: { text: string; className?: string }) {
  const id = `orbit-${text.replace(/\W+/g, "-")}`;
  return (
    <svg viewBox="0 0 200 200" className={`orbit ${className}`} aria-hidden="true">
      <defs>
        <path id={id} d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
      </defs>
      <text className="fill-current font-mono text-[10.5px] uppercase tracking-[0.32em]">
        <textPath href={`#${id}`}>{text}</textPath>
      </text>
    </svg>
  );
}
