import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What 66 labs apps and this website collect (very little), why, and who else is involved: app by app, in plain language.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy, _plainly._"
      updated="October 28, 2026"
      summary={[
        { label: "Our apps", text: "Your data stays on your device unless you flip on a feature that syncs it." },
        { label: "This website", text: "No ads. Analytics cookies only if you accept them, and you can change that any time." },
        { label: "Never", text: "We don't sell your data or feed it to advertisers." },
      ]}
      sections={[
        {
          id: "overview",
          title: "The overview",
          body: (
            <>
              <p>
                66 labs (“we”, “us”) is an independent studio that makes small apps for the Mac and
                iPhone. We are the data controller for what this policy describes. This policy explains what our
                apps and this website (66labs.dev) collect, why, and who else is involved. The short version: as
                little as possible.
              </p>
              <p>
                Each app works a little differently, so there&apos;s a section for each one below. If an app
                isn&apos;t listed yet, it follows the general rules in this policy.
              </p>
            </>
          ),
        },
        {
          id: "website",
          title: "This website",
          body: (
            <>
              <ul>
                <li>We don&apos;t use advertising cookies or sell data from this site.</li>
                <li>
                  With your consent, we use <strong>Google Analytics</strong> (Google LLC) to count visits and see
                  which pages are read, and <strong>Microsoft Clarity</strong> (Microsoft) to see anonymised clicks,
                  scrolling, heatmaps and session replays. Both set cookies and send data to Google and Microsoft,
                  which may process it outside your country. <strong>Neither loads until you accept</strong> in the
                  banner; declining, or sending a Global Privacy Control signal, keeps them off. You can change your
                  choice any time with “Cookie settings” in the footer. Details are in our{" "}
                  <Link href="/cookies">Cookie Policy</Link>.
                </li>
                <li>Fonts are served from this site, so loading a page doesn&apos;t ping a third-party font service.</li>
                <li>
                  The site also stores your cookie choice, and a small flag in session storage so the intro animation
                  only plays once per visit. They never leave your browser.
                </li>
                <li>
                  Like any web server, our hosting provider (GitHub Pages) may keep standard request logs, including
                  your IP address, under <a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement">GitHub&apos;s privacy statement</a>.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "snapback",
          title: "Snapback",
          body: (
            <ul>
              <li>Your workspaces, layouts and settings are stored on your Mac.</li>
              <li>
                Snapback sends <strong>anonymous usage signals</strong> (such as the app launching) through{" "}
                <a href="https://telemetrydeck.com">TelemetryDeck</a>, so we know roughly how many people use
                Snapback. These signals contain no personal data or IP addresses. You can turn
                this off at any time in Snapback under Settings &gt; General. See{" "}
                <a href="https://telemetrydeck.com/privacy">TelemetryDeck&apos;s privacy policy</a>.
              </li>
              <li>
                It keeps local log files for troubleshooting. They stay on your Mac unless you choose to send them
                to us with a support request.
              </li>
              <li>
                It checks our update feed to see whether a new version is available. Like any web request, this
                reveals your IP address and app version to our hosting provider.
              </li>
              <li>
                If you buy Pro, your license key is stored in the macOS Keychain and checked with Lemon Squeezy (see
                “Purchases” below).
              </li>
            </ul>
          ),
        },
        {
          id: "peggo",
          title: "Peggo",
          body: (
            <ul>
              <li>
                Your clipboard history is stored in a local database on your Mac. Peggo never sends it, or anything
                you copy, anywhere.
              </li>
              <li>
                Peggo sends one <strong>anonymous usage signal</strong> when the app launches, through{" "}
                <a href="https://telemetrydeck.com">TelemetryDeck</a>, so we know roughly how many people use it.
                The signal carries no clipboard content, no personal data and no IP address. See{" "}
                <a href="https://telemetrydeck.com/privacy">TelemetryDeck&apos;s privacy policy</a>.
              </li>
              <li>
                It uses the macOS Accessibility permission only to paste clips into the app you&apos;re using, when
                you ask it to.
              </li>
              <li>It checks our update feed to see whether a new version is available.</li>
              <li>If you buy Pro, your license is checked with Lemon Squeezy (see “Purchases” below).</li>
            </ul>
          ),
        },
        {
          id: "boomark",
          title: "Boomark",
          body: (
            <ul>
              <li>Your bookmarks and tags are stored on your device.</li>
              <li>
                When you press the save shortcut, Boomark reads the URL and title of the frontmost browser tab. It
                doesn&apos;t read tabs at any other time, and never reads page contents or your browsing history.
              </li>
              <li>
                With Pro, bookmarks sync between your devices through <strong>your own iCloud account</strong>{" "}
                (Apple CloudKit). They&apos;re stored by Apple under your Apple Account, they never pass through
                our servers and we can&apos;t see them. Apple&apos;s privacy policy applies to iCloud.
              </li>
              <li>
                Boomark sends one <strong>anonymous usage signal</strong> when the app launches, through{" "}
                <a href="https://telemetrydeck.com">TelemetryDeck</a>, so we know roughly how many people use it.
                The signal carries no bookmarks, no URLs, no personal data and no IP address. See{" "}
                <a href="https://telemetrydeck.com/privacy">TelemetryDeck&apos;s privacy policy</a>.
              </li>
              <li>It checks our update feed to see whether a new version is available.</li>
              <li>If you buy Pro, your license is checked with Lemon Squeezy (see “Purchases” below).</li>
            </ul>
          ),
        },
        {
          id: "purchases",
          title: "Purchases",
          body: (
            <p>
              Paid licenses are sold through <a href="https://www.lemonsqueezy.com">Lemon Squeezy</a>, our payment
              provider and merchant of record. They collect what&apos;s needed to process your order, such as your
              name, email, billing country and payment details, under{" "}
              <a href="https://www.lemonsqueezy.com/privacy">their privacy policy</a>. We receive your order details
              and license key so we can support you; we never see your full card details. When you activate a
              license, the app sends Lemon Squeezy the key and your Mac&apos;s name (as set in System Settings) so
              you can tell your activated devices apart; later checks send the key and that activation&apos;s ID.
            </p>
          ),
        },
        {
          id: "email",
          title: "When you email us",
          body: (
            <p>
              If you contact us, we&apos;ll have your email address and whatever you include (like logs or
              screenshots). We use it only to answer you and fix the problem, and we don&apos;t add you to any
              mailing list.
            </p>
          ),
        },
        {
          id: "never",
          title: "What we never do",
          body: (
            <ul>
              <li>Sell your data.</li>
              <li>Use it for advertising or share it with advertisers.</li>
              <li>Read your bookmarks, clipboard, windows or files.</li>
            </ul>
          ),
        },
        {
          id: "basis",
          title: "Why we may process data",
          body: (
            <ul>
              <li>
                <strong>Consent</strong> for website analytics and session replay. You can withdraw it any time
                from the footer.
              </li>
              <li>
                <strong>Contract</strong> for processing your order and checking your license.
              </li>
              <li>
                <strong>Legitimate interest</strong> in counting anonymous app launches, keeping our apps secure and
                answering your emails.
              </li>
              <li>
                <strong>Legal obligation</strong> for tax and accounting records of purchases.
              </li>
            </ul>
          ),
        },
        {
          id: "retention",
          title: "How long we keep it",
          body: (
            <ul>
              <li>Support emails: up to 2 years after the conversation ends.</li>
              <li>Order and license records: as long as tax and accounting law requires, usually several years.</li>
              <li>
                Analytics: set by Google and Microsoft. Their cookies last up to 2 years and 1 year, and the data
                they collect follows their own retention settings.
              </li>
            </ul>
          ),
        },
        {
          id: "transfers",
          title: "Where data goes",
          body: (
            <p>
              The services above (Lemon Squeezy, Google, Microsoft, TelemetryDeck,
              GitHub, Apple) operate worldwide. Your data may therefore be processed in countries other than yours,
              including the United States. Where the law requires it, those providers rely on safeguards such as
              standard contractual clauses.
            </p>
          ),
        },
        {
          id: "rights",
          title: "Your rights",
          body: (
            <>
              <p>
                Because almost everything stays on your device, deleting an app and its data removes it. For
                anything we or our payment provider hold about you, like order records or support emails, you can
                ask us to give you a copy, correct it, delete it, restrict or object to how we use it, or move it to
                another service. You can withdraw consent at any time. Email{" "}
                <a href="mailto:hello@66labs.dev">hello@66labs.dev</a> and we&apos;ll reply within 30 days, subject
                to what we&apos;re legally required to keep.
              </p>
              <p>
                If you live in the EU, UK or a US state with a privacy law (such as California), these rights are
                protected by law, and you can complain to your local data protection authority. We don&apos;t sell
                or share personal information for advertising. Wherever you live, you can exercise these rights by emailing us.
              </p>
            </>
          ),
        },
        {
          id: "children",
          title: "Children",
          body: (
            <p>
              Our apps and site aren&apos;t directed at children under 13, and we don&apos;t knowingly collect their
              personal data. If you think a child has sent us data, email us and we&apos;ll delete it.
            </p>
          ),
        },
        {
          id: "changes",
          title: "Changes & contact",
          body: (
            <p>
              We&apos;ll update this page when our apps or this site change what they collect, and change the date
              at the top. Questions? Email <a href="mailto:hello@66labs.dev">hello@66labs.dev</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
