import { ImageResponse } from "next/og";
import { getAppHostname } from "@/lib/app-url";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "SpendSense by Credex — Free AI Tool Spend Audit";

export default function Image() {
  const hostname = getAppHostname();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          color: "#fafafa",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            color: "#a3a3a3",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "#fafafa",
              color: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            S
          </div>
          <span style={{ letterSpacing: 1, textTransform: "uppercase" }}>
            SpendSense by Credex
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1,
              color: "#fafafa",
            }}
          >
            Know exactly where your AI budget leaks.
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#a3a3a3",
              maxWidth: 1000,
              lineHeight: 1.35,
            }}
          >
            Free 3-minute audit of Cursor, Claude, ChatGPT, Copilot and more —
            with defensible savings math.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#737373",
            fontFamily: "monospace",
          }}
        >
          <span>{hostname}</span>
          <span>No login · Email after value</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
