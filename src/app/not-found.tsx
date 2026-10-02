import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="relative flex min-h-screen flex-col items-start justify-center overflow-hidden bg-ink px-5 pt-24 pb-20 text-paper md:px-14"
    >
      <div className="grain" aria-hidden="true" />

      <Reveal className="relative z-10 max-w-[900px]">
        <span className="mb-7 inline-flex items-center rounded-full border border-[rgba(243,245,249,0.25)] px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.16em]">
          404: nothing to see here
        </span>
        <h1 className="font-display text-[15vw] font-extrabold leading-[0.92] tracking-tight md:text-[7.5vw]">
          Well, this is <span className="text-blue-soft">awkward.</span>
        </h1>
        <p className="mt-7 max-w-[46ch] font-mono text-[15px] leading-relaxed text-[rgba(243,245,249,0.68)]">
          This page doesn&apos;t exist, never did, or packed up and left without telling us. Either way, you
          caught us empty-handed. The apps are all still where we left them.
        </p>
        <div className="mt-11 flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-full bg-paper px-6 py-3.5 font-mono text-[13px] uppercase tracking-[0.05em] text-ink transition-colors duration-300 hover:bg-blue-soft hover:text-paper"
          >
            Take me home
          </Link>
          <Link
            href="/apps"
            className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(243,245,249,0.25)] px-6 py-3.5 font-mono text-[13px] uppercase tracking-[0.05em] text-paper transition-colors duration-300 hover:border-paper hover:bg-[rgba(243,245,249,0.06)]"
          >
            See the apps
          </Link>
        </div>
      </Reveal>

      <div
        aria-hidden="true"
        className="absolute right-16 top-1/2 hidden h-45 w-45 -translate-y-1/2 md:block"
      >
        <div className="orbit relative h-full w-full rounded-full border border-dashed border-[rgba(243,245,249,0.25)]">
          <span className="absolute -top-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-lime" />
        </div>
      </div>

      <span
        aria-hidden="true"
        className="ghost-word pointer-events-none absolute -bottom-20 -right-6 select-none font-display text-[32vw] font-extrabold leading-none md:text-[22vw]"
      >
        66
      </span>
    </main>
  );
}
