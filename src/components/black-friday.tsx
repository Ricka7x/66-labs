"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { apps, offerPurchaseUrl, type AppOffer } from "@/lib/apps";

/**
 * Time left on an offer, or null when it is not running. Starts null so the pre-rendered page and
 * the first client render match, then fills in after mount and returns to null at the end time.
 */
function useRemaining(offer?: AppOffer) {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    if (!offer) return;
    const end = new Date(offer.endsAt).getTime();
    const tick = () => {
      const left = end - Date.now();
      setMs(left > 0 ? left : null);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [offer]);

  return offer ? ms : null;
}

/** A buy link that carries the offer's code while the offer runs, and the plain link after. */
export function PurchaseLink({
  href,
  offer,
  price,
  className,
  children,
}: {
  href: string;
  offer?: AppOffer;
  /** Regular price, appended after the label as ": $9.99" (or the sale price while the offer runs) */
  price?: string;
  className?: string;
  children: ReactNode;
}) {
  const remaining = useRemaining(offer);
  const running = offer !== undefined && remaining !== null;
  return (
    <a href={offer && running ? offerPurchaseUrl(href, offer) : href} className={className}>
      {children}
      {offer && running ? (
        <>
          : {offer.salePrice}
          {price && <s className="ml-2 opacity-60">{price}</s>}
        </>
      ) : price ? (
        `: ${price}`
      ) : (
        ""
      )}
    </a>
  );
}

/** The Pro price, with the regular price crossed out beside the sale price while the offer runs. */
export function ProPrice({ price, offer }: { price: string; offer?: AppOffer }) {
  const ms = useRemaining(offer);
  if (!offer || ms === null) return <>{price}</>;
  return (
    <>
      {offer.salePrice}
      <s className="ml-3 text-2xl font-bold text-[rgba(243,245,249,0.4)]">{price}</s>
    </>
  );
}

/** The offer line and live counter shown beside an app's Pro price. */
export function OfferNote({ offer }: { offer?: AppOffer }) {
  const ms = useRemaining(offer);
  if (!offer || ms === null) return null;

  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.08em]">
      <p className="text-paper">
        {offer.name}: {offer.percentOff}% off, applied at checkout (code {offer.code})
      </p>
      <p className="mt-1.5 text-[rgba(243,245,249,0.6)]">
        Ends in {d}d {pad(h)}h {pad(m)}m {pad(s)}s
      </p>
    </div>
  );
}

/** A slim pill fixed to the bottom of every page while an offer runs. */
export function OfferPill() {
  const app = apps.find((a) => a.offer);
  const ms = useRemaining(app?.offer);
  if (!app?.offer || ms === null) return null;

  const { offer } = app;
  // Straight to checkout with the code applied. Falls back to the app's pricing section if the
  // app has no purchase link.
  const href = app.links.purchase ? offerPurchaseUrl(app.links.purchase, offer) : `/apps/${app.slug}/#pricing`;
  return (
    <Link
      href={href}
      className="fixed bottom-5 left-1/2 z-110 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-paper shadow-lg transition-transform hover:-translate-y-0.5"
    >
      <span className="sm:hidden">
        {offer.name} · {app.name} Pro {offer.percentOff}% off
      </span>
      <span className="hidden sm:inline">
        {offer.name}: {app.name} Pro is {offer.percentOff}% off until {offer.endsOn} →
      </span>
    </Link>
  );
}
