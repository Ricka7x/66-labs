import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "66 Labs: small apps for big annoyances";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#02040a";
const PAPER = "#f3f5f9";
const BLUE = "#0b63e5";
const BLUE_SOFT = "#4f8dff";
const TEAL = "#0f9d8a";
const LIME = "#c4f042";

export default function Image() {
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
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: BLUE,
            filter: "blur(90px)",
            opacity: 0.55,
            top: -180,
            right: -120,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: TEAL,
            filter: "blur(90px)",
            opacity: 0.35,
            bottom: -160,
            left: -80,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "48px 56px 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 700, fontSize: 22 }}>
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: BLUE_SOFT, display: "flex" }} />
            66 Labs
          </div>
          <div style={{ fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "rgba(243,245,249,0.5)" }}>
            66labs.dev
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", padding: "0 56px", flex: 1, justifyContent: "center" }}>
          <div style={{ display: "flex", fontWeight: 800, fontSize: 76, lineHeight: 0.98, letterSpacing: -2, maxWidth: 900 }}>
            Small apps for
          </div>
          <div style={{ display: "flex", fontWeight: 800, fontSize: 76, lineHeight: 0.98, letterSpacing: -2, maxWidth: 900 }}>
            <span style={{ color: BLUE_SOFT, marginRight: 24 }}>big</span>
            <span style={{ color: LIME }}>annoyances.</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 56px 48px",
          }}
        >
          <div style={{ display: "flex", fontSize: 17, color: "rgba(243,245,249,0.65)", maxWidth: 620, lineHeight: 1.5 }}>
            Native Mac &amp; iPhone apps, each one fixing a single everyday annoyance, properly.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 15,
              fontWeight: 500,
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
    { ...size },
  );
}
