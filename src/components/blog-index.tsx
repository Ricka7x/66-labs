"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AppIcon } from "@/components/app-icon";
import { RollText } from "@/components/micro";
import { hasFinePointer, lerp, prefersReducedMotion } from "@/lib/motion";
import type { App } from "@/lib/apps";
import type { PostSummary } from "@/lib/posts";

type AppMeta = Pick<App, "slug" | "name" | "iconFullBleed" | "accent">;

// The filter lives in the URL (?app=snapback, ?app=general) so app pages can deep-link to it.
// Read through an external store: the server (and the static HTML) renders every post, and the
// browser applies ?app= right after hydration, no Suspense bail-out, no hydration mismatch.
const FILTER_EVENT = "blog-filter";
function subscribeFilter(cb: () => void) {
  window.addEventListener("popstate", cb);
  window.addEventListener(FILTER_EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(FILTER_EVENT, cb);
  };
}
const readFilter = () => new URLSearchParams(window.location.search).get("app") ?? "all";
const serverFilter = () => "all";
function writeFilter(next: string) {
  window.history.replaceState(null, "", next === "all" ? "/blog" : `/blog?app=${next}`);
  window.dispatchEvent(new Event(FILTER_EVENT));
}

/**
 * The post list. Filter pills per app; each row wipes to ink on hover while
 * the post's app icon trails the cursor, tilting with its speed.
 */
export function BlogIndex({ posts, apps }: { posts: (PostSummary & { dateLabel: string })[]; apps: AppMeta[] }) {
  const filter = useSyncExternalStore(subscribeFilter, readFilter, serverFilter);
  const setFilter = writeFilter;
  const [hovered, setHovered] = useState<string | undefined>();
  const previewRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  const appsWithPosts = apps.filter((a) => posts.some((p) => p.app === a.slug));
  const hasGeneral = posts.some((p) => !p.app);
  const visible = filter === "all" ? posts : posts.filter((p) => (p.app ?? "general") === filter);
  const bySlug = Object.fromEntries(apps.map((a) => [a.slug, a]));

  useEffect(() => {
    const el = previewRef.current;
    const list = listRef.current;
    if (!el || !list || prefersReducedMotion() || !hasFinePointer()) return;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    function frame() {
      const px = x;
      x = lerp(x, tx, 0.14);
      y = lerp(y, ty, 0.14);
      const tilt = Math.max(-18, Math.min(18, (x - px) * 0.9));
      // Sits up and to the right of the pointer so it never covers the title being read.
      el!.style.transform = `translate3d(${x + 36}px, ${y - 128}px, 0) rotate(${tilt}deg)`;
      raf = requestAnimationFrame(frame);
    }
    function onMove(e: PointerEvent) {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) {
        x = tx;
        y = ty;
        raf = requestAnimationFrame(frame);
      }
    }
    list.addEventListener("pointermove", onMove);
    return () => {
      list.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const hoveredPost = posts.find((p) => p.slug === hovered);
  const hoveredApp = hoveredPost?.app ? bySlug[hoveredPost.app] : undefined;
  const hoveredFeatures = hoveredPost && !hoveredPost.app ? hoveredPost.features.map((s) => bySlug[s]).filter(Boolean) : [];

  return (
    <div>
      <div role="group" aria-label="Filter posts by app" className="flex flex-wrap gap-2.5">
        <Pill active={filter === "all"} onClick={() => setFilter("all")} count={posts.length}>
          Everything
        </Pill>
        {appsWithPosts.map((a) => (
          <Pill
            key={a.slug}
            active={filter === a.slug}
            onClick={() => setFilter(a.slug)}
            count={posts.filter((p) => p.app === a.slug).length}
          >
            <span className="relative -my-1 -ml-1 h-5 w-5">
              <AppIcon app={a} className="h-full w-full" sizes="20px" />
            </span>
            {a.name}
          </Pill>
        ))}
        {hasGeneral && (
          <Pill active={filter === "general"} onClick={() => setFilter("general")} count={posts.filter((p) => !p.app).length}>
            General
          </Pill>
        )}
      </div>

      <ol ref={listRef} className="mt-12 border-t border-line" onPointerLeave={() => setHovered(undefined)}>
        {visible.map((p, i) => {
          const app = p.app ? bySlug[p.app] : undefined;
          return (
            // Keyed by filter too, so rows replay their entrance when the filter changes.
            <li key={`${filter}-${p.slug}`} className="post-row" style={{ "--i": i } as React.CSSProperties}>
              <Link
                href={`/blog/${p.slug}`}
                onPointerEnter={() => setHovered(p.slug)}
                onFocus={() => setHovered(p.slug)}
                className="rule-row group relative grid grid-cols-1 gap-3 border-b border-line px-2 py-8 md:grid-cols-[150px_1fr_auto] md:items-baseline md:gap-10 md:px-6"
              >
                <span className="rule-soft font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                  {p.dateLabel}
                </span>
                <span>
                  <span className="block font-display text-2xl font-extrabold leading-tight tracking-tight transition-transform duration-500 group-hover:translate-x-2 md:text-[34px]">
                    {p.title}
                  </span>
                  <span className="rule-soft mt-2 block max-w-[62ch] text-[15px] text-ink-soft">{p.description}</span>
                </span>
                <span className="rule-soft flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft md:justify-end">
                  {app && (
                    <span className="relative h-5 w-5 md:hidden">
                      <AppIcon app={app} className="h-full w-full" sizes="20px" />
                    </span>
                  )}
                  {app ? app.name : "General"} · {p.readingTime} min
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      {/* Cursor-trailing preview (desktop only) */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-90 hidden h-28 w-28 transition-[opacity,scale] duration-300 md:block ${
          hovered ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
        style={{ transitionTimingFunction: "var(--spring)" }}
      >
        {hoveredApp ? (
          <AppIcon app={hoveredApp} className="h-full w-full" sizes="112px" />
        ) : hoveredFeatures.length > 0 ? (
          <span className="relative block h-full w-full">
            {hoveredFeatures.map((a, i) => (
              <span
                key={a.slug}
                className="absolute inset-0"
                style={{ transform: `translateX(${(i - (hoveredFeatures.length - 1) / 2) * 44}px) rotate(${(i - (hoveredFeatures.length - 1) / 2) * 12}deg)` }}
              >
                <AppIcon app={a} className="h-full w-full" sizes="112px" />
              </span>
            ))}
          </span>
        ) : (
          <span className="flex h-full w-full items-center justify-center rounded-[26px] bg-blue font-display text-4xl font-extrabold text-ink shadow-xl">
            66
          </span>
        )}
      </div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.06em] transition-colors duration-300 ${
        active ? "border-ink bg-ink text-paper" : "border-line text-ink-soft hover:border-ink hover:text-ink"
      }`}
    >
      {typeof children === "string" ? <RollText>{children}</RollText> : children}
      <sup className="text-[9px] opacity-60">{count}</sup>
    </button>
  );
}
