import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "How refunds work for 66 labs apps and Pro licenses: 14 days, no questions, in plain language.",
  alternates: { canonical: "/refunds" },
};

export default function RefundsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refunds, _plainly._"
      updated="October 28, 2026"
      summary={[
        { label: "The window", text: "Ask within 14 days of buying and you get your money back." },
        { label: "How", text: "Email us with your order number. We handle it through Lemon Squeezy." },
        { label: "Free apps", text: "Nothing to refund. Try before you buy." },
      ]}
      sections={[
        {
          id: "guarantee",
          title: "14-day money-back guarantee",
          body: (
            <>
              <p>
                If a paid license (such as a Pro license) isn&apos;t right for you, email us within 14 days of your
                purchase and we&apos;ll refund it in full. You don&apos;t need to explain why, although we&apos;d
                love to know what we could do better.
              </p>
              <p>
                Our apps are free to download, and the free version is there so you can try an app before paying.
                We encourage you to do that first.
              </p>
            </>
          ),
        },
        {
          id: "how",
          title: "How to ask",
          body: (
            <>
              <p>
                Email <a href="mailto:hello@66labs.dev">hello@66labs.dev</a> from the address you bought with, and
                include your order number or license key. Your receipt from Lemon Squeezy has the order number.
              </p>
              <p>
                <a href="https://www.lemonsqueezy.com">Lemon Squeezy</a> is the merchant of record for our orders,
                so the refund is issued by them to your original payment method. Banks usually take 5 to 10
                business days to show it. When a refund is issued, the license key is deactivated.
              </p>
            </>
          ),
        },
        {
          id: "after",
          title: "After 14 days",
          body: (
            <p>
              We can still help. If an app doesn&apos;t work as described on its page, or a bug stops you from
              using something you paid for and we can&apos;t fix it, write to us and we&apos;ll make it right,
              including a refund where that&apos;s fair. These cases are decided one by one.
            </p>
          ),
        },
        {
          id: "eu",
          title: "Your legal rights",
          body: (
            <>
              <p>
                This policy adds to the rights you have by law and doesn&apos;t replace them. For example, many
                countries give consumers a right to cancel a distance purchase, or rights when a digital product is
                faulty. Where such a right applies to you, you keep it.
              </p>
              <p>
                If you&apos;re in the EU or UK, you can cancel a purchase within 14 days of buying. If you start
                using the license right away, the checkout may ask you to agree to immediate delivery and to
                acknowledge that the statutory cancellation right can end once delivery starts. Our own 14-day
                guarantee above still applies either way.
              </p>
            </>
          ),
        },
        {
          id: "chargebacks",
          title: "Please ask us first",
          body: (
            <p>
              A refund request to us is faster than a dispute with your bank, and it means we can fix the problem.
              Fraudulent or abusive requests, such as repeated refunds of the same license, may be refused.
            </p>
          ),
        },
        {
          id: "contact",
          title: "Contact",
          body: (
            <p>
              Questions? Email <a href="mailto:hello@66labs.dev">hello@66labs.dev</a>. See also our{" "}
              <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
