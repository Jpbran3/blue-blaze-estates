import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

// Link-preview card for Facebook, iMessage, Google and the like. Branded text
// rather than a property photo, so the preview never shows a picture the
// business cannot vouch for as its own.
export const alt = "Blue Blaze Estates — quality rentals in Herrin and Southern Illinois. Housing vouchers welcome.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: "72px 80px",
          background: "linear-gradient(135deg, #172554 0%, #1e3a8a 60%, #1d4ed8 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: 24,
              background: "white",
              color: "#1d4ed8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 60,
              fontWeight: 700,
            }}
          >
            BB
          </div>
          <div style={{ fontSize: 64, fontWeight: 700 }}>{SITE.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.15 }}>
            Quality rentals in Herrin &amp; Southern Illinois
          </div>
          <div style={{ fontSize: 36, color: "#bfdbfe" }}>
            Housing vouchers and rental assistance welcome
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, color: "#dbeafe" }}>
          <div>blueblazeestates.com</div>
          <div>{SITE.phone}</div>
        </div>
      </div>
    ),
    size
  );
}
