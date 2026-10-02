import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import { HelpCenter } from "@/components/help-center";
import { Reveal } from "@/components/reveal";
import { SplitReveal } from "@/components/split-reveal";
import { IconSwap } from "@/components/icon-swap";
import { apps } from "@/lib/apps";
import { appHelp, labHelp } from "@/lib/help";

export const metadata: Metadata = {
  title: "Help",
  description: "Help and answers for every 66 labs app: setup, shortcuts, licenses and troubleshooting.",
  alternates: { canonical: "/help" },
};

export default function HelpPage() {
  return (
    <main id="main" className="pt-35 pb-30">
      <div className="mx-auto max-w-[1280px] px-5 md:px-14">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">Help</span>
        <SplitReveal
          as="h1"
          stagger={0.07}
          className="mt-4 block font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-[7vw]"
        >
          How can we _help?_
        </SplitReveal>
        <p className="mt-6 max-w-130 text-base text-ink-soft md:text-lg">
          Pick an app for setup guides, shortcuts and fixes, or skip the reading and{" "}
          <a href="mailto:hello@66labs.dev" className="text-ink underline decoration-blue decoration-2 underline-offset-4">
            email us
          </a>
          .
        </p>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((a, i) => {
            const count = (appHelp[a.slug] ?? []).reduce((n, s) => n + s.items.length, 0);
            return (
              <Reveal key={a.slug} delay={i * 0.06}>
                <Link
                  href={`/apps/${a.slug}/help`}
                  data-cursor="Help"
                  data-cursor-color={a.accent}
                  className="group relative flex items-center gap-5 overflow-hidden rounded-[22px] border border-line p-6 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
                >
                  <span className="relative h-16 w-16 shrink-0 transition-transform duration-500 group-hover:-rotate-8 group-hover:scale-110" style={{ transitionTimingFunction: "var(--spring)" }}>
                    <AppIcon app={a} className="h-full w-full" sizes="64px" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-2xl font-extrabold tracking-tight">{a.name}</span>
                    <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.08em] opacity-60">
                      {count} answers
                    </span>
                  </span>
                  <span aria-hidden="true" className="h-6 w-6 shrink-0 overflow-hidden">
                    <IconSwap icon={ArrowRight} direction="right" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-24">
          <HelpCenter sections={[labHelp]} />
        </div>
      </div>
    </main>
  );
}
