import type { ReactNode } from "react";
import { SplitReveal } from "@/components/split-reveal";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

/**
 * Shared layout for /terms and /privacy: a plain-language summary up top, a
 * sticky index beside the text, and the full sections in the article type.
 */
export function LegalPage({
  eyebrow,
  title,
  updated,
  summary,
  sections,
}: {
  eyebrow: string;
  /** SplitReveal syntax: _underscores_ for the serif italic */
  title: string;
  updated: string;
  summary: { label: string; text: string }[];
  sections: LegalSection[];
}) {
  return (
    <main id="main" className="pt-35 pb-30">
      <div className="mx-auto max-w-[1280px] px-5 md:px-14">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">{eyebrow}</span>
        <SplitReveal
          as="h1"
          stagger={0.07}
          className="mt-4 block font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-[6.5vw]"
        >
          {title}
        </SplitReveal>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">Last updated {updated}</p>

        {/* The short version */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {summary.map((s) => (
            <div key={s.label} className="rounded-[22px] bg-ink p-7 text-paper">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[rgba(243,245,249,0.55)]">
                {s.label}
              </span>
              <p className="mt-3 font-sans text-2xl leading-snug">
                <span className="accent-serif">{s.text}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Sections" className="hidden lg:block">
            <ol className="sticky top-28 flex flex-col gap-1 border-l border-line">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ml-px block border-l border-transparent py-1.5 pl-4 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft transition-colors hover:border-ink hover:text-ink"
                  >
                    {String(i + 1).padStart(2, "0")} {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="prose-66 max-w-[68ch]">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2>
                  <span className="mr-3 font-mono text-sm font-normal text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                {s.body}
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
