import type { MetadataRoute } from "next";
import { apps } from "@/lib/apps";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-static";

const SITE = "https://66labs.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/apps/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/blog/`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/help/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/terms/`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE}/privacy/`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const appRoutes: MetadataRoute.Sitemap = apps.flatMap((app) => [
    { url: `${SITE}/apps/${app.slug}/`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE}/apps/${app.slug}/help/`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.4 },
  ]);

  const postRoutes: MetadataRoute.Sitemap = getPosts().map((post) => ({
    url: `${SITE}/blog/${post.slug}/`,
    lastModified: new Date(`${post.date}T00:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...appRoutes, ...postRoutes];
}
