import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const dynamic = "force-static";
export const runtime = "nodejs";
export const alt = "66 Labs: small apps for big annoyances";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Design tokens, lifted straight from globals.css so the card matches the site.
const INK = "#02040a";
const PAPER = "#f3f5f9";
const BLUE_SOFT = "#4f8dff";

// Satori needs a real TTF/OTF buffer, not the variable woff2 next/font serves in-browser.
// Google's CSS endpoint hands back a plain truetype URL when the request looks like it
// came from a browser with no woff2 support, which is what a bare server-side fetch looks like.
async function loadGoogleFont(family: string, weight: number, text: string) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`,
  ).then((res) => res.text());
  const match = css.match(/src: url\(([^)]+)\) format\('(?:truetype|opentype)'\)/);
  if (!match) throw new Error(`loadGoogleFont: no truetype source for ${family} ${weight}`);
  return fetch(match[1]).then((res) => res.arrayBuffer());
}

function iconDataUri(slug: string) {
  const bytes = readFileSync(join(process.cwd(), "public", "apps", `${slug}.png`));
  return `data:image/png;base64,${bytes.toString("base64")}`;
}

// Echoes the homepage's HeroStickers: the real app icons, scattered and tilted like
// physical stickers, instead of invented shapes.
const STICKERS = [
  { slug: "snapback", size: 108, top: 56, left: 846, rotate: -9 },
  { slug: "peggo", size: 120, top: 150, left: 980, rotate: 7 },
  { slug: "boomark", size: 100, top: 294, left: 872, rotate: -5 },
];

// Same noise overlay as .grain in globals.css, at a fraction of the opacity since this has
// to read at thumbnail size with no multiply blend to lean on.
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E";

export default async function Image() {
  const [bricolageExtrabold, jbMono, jbMonoMedium] = await Promise.all([
    loadGoogleFont("Bricolage Grotesque", 800, "SMALL APPS FOR BIG ANNOYANCES."),
    loadGoogleFont("JetBrains Mono", 700, "66 LABS: INDEPENDENT SOFTWARE"),
    loadGoogleFont(
      "JetBrains Mono",
      500,
      "Native apps for the Mac and iPhone, each fixing one everyday annoyance, properly." +
        "One-time price. No subscriptions. Pay once, own it.66labs.dev",
    ),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          color: PAPER,
          fontFamily: "Bricolage Grotesque",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url("${GRAIN}")`, opacity: 0.1, display: "flex" }} />

        {STICKERS.map((s) => (
          <img
            key={s.slug}
            src={iconDataUri(s.slug)}
            width={s.size}
            height={s.size}
            style={{
              position: "absolute",
              top: s.top,
              left: s.left,
              transform: `rotate(${s.rotate}deg)`,
              borderRadius: s.size * 0.22,
              boxShadow: "0 14px 24px rgba(0,0,0,0.35)",
            }}
          />
        ))}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "52px 0 0 56px",
            fontFamily: "JetBrains Mono",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 2,
          }}
        >
          <span style={{ width: 9, height: 9, borderRadius: 999, background: BLUE_SOFT, display: "flex" }} />
          66 LABS: INDEPENDENT SOFTWARE
        </div>

        <div style={{ display: "flex", flexDirection: "column", padding: "0 56px", flex: 1, justifyContent: "center", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", fontWeight: 800, fontSize: 72, lineHeight: 0.98, letterSpacing: -2.5, color: PAPER }}>
              SMALL APPS FOR
            </div>
            <div style={{ display: "flex", fontWeight: 800, fontSize: 72, lineHeight: 0.98, letterSpacing: -2.5, color: BLUE_SOFT }}>
              BIG ANNOYANCES.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "JetBrains Mono",
              fontWeight: 500,
              fontSize: 18,
              lineHeight: 1.5,
              color: "rgba(243,245,249,0.6)",
              maxWidth: 560,
            }}
          >
            Native apps for the Mac and iPhone, each fixing one everyday annoyance, properly.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(243,245,249,0.14)",
            padding: "26px 56px 44px",
            fontFamily: "JetBrains Mono",
            fontWeight: 500,
            fontSize: 15,
            color: "rgba(243,245,249,0.55)",
          }}
        >
          <div style={{ display: "flex" }}>One-time price. No subscriptions. Pay once, own it.</div>
          <div
            style={{
              display: "flex",
              background: "rgba(243,245,249,0.08)",
              border: "1px solid rgba(243,245,249,0.18)",
              padding: "10px 18px",
              borderRadius: 999,
              whiteSpace: "nowrap",
            }}
          >
            66labs.dev
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage Grotesque", data: bricolageExtrabold, weight: 800, style: "normal" },
        { name: "JetBrains Mono", data: jbMono, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: jbMonoMedium, weight: 500, style: "normal" },
      ],
    },
  );
}
