import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const BARS = [44, 76, 110, 76, 44];

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          background: "#141414",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {BARS.map((h, i) => (
            <div key={i} style={{ width: 16, height: h, background: "#C9A063", borderRadius: 8 }} />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
