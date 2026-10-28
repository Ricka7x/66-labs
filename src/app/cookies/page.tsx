import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { CookieSettingsButton } from "@/components/analytics-consent";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Which cookies 66labs.dev uses, who sets them, and how to change your choice at any time.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Cookies, _plainly._"
      updated="October 28, 2026"
      summary={[
        { label: "By default", text: "No analytics cookies. Nothing loads until you accept." },
        { label: "If you accept", text: "Google Analytics and Microsoft Clarity set cookies to measure the site." },
        { label: "Change your mind", text: "Use Cookie settings in the footer any time." },
      ]}
      sections={[
        {
          id: "what",
          title: "What this covers",
          body: (
            <p>
              This page covers cookies and similar technologies (such as local storage) on 66labs.dev. Our apps
              don&apos;t use cookies; what they send is described in the <Link href="/privacy">Privacy Policy</Link>.
            </p>
          ),
        },
        {
          id: "necessary",
          title: "Always on",
          body: (
            <ul>
              <li>
                <strong>Your cookie choice</strong> (<code>66labs-consent</code>, local storage): remembers whether
                you accepted or declined, so we don&apos;t ask on every page. Kept until you clear it.
              </li>
              <li>
                <strong>Intro animation flag</strong> (session storage): stops the intro from replaying during one
                visit. Cleared when you close the tab.
              </li>
            </ul>
          ),
        },
        {
          id: "analytics",
          title: "Only if you accept",
          body: (
            <>
              <ul>
                <li>
                  <strong>Google Analytics 4</strong> (Google LLC): cookies such as <code>_ga</code> and{" "}
                  <code>_ga_*</code>, kept up to 2 years. Counts visits and pages viewed and where visitors come
                  from. Data is processed by Google, possibly outside your country.{" "}
                  <a href="https://policies.google.com/privacy">Google&apos;s privacy policy</a>.
                </li>
                <li>
                  <strong>Microsoft Clarity</strong> (Microsoft): cookies such as <code>_clck</code> and{" "}
                  <code>_clsk</code>, kept up to 1 year. Records anonymised clicks, scrolling and heatmaps, and
                  session replays, so we can see where the site is confusing. Text you type into fields is masked.{" "}
                  <a href="https://privacy.microsoft.com/privacystatement">Microsoft&apos;s privacy statement</a>.
                </li>
              </ul>
              <p>
                We don&apos;t use advertising cookies and we don&apos;t share this data with advertisers. If your
                browser sends a Global Privacy Control signal, we treat it as a decline.
              </p>
            </>
          ),
        },
        {
          id: "change",
          title: "Change your choice",
          body: (
            <>
              <p>
                You can accept or decline again whenever you like.{" "}
                <CookieSettingsButton className="underline" />. Declining after accepting removes these cookies and
                reloads the page. You can also delete cookies in your browser settings.
              </p>
            </>
          ),
        },
        {
          id: "contact",
          title: "Contact",
          body: (
            <p>
              Questions? Email <a href="mailto:hello@66labs.dev">hello@66labs.dev</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
