"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Clarity from "@microsoft/clarity";

const GA_MEASUREMENT_ID = "G-53S1NP5SF6";
const CLARITY_PROJECT_ID = "yrnkerysvr";
const STORAGE_KEY = "66labs-consent";
const OPEN_EVENT = "66labs:open-cookie-settings";
const CHANGE_EVENT = "66labs:consent-changed";

type Choice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    globalPrivacyControl?: boolean;
  }
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

function readChoice(): Choice | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/** Held in memory too, so a choice still applies for this visit if storage is blocked. */
let memoryChoice: Choice | null = null;

function writeChoice(choice: Choice) {
  memoryChoice = choice;
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* storage blocked */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** The saved choice, else "denied" if the browser sends Global Privacy Control, else null (ask). */
function currentChoice(): Choice | null {
  return readChoice() ?? memoryChoice ?? (navigator.globalPrivacyControl ? "denied" : null);
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Removes the Google Analytics and Clarity cookies this site may have set. */
function clearTrackingCookies() {
  const host = window.location.hostname;
  const root = host.split(".").slice(-2).join(".");
  const domains = [undefined, host, `.${host}`, `.${root}`];
  document.cookie.split(";").forEach((raw) => {
    const name = raw.split("=")[0].trim();
    if (!/^(_ga|_gid|_gat|_clck|_clsk|CLID|ANONCHK|MUID|SM|SRM_B)/.test(name)) return;
    domains.forEach((d) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ""}`;
    });
  });
}

function loadGoogleAnalytics() {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

function startClarity() {
  Clarity.init(CLARITY_PROJECT_ID);
  Clarity.consentV2({ ad_Storage: "denied", analytics_Storage: "granted" });
}

/**
 * Loads Google Analytics and Microsoft Clarity only after the visitor accepts.
 * Nothing from either is requested before then, and a Global Privacy Control
 * signal counts as a decline. The choice is kept in localStorage and can be
 * changed any time from the footer.
 */
export function AnalyticsConsent() {
  const pathname = usePathname();
  // "pending" on the server and during hydration: no banner, nothing loaded.
  const choice = useSyncExternalStore<Choice | null | "pending">(subscribe, currentChoice, () => "pending");
  const [reopened, setReopened] = useState(false);
  const open = reopened || choice === null;

  useEffect(() => {
    const reopen = () => setReopened(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (choice !== "granted") return;
    loadGoogleAnalytics();
    startClarity();
  }, [choice]);

  useEffect(() => {
    if (choice !== "granted") return;
    Clarity.setTag("page", pathname);
  }, [choice, pathname]);

  const decide = useCallback(
    (next: Choice) => {
      const wasGranted = choice === "granted";
      writeChoice(next);
      setReopened(false);
      if (next === "denied" && wasGranted) {
        clearTrackingCookies();
        // Scripts already running can't be unloaded, so start clean.
        window.location.reload();
      }
    },
    [choice],
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-4 bottom-4 z-[90] max-w-[440px] rounded-[22px] bg-ink p-6 text-paper shadow-2xl md:left-6 md:bottom-6"
    >
      <h2 id="cookie-title" className="font-display text-xl font-bold">
        Cookies, your call
      </h2>
      <p className="mt-2 font-sans text-sm leading-relaxed text-[rgba(243,245,249,0.75)]">
        We&apos;d like to use Google Analytics and Microsoft Clarity (which can record anonymised sessions) to see how
        this site is used. They set cookies and share data with Google and Microsoft. Nothing loads unless you accept.
        Details in our <Link href="/cookies" className="underline">cookie policy</Link> and{" "}
        <Link href="/privacy" className="underline">privacy policy</Link>.
      </p>
      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={() => decide("denied")}
          className="flex-1 rounded-full border border-paper px-4 py-2.5 font-mono text-xs uppercase tracking-[0.08em] hover:bg-paper hover:text-ink"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => decide("granted")}
          className="flex-1 rounded-full border border-paper px-4 py-2.5 font-mono text-xs uppercase tracking-[0.08em] hover:bg-paper hover:text-ink"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

/** Footer control that reopens the banner so a choice can be changed. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Cookie settings
    </button>
  );
}
