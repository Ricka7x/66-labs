import { ViewTransition } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowDown, ArrowRight, Mail } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import { StatusSticker } from "@/components/app-card";
import { Reveal } from "@/components/reveal";
import { SplitReveal } from "@/components/split-reveal";
import { MagneticButton } from "@/components/magnetic-button";
import { Marquee } from "@/components/marquee";
import { OrbitText, TiltBox } from "@/components/app-page-bits";
import { AppVideo, VideoPlaceholder } from "@/components/app-video";
import { FeatureShowcase } from "@/components/feature-showcase";
import { IconSwap } from "@/components/icon-swap";
import { STATUS_LABEL, apps, getApp, getNextApp, type App } from "@/lib/apps";
import { getPostsForApp } from "@/lib/posts";
import { LatestPosts } from "@/components/latest-posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return apps.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/apps/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) return {};
  return {
    title: `${app.name}: ${app.kind} for ${app.platforms.join(" & ")}`,
    description: app.tagline,
    alternates: { canonical: `/apps/${app.slug}` },
  };
}

export default async function AppPage({ params }: PageProps<"/apps/[slug]">) {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) notFound();
  const next = getNextApp(slug);

  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <main id="main">
        {/* ---------- Hero ---------- */}
        <section className="relative z-1 overflow-x-clip bg-ink pt-27.5 pb-16 text-paper">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full opacity-45 blur-[80px]"
            style={{ width: 420, height: 420, top: -120, right: -80, background: app.glow[0] }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full opacity-30 blur-[80px]"
            style={{ width: 300, height: 300, bottom: 30, left: "12%", background: app.glow[1] }}
          />

          <div className="relative z-2 mx-auto max-w-[1280px] px-5 md:px-14">
            <Link
              href="/apps"
              transitionTypes={["nav-back"]}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-[rgba(243,245,249,0.6)] hover:text-paper"
            >
              ← All apps
            </Link>

            <div className="mt-12 grid grid-cols-1 items-center gap-12 md:grid-cols-[1.4fr_1fr]">
              <div>
                <StatusSticker status={app.status} className="-rotate-2" />
                <ViewTransition name={`app-title-${app.slug}`}>
                  <h1 className="mt-6 font-display text-[16vw] font-extrabold leading-[0.92] tracking-tight md:text-[7vw]">
                    {app.name}
                  </h1>
                </ViewTransition>
                <p className="mt-2 font-sans text-2xl text-[rgba(243,245,249,0.7)] md:text-3xl">
                  <em>
                    a {app.kind.toLowerCase()} for {app.platforms.join(" & ")}
                  </em>
                </p>
                <SplitReveal as="p" stagger={0.025} delay={0.15} className="mt-6 block max-w-140 text-lg text-[rgba(243,245,249,0.78)] md:text-xl">
                  {app.tagline}
                </SplitReveal>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <MagneticButton>
                    <PrimaryAction app={app} />
                  </MagneticButton>
                  {app.pricing.pro && app.links.purchase && (
                    <a
                      href={app.links.purchase}
                      className="font-mono text-xs uppercase tracking-[0.08em] text-[rgba(243,245,249,0.7)] underline decoration-line-invert underline-offset-4 hover:text-paper"
                    >
                      Get Pro{app.pricing.pro.price ? `: ${app.pricing.pro.price}` : ""}
                    </a>
                  )}
                </div>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(243,245,249,0.5)]">
                  {app.requires} · {app.pricing.free}
                </p>
              </div>

              <TiltBox className="mx-auto flex aspect-square w-full max-w-90 items-center justify-center rounded-[32px] border border-line-invert bg-[rgba(243,245,249,0.04)] md:max-w-105">
                <span className="absolute left-5 top-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[rgba(243,245,249,0.4)]">
                  fig. {String(apps.indexOf(app) + 1).padStart(2, "0")}
                </span>
                <OrbitText
                  text={`${app.name} · ${app.kind} · ${app.platforms.join(" + ")} · `}
                  className="tilt-layer absolute inset-[8%] text-[rgba(243,245,249,0.32)]"
                />
                <ViewTransition name={`app-icon-${app.slug}`}>
                  <div
                    className="tilt-layer relative h-1/2 w-1/2"
                    style={{ "--depth": 30 } as React.CSSProperties}
                  >
                    <AppIcon app={app} className="h-full w-full" sizes="(min-width: 768px) 220px, 45vw" preload />
                  </div>
                </ViewTransition>
              </TiltBox>
            </div>
          </div>
        </section>

        {/* ---------- In action ---------- */}
        <section className="relative overflow-x-clip pb-8" aria-label={`${app.name} in action`}>
          <div className="relative mx-auto max-w-[1280px] px-5 md:px-14">
            {/* The hero's ink carries on behind the top half of the frame, so it straddles the two. */}
            <div aria-hidden="true" className="absolute -inset-x-[100vw] top-0 bottom-1/2 bg-ink" />
            <span className="relative block pt-2 pb-6 font-mono text-xs uppercase tracking-[0.14em] text-[rgba(243,245,249,0.5)]">
              See it in action
            </span>
            <div className="relative">
              {app.video ? (
                <AppVideo video={app.video} accent={app.accent} featured />
              ) : (
                <VideoPlaceholder app={app} />
              )}
            </div>
          </div>
          {app.video?.caption && (
            <p className="mx-auto mt-5 flex max-w-[1280px] flex-wrap items-baseline gap-x-3 gap-y-1 px-5 md:px-14">
              <span className="font-display text-lg font-extrabold tracking-tight">{app.video.title}</span>
              <span className="text-[15px] text-ink-soft">{app.video.caption}</span>
            </p>
          )}

        </section>

        {/* ---------- About + features ---------- */}
        <section className="py-24">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-5 md:grid-cols-[0.8fr_1.2fr] md:gap-15 md:px-14">
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">
                The short version
              </span>
              <p className="mt-4 max-w-[46ch] text-lg leading-relaxed">
                {app.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {app.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] tracking-[0.04em] text-ink-soft"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.06} className="self-end">
              <SplitReveal as="p" stagger={0.03} className="block font-display text-3xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
                {`${app.features.length} things it does _really_ _well._`}
              </SplitReveal>
            </Reveal>
          </div>

          <div className="mx-auto mt-10 max-w-[1280px] px-5 md:mt-6 md:px-14">
            <FeatureShowcase app={app} />
          </div>
        </section>

        {/* ---------- Pricing ---------- */}
        <section id="pricing" className="scroll-mt-20 border-t border-line py-24">
          <div className="mx-auto max-w-[1280px] px-5 md:px-14">
            <SplitReveal as="h2" className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">
              What it _costs._
            </SplitReveal>
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
              <Reveal className="rounded-[22px] border border-line p-8">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">Free</span>
                <p className="mt-3 font-display text-5xl font-extrabold tracking-tight">$0</p>
                <p className="mt-3 text-ink-soft">
                  {app.pricing.pro
                    ? "The core app, free to download. Pro is there if you want more."
                    : "The whole app, free to download."}
                </p>
              </Reveal>
              {app.pricing.pro ? (
                <Reveal delay={0.06}>
                  <TiltBox className="h-full rounded-[22px] bg-ink p-8 text-paper">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute rounded-full opacity-50 blur-[50px]"
                    style={{ width: 200, height: 200, top: -60, right: -40, background: app.accent }}
                  />
                  <div className="relative z-2">
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-[rgba(243,245,249,0.6)]">
                      Pro
                    </span>
                    <p className="mt-3 font-display text-5xl font-extrabold tracking-tight">
                      {app.pricing.pro.price ?? <em className="text-4xl">soon</em>}
                      {app.pricing.pro.note && (
                        <span className="ml-2 font-mono text-xs font-normal uppercase tracking-[0.08em] text-[rgba(243,245,249,0.6)]">
                          {app.pricing.pro.note}
                        </span>
                      )}
                    </p>
                    <ul className="mt-5 flex flex-col gap-2.5">
                      {app.pricing.pro.perks.map((p) => (
                        <li key={p} className="flex items-start gap-3 text-[15px] text-[rgba(243,245,249,0.86)]">
                          <i
                            aria-hidden="true"
                            className="mt-1.75 h-2 w-2 shrink-0 rounded-full not-italic"
                            style={{ background: app.accent }}
                          />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  </TiltBox>
                </Reveal>
              ) : (
                <Reveal
                  delay={0.06}
                  className="flex items-center rounded-[22px] border-2 border-dashed border-line p-8"
                >
                  <p className="font-sans text-2xl text-ink-soft">
                    <em>That&apos;s it. That&apos;s the pricing.</em>
                  </p>
                </Reveal>
              )}
            </div>
          </div>
        </section>

        <LatestPosts
          posts={getPostsForApp(app.slug).slice(0, 4)}
          eyebrow={`${app.name} on the blog`}
          title="Tips, tricks & _updates._"
          allHref={`/blog?app=${app.slug}`}
        />

        <Marquee
          className="border-y border-line bg-paper text-ink"
          items={[app.name, app.kind, app.name, app.platforms.join(" + "), app.name, STATUS_LABEL[app.status]]}
        />

        {/* ---------- Footer nav ---------- */}
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="flex flex-wrap gap-x-6 gap-y-2">
              <Link
                href={`/apps/${app.slug}/help`}
                className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink"
              >
                {app.name} help →
              </Link>
              <a
                href={`mailto:hello@66labs.dev?subject=${encodeURIComponent(app.name)}`}
                className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink"
              >
                Questions? Ask us
              </a>
            </span>
            {next.slug !== app.slug && (
              <Link
                href={`/apps/${next.slug}`}
                transitionTypes={["nav-forward"]}
                className="group text-right"
              >
                <span className="block font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">Next app</span>
                <span className="mt-1 inline-flex items-center gap-3 font-display text-4xl font-extrabold tracking-tight md:text-6xl">
                  {next.name}
                  <span className="h-8 w-8 overflow-hidden md:h-10 md:w-10">
                    <IconSwap icon={ArrowRight} direction="right" className="h-[55%] w-[55%]" />
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </main>
    </ViewTransition>
  );
}

function PrimaryAction({ app }: { app: App }) {
  const className =
    "group inline-flex items-center gap-3 rounded-full bg-paper py-2.5 pl-6 pr-2.5 font-mono text-[13px] uppercase tracking-[0.05em] text-ink";
  const icon = (Icon: typeof ArrowDown, direction: "down" | "diagonal" = "down") => (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-ink text-paper transition-colors duration-300 group-hover:bg-[var(--hover-bg)] group-hover:text-paper"
      style={{ "--hover-bg": app.accent } as React.CSSProperties}
    >
      <IconSwap icon={Icon} direction={direction} />
    </span>
  );

  if (app.links.download) {
    return (
      <a href={app.links.download} className={className}>
        Download for {app.platforms[0]}
        {icon(ArrowDown)}
      </a>
    );
  }
  if (app.status === "available") {
    // Shipped, but its download hasn't moved to this site yet.
    return (
      <span aria-disabled="true" className={`${className} cursor-default opacity-80`}>
        Download for {app.platforms[0]}, soon
        {icon(ArrowDown)}
      </span>
    );
  }
  return (
    <a
      href={`mailto:hello@66labs.dev?subject=${encodeURIComponent(`Tell me when ${app.name} launches`)}`}
      className={className}
    >
      Tell me when it&apos;s out
      {icon(Mail, "diagonal")}
    </a>
  );
}
