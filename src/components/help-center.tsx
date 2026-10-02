"use client";

import { useDeferredValue, useEffect, useId, useState } from "react";
import Link from "next/link";
import type { HelpItem, HelpSection } from "@/lib/help";

/**
 * Searchable FAQ: live filter with highlighted matches, a sticky section index
 * that follows your scroll, and answers that open with a smooth height ease.
 */
export function HelpCenter({ sections, accent = "var(--coral)" }: { sections: HelpSection[]; accent?: string }) {
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query.trim().toLowerCase());
  const [current, setCurrent] = useState(sections[0]?.id);

  const filtered = sections
    .map((s) => ({
      ...s,
      items: q ? s.items.filter((i) => `${i.q} ${i.a}`.toLowerCase().includes(q)) : s.items,
    }))
    .filter((s) => s.items.length > 0);
  const total = filtered.reduce((n, s) => n + s.items.length, 0);

  // Follow the reader through the sections for the index highlight.
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections, q]);

  // Deep links (/help#displays) open straight to their section.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
      {/* Index */}
      <nav aria-label="Help topics" className="hidden lg:block">
        <ul className="sticky top-28 flex flex-col gap-1 border-l border-line">
          {sections.map((s) => {
            const on = current === s.id;
            const dim = q && !filtered.some((f) => f.id === s.id);
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`-ml-px block border-l py-1.5 pl-4 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-300 ${
                    on ? "text-ink" : "border-transparent text-ink-soft hover:text-ink"
                  } ${dim ? "opacity-30" : ""}`}
                  style={on ? { borderColor: accent } : undefined}
                >
                  {s.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div>
        {/* Search */}
        <label className="group relative block">
          <span className="sr-only">Search help</span>
          <span aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 font-mono text-ink-soft">
            ⌕
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search, try “shortcut”, “license”, “display”…"
            className="w-full rounded-full border border-line bg-paper py-4 pl-12 pr-24 text-base outline-none focus-visible:outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-ink-soft/70 focus:border-ink focus:shadow-[0_0_0_4px_rgba(11,11,10,0.06)]"
          />
          <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
            {total} {total === 1 ? "answer" : "answers"}
          </span>
        </label>

        {filtered.length === 0 ? (
          <div className="mt-12 rounded-[22px] border-2 border-dashed border-line px-8 py-16 text-center">
            <p className="font-display text-2xl font-extrabold tracking-tight">Nothing on “{query}” yet.</p>
            <p className="mt-2 text-ink-soft">
              Ask us directly:{" "}
              <a href="mailto:hello@66labs.dev" className="text-ink underline decoration-coral decoration-2 underline-offset-4">
                hello@66labs.dev
              </a>
            </p>
          </div>
        ) : (
          <div className="mt-12 flex flex-col gap-16">
            {filtered.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">{s.title}</h2>
                <div className="mt-5 border-t border-line">
                  {s.items.map((item) => (
                    <Question key={item.q} item={item} query={q} accent={accent} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Question({ item, query, accent }: { item: HelpItem; query: string; accent: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  // While searching, show every matching answer.
  const expanded = open || !!query;

  return (
    <div className="border-b border-line">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-start justify-between gap-6 py-5 text-left"
      >
        <span className="text-[17px] font-semibold leading-snug transition-transform duration-500 group-hover:translate-x-1.5">
          <Highlight text={item.q} query={query} accent={accent} />
        </span>
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line transition-[transform,background-color,color,border-color] duration-500 group-hover:border-ink"
          style={{
            transform: expanded ? "rotate(45deg)" : "none",
            transitionTimingFunction: "var(--spring)",
            ...(expanded ? { background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" } : {}),
          }}
        >
          +
        </span>
      </button>
      <div
        id={id}
        role="region"
        className="grid transition-[grid-template-rows] duration-500"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr", transitionTimingFunction: "var(--ease)" }}
      >
        <div className="overflow-hidden">
          <div className="max-w-[64ch] pb-6 text-[16px] leading-relaxed text-ink-soft">
            <Highlight text={item.a} query={query} accent={accent} />
            {item.link && (
              <Link
                href={item.link.href}
                className="mt-3 block w-fit font-mono text-xs uppercase tracking-[0.08em] text-ink underline decoration-coral decoration-2 underline-offset-4"
              >
                {item.link.label} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Highlight({ text, query, accent }: { text: string; query: string; accent: string }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === query ? (
          <mark
            key={i}
            className="rounded-[4px] px-0.5 text-ink"
            style={{ background: `color-mix(in oklab, ${accent} 35%, transparent)` }}
          >
            {p}
          </mark>
        ) : (
          p
        ),
      )}
    </>
  );
}
