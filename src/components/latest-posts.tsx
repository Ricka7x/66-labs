import Link from "next/link";
import { AppIcon } from "@/components/app-icon";
import { Reveal } from "@/components/reveal";
import { SplitReveal } from "@/components/split-reveal";
import { getApp } from "@/lib/apps";
import { formatDate, type Post } from "@/lib/posts";

/** Compact post list used on the homepage and app pages. */
export function LatestPosts({
  posts,
  eyebrow,
  title,
  allHref = "/blog",
}: {
  posts: Post[];
  eyebrow: string;
  /** SplitReveal syntax: wrap words in _underscores_ for the serif italic */
  title: string;
  allHref?: string;
}) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-line py-24">
      <div className="mx-auto max-w-[1280px] px-5 md:px-14">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">{eyebrow}</span>
            <SplitReveal as="h2" className="mt-3 block font-display text-4xl font-extrabold tracking-tight md:text-6xl">
              {title}
            </SplitReveal>
          </div>
          <Link
            href={allHref}
            className="font-mono text-[13px] text-ink-soft underline decoration-line underline-offset-4 hover:text-ink hover:decoration-ink"
          >
            All posts →
          </Link>
        </div>

        <ul className="border-t border-line">
          {posts.map((p, i) => {
            const app = p.app ? getApp(p.app) : undefined;
            return (
              <li key={p.slug}>
                <Reveal delay={i * 0.05}>
                  <Link
                    href={`/blog/${p.slug}`}
                    data-cursor="Read"
                    data-cursor-color={app?.accent}
                    className="rule-row group relative flex flex-col gap-2 border-b border-line px-2 py-7 md:flex-row md:items-center md:gap-8 md:px-6"
                  >
                    {app && (
                      <span className="relative hidden h-12 w-12 shrink-0 transition-transform duration-500 group-hover:-rotate-8 group-hover:scale-110 md:block">
                        <AppIcon app={app} className="h-full w-full" sizes="48px" />
                      </span>
                    )}
                    <span className="flex-1 font-display text-xl font-extrabold leading-tight tracking-tight transition-transform duration-500 group-hover:translate-x-2 md:text-3xl">
                      {p.title}
                    </span>
                    <span className="rule-soft shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                      {formatDate(p.date, "short")} · {p.readingTime} min
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
