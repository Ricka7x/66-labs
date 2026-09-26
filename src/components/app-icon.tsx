import Image from "next/image";
import type { App } from "@/lib/apps";

/**
 * The app's real icon (public/apps/<slug>.png). Full-bleed artwork is scaled
 * down to sit inside the same padding macOS icons ship with, so every icon
 * reads at the same visual size side by side.
 */
export function AppIcon({
  app,
  className = "",
  sizes = "128px",
  preload = false,
}: {
  app: Pick<App, "slug" | "name" | "iconFullBleed">;
  className?: string;
  sizes?: string;
  preload?: boolean;
}) {
  return (
    <span className={`relative block ${className}`}>
      <Image
        src={`/apps/${app.slug}.png`}
        alt={`${app.name} app icon`}
        fill
        sizes={sizes}
        preload={preload}
        draggable={false}
        className={`object-contain drop-shadow-[0_14px_24px_rgba(0,0,0,0.35)] ${app.iconFullBleed ? "scale-[0.81]" : ""}`}
      />
    </span>
  );
}
