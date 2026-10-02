import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { getApp, type App } from "@/lib/apps";

const POSTS_DIR = path.join(process.cwd(), "content/blog");

export interface Post {
  slug: string;
  title: string;
  description: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  author?: string;
  tags: string[];
  /** The app this post is about. Omit for general posts (lists, lab news…). */
  app?: App["slug"];
  /** Apps a general post covers: it's also listed on each of those apps' pages. */
  features: App["slug"][];
  published: boolean;
  readingTime: number;
  content: string;
}

function readPost(file: string): Post {
  const slug = file.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    author: data.author,
    tags: data.tags ?? [],
    app: data.app && getApp(data.app) ? data.app : undefined,
    features: ((data.features ?? []) as string[]).filter((s) => getApp(s)),
    published: data.published ?? false,
    readingTime: Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200)),
    content,
  };
}

/** Every published post, newest first. Drafts (`published: false`) never leave this module. */
export const getPosts = cache((): Post[] => {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(readPost)
    .filter((p) => p.published)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
});

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

/** Posts about an app, plus general posts that feature it, newest first. */
export function getPostsForApp(slug: App["slug"]): Post[] {
  return getPosts().filter((p) => p.app === slug || (!p.app && p.features.includes(slug)));
}

/** Up to `n` other posts, preferring ones about the same app. */
export function getRelatedPosts(post: Post, n = 3): Post[] {
  const others = getPosts().filter((p) => p.slug !== post.slug);
  const sameApp = others.filter((p) => post.app && p.app === post.app);
  const rest = others.filter((p) => !sameApp.includes(p));
  return [...sameApp, ...rest].slice(0, n);
}

export function formatDate(date: string, style: "long" | "short" = "long") {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: style === "long" ? "long" : "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Lightweight shape safe to hand to client components (no MDX body). */
export type PostSummary = Omit<Post, "content">;
export function summarize({ content: _content, ...rest }: Post): PostSummary {
  void _content;
  return rest;
}
