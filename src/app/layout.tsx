import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CustomCursor } from "@/components/custom-cursor";
import { SmoothScroll } from "@/components/smooth-scroll";
import { IntroLoader } from "@/components/intro-loader";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable",
  // Width + optical size power the hero's cursor-reactive lettering.
  axes: ["wdth", "opsz"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-jbmono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://66labs.dev"),
  title: {
    default: "66 Studio: Small apps for big annoyances",
    template: "%s: 66 Studio",
  },
  description:
    "66 studio makes small, native apps for the Mac and iPhone, each one fixing a single everyday annoyance, properly.",
};

/**
 * Runs before paint: marks JS as available (so arrival animations can start
 * hidden) and decides whether this is the first visit of the session, which
 * gets the intro counter.
 */
const ARRIVAL_SCRIPT = `(function(){var d=document.documentElement;d.classList.add("js");try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&!sessionStorage.getItem("66-intro"))d.classList.add("intro")}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${instrumentSerif.variable} ${jbMono.variable}`}
      // The inline script below adds classes before hydration.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: ARRIVAL_SCRIPT }} />
      </head>
      <body className="bg-paper text-ink antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="grain" aria-hidden="true" />
        <SmoothScroll />
        <IntroLoader />
        <CustomCursor />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
