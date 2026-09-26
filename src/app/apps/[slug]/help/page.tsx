import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppIcon } from "@/components/app-icon";
import { HelpCenter } from "@/components/help-center";
import { apps, getApp } from "@/lib/apps";
import { appHelp, studioHelp } from "@/lib/help";

export const dynamicParams = false;

export function generateStaticParams() {
  return apps.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/apps/[slug]/help">): Promise<Metadata> {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) return {};
  return {
    title: `${app.name} Help`,
    description: `Help for ${app.name}: setup, shortcuts, troubleshooting and answers to common questions.`,
    alternates: { canonical: `/apps/${app.slug}/help` },
  };
}

export default async function AppHelpPage({ params }: PageProps<"/apps/[slug]/help">) {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) notFound();
  const sections = [...(appHelp[app.slug] ?? []), studioHelp];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sections.flatMap((s) =>
      s.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    ),
  };

  return (
    <main id="main" className="pt-32 pb-30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mx-auto max-w-[1280px] px-5 md:px-14">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
          <Link href="/help" className="hover:text-ink">
            Help
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={`/apps/${app.slug}`} className="hover:text-ink">
            {app.name}
          </Link>
        </nav>

        <header className="mt-10 flex flex-wrap items-center gap-6">
          <span className="relative h-20 w-20 md:h-24 md:w-24">
            <AppIcon app={app} className="h-full w-full" sizes="96px" preload />
          </span>
          <div>
            <h1 className="font-display text-5xl font-extrabold leading-none tracking-tight md:text-7xl">
              {app.name} <em>help.</em>
            </h1>
            <p className="mt-3 text-ink-soft">
              Setup, shortcuts and fixes. Stuck anyway?{" "}
              <a
                href={`mailto:hello@66studio.co?subject=${encodeURIComponent(`${app.name} help`)}`}
                className="text-ink underline decoration-2 underline-offset-4"
                style={{ textDecorationColor: app.accent }}
              >
                Email us
              </a>
              .
            </p>
          </div>
        </header>

        <div className="mt-16">
          <HelpCenter sections={sections} accent={app.accent} />
        </div>
      </div>
    </main>
  );
}
