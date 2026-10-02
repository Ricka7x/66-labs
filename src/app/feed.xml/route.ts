import { getApp } from "@/lib/apps";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-static";

const SITE = "https://66labs.dev";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = getPosts()
    .map((p) => {
      const url = `${SITE}/blog/${p.slug}`;
      const category = p.app ? getApp(p.app)?.name : "General";
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(p.description)}</description>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
      ${category ? `<category>${esc(category)}</category>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>66 labs: Notes from the workbench</title>
    <link>${SITE}/blog</link>
    <description>Guides, updates and behind-the-scenes on the apps from 66 labs.</description>
    <language>en</language>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
