import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { AppIcon } from "@/components/app-icon";
import { AppCard, AppStrip } from "@/components/app-card";
import { Reveal } from "@/components/reveal";
import { mdxComponents } from "@/components/mdx";
import { getApp } from "@/lib/apps";
import { formatDate, getPost, getPosts, getRelatedPosts } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const app = post.app ? getApp(post.app) : undefined;
  // General posts close with the apps they feature instead of a single app card.
  const featured = post.features.map((s) => getApp(s)).filter((a) => a !== undefined);
  const related = getRelatedPosts(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: `${post.date}T00:00:00Z`,
    author: { "@type": "Organization", name: post.author ?? "66 studio" },
    publisher: { "@type": "Organization", name: "66 studio" },
    mainEntityOfPage: `https://66studio.co/blog/${post.slug}`,
    keywords: post.tags.join(", "),
  };

  return (
    <main id="main" className="pt-32 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article>
        <header className="mx-auto max-w-[1280px] px-5 md:px-14">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink"
          >
            ← All posts
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
            {app ? (
              <Link
                href={`/apps/${app.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 transition-colors hover:border-ink hover:text-ink"
              >
                <span className="relative h-6 w-6">
                  <AppIcon app={app} className="h-full w-full" sizes="24px" />
                </span>
                {app.name}
              </Link>
            ) : (
              <Link href="/blog?app=general" className="rounded-full border border-line px-3 py-1 transition-colors hover:border-ink hover:text-ink">
                General
              </Link>
            )}
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
          </div>

          <Reveal>
            <h1 className="mt-6 max-w-[20ch] font-display text-[10vw] font-extrabold leading-[0.98] tracking-tight md:text-[5.2vw]">
              {post.title}
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-[52ch] font-serif text-2xl leading-snug text-ink-soft md:text-3xl">
              <em>{post.description}</em>
            </p>
          </Reveal>
        </header>

        <div className="mx-auto mt-16 max-w-[1280px] px-5 md:px-14">
          <div className="border-t border-line pt-14">
            <div className="prose-66 mx-auto max-w-[68ch]">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
              />
            </div>

            {post.tags.length > 0 && (
              <ul className="mx-auto mt-14 flex max-w-[68ch] flex-wrap gap-2" aria-label="Tags">
                {post.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-soft"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </article>

      {app && (
        <section className="mx-auto mt-24 max-w-[1280px] px-5 md:px-14" aria-label={`About ${app.name}`}>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">The app in this post</span>
          <div className="mt-5 max-w-3xl">
            <AppCard app={app} />
          </div>
        </section>
      )}

      {!app && featured.length > 0 && (
        <section className="mx-auto mt-24 max-w-[1280px] px-5 md:px-14" aria-label="Apps in this post">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">
            From 66 studio, in this post
          </span>
          <div className="mt-5 flex max-w-3xl flex-col gap-3">
            {featured.map((a) => (
              <AppStrip key={a.slug} app={a} />
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mx-auto mt-24 max-w-[1280px] px-5 md:px-14">
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
            Keep <em>reading.</em>
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {related.map((r, i) => {
              const rApp = r.app ? getApp(r.app) : undefined;
              return (
                <Reveal key={r.slug} delay={i * 0.06}>
                  <Link
                    href={`/blog/${r.slug}`}
                    data-cursor="Read"
                    className="group flex h-full flex-col rounded-[22px] border border-line p-7 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
                  >
                    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] opacity-60">
                      {rApp && (
                        <span className="relative h-5 w-5">
                          <AppIcon app={rApp} className="h-full w-full" sizes="20px" />
                        </span>
                      )}
                      {formatDate(r.date, "short")} · {r.readingTime} min
                    </span>
                    <span className="mt-4 font-display text-xl font-extrabold leading-tight tracking-tight">
                      {r.title}
                    </span>
                    <span className="mt-auto pt-6 font-mono text-xs uppercase tracking-[0.08em] opacity-60 transition-transform duration-500 group-hover:translate-x-1.5">
                      Read →
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
