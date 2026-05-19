import { ImageResponse } from "next/og";
import { getAudit } from "@/lib/supabase";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "SpendSense audit result";

interface Props {
  params: { id: string };
}

export default async function Image({ params }: Props) {
  const audit = await getAudit(params.id);

  const monthly = audit?.totalMonthlySavings ?? 0;
  const annual = audit?.totalAnnualSavings ?? 0;
  const toolCount = audit?.input.tools.length ?? 0;
  const isOptimal = monthly === 0;

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
            fontSize: 26,
            color: "#a3a3a3",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "#fafafa",
              color: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            S
          </div>
          <span style={{ letterSpacing: 1, textTransform: "uppercase" }}>
            SpendSense audit
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 24,
              color: "#a3a3a3",
              textTransform: "uppercase",
              letterSpacing: 3,
              fontFamily: "monospace",
            }}
          >
            {isOptimal ? "Stack optimized" : "Potential savings"}
          </div>
          <div
            style={{
              fontSize: isOptimal ? 120 : 168,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1,
              color: "#fafafa",
              display: "flex",
              alignItems: "baseline",
              gap: 16,
            }}
          >
            {isOptimal ? (
              "Right-sized"
            ) : (
              <>
                <span>${monthly.toLocaleString()}</span>
                <span style={{ fontSize: 56, color: "#a3a3a3" }}>/mo</span>
              </>
            )}
          </div>
          {!isOptimal && (
            <div style={{ fontSize: 36, color: "#a3a3a3" }}>
              ${annual.toLocaleString()}/year across {toolCount} AI tools
            </div>
          )}
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
          <span>SpendSense by Credex</span>
          <span>Free 3-minute audit</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
