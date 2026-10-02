import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Parallax } from "@/components/parallax";
import { Marquee } from "@/components/marquee";
import { MagneticButton } from "@/components/magnetic-button";
import { KineticHeadline } from "@/components/kinetic-headline";
import { HeroStickers } from "@/components/hero-stickers";
import { AppShowcase } from "@/components/app-showcase";
import { SplitReveal } from "@/components/split-reveal";
import { ScrubCount, PointerGlow } from "@/components/micro";
import { OrientKicker } from "@/components/orient-kicker";
import { ScrubText } from "@/components/scrub-text";
import { IconSwap } from "@/components/icon-swap";
import { apps } from "@/lib/apps";
import { getPosts } from "@/lib/posts";
import { LatestPosts } from "@/components/latest-posts";

export default function HomePage() {
  const shipped = apps.filter((a) => a.status === "available").length;
  const posts = getPosts();
  const postCount = posts.length;

  return (
    <main id="main">
      {/* ---------- Hero ---------- */}
      <section id="top" className="relative flex min-h-dvh flex-col justify-center overflow-hidden pt-30">
        <Parallax
          speed={0.15}
          className="pointer-events-none absolute -right-15 -top-10 -z-10 h-80 w-80 rounded-full opacity-85"
        >
          <div className="blob h-80 w-80" style={{ background: "var(--blue)" }} />
        </Parallax>

        <HeroStickers apps={apps.map(({ slug, name, iconFullBleed }) => ({ slug, name, iconFullBleed }))} />

        <div className="relative z-2 mx-auto w-full max-w-[1280px] px-5 md:px-14">
          <span
            className="arrive inline-flex items-center gap-2.5 rounded-full border border-line bg-paper/60 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.16em] backdrop-blur-sm"
            style={{ "--d": "0.1s" } as React.CSSProperties}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue" />
            </span>
            66 labs: independent software
          </span>
          <KineticHeadline
            className="mt-6.5 font-display text-[12.5vw] font-extrabold leading-[0.96] tracking-tight md:text-[7.5vw]"
            lines={[{ text: "SMALL APPS FOR" }, { text: "BIG ANNOYANCES.", serif: true }]}
          />
          <p
            className="arrive mt-7.5 max-w-130 text-base text-ink-soft md:text-[19px]"
            style={{ "--d": "0.7s" } as React.CSSProperties}
          >
            We&apos;re a tiny lab making native apps for the Mac and iPhone. Each one takes on a
            single thing that makes you mutter at your screen, fixes it properly, and gets out of
            your way. Then we go find the next one.
          </p>
          <div className="arrive mt-9 flex flex-wrap items-center gap-5" style={{ "--d": "0.85s" } as React.CSSProperties}>
            <MagneticButton>
              <a
                href="#apps"
                data-cursor="Scroll"
                className="group inline-flex items-center gap-3 rounded-full bg-ink py-2.5 pl-6 pr-2.5 font-mono text-[13px] uppercase tracking-[0.05em] text-paper"
              >
                Meet the apps
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-paper text-ink transition-colors duration-300 group-hover:bg-blue group-hover:text-paper">
                  <IconSwap icon={ArrowDown} direction="down" className="h-[46%] w-[46%]" />
                </span>
              </a>
            </MagneticButton>
            <span className="font-sans text-lg text-ink-soft">
              <em>
                {apps.length} apps. {shipped} shipped. More on the way.
              </em>
            </span>
          </div>
        </div>

        <div className="relative z-2 mt-auto pt-56 md:pt-16">
          <Marquee items={[...apps.map((a) => a.name), "Native, always", "Fairly priced", "No bloat", "No nonsense"]} />
        </div>
      </section>

      {/* ---------- The shelf ---------- */}
      <AppShowcase apps={apps} />

      {/* ---------- About ---------- */}
      <section id="about" className="py-30">
        <div className="mx-auto max-w-[1280px] px-5 md:px-14">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[0.9fr_1.6fr] md:gap-15">
            <Reveal className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">
              <OrientKicker>The lab</OrientKicker>
            </Reveal>
            <div>
              <SplitReveal as="p" stagger={0.018} className="text-2xl leading-[1.28] tracking-tight md:text-4xl">
                We&apos;re a small lab with a long list of things that drive us up the wall, and the stubbornness to fix them _properly._ Every app starts as one of our own annoyances, and we price them fairly, so anyone with the same itch can have the fix.
              </SplitReveal>
              <ScrubText className="mt-6 max-w-150 text-base text-ink-soft md:text-lg">
                Our philosophy: one-time payment, cheap, useful. No subscriptions, no dark patterns, no renting software you already paid for. Pay once, own it, get updates. If it's not worth a one-time price, we don't ship it.
              </ScrubText>
              <div
                data-scrub-group
                className="mt-11 grid grid-cols-1 gap-4 border-t border-line pt-6 md:grid-cols-3 md:gap-6"
              >
                <Reveal>
                  <b className="block font-display text-[44px] font-extrabold leading-none text-blue">
                    <ScrubCount to={shipped} />
                  </b>
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                    Out in the wild
                  </span>
                </Reveal>
                <Reveal delay={0.06}>
                  <b className="block font-display text-[44px] font-extrabold leading-none">
                    <ScrubCount to={apps.length} />
                  </b>
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                    Apps and counting
                  </span>
                </Reveal>
                <Reveal delay={0.12}>
                  <b className="block font-display text-[44px] font-extrabold leading-none">
                    <ScrubCount to={postCount} />
                  </b>
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                    Notes on the blog
                  </span>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LatestPosts
        posts={posts.slice(0, 3)}
        eyebrow={<OrientKicker>The blog</OrientKicker>}
        title="Notes from _the_ _workbench._"
      />

      {/* ---------- Contact ---------- */}
      <section id="contact" className="relative overflow-hidden bg-ink pt-35 text-paper">
        <PointerGlow color="var(--teal)" size={620} />
        <div className="relative z-2 mx-auto max-w-[1280px] px-5 md:px-14">
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-line-invert px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.16em]">
              Bug? Idea? Rant?
            </span>
          </Reveal>
          <SplitReveal
            as="h2"
            stagger={0.08}
            className="mt-6.5 block max-w-[12ch] font-display text-[12vw] font-extrabold leading-[0.95] tracking-tight md:text-[7vw]"
          >
            REAL HUMANS _read_ _these._
          </SplitReveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-120 text-[rgba(243,245,249,0.72)]">
              Bug reports, feature wishes, or an annoyance that deserves to become app no.{" "}
              {apps.length + 1}: send it over. It lands in the same inbox the apps are built from,
              and we read every single one.
            </p>
          </Reveal>
          <Reveal delay={0.16} className="mt-12">
            <MagneticButton>
              <a
                href="mailto:hello@66labs.dev"
                data-cursor="Say hi"
                className="group inline-flex items-center gap-3.5 rounded-full bg-paper py-3 pl-7 pr-3 font-mono text-sm uppercase tracking-[0.05em] text-ink md:text-base"
              >
                hello@66labs.dev
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-ink text-paper transition-colors duration-300 group-hover:bg-blue"
                >
                  <IconSwap icon={ArrowUpRight} direction="diagonal" />
                </span>
              </a>
            </MagneticButton>
          </Reveal>
        </div>

        <div className="relative z-2 mt-24">
          <Marquee
            className="border-t border-line-invert bg-transparent text-paper"
            items={["Spot it", "Fix it", "Ship it", "Repeat", "Say hi"]}
          />
        </div>
      </section>
    </main>
  );
}
