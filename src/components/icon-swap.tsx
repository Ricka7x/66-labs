import type { LucideIcon } from "lucide-react";

export type SwapDirection = "right" | "down" | "diagonal";

/**
 * Circle-button icon that slides out and is replaced by a duplicate on
 * hover (parent needs the `group` class). Same mechanic as the old
 * glyph-based `.arrow-swap`, rebuilt for real SVG icons.
 */
export function IconSwap({
  icon: Icon,
  direction = "right",
  className = "h-[42%] w-[42%]",
}: {
  icon: LucideIcon;
  direction?: SwapDirection;
  className?: string;
}) {
  return (
    <span aria-hidden="true" data-direction={direction} className="icon-swap relative block h-full w-full">
      <Icon className={`icon-swap-a absolute inset-0 m-auto ${className}`} />
      <Icon className={`icon-swap-b absolute inset-0 m-auto ${className}`} />
    </span>
  );
}
