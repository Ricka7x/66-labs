import type { Metadata } from "next";
import { AppCard, NextAppCard } from "@/components/app-card";
import { apps } from "@/lib/apps";

export const metadata: Metadata = {
  title: "Apps",
  description: `Every app from 66 studio: ${apps.map((a) => a.name).join(", ")}. Small, native apps for the Mac and iPhone, each fixing one everyday annoyance.`,
};

export default function AppsPage() {
  return (
    <main id="main" className="pt-35 pb-30">
      <div className="mx-auto max-w-[1280px] px-5 md:px-14">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">All apps</span>
        <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight md:text-[6vw]">
          Everything on <em>the shelf.</em>
        </h1>
        <p className="mt-5 max-w-130 text-base text-ink-soft md:text-lg">
          Small, native apps for the Mac and iPhone. Each one fixes one annoying thing, properly,
          and doesn&apos;t try to do anything else.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-[1280px] grid-cols-1 gap-5 px-5 md:grid-cols-2 md:px-14">
        {apps.map((a, i) => (
          <AppCard key={a.slug} app={a} delay={i * 0.06} />
        ))}
        <NextAppCard number={apps.length + 1} delay={apps.length * 0.06} />
      </div>
    </main>
  );
}
