import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const BARS = [8, 14, 20, 14, 8];

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
          background: "#141414",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {BARS.map((h, i) => (
            <div key={i} style={{ width: 3, height: h, background: "#C9A063", borderRadius: 2 }} />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
