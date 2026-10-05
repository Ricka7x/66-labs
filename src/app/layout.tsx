import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import Script from "next/script";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CustomCursor } from "@/components/custom-cursor";
import { SmoothScroll } from "@/components/smooth-scroll";
import { IntroLoader } from "@/components/intro-loader";
import ClarityAnalytics from "@/components/clarity-analytics";

const GA_MEASUREMENT_ID = "G-53S1NP5SF6";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable",
  // Width + optical size power the hero's cursor-reactive lettering.
  axes: ["wdth", "opsz"],
  variable: "--font-bricolage",
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
    default: "66 Labs: Small apps for big annoyances",
    template: "%s: 66 Labs",
  },
  description:
    "66 labs makes small, native apps for the Mac and iPhone, each one fixing one everyday annoyance properly, then getting out of the way.",
  openGraph: {
    title: "66 Labs: Small apps for big annoyances",
    description:
      "66 labs makes small, native apps for the Mac and iPhone, each one fixing one everyday annoyance properly, then getting out of the way.",
    url: "https://66labs.dev",
    siteName: "66 Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "66 Labs: Small apps for big annoyances",
    description:
      "66 labs makes small, native apps for the Mac and iPhone, each one fixing one everyday annoyance properly, then getting out of the way.",
  },
};

/**
 * Runs before paint: marks JS as available (so arrival animations can start
 * hidden) and decides whether this is the first visit of the session, which
 * gets the intro counter.
 *
 * This must be a plain `<script>` tag, not `next/script`: in this Next
 * version, `beforeInteractive` scripts are serialized into a `self.__next_s`
 * queue that the async-loaded runtime bundle only drains after it hydrates,
 * so the real page paints first and the intro flashes in afterward. A raw
 * inline script is parser-blocking and runs before any body content paints.
 */
const ARRIVAL_SCRIPT = `(function(){var d=document.documentElement;d.classList.add("js");try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&!sessionStorage.getItem("66-intro"))d.classList.add("intro")}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${GeistSans.variable} ${jbMono.variable}`}
      // The inline script below adds classes before hydration.
      suppressHydrationWarning
    >
      <head>
        <script id="arrival-script" dangerouslySetInnerHTML={{ __html: ARRIVAL_SCRIPT }} />
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
        <ClarityAnalytics />
        {children}
        <SiteFooter />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
