import Link from "next/link";
import { RollText } from "@/components/micro";

const LINKS = [
  { href: "/apps", label: "Apps" },
  { href: "/blog", label: "Blog" },
  { href: "/help", label: "Help" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line-invert bg-ink py-8 text-[rgba(244,242,234,0.55)]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-5 font-mono text-[11.5px] tracking-[0.04em] md:flex-row md:items-center md:justify-between md:px-14">
        <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-3 uppercase">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="group hover:text-paper">
              <RollText>{l.label}</RollText>
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 md:justify-end">
          <span>© {new Date().getFullYear()} 66 labs. Independently run.</span>
          <a href="#main" className="inline-flex items-center gap-1.5 hover:text-paper">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
