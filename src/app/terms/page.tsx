import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms for using 66 studio apps and this website: licenses, purchases, and the fine print, in plain language.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & _conditions._"
      updated="September 26, 2026"
      summary={[
        { label: "In short", text: "Use our apps on your own devices. Don't resell or redistribute them." },
        { label: "Paying", text: "Paid licenses go through Lemon Squeezy, which handles checkout and receipts." },
        { label: "Fine print", text: "The apps come as they are. We work hard on them, but can't promise perfection." },
      ]}
      sections={[
        {
          id: "about",
          title: "About these terms",
          body: (
            <>
              <p>
                These Terms &amp; Conditions (“Terms”) cover every app made by 66 studio (“we”, “us”), including
                the ones listed on our <Link href="/apps">apps page</Link>, and this website, 66labs.dev. By
                downloading, installing or using one of our apps, you agree to these Terms.
              </p>
              <p>
                Some apps may add terms of their own on their app page. Where they do, those apply to that app
                alongside these.
              </p>
            </>
          ),
        },
        {
          id: "license",
          title: "Your license",
          body: (
            <>
              <p>
                Our apps are licensed to you, not sold. You may install and use them on devices you own or
                control.
              </p>
              <ul>
                <li>Don&apos;t redistribute, resell, rent or sublicense our apps or license keys.</li>
                <li>Don&apos;t reverse engineer, decompile or modify the apps, except where the law allows it.</li>
                <li>Don&apos;t remove or bypass license checks or other technical protections.</li>
              </ul>
            </>
          ),
        },
        {
          id: "purchases",
          title: "Purchases & paid features",
          body: (
            <>
              <p>
                Some apps are free with optional paid features (for example, a Pro license). Prices and what&apos;s
                included are shown on each app&apos;s page at the time you buy.
              </p>
              <p>
                Payments are processed by <a href="https://www.lemonsqueezy.com">Lemon Squeezy</a>, which acts as
                the reseller and merchant of record for our orders. Their terms apply to the checkout itself, and
                they send your license key, receipt and invoice. You can find past orders at
                app.lemonsqueezy.com/my-orders.
              </p>
              <p>
                A license key may be limited to a number of devices; each app&apos;s help page explains how to move
                it between devices. Where an app&apos;s page describes a license as one-time, you pay once and it
                doesn&apos;t expire.
              </p>
              <p>
                Something wrong with an order? Email us at{" "}
                <a href="mailto:hello@66labs.dev">hello@66labs.dev</a>.
              </p>
            </>
          ),
        },
        {
          id: "your-part",
          title: "Your part",
          body: (
            <ul>
              <li>Use our apps in line with the laws that apply to you.</li>
              <li>Don&apos;t use them to harm others, their devices, or their data.</li>
              <li>Keep your own backups: our apps work with your files, windows and data, and backups are good sense.</li>
            </ul>
          ),
        },
        {
          id: "third-parties",
          title: "Other services",
          body: (
            <p>
              Some features rely on services we don&apos;t run, for example iCloud for syncing, your web browser for
              saving tabs, or macOS itself. Your use of those is covered by their own terms, and we can&apos;t
              guarantee they&apos;ll always be available or behave the same way.
            </p>
          ),
        },
        {
          id: "updates",
          title: "Updates & changes",
          body: (
            <>
              <p>
                We may update our apps, adding, changing or removing features, and some apps check for updates
                automatically. We may also update these Terms. When we do, we&apos;ll change the date at the top of
                this page. Continuing to use our apps after a change means you accept the updated Terms.
              </p>
            </>
          ),
        },
        {
          id: "warranty",
          title: "No warranty & liability",
          body: (
            <>
              <p>
                Our apps and this website are provided “as is” and “as available”, without warranties of any kind,
                to the fullest extent the law allows.
              </p>
              <p>
                To the fullest extent the law allows, 66 studio isn&apos;t liable for indirect, incidental or
                consequential damages, or for lost data or profits, arising from using or being unable to use our
                apps. Nothing in these Terms limits rights you have under consumer protection laws that can&apos;t
                be waived.
              </p>
            </>
          ),
        },
        {
          id: "privacy",
          title: "Privacy",
          body: (
            <p>
              How our apps and this website handle data is covered in our <Link href="/privacy">Privacy Policy</Link>.
            </p>
          ),
        },
        {
          id: "contact",
          title: "Contact",
          body: (
            <p>
              Questions about these Terms? Email <a href="mailto:hello@66labs.dev">hello@66labs.dev</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
