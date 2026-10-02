"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RollText } from "@/components/micro";
import { lockScroll } from "@/components/smooth-scroll";

const LINKS = [
  { href: "/apps", label: "Apps" },
  { href: "/blog", label: "Blog" },
  { href: "/#about", label: "Lab" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // App pages open on a dark hero, so the header reads light until you scroll past it
  const onDark = /^\/apps\/[^/]+\/?$/.test(usePathname()) && !scrolled;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    // Only touch Lenis while the menu is open, so mounting never unlocks the intro's scroll lock.
    if (open) lockScroll(true);
    return () => {
      document.body.style.overflow = "";
      if (open) lockScroll(false);
    };
  }, [open]);

  return (
    <>
      <header
        style={{ viewTransitionName: "site-header" }}
        className={`fixed top-0 inset-x-0 z-120 flex items-center justify-between px-5 md:px-14 py-4.5 border-b transition-colors duration-300 ${
          open ? "bg-ink border-transparent" : scrolled ? "bg-paper/90 backdrop-blur-md border-line" : "border-transparent"
        } ${onDark || open ? "text-paper" : "text-ink"}`}
      >
        <Link
          href="/"
          className="font-display font-extrabold text-[22px] tracking-tight flex items-center gap-2"
        >
          <span aria-hidden="true" className="w-2 h-2 rounded-full bg-blue inline-block" />
          66<span className="sr-only">labs</span>
        </Link>
        <nav aria-label="Primary" className="hidden md:flex gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative pb-0.75 font-mono text-xs uppercase tracking-[0.08em]"
            >
              <RollText>{l.label}</RollText>
              <span className="absolute left-0 right-full bottom-0 h-px bg-current transition-all duration-300 group-hover:right-0" />
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="relative z-130 h-6 w-8.5 md:hidden"
        >
          <span
            className={`absolute left-0 right-0 h-0.5 bg-current transition-transform duration-300 ${open ? "translate-y-[9px] rotate-45" : ""}`}
            style={{ top: "2px" }}
          />
          <span
            className={`absolute left-0 right-0 h-0.5 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
            style={{ top: "11px" }}
          />
          <span
            className={`absolute left-0 right-0 h-0.5 bg-current transition-transform duration-300 ${open ? "-translate-y-[9px] -rotate-45" : ""}`}
            style={{ top: "20px" }}
          />
        </button>
      </header>

      <div
        id="mobile-nav"
        className="fixed inset-0 z-110 flex flex-col justify-center bg-ink px-8 text-paper transition-[clip-path] duration-500"
        style={{
          clipPath: open
            ? "circle(150% at calc(100% - 40px) 34px)"
            : "circle(0% at calc(100% - 40px) 34px)",
          transitionTimingFunction: "var(--ease)",
        }}
      >
        <ul className="flex flex-col gap-1">
          {LINKS.map((l, i) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="inline-block font-display text-[13vw] font-extrabold leading-[1.05] tracking-tight transition-all duration-500"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: open ? `${0.08 + i * 0.06}s` : "0s",
                }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
