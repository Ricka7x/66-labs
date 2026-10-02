import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog-index";
import { SplitReveal } from "@/components/split-reveal";
import { apps } from "@/lib/apps";
import { formatDate, getPosts, summarize } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes from the 66 labs workbench: guides, release notes and behind-the-scenes on every app we make.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function BlogPage() {
  const posts = getPosts().map((p) => ({ ...summarize(p), dateLabel: formatDate(p.date, "short") }));

  return (
    <main id="main" className="pt-35 pb-30">
      <div className="mx-auto max-w-[1280px] px-5 md:px-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">The blog</span>
            <SplitReveal
              as="h1"
              stagger={0.07}
              className="mt-4 block font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-[7vw]"
            >
              Notes from _the_ _workbench._
            </SplitReveal>
          </div>
          <a
            href="/feed.xml"
            className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-blue" />
            RSS feed
          </a>
        </div>
        <p className="mt-6 max-w-130 text-base text-ink-soft md:text-lg">
          How-tos, release notes and the occasional rant about software that should know better, straight from the people who
          build the apps.
        </p>

        <div className="mt-14">
          <BlogIndex
            posts={posts}
            apps={apps.map(({ slug, name, iconFullBleed, accent }) => ({ slug, name, iconFullBleed, accent }))}
          />
        </div>
      </div>
    </main>
  );
}
