import Link from "next/link";
import type { ComponentProps } from "react";
import { BlogVideo } from "@/components/blog-video";
import { AppStrip } from "@/components/app-card";
import { apps, getApp } from "@/lib/apps";

/** Internal links go through next/link; external ones open as normal links. */
function A({ href = "", ...props }: ComponentProps<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) return <Link href={href} {...props} />;
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
}

/**
 * Markdown wraps images in a <p>, so this can't use <figure>/<figcaption> (block elements
 * aren't allowed inside <p>: it breaks hydration). Spans styled as blocks instead.
 */
function Img({ alt = "", ...props }: ComponentProps<"img">) {
  return (
    <span className="prose-figure">
      {/* Post images come from markdown with unknown dimensions, so a plain lazy img is the right tool. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={alt} loading="lazy" decoding="async" {...props} />
      {alt && <span className="prose-caption">{alt}</span>}
    </span>
  );
}

function Table(props: ComponentProps<"table">) {
  return (
    <div className="prose-table-wrap">
      <table {...props} />
    </div>
  );
}

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="my-8 rounded-[18px] border-2 border-dashed border-line p-12 text-center">
      <div className="font-mono text-xs uppercase tracking-[0.12em] text-ink-soft">Image placeholder</div>
      <div className="mt-2 text-sm text-ink-soft">{label}</div>
    </div>
  );
}

/** `<App slug="peggo" />`, drop one of the lab's apps into a post. */
function App({ slug }: { slug: string }) {
  const app = getApp(slug);
  if (!app) return null;
  return (
    <div className="not-prose my-10">
      <AppStrip app={app} />
    </div>
  );
}

/** `<AllApps />`, every app on the shelf, e.g. to close out a general post. */
function AllApps({ title = "Made by 66 labs" }: { title?: string }) {
  return (
    <div className="not-prose my-12">
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">{title}</span>
      <div className="mt-4 flex flex-col gap-3">
        {apps.map((a) => (
          <AppStrip key={a.slug} app={a} />
        ))}
      </div>
    </div>
  );
}

export const mdxComponents = {
  App,
  AllApps,
  a: A,
  img: Img,
  table: Table,
  Video: BlogVideo,
  ImagePlaceholder,
};
