import type { Metadata } from "next";
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
      updated="September 26, 2026"
      summary={[
        { label: "Our apps", text: "Your data stays on your device unless you turn on a feature that syncs it." },
        { label: "This website", text: "No analytics, no ads, no tracking cookies." },
        { label: "Never", text: "We don't sell your data or use it for advertising." },
      ]}
      sections={[
        {
          id: "overview",
          title: "The overview",
          body: (
            <>
              <p>
                66 labs (“we”, “us”) makes small apps for the Mac and iPhone. This policy explains what our apps
                and this website (66labs.dev) collect, why, and who else is involved. The short version: as little
                as possible.
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
            <ul>
              <li>We don&apos;t use analytics, advertising or tracking cookies on 66labs.dev.</li>
              <li>Fonts are served from this site, so loading a page doesn&apos;t ping a third-party font service.</li>
              <li>
                The site stores one small flag in your browser&apos;s session storage so the intro animation only
                plays once per visit. It never leaves your browser and is cleared when you close the tab.
              </li>
              <li>Like any web server, our hosting provider may keep standard, short-lived request logs.</li>
            </ul>
          ),
        },
        {
          id: "snapback",
          title: "Snapback",
          body: (
            <ul>
              <li>Your workspaces, layouts and settings are stored on your Mac.</li>
              <li>
                Snapback sends <strong>anonymous usage signals</strong> (such as the app launching, or a workspace
                being saved) through <a href="https://telemetrydeck.com">TelemetryDeck</a>, so we know roughly how
                many people use which features. These signals contain no personal data or IP addresses. See{" "}
                <a href="https://telemetrydeck.com/privacy">TelemetryDeck&apos;s privacy policy</a>.
              </li>
              <li>
                It keeps local log files for troubleshooting. They stay on your Mac unless you choose to send them
                to us with a support request.
              </li>
              <li>It checks our update feed to see whether a new version is available.</li>
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
                Your clipboard history is stored in a local database on your Mac. Peggo doesn&apos;t send it, or
                anything else, anywhere.
              </li>
              <li>
                It uses the macOS Accessibility permission only to paste clips into the app you&apos;re using, when
                you ask it to.
              </li>
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
          id: "rights",
          title: "Your choices",
          body: (
            <p>
              Because almost everything stays on your device, deleting an app and its data removes it. For anything
              we or our payment provider hold about you, like order records or support emails, email us and
              we&apos;ll help you see or delete it, subject to what we&apos;re legally required to keep.
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
