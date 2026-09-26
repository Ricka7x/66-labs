# 66 studio

The studio's site: Next.js (App Router), Tailwind v4, native React `<ViewTransition>` for the
app-card → app-page morph.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build + static generation check
npm run lint
```

## Adding an app

Add an entry to the `apps` array in `src/lib/apps.ts`, that's it. The homepage shelf, `/apps`,
and `/apps/[slug]` (statically generated) are all driven off that array.

- Icon: export the 1024px icon from the app's `AppIcon.appiconset` to `public/apps/<slug>.png`.
  Set `iconFullBleed: true` if the artwork fills the whole square (no macOS padding) so it's
  scaled to match the others.
- Features are `{ title, body, image? }` and every app page shows them as the pinned scroll
  showcase. Add `image: { src: "/apps/<slug>/features/<name>.webp", alt, aspect: "w / h" }` to swap a
  feature's "Screenshot soon" card for the real thing. Screenshots around 3:2 fit the frame best.
- Demo video: put `<name>.mp4`, `<name>.webm` and `<name>-poster.webp` in `public/apps/<slug>/`, then
  set `video: { src: "/apps/<slug>/<name>", title, caption, aspect: "w / h" }`. Without one the
  page shows a "Demo video on the way" frame.
- `status: "coming-soon"` shows a "Tell me when it's out" email button. For shipped apps, set
  `links.download`, until then the page shows "Download, soon".

## Writing a blog post

Drop an `.mdx` file in `content/blog/`, the filename is the slug (`/blog/<slug>`).

```mdx
---
title: "Post title"
description: "One-sentence summary, used on cards, in the feed and as the meta description."
date: "2026-09-26"
author: "66 studio"
tags: ["macOS", "productivity"]
app: "boomark"        # app-specific post: listed under that app's filter and on its page
# features: ["snapback", "peggo", "boomark"]   # general post (no `app`): shows on each featured app's page

published: true       # false keeps it out of every list, page and the feed
---
```

- No `app` = a **General** post (lists, studio news). Add `features` to surface it on those apps' pages.
- `<App slug="peggo" />` embeds an app card anywhere in a post; `<AllApps />` embeds the whole shelf.
- `/blog?app=<slug>` (or `?app=general`) opens the blog pre-filtered.
- Markdown + GFM tables work. `<Video src="/blog/<app>/clip.mp4" autoPlay />` embeds a demo
  (put a `clip-poster.webp` next to it); `<ImagePlaceholder label="..." />` marks a missing image.
- Put post media in `public/blog/<app>/`.
- Posts show up on `/blog`, in `/feed.xml`, on the homepage (latest 3), and on their app's page.

## Help, terms & privacy

- Help content lives in `src/lib/help.ts`: one list of sections per app (`appHelp[slug]`) plus
  `studioHelp`, the questions shared by every app. Section `id`s are link anchors
  (`/apps/<slug>/help#displays`); blog posts use them, so don't rename them casually.
- `/help` is the hub; `/apps/<slug>/help` is each app's searchable help page.
- `/terms` and `/privacy` are studio-wide, with a section per app in the privacy policy. When you
  add an app, or an app starts using a new service (analytics, sync, payments), add or update its
  section and bump the "Last updated" date.

## Structure

- `src/app/page.tsx`: homepage (hero, app shelf, scene-scroll, studio note, house rules, contact)
- `src/app/apps/page.tsx`: every app
- `src/app/apps/[slug]/page.tsx`: one app's page (hero, features, pricing)
- `src/app/blog/`: blog index + post pages; `src/app/feed.xml/route.ts`: RSS
- `src/lib/apps.ts`: the single source of truth for all app content
- `src/lib/posts.ts`: reads `content/blog/*.mdx`
- `src/components/`: shared UI (header, footer, cursor, reveal/parallax hooks, cards)
- `_reference/single-file-v1.html`: the original single-file HTML version, kept for reference

Old `/work` and `/work/:slug` URLs redirect to `/apps` (see `next.config.ts`).

## Notes

- Fonts (Bricolage Grotesque, Instrument Serif, JetBrains Mono) are self-hosted automatically via
  `next/font/google`; no runtime requests to Google.
- The card → app-page transition uses React's `<ViewTransition>` (built into the App Router,
  see [Next's view transitions guide](https://nextjs.org/docs/app/guides/view-transitions)).
- Motion is hand-rolled (rAF + CSS custom properties); the only dependency is
  [Lenis](https://github.com/darkroomengineering/lenis) for inertia scrolling. Shared helpers live
  in `src/lib/motion.ts`, most effect CSS in `globals.css`.
- The first visit of a session gets the 00 → 66 intro (`intro-loader.tsx`); arrival animations key
  off `html.intro-done`, set before paint by the inline script in `layout.tsx`.
- Everything respects `prefers-reduced-motion`: no intro, no smooth scroll, no pinning, static
  stickers, content shown immediately.
