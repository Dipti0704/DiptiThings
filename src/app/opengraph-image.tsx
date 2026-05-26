import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#faf8f3",
          backgroundImage:
            "radial-gradient(circle at 0% 0%, rgba(196,92,38,0.18), transparent 50%), radial-gradient(circle at 100% 100%, rgba(196,92,38,0.10), transparent 50%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#1a1814",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#1a1814",
              color: "#faf8f3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 500,
            }}
          >
            T
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#6b6560",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            taranships.dev
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, letterSpacing: -1.5 }}>
            {site.name}
          </div>
          <div style={{ fontSize: 36, color: "#6b6560", letterSpacing: -0.5 }}>
            {site.role}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#1a1814",
              maxWidth: 940,
              marginTop: 16,
              lineHeight: 1.3,
              fontFamily: "system-ui",
            }}
          >
            {site.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 32,
            fontSize: 20,
            color: "#6b6560",
            fontFamily: "system-ui",
            letterSpacing: 0.5,
          }}
        >
          <span>13+ products shipped</span>
          <span>·</span>
          <span>2 App Store apps</span>
          <span>·</span>
          <span>Toronto, ON</span>
        </div>
      </div>
    ),
    size,
  );
}
